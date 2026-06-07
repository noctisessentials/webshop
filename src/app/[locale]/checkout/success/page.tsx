'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter, Link } from '@/i18n/navigation'
import { CheckCircle, Package, Mail } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { getStoredUTMs, clearUTMs } from '@/lib/utm'

type OrderState =
  | { status: 'loading' }
  | { status: 'success'; orderId: number; orderNumber: string }
  | { status: 'pending'; total: number }
  | { status: 'canceled' }
  | { status: 'failed' }
  | { status: 'error'; message: string }

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart() as ReturnType<typeof useCart> & { clearCart?: () => void }
  const [order, setOrder] = useState<OrderState>({ status: 'loading' })

  const paymentIntentId = searchParams.get('payment_intent')
  const redirectStatus = searchParams.get('redirect_status')
  const calledRef = useRef(false)

  useEffect(() => {
    if (!paymentIntentId) {
      router.replace('/')
      return
    }
    // Handle redirect-based payment methods (iDEAL, Bancontact, Klarna)
    if (redirectStatus === 'canceled') {
      setOrder({ status: 'canceled' })
      return
    }
    if (redirectStatus === 'failed') {
      setOrder({ status: 'failed' })
      return
    }
    if (calledRef.current) return
    calledRef.current = true

    async function completeOrder() {
      try {
        // localStorage survives cross-origin redirects (iDEAL, Klarna, Bancontact);
        // sessionStorage may be cleared on mobile during payment redirect
        const shippingRaw =
          localStorage.getItem('noctis_shipping') ??
          sessionStorage.getItem('noctis_shipping')
        const shipping = shippingRaw ? JSON.parse(shippingRaw) : null

        // Extract GA4 client_id from _ga cookie so server-side Measurement Protocol
        // can attribute the purchase to the correct session/user
        let ga4ClientId: string | undefined
        try {
          const gaCookie = document.cookie.split('; ').find((c) => c.startsWith('_ga='))
          if (gaCookie) {
            const parts = gaCookie.split('=')[1].split('.')
            if (parts.length >= 4) ga4ClientId = `${parts[2]}.${parts[3]}`
          }
        } catch { /* cookie access blocked */ }

        const res = await fetch('/api/order-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId, shipping, utm: getStoredUTMs(), ga4ClientId }),
        })

        if (!res.ok) throw new Error('Order creation failed')
        const data = await res.json()

        // Pending: webhook hasn't fired yet — show processing state, cart still cleared
        if (data.status === 'pending') {
          setOrder({ status: 'pending', total: data.total ?? 0 })
          localStorage.removeItem('noctis_shipping')
          sessionStorage.removeItem('noctis_shipping')
          sessionStorage.removeItem('noctis_cart')
          clearUTMs()
          clearCart?.()
          return
        }

        setOrder({ status: 'success', orderId: data.orderId, orderNumber: data.orderNumber })

        const eventId = `purchase-${data.orderId}`

        // GA4 ecommerce purchase event — read cart from sessionStorage before clearing
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          try {
            const cartRaw = sessionStorage.getItem('noctis_cart')
            const cartItems: { wcId: number; title: string; colorName: string; quantity: number; price: number }[] =
              cartRaw ? JSON.parse(cartRaw) : []
            window.gtag('event', 'purchase', {
              transaction_id: data.orderNumber ?? String(data.orderId),
              value: data.total ?? 0,
              currency: 'EUR',
              items: cartItems.map((item) => ({
                item_id: String(item.wcId),
                item_name: item.colorName ? `${item.title} — ${item.colorName}` : item.title,
                price: item.price,
                quantity: item.quantity,
              })),
            })
          } catch {
            // Storage unavailable — fire minimal event
            window.gtag('event', 'purchase', {
              transaction_id: data.orderNumber ?? String(data.orderId),
              value: data.total ?? 0,
              currency: 'EUR',
            })
          }
        }

        // Browser pixel — may be blocked by ad blockers / Safari ITP
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', {
            content_ids: [String(data.orderId)],
            value: data.total ?? 0,
            currency: 'EUR',
            num_items: data.itemCount ?? 1,
          }, { eventID: eventId })
        }

        // Server-side CAPI — fires regardless of ad blockers, deduplicates with browser pixel and webhook via event_id
        fetch('/api/meta-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Purchase',
            eventId,
            eventSourceUrl: window.location.href,
            userData: {
              email: shipping?.email,
              phone: shipping?.phone,
              firstName: shipping?.firstName,
              lastName: shipping?.lastName,
            },
            customData: {
              value: data.total ?? 0,
              currency: 'EUR',
              content_ids: [String(data.orderId)],
              num_items: data.itemCount ?? 1,
            },
          }),
        }).catch((err) => console.error('[capi] Purchase event failed:', err))

        localStorage.removeItem('noctis_shipping')
        sessionStorage.removeItem('noctis_shipping')
        sessionStorage.removeItem('noctis_cart')
        clearUTMs()
        clearCart?.()
      } catch (err) {
        console.error(err)
        setOrder({
          status: 'error',
          message: 'Je betaling is ontvangen, maar er ging iets mis bij het aanmaken van je bestelling. Neem contact op met ons supportteam.',
        })
      }
    }

    completeOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentId])

  const shippingRaw = typeof window !== 'undefined'
    ? (localStorage.getItem('noctis_shipping') ?? sessionStorage.getItem('noctis_shipping'))
    : null
  const shipping = shippingRaw ? JSON.parse(shippingRaw) : null

  return (
    <div className="min-h-screen bg-[#F0EDE8]">
      <div className="container-content py-14 md:py-20 max-w-2xl">
        {order.status === 'loading' && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="font-sans text-muted text-sm">Bestelling afronden…</p>
          </div>
        )}

        {order.status === 'pending' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-accent" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-3">
                Betaling ontvangen
              </p>
              <h1
                className="font-sans font-bold text-dark mb-3 tracking-tight"
                style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
              >
                Bedankt{shipping?.firstName ? `, ${shipping.firstName}` : ''}!
              </h1>
              <p className="font-sans text-muted text-sm leading-relaxed">
                Je betaling is bevestigd. Je ontvangt zo meteen een bevestigingsmail.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-dark">Bevestigingsmail onderweg</p>
                  <p className="font-sans text-xs text-muted mt-0.5 leading-relaxed">
                    Binnen enkele minuten ontvang je een bevestiging. Niets ontvangen? Controleer je spam of neem contact op via info@noctisessentials.com.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link href="/winkel" className="inline-block bg-dark text-white font-sans font-semibold text-sm px-8 py-4 rounded-xl hover:bg-dark/90 transition-colors duration-200">
                Verder winkelen
              </Link>
            </div>
          </div>
        )}

        {order.status === 'success' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-accent" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-3">
                Bestelling bevestigd
              </p>
              <h1
                className="font-sans font-bold text-dark mb-3 tracking-tight"
                style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
              >
                Bedankt{shipping?.firstName ? `, ${shipping.firstName}` : ''}!
              </h1>
              <p className="font-sans text-muted text-sm leading-relaxed">
                Bestelling <span className="font-semibold text-dark">#{order.orderNumber}</span> is geplaatst.
                {shipping?.email && (
                  <> Een bevestiging is verzonden naar <span className="font-semibold text-dark">{shipping.email}</span>.</>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h2 className="font-sans font-semibold text-sm text-dark mb-6">
                Wat gebeurt er nu?
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    title: 'Bevestigingsmail',
                    body: 'Je ontvangt binnen enkele minuten een bevestiging in je inbox. Niets ontvangen? Controleer je spam of ongewenste e-mail (vooral bij Outlook). Nog steeds niets? Neem contact met ons op via info@noctisessentials.com.',
                  },
                  {
                    icon: Package,
                    title: 'Verzending binnen 1 werkdag',
                    body: 'Levering in Nederland en België binnen 1-2 werkdagen.',
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm text-dark">{title}</p>
                      <p className="font-sans text-xs text-muted mt-0.5 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/winkel"
                className="inline-block bg-dark text-white font-sans font-semibold text-sm px-8 py-4 rounded-xl hover:bg-dark/90 transition-colors duration-200"
              >
                Verder winkelen
              </Link>
            </div>
          </div>
        )}

        {order.status === 'canceled' && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted mb-3">
              Betaling geannuleerd
            </p>
            <h1 className="font-sans font-bold text-dark mb-3" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
              Je hebt de betaling geannuleerd.
            </h1>
            <p className="font-sans text-sm text-muted leading-relaxed mb-6">
              Er is niets in rekening gebracht. Je winkelwagen is nog intact.
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-dark text-white font-sans font-semibold text-sm px-8 py-4 rounded-xl hover:bg-dark/90 transition-colors duration-200"
            >
              Terug naar checkout
            </Link>
          </div>
        )}

        {order.status === 'failed' && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted mb-3">
              Betaling mislukt
            </p>
            <h1 className="font-sans font-bold text-dark mb-3" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
              Er ging iets mis met je betaling.
            </h1>
            <p className="font-sans text-sm text-muted leading-relaxed mb-6">
              Er is niets in rekening gebracht. Probeer het opnieuw of kies een andere betaalmethode.
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-dark text-white font-sans font-semibold text-sm px-8 py-4 rounded-xl hover:bg-dark/90 transition-colors duration-200"
            >
              Opnieuw proberen
            </Link>
          </div>
        )}

        {order.status === 'error' && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="font-sans font-semibold text-dark mb-2">Betaling ontvangen</p>
            <p className="font-sans text-sm text-muted leading-relaxed mb-6">
              {order.message}
            </p>
            <a
              href="mailto:info@noctisessentials.com"
              className="text-accent font-sans font-semibold text-sm underline underline-offset-4"
            >
              info@noctisessentials.com
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
