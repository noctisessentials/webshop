'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Bot, MessageCircle, Send, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatApiResponse = {
  reply: string
  needsEscalation: boolean
  suggestEscalationForm?: boolean
  reason?: string
}

type EscalationApiResponse = {
  ok?: boolean
  error?: string
  confirmation?: string
}

const CHAT_SESSION_KEY = 'noctis-chat-session'

const COPY = {
  nl: {
    launcher: 'Klantenservice chat',
    title: 'Noctis Support',
    subtitle: 'Direct antwoord of handoff naar een medewerker',
    placeholder: 'Typ je vraag...',
    send: 'Verstuur',
    close: 'Sluiten',
    you: 'Jij',
    greeting:
      'Hoi! Ik help je met vragen over bestelling, levering, retouren en betalingen. Als ik het niet zeker weet, zet ik je direct door naar een medewerker.',
    openingLine: 'Waarmee kan ik je helpen?',
    quickReturns: 'Retourneren',
    quickDelivery: 'Levering',
    quickPayment: 'Betaling',
    quickHuman: 'Spreek medewerker',
    humanPrompt:
      'Natuurlijk, ik zet dit direct door. Laat hieronder je naam en e-mailadres achter. We nemen binnen 24 uur contact met je op.',
    fallbackError: 'Er ging iets mis. Probeer het opnieuw of kies voor een medewerker.',
    rateLimited: 'Je verstuurt snel veel berichten. Wacht even en probeer opnieuw.',
    contactTitle: 'Doorzetten naar medewerker',
    name: 'Naam',
    email: 'E-mailadres',
    submitEscalation: 'Verstuur naar support',
    escalationLoading: 'Bezig met verzenden...',
    escalationSuccess: 'Bedankt, we nemen binnen 24 uur contact met je op.',
  },
  en: {
    launcher: 'Customer support chat',
    title: 'Noctis Support',
    subtitle: 'Instant help or human handoff',
    placeholder: 'Type your question...',
    send: 'Send',
    close: 'Close',
    you: 'You',
    greeting:
      'Hi! I can help with orders, delivery, returns and payments. If I am not sure, I will escalate your case to a real support person.',
    openingLine: 'How can I help you today?',
    quickReturns: 'Returns',
    quickDelivery: 'Delivery',
    quickPayment: 'Payment',
    quickHuman: 'Talk to a person',
    humanPrompt:
      'Absolutely, I will escalate this right away. Please share your name and email below. We will get back to you within 24 hours.',
    fallbackError: 'Something went wrong. Please try again or request a real person.',
    rateLimited: 'You are sending messages quickly. Please wait a moment and try again.',
    contactTitle: 'Escalate to support',
    name: 'Name',
    email: 'Email address',
    submitEscalation: 'Send to support',
    escalationLoading: 'Sending...',
    escalationSuccess: 'Thanks, we will contact you within 24 hours.',
  },
} as const

function isHumanSupportIntent(text: string): boolean {
  return /(human|real person|agent|support medewerker|medewerker|persoon spreken|iemand spreken|mens spreken|customer service|klantenservice)/i.test(text)
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server'
  const existing = window.localStorage.getItem(CHAT_SESSION_KEY)
  if (existing) return existing
  const created = makeId()
  window.localStorage.setItem(CHAT_SESSION_KEY, created)
  return created
}

export function ChatWidget() {
  const localeRaw = useLocale()
  const locale = localeRaw === 'en' ? 'en' : 'nl'
  const t = COPY[locale]

  const [open, setOpen] = useState(false)
  const [sessionId, setSessionId] = useState('unknown')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<UiMessage[]>([
    { id: 'welcome-1', role: 'assistant', content: t.greeting },
    { id: 'welcome-2', role: 'assistant', content: t.openingLine },
  ])

  const [showEscalationForm, setShowEscalationForm] = useState(false)
  const [escalationName, setEscalationName] = useState('')
  const [escalationEmail, setEscalationEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [escalationStatus, setEscalationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [escalationFeedback, setEscalationFeedback] = useState('')

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open, loading, showEscalationForm, escalationStatus])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  const appendAssistant = (content: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content }])
  }

  const sendQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSend = async () => {
    const text = input.trim().slice(0, 500)
    if (!text || loading) return

    const userMsg: UiMessage = { id: makeId(), role: 'user', content: text }
    const nextMessages = [...messages, userMsg]

    setMessages(nextMessages)
    setInput('')

    if (isHumanSupportIntent(text)) {
      appendAssistant(t.humanPrompt)
      setShowEscalationForm(true)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (res.status === 429) {
        appendAssistant(t.rateLimited)
        setLoading(false)
        return
      }

      if (!res.ok) {
        appendAssistant(t.fallbackError)
        setLoading(false)
        return
      }

      const data = (await res.json()) as ChatApiResponse
      appendAssistant(data.reply)

      if (data.needsEscalation || data.suggestEscalationForm) {
        setShowEscalationForm(true)
      }
    } catch {
      appendAssistant(t.fallbackError)
    } finally {
      setLoading(false)
    }
  }

  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (escalationStatus === 'loading') return

    setEscalationStatus('loading')
    setEscalationFeedback('')

    try {
      const res = await fetch('/api/chatbot/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          website,
          name: escalationName,
          email: escalationEmail,
          reason: 'customer-escalation',
          conversation: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = (await res.json()) as EscalationApiResponse

      if (!res.ok || !data.ok) {
        setEscalationStatus('error')
        setEscalationFeedback(data.error || t.fallbackError)
        return
      }

      setEscalationStatus('success')
      setEscalationFeedback(data.confirmation || t.escalationSuccess)
      appendAssistant(data.confirmation || t.escalationSuccess)
    } catch {
      setEscalationStatus('error')
      setEscalationFeedback(t.fallbackError)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t.launcher}
        className={cn(
          'group flex items-center gap-2 rounded-full h-12 px-4 border border-dark/10 bg-white text-dark shadow-[0_14px_35px_rgba(30,29,29,0.16)] transition-all duration-300',
          'hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(30,29,29,0.2)]'
        )}
      >
        {open ? <X size={18} strokeWidth={1.8} /> : <MessageCircle size={18} strokeWidth={1.8} />}
        <span className="font-sans text-sm font-semibold">{open ? t.close : t.launcher}</span>
      </button>

      <div
        className={cn(
          'absolute bottom-16 right-0 w-[min(94vw,390px)] rounded-[24px] border border-border bg-[#F7F4F0] shadow-[0_20px_65px_rgba(30,29,29,0.22)] overflow-hidden transition-all duration-300 origin-bottom-right',
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-[0.96] translate-y-3 pointer-events-none'
        )}
      >
        <div className="px-4 py-3.5 bg-white/92 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-8 w-8 rounded-full bg-dark text-white flex items-center justify-center">
              <Bot size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-dark truncate">{t.title}</p>
              <p className="font-sans text-xs text-muted truncate">{t.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-8 w-8 rounded-full border border-border bg-white text-dark flex items-center justify-center hover:bg-surface transition-colors"
            aria-label={t.close}
          >
            <X size={14} />
          </button>
        </div>

        <div ref={listRef} className="max-h-[56vh] min-h-[360px] overflow-y-auto px-4 py-4 space-y-2.5">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn('chat-message-pop flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              style={{ animationDelay: `${Math.min(index * 35, 220)}ms` }}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-[0_8px_26px_rgba(30,29,29,0.08)]',
                  message.role === 'user'
                    ? 'bg-dark text-white rounded-br-md'
                    : 'bg-white text-dark rounded-bl-md border border-border/80'
                )}
              >
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                  {message.role === 'user' ? <UserRound size={12} /> : <Bot size={12} />}
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    {message.role === 'user' ? t.you : 'Noctis'}
                  </span>
                </div>
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message-pop flex justify-start">
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-border text-dark shadow-[0_8px_26px_rgba(30,29,29,0.08)]">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-dark/40 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-dark/40 animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-dark/40 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}

          {showEscalationForm && (
            <form onSubmit={handleEscalationSubmit} className="mt-2 bg-white border border-border rounded-2xl p-3.5 space-y-3 chat-message-pop">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.contactTitle}</p>
              <input
                value={escalationName}
                onChange={(e) => setEscalationName(e.target.value)}
                required
                placeholder={t.name}
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface/60 text-sm focus:outline-none focus:ring-2 focus:ring-dark/10"
              />
              <input
                value={escalationEmail}
                onChange={(e) => setEscalationEmail(e.target.value)}
                required
                type="email"
                placeholder={t.email}
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface/60 text-sm focus:outline-none focus:ring-2 focus:ring-dark/10"
              />
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              />
              {escalationFeedback && (
                <p className={cn('text-xs', escalationStatus === 'success' ? 'text-green-700' : 'text-red-600')}>
                  {escalationFeedback}
                </p>
              )}
              <button
                type="submit"
                disabled={escalationStatus === 'loading'}
                className="w-full h-10 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/85 transition-colors disabled:opacity-60"
              >
                {escalationStatus === 'loading' ? t.escalationLoading : t.submitEscalation}
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-border p-3 bg-white/92 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => sendQuickPrompt(t.quickDelivery)}
              className="chat-quick-chip"
            >
              {t.quickDelivery}
            </button>
            <button
              type="button"
              onClick={() => sendQuickPrompt(t.quickReturns)}
              className="chat-quick-chip"
            >
              {t.quickReturns}
            </button>
            <button
              type="button"
              onClick={() => sendQuickPrompt(t.quickPayment)}
              className="chat-quick-chip"
            >
              {t.quickPayment}
            </button>
            <button
              type="button"
              onClick={() => {
                appendAssistant(t.humanPrompt)
                setShowEscalationForm(true)
              }}
              className="chat-quick-chip"
            >
              {t.quickHuman}
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleSend()
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              placeholder={t.placeholder}
              rows={1}
              className="flex-1 max-h-28 min-h-10 px-3 py-2.5 rounded-xl border border-border bg-surface/60 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-dark/10"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
            />
            <button
              type="submit"
              disabled={!canSend}
              className="h-10 w-10 rounded-xl bg-dark text-white flex items-center justify-center hover:bg-dark/85 transition-colors disabled:opacity-50"
              aria-label={t.send}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
