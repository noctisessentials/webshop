'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Bot, ExternalLink, MessageCircle, Package, Send, Truck, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type OrderTrackResult = {
  number: string
  status: string
  customer_name: string
  line_items: Array<{ name: string; quantity: number }>
  tracking: { carrier: string | null; code: string | null; url: string | null }
}

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  trackingCard?: OrderTrackResult
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

const ORDER_STATUS_NL: Record<string, string> = {
  pending: 'In behandeling',
  processing: 'Wordt verwerkt',
  'on-hold': 'In de wacht',
  completed: 'Voltooid',
  shipped: 'Onderweg',
  cancelled: 'Geannuleerd',
  refunded: 'Terugbetaald',
  failed: 'Mislukt',
}

const ORDER_STATUS_EN: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  'on-hold': 'On hold',
  completed: 'Completed',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  failed: 'Failed',
}

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
    quickTrack: 'Bestelling volgen',
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
    // Order tracking
    orderTrackPrompt: 'Geen probleem! Geef je ordernummer en postcode, dan zoek ik het direct voor je op.',
    orderNumber: 'Ordernummer',
    orderPostcode: 'Postcode',
    orderTrackSubmit: 'Opzoeken',
    orderTrackLoading: 'Zoeken...',
    orderTrackNotFound: 'Geen bestelling gevonden. Controleer je gegevens en probeer opnieuw.',
    orderTrackTitle: 'Bestelling gevonden',
    orderTrackCarrier: 'Track & trace',
    orderTrackFollow: 'Volg pakket',
    orderTrackNoTracking: 'Nog geen trackinginformatie beschikbaar. Je ontvangt een e-mail zodra je pakket onderweg is.',
    orderStatusLabel: 'Status',
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
    quickTrack: 'Track order',
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
    // Order tracking
    orderTrackPrompt: 'No problem! Share your order number and postcode and I\'ll look it up right away.',
    orderNumber: 'Order number',
    orderPostcode: 'Postcode',
    orderTrackSubmit: 'Look up',
    orderTrackLoading: 'Searching...',
    orderTrackNotFound: 'No order found. Please check your details and try again.',
    orderTrackTitle: 'Order found',
    orderTrackCarrier: 'Track & trace',
    orderTrackFollow: 'Track package',
    orderTrackNoTracking: 'No tracking information yet. You\'ll receive an email once your package is on its way.',
    orderStatusLabel: 'Status',
  },
} as const

function isHumanSupportIntent(text: string): boolean {
  return /(human|real person|agent|support medewerker|medewerker|persoon spreken|iemand spreken|mens spreken|customer service|klantenservice)/i.test(text)
}

function isOrderTrackIntent(text: string): boolean {
  return /(bestelling volgen|track|traceer|volgen|pakket|where.*order|waar.*bestelling|waar.*pakket|status.*bestelling|bestelling.*status|wanneer.*levering|levering.*wanneer|mijn bestelling|order.*status)/i.test(text)
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

type CopyShape = typeof COPY['nl'] | typeof COPY['en']

function TrackingCard({ data, t, locale }: { data: OrderTrackResult; t: CopyShape; locale: 'nl' | 'en' }) {
  const statusMap = locale === 'en' ? ORDER_STATUS_EN : ORDER_STATUS_NL
  const statusLabel = statusMap[data.status] ?? data.status

  return (
    <div className="mt-2 rounded-xl border border-border bg-white overflow-hidden text-[12.5px]">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-dark">#{data.number}</p>
          <p className="text-muted text-[11px]">{data.customer_name}</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 whitespace-nowrap">
          {statusLabel}
        </span>
      </div>

      {/* Products */}
      {data.line_items.length > 0 && (
        <div className="px-3 py-2 border-b border-border space-y-1">
          {data.line_items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-dark/75">
              <Package size={10} className="text-muted flex-shrink-0" />
              <span>{item.name} × {item.quantity}</span>
            </div>
          ))}
          {data.line_items.length > 3 && (
            <p className="text-muted text-[10px]">+{data.line_items.length - 3} meer</p>
          )}
        </div>
      )}

      {/* Tracking */}
      <div className="px-3 py-2.5">
        {data.tracking.url ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-dark/70 min-w-0">
              <Truck size={11} className="flex-shrink-0 text-blue-600" />
              <span className="truncate">{data.tracking.carrier ?? 'DHL'}{data.tracking.code ? ` · ${data.tracking.code}` : ''}</span>
            </div>
            <a
              href={data.tracking.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-dark text-white hover:bg-dark/85 transition-colors"
            >
              {t.orderTrackFollow}
              <ExternalLink size={9} />
            </a>
          </div>
        ) : (
          <p className="text-muted text-[11px] italic">{t.orderTrackNoTracking}</p>
        )}
      </div>
    </div>
  )
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

  // Order tracking form state
  const [showOrderTrackForm, setShowOrderTrackForm] = useState(false)
  const [orderTrackNumber, setOrderTrackNumber] = useState('')
  const [orderTrackPostcode, setOrderTrackPostcode] = useState('')
  const [orderTrackLoading, setOrderTrackLoading] = useState(false)
  const [orderTrackError, setOrderTrackError] = useState('')

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open, loading, showEscalationForm, escalationStatus, showOrderTrackForm])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  const appendAssistant = (content: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content }])
  }

  const triggerOrderTrack = () => {
    appendAssistant(t.orderTrackPrompt)
    setShowOrderTrackForm(true)
    setOrderTrackError('')
    setOrderTrackNumber('')
    setOrderTrackPostcode('')
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

    if (isOrderTrackIntent(text) && !showOrderTrackForm) {
      triggerOrderTrack()
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

  const handleOrderTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderTrackLoading(true)
    setOrderTrackError('')

    try {
      const res = await fetch(
        `/api/order-track?number=${encodeURIComponent(orderTrackNumber.trim())}&postcode=${encodeURIComponent(orderTrackPostcode.trim())}`
      )

      if (res.status === 404) {
        setOrderTrackError(t.orderTrackNotFound)
        return
      }
      if (!res.ok) {
        setOrderTrackError(t.fallbackError)
        return
      }

      const data: OrderTrackResult = await res.json()

      setShowOrderTrackForm(false)
      setOrderTrackNumber('')
      setOrderTrackPostcode('')

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'assistant',
          content: t.orderTrackTitle,
          trackingCard: data,
        },
      ])
    } catch {
      setOrderTrackError(t.fallbackError)
    } finally {
      setOrderTrackLoading(false)
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
    <div className="chat-widget-fixed fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t.launcher}
        className={cn(
          'group flex items-center gap-2 rounded-full h-12 border border-dark/10 bg-white text-dark transition-all duration-300',
          'px-3 md:px-4',
          'shadow-none md:shadow-[0_14px_35px_rgba(30,29,29,0.16)]',
          'hover:-translate-y-0.5 md:hover:shadow-[0_18px_38px_rgba(30,29,29,0.2)]'
        )}
      >
        {open ? <X size={18} strokeWidth={1.8} /> : <MessageCircle size={18} strokeWidth={1.8} />}
        <span className="hidden md:inline font-sans text-sm font-semibold">{open ? t.close : t.launcher}</span>
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
              {message.trackingCard ? (
                // Tracking result card — full-width assistant bubble
                <div className="w-full max-w-full rounded-2xl rounded-bl-md bg-white border border-border/80 shadow-[0_8px_26px_rgba(30,29,29,0.08)] px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                    <Bot size={12} />
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold">Noctis</span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-dark">{message.content}</p>
                  <TrackingCard data={message.trackingCard!} t={t} locale={locale} />
                </div>
              ) : (
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
              )}
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

          {/* Order tracking inline form */}
          {showOrderTrackForm && (
            <form onSubmit={handleOrderTrack} className="mt-2 bg-white border border-border rounded-2xl p-3.5 space-y-3 chat-message-pop">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.quickTrack}</p>
              <input
                value={orderTrackNumber}
                onChange={(e) => setOrderTrackNumber(e.target.value)}
                required
                placeholder={t.orderNumber}
                inputMode="numeric"
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface/60 text-sm focus:outline-none focus:ring-2 focus:ring-dark/10"
              />
              <input
                value={orderTrackPostcode}
                onChange={(e) => setOrderTrackPostcode(e.target.value)}
                required
                placeholder={t.orderPostcode}
                autoComplete="postal-code"
                className="w-full h-10 px-3 rounded-xl border border-border bg-surface/60 text-sm focus:outline-none focus:ring-2 focus:ring-dark/10"
              />
              {orderTrackError && (
                <p className="text-xs text-red-600">{orderTrackError}</p>
              )}
              <button
                type="submit"
                disabled={orderTrackLoading}
                className="w-full h-10 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/85 transition-colors disabled:opacity-60"
              >
                {orderTrackLoading ? t.orderTrackLoading : t.orderTrackSubmit}
              </button>
            </form>
          )}

          {/* Escalation form */}
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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button type="button" onClick={() => triggerOrderTrack()} className="chat-quick-chip">
              {t.quickTrack}
            </button>
            <button type="button" onClick={() => { setInput(t.quickDelivery) }} className="chat-quick-chip">
              {t.quickDelivery}
            </button>
            <button type="button" onClick={() => { setInput(t.quickReturns) }} className="chat-quick-chip">
              {t.quickReturns}
            </button>
            <button type="button" onClick={() => { setInput(t.quickPayment) }} className="chat-quick-chip">
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
