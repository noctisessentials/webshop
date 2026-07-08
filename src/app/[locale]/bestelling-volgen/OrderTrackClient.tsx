'use client'

import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, ExternalLink } from 'lucide-react'

type TrackingOrder = {
  id: number
  number: string
  status: string
  date_created: string
  total: string
  currency: string
  customer_name: string
  shipping: {
    address_1: string
    city: string
    postcode: string
    country: string
  }
  line_items: Array<{
    id: number
    name: string
    quantity: number
    total: string
    image?: { src: string }
  }>
  payment_method_title: string
  tracking: {
    carrier: string | null
    code: string | null
    url: string | null
  }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: 'In behandeling',    color: 'bg-yellow-50 text-yellow-800 border-yellow-200', icon: Clock },
  processing: { label: 'Wordt verwerkt',    color: 'bg-blue-50 text-blue-800 border-blue-200',      icon: Package },
  'on-hold':  { label: 'In de wacht',       color: 'bg-gray-50 text-gray-700 border-gray-200',       icon: Clock },
  completed:  { label: 'Voltooid',          color: 'bg-green-50 text-green-800 border-green-200',    icon: CheckCircle },
  shipped:    { label: 'Onderweg',          color: 'bg-blue-50 text-blue-800 border-blue-200',       icon: Truck },
  cancelled:  { label: 'Geannuleerd',       color: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle },
  refunded:   { label: 'Terugbetaald',      color: 'bg-purple-50 text-purple-700 border-purple-200', icon: RotateCcw },
  failed:     { label: 'Mislukt',           color: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle },
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(parseFloat(amount))
}

const inputClass =
  'w-full h-12 px-4 rounded-xl border border-border bg-white text-sm font-sans text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark/10 focus:border-dark/30 transition-colors'
const labelClass = 'block text-xs font-sans font-semibold text-dark/60 uppercase tracking-wider mb-2'

export default function OrderTrackClient() {
  const [orderNumber, setOrderNumber] = useState('')
  const [postcode, setPostcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(
        `/api/order-track?number=${encodeURIComponent(orderNumber.trim())}&postcode=${encodeURIComponent(postcode.trim())}`
      )

      if (res.status === 404) {
        setError('Geen bestelling gevonden met dit ordernummer en postcode. Controleer je gegevens en probeer opnieuw.')
        return
      }
      if (!res.ok) {
        setError('Er is iets misgegaan. Probeer het opnieuw of neem contact op.')
        return
      }

      const data: TrackingOrder = await res.json()
      setOrder(data)
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw of neem contact op.')
    } finally {
      setLoading(false)
    }
  }

  const statusCfg = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.processing) : null
  const StatusIcon = statusCfg?.icon ?? Package

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-border p-7 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="orderNumber" className={labelClass}>Ordernummer</label>
              <input
                id="orderNumber"
                type="text"
                required
                placeholder="bijv. 5904"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={inputClass}
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="postcode" className={labelClass}>Postcode</label>
              <input
                id="postcode"
                type="text"
                required
                placeholder="bijv. 1234 AB"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={inputClass}
                autoComplete="postal-code"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-sans text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 px-8 rounded-xl bg-dark text-white text-sm font-sans font-semibold hover:bg-dark/85 transition-colors duration-200 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Zoeken…
              </>
            ) : (
              <>
                <Package size={16} />
                Bestelling opzoeken
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {order && statusCfg && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-7 py-5 border-b border-border flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-sans text-muted mb-0.5">Bestelling #{order.number}</p>
              <p className="font-sans font-semibold text-dark">{order.customer_name}</p>
              <p className="text-sm font-sans text-muted mt-0.5">{formatDate(order.date_created)}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
              <StatusIcon size={12} />
              {statusCfg.label}
            </span>
          </div>

          {/* Tracking block */}
          {order.tracking.url || order.tracking.code ? (
            <div className="px-7 py-5 border-b border-border bg-blue-50/40">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Truck size={16} className="text-blue-600" />
                    <p className="text-sm font-sans font-semibold text-dark">
                      {order.tracking.carrier ?? 'Pakket'} Track & Trace
                    </p>
                  </div>
                  {order.tracking.code && (
                    <p className="text-xs font-sans text-muted font-mono mt-1">
                      {order.tracking.code}
                    </p>
                  )}
                </div>
                {order.tracking.url && (
                  <a
                    href={order.tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-dark text-white text-xs font-sans font-semibold hover:bg-dark/85 transition-colors"
                  >
                    Volg pakket
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="px-7 py-4 border-b border-border bg-surface/50">
              <div className="flex items-center gap-2 text-sm font-sans text-muted">
                <Clock size={14} />
                <span>Nog geen trackinginformatie beschikbaar. Je ontvangt een e-mail zodra je pakket onderweg is.</span>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="px-7 py-5 border-b border-border">
            <p className="text-xs font-sans font-semibold text-dark/50 uppercase tracking-wider mb-4">Producten</p>
            <div className="space-y-3">
              {order.line_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-lg bg-surface border border-border flex-shrink-0 overflow-hidden">
                      {item.image?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image.src} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package size={16} className="text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-sans text-dark truncate">{item.name}</p>
                      <p className="text-xs font-sans text-muted">× {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-sans font-semibold text-dark flex-shrink-0">
                    {formatPrice(item.total, order.currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-sm font-sans font-semibold text-dark">Totaal</span>
              <span className="text-sm font-sans font-bold text-dark">{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="px-7 py-5">
            <p className="text-xs font-sans font-semibold text-dark/50 uppercase tracking-wider mb-3">Bezorgadres</p>
            <p className="text-sm font-sans text-dark/75 leading-relaxed">
              {order.shipping.address_1}<br />
              {order.shipping.postcode} {order.shipping.city}
            </p>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="bg-surface rounded-2xl border border-border px-6 py-5">
        <p className="text-sm font-sans font-semibold text-dark mb-1">Hulp nodig?</p>
        <p className="text-sm font-sans text-dark/60">
          Vind je ordernummer in de bevestigingsmail die je na aankoop hebt ontvangen.{' '}
          Geen e-mail ontvangen?{' '}
          <a href="/contact" className="underline hover:text-accent transition-colors">
            Neem contact op
          </a>{' '}
          of mail naar{' '}
          <a href="mailto:info@noctisessentials.com" className="underline hover:text-accent transition-colors">
            info@noctisessentials.com
          </a>
        </p>
      </div>
    </div>
  )
}
