import type { ChatFAQItem } from '@/lib/chatbot/knowledge'

type ScoredFAQ = {
  item: ChatFAQItem
  score: number
}

const STOP_WORDS = new Set([
  'de', 'het', 'een', 'en', 'of', 'ik', 'je', 'jij', 'u', 'we', 'wij', 'is', 'zijn', 'op', 'in', 'naar',
  'met', 'voor', 'van', 'te', 'dat', 'dit', 'die', 'doe', 'kan', 'kun', 'kunt', 'mijn', 'jouw', 'your',
  'the', 'a', 'an', 'and', 'or', 'to', 'is', 'are', 'on', 'in', 'for', 'of', 'with', 'my', 'i', 'you',
  'what', 'how', 'where', 'when', 'can', 'do', 'does', 'it', 'be', 'if', 'within', 'via', 'about', 'me',
])

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

function overlapScore(queryTokens: string[], targetTokens: string[]): number {
  if (!queryTokens.length || !targetTokens.length) return 0

  const querySet = new Set(queryTokens)
  const targetSet = new Set(targetTokens)

  let overlap = 0
  for (const token of querySet) {
    if (targetSet.has(token)) overlap += 1
  }

  return overlap / Math.max(3, querySet.size)
}

function phraseScore(query: string, target: string): number {
  const q = query.trim().toLowerCase()
  const t = target.toLowerCase()
  if (!q || q.length < 5) return 0
  if (t.includes(q)) return 1

  const qWords = q.split(/\s+/).filter(Boolean)
  const longest = qWords.sort((a, b) => b.length - a.length)[0]
  if (!longest || longest.length < 4) return 0
  return t.includes(longest) ? 0.3 : 0
}

export function rankFAQs(query: string, faqs: ChatFAQItem[], limit = 4): ScoredFAQ[] {
  const queryTokens = tokenize(query)

  return faqs
    .map((item) => {
      const questionTokens = tokenize(item.q)
      const answerTokens = tokenize(item.a)

      const questionOverlap = overlapScore(queryTokens, questionTokens)
      const answerOverlap = overlapScore(queryTokens, answerTokens)
      const questionPhrase = phraseScore(query, item.q)
      const answerPhrase = phraseScore(query, item.a)

      const score = questionOverlap * 0.62 + answerOverlap * 0.23 + questionPhrase * 0.1 + answerPhrase * 0.05

      return { item, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
