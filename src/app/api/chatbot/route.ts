import { NextResponse } from 'next/server'
import { CHATBOT_POLICIES } from '@/lib/chatbot/knowledge'
import { NOCTIS_KNOWLEDGE_BASE, getChatbotKnowledgeItems } from '@/lib/chatbot/knowledge-base'
import { rankFAQs } from '@/lib/chatbot/retrieval'
import { rateLimit } from '@/lib/rate-limit'

type ClientRole = 'user' | 'assistant'

type ClientMessage = {
  role: ClientRole
  content: string
}

type ChatbotJson = {
  reply: string
  needsEscalation: boolean
  reason?: string
  sourceKnowledgeIds?: string[]
}

type OpenAIChoice = {
  message?: {
    content?: string
  }
}

type OpenAIChatResponse = {
  choices?: OpenAIChoice[]
}

function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function normalizeLocale(locale: unknown): 'nl' | 'en' {
  return locale === 'en' ? 'en' : 'nl'
}

function trimMessage(content: string): string {
  return content.replace(/\s+/g, ' ').trim().slice(0, 500)
}

function sanitizeMessages(input: unknown): ClientMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .filter((item): item is ClientMessage => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Partial<ClientMessage>
      if (candidate.role !== 'user' && candidate.role !== 'assistant') return false
      if (typeof candidate.content !== 'string') return false
      return true
    })
    .map((item) => ({
      role: item.role,
      content: trimMessage(item.content),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-10)
}

function parseJsonObject(raw: string): ChatbotJson | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed) as ChatbotJson
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) return null

    try {
      return JSON.parse(match[0]) as ChatbotJson
    } catch {
      return null
    }
  }
}

function isHumanSupportIntent(text: string): boolean {
  return /(human|real person|agent|support medewerker|medewerker|persoon spreken|iemand spreken|mens spreken|customer service|klantenservice)/i.test(text)
}

function escalationReply(locale: 'nl' | 'en', reason?: string) {
  return {
    reply:
      locale === 'en'
        ? `I want to escalate this to our support team to avoid giving you incorrect information. Please share your name and email, and we will get back to you within ${CHATBOT_POLICIES.escalationSlaHours} hours.`
        : `Ik wil dit doorzetten naar ons supportteam om te voorkomen dat ik onjuiste informatie geef. Deel je naam en e-mailadres, dan komen we binnen ${CHATBOT_POLICIES.escalationSlaHours} uur bij je terug.`,
    needsEscalation: true,
    suggestEscalationForm: true,
    reason,
    sourceKnowledgeIds: [] as string[],
  }
}

function deterministicKnowledgeReply(locale: 'nl' | 'en', answer: string, knowledgeId: string) {
  return {
    reply:
      locale === 'en'
        ? `${answer}\n\nIf you prefer, I can still connect you with a real support person.`
        : `${answer}\n\nAls je wilt, kan ik je alsnog doorzetten naar een medewerker.`,
    needsEscalation: false,
    suggestEscalationForm: false,
    sourceKnowledgeIds: [knowledgeId],
  }
}

function buildKnowledgeSnippet(ids: string[]) {
  const items = getChatbotKnowledgeItems().filter((item) => ids.includes(item.id))
  return items.map((item) => `[${item.id}] Q: ${item.q}\nA: ${item.a}`).join('\n\n')
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request)

    // Anti-spam / anti-cost limits
    if (!rateLimit(`chat:ip-minute:${ip}`, 12, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many chat requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const locale = normalizeLocale(body?.locale)
    const messages = sanitizeMessages(body?.messages)
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.slice(0, 80) : 'unknown'

    if (!rateLimit(`chat:session-hour:${sessionId}`, 90, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Chat limit reached for this session. Please try again later.'
              : 'Chatlimiet bereikt voor deze sessie. Probeer het later opnieuw.',
        },
        { status: 429 }
      )
    }

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Missing chat messages' }, { status: 400 })
    }

    const latestUserMessage = [...messages].reverse().find((msg) => msg.role === 'user')?.content
    if (!latestUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    if (isHumanSupportIntent(latestUserMessage)) {
      return NextResponse.json(escalationReply(locale, 'human-request'))
    }

    const ranked = rankFAQs(latestUserMessage, getChatbotKnowledgeItems(), 5)
    const top = ranked[0]

    if (!top || top.score < 0.12) {
      return NextResponse.json(escalationReply(locale, 'no-grounding-match'))
    }

    const sourceKnowledgeIds = ranked.filter((item) => item.score >= 0.09).map((item) => item.item.id)
    if (sourceKnowledgeIds.length === 0) {
      return NextResponse.json(escalationReply(locale, 'no-strong-candidates'))
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Safe fallback for local development if OpenAI key is not configured.
      return NextResponse.json(deterministicKnowledgeReply(locale, top.item.a, top.item.id))
    }

    const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4.1'

    const knowledgeSnippet = buildKnowledgeSnippet(sourceKnowledgeIds)
    const recentMessages = messages.slice(-6)

    const systemPrompt =
      locale === 'en'
        ? [
            'You are Noctis Essentials customer support.',
            'ONLY use facts that exist in the knowledge provided below.',
            'If the user asks anything that is not fully covered by knowledge, set needsEscalation=true.',
            'Never guess, infer policy details, or invent timelines.',
            'If you can answer, use a calm, helpful, understanding and never-pushy tone.',
            'The product can be functional AND emotional. You may mention benefits only if they are explicitly in knowledge.',
            'Answer in the same language as the user message.',
            'Output JSON only with keys: reply, needsEscalation, reason, sourceKnowledgeIds.',
            '',
            'FULL KNOWLEDGE BASE:',
            NOCTIS_KNOWLEDGE_BASE,
            '',
            'RELEVANT KNOWLEDGE SNIPPETS:',
            knowledgeSnippet,
          ].join('\n')
        : [
            'Je bent klantenservice van Noctis Essentials.',
            'Gebruik ALLEEN feiten die in de kennis hieronder staan.',
            'Als de vraag niet volledig door die kennis wordt gedekt, zet needsEscalation=true.',
            'Nooit gokken, geen extra beleidsdetails verzinnen en geen aannames doen.',
            'Als je kunt antwoorden, gebruik een kalme, behulpzame, begripvolle en niet-opdringerige toon.',
            'Het product is functioneel EN emotioneel. Benoem voordelen alleen als ze expliciet in de kennis staan.',
            'Antwoord in dezelfde taal als de vraag van de gebruiker.',
            'Geef alleen JSON terug met de velden: reply, needsEscalation, reason, sourceKnowledgeIds.',
            '',
            'VOLLEDIGE KENNISBASIS:',
            NOCTIS_KNOWLEDGE_BASE,
            '',
            'RELEVANTE KENNISFRAGMENTEN:',
            knowledgeSnippet,
          ].join('\n')

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 320,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...recentMessages,
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const errText = await openAiResponse.text()
      console.error('[chatbot] openai_error', errText)
      return NextResponse.json(deterministicKnowledgeReply(locale, top.item.a, top.item.id))
    }

    const payload = (await openAiResponse.json()) as OpenAIChatResponse
    const raw = payload.choices?.[0]?.message?.content ?? ''
    const parsed = parseJsonObject(raw)

    if (!parsed || typeof parsed.reply !== 'string' || typeof parsed.needsEscalation !== 'boolean') {
      return NextResponse.json(deterministicKnowledgeReply(locale, top.item.a, top.item.id))
    }

    const validSourceIds = Array.isArray(parsed.sourceKnowledgeIds)
      ? parsed.sourceKnowledgeIds.filter((id) => typeof id === 'string' && sourceKnowledgeIds.includes(id))
      : []

    if (parsed.needsEscalation) {
      return NextResponse.json(escalationReply(locale, parsed.reason ?? 'model-escalation'))
    }

    if (validSourceIds.length === 0) {
      return NextResponse.json(deterministicKnowledgeReply(locale, top.item.a, top.item.id))
    }

    return NextResponse.json({
      reply: parsed.reply.trim().slice(0, 900),
      needsEscalation: false,
      suggestEscalationForm: false,
      sourceKnowledgeIds: validSourceIds,
    })
  } catch (error) {
    console.error('[chatbot]', error)
    return NextResponse.json({ error: 'Chatbot request failed' }, { status: 500 })
  }
}
