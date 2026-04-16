'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'

type WCOrder = {
  id: number
  number: string
  status: OrderStatus
  date_created: string
  total: string
  currency: string
  line_items: Array<{ name: string; quantity: number; total: string }>
  billing: { first_name: string; last_name: string; email: string }
  shipping: { address_1: string; city: string; postcode: string; country: string }
  payment_method_title: string
  meta_data: Array<{ key: string; value: string }>
}

const STATUS_LABELS_NL: Record<OrderStatus, string> = {
  pending: 'In behandeling',
  processing: 'Wordt verwerkt',
  'on-hold': 'In de wacht',
  completed: 'Voltooid',
  cancelled: 'Geannuleerd',
  refunded: 'Terugbetaald',
  failed: 'Mislukt',
}

const STATUS_LABELS_EN: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  'on-hold': 'On hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  failed: 'Failed',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-50 text-blue-800 border-blue-200',
  'on-hold': 'bg-gray-50 text-gray-700 border-gray-200',
  completed: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
}

function formatDate(dateStr: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(parseFloat(amount))
}

export default function OrderLookup() {
  const locale = useLocale()
  const isEn = locale === 'en'
  const STATUS_LABELS = isEn ? STATUS_LABELS_EN : STATUS_LABELS_NL

  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<WCOrder | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(`/api/order-lookup?email=${encodeURIComponent(email)}&number=${encodeURIComponent(orderNumber)}`)
      if (res.status === 404) {
        setError(isEn
          ? 'No order found with this email address and order number. Please check your details and try again.'
          : 'Geen bestelling gevonden met dit e-mailadres en ordernummer. Controleer de gegevens en probeer opnieuw.')
        setLoading(false)
        return
      }
      if (!res.ok) {
        setError(isEn ? 'Something went wrong. Please try again.' : 'Er is iets misgegaan. Probeer het opnieuw.')
        setLoading(false)
        return
      }
      const data: WCOrder = await res.json()
      setOrder(data)
    } catch {
      setError(isEn
        ? 'Something went wrong. Please try again or contact us.'
        : 'Er is iets misgegaan. Probeer het opnieuw of neem contact op.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-11 px-4 rounded-xl border border-border bg-white text-sm font-sans text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark/10 focus:border-dark/30 transition-colors'
  const labelClass = 'block text-xs font-sans font-semibold text-dark mb-1.5'

  const trackingUrl = order?.meta_data?.find((m) => m.key === '_tracking_url' || m.key === 'tracking_url')?.value

  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-[22px] border border-border p-8">
        <form onSubmit={handleLookup} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className={labelClass}>
                {isEn ? 'Email address' : 'E-mailadres'}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={isEn ? 'your@email.com' : 'jouw@email.nl'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="orderNumber" className={labelClass}>
                {isEn ? 'Order number' : 'Ordernummer'}
              </label>
              <input
                id="orderNumber"
                type="text"
                required
                placeholder={isEn ? 'e.g. 1234' : 'bijv. 1234'}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-sans text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-11 px-8 rounded-xl bg-dark text-white text-sm font-sans font-semibold hover:bg-dark/85 transition-colors duration-200 disabled:opacity-60"
          >
            {loading
              ? (isEn ? 'Searching…' : 'Zoeken…')
              : (isEn ? 'Look up order' : 'Bestelling opzoeken')}
          </button>
        </form>
      </div>

      {order && (
        <div className="bg-surface rounded-[22px] border border-border p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-sans text-muted mb-0.5">
                {isEn ? 'Order' : 'Bestelling'} #{order.number}
              </p>
              <p className="font-sans font-semibold text-dark">{formatDate(order.date_created, locale)}</p>
            </div>
            <span className={`text-xs font-sans font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-3">
              {isEn ? 'Products' : 'Producten'}
            </p>
            <div className="space-y-2">
              {order.line_items.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-4 text-sm font-sans">
                  <span className="text-dark">{item.name} <span className="text-muted">× {item.quantity}</span></span>
                  <span className="text-dark font-semibold flex-shrink-0">{formatPrice(item.total, order.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm font-sans font-semibold text-dark">
                {isEn ? 'Total' : 'Totaal'}
              </span>
              <span className="text-sm font-sans font-bold text-dark">{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-2">
                {isEn ? 'Delivery address' : 'Bezorgadres'}
              </p>
              <p className="text-sm font-sans text-dark/80 leading-relaxed">
                {order.billing.first_name} {order.billing.last_name}<br />
                {order.shipping.address_1}<br />
                {order.shipping.postcode} {order.shipping.city}
              </p>
            </div>
            <div>
              <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-2">
                {isEn ? 'Payment method' : 'Betaalmethode'}
              </p>
              <p className="text-sm font-sans text-dark/80">{order.payment_method_title}</p>
            </div>
          </div>

          {trackingUrl && (
            <div className="bg-white rounded-[14px] border border-border p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-sans font-semibold text-dark mb-0.5">Track & trace</p>
                <p className="text-xs font-sans text-muted">
                  {isEn ? 'See where your package is' : 'Bekijk waar je pakket is'}
                </p>
              </div>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 h-9 px-5 rounded-xl bg-dark text-white text-xs font-sans font-semibold inline-flex items-center hover:bg-dark/85 transition-colors"
              >
                {isEn ? 'Track package →' : 'Volg pakket →'}
              </a>
            </div>
          )}

          <p className="text-xs font-sans text-muted">
            {isEn ? 'Want to return?' : 'Wil je retourneren?'}{' '}
            <Link href="/retourneren" className="underline hover:text-dark transition-colors">
              {isEn ? 'View return policy' : 'Bekijk het retourbeleid'}
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
