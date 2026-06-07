import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import crypto from 'crypto'
import { utmToWCMeta } from '@/lib/utm'
import type { UTMData } from '@/lib/utm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

type WCOrder = {
  id: number
  number: string
  transaction_id?: string
}

async function findExistingOrder(
  WC_URL: string,
  credentials: string,
  paymentIntentId: string
): Promise<WCOrder | undefined> {
  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?transaction_id=${encodeURIComponent(paymentIntentId)}&per_page=5`,
    { headers: { Authorization: `Basic ${credentials}` } }
  )
  if (!res.ok) return undefined
  const orders = (await res.json()) as WCOrder[]
  return orders.find((o) => o.transaction_id === paymentIntentId)
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const rawBody = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const WC_URL = process.env.NEXT_PUBLIC_WC_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET

  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    console.error('[stripe-webhook] WooCommerce not configured')
    return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 })
  }

  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

  // ── payment_intent.succeeded ──────────────────────────────────────────────────
  if (event.type === 'payment_intent.succeeded') {
    const intentId = (event.data.object as Stripe.PaymentIntent).id

    const fullIntent = await stripe.paymentIntents.retrieve(intentId, {
      expand: ['latest_charge'],
    })

    const charge = fullIntent.latest_charge as Stripe.Charge | null
    const receiptUrl = charge?.receipt_url ?? null

    type LineItem = { wcId: number; quantity: number; price?: number; title?: string; colorName?: string }
    const lineItems: LineItem[] = JSON.parse(fullIntent.metadata.line_items ?? '[]')
    const shippingRaw = fullIntent.metadata.shipping
    const shipping = shippingRaw ? JSON.parse(shippingRaw) : null
    const utmRaw = fullIntent.metadata.utm
    let utm: UTMData | null = null
    try { utm = utmRaw ? JSON.parse(utmRaw) : null } catch { utm = null }

    // ── Step 1: Ensure WC order exists ─────────────────────────────────────────
    let wcOrder: WCOrder | undefined
    let justCreated = false

    // Fast path: wc_order_id already stored in Stripe metadata
    if (fullIntent.metadata.wc_order_id) {
      console.log(`[stripe-webhook] Found wc_order_id in Stripe metadata: #${fullIntent.metadata.wc_order_id}`)
      wcOrder = {
        id: Number(fullIntent.metadata.wc_order_id),
        number: fullIntent.metadata.wc_order_number ?? fullIntent.metadata.wc_order_id,
      }
    }

    if (!wcOrder) wcOrder = await findExistingOrder(WC_URL, credentials, intentId)

    if (!wcOrder && lineItems.length > 0) {
      const orderBody: Record<string, unknown> = {
        status: 'processing',
        payment_method: 'stripe',
        payment_method_title: 'Stripe',
        set_paid: true,
        transaction_id: intentId,
        line_items: lineItems.map(({ wcId, quantity }) => ({ product_id: wcId, quantity })),
        ...(utm ? { meta_data: utmToWCMeta(utm) } : {}),
      }

      if (shipping) {
        orderBody.billing = {
          first_name: shipping.firstName ?? '',
          last_name: shipping.lastName ?? '',
          email: shipping.email ?? fullIntent.receipt_email ?? '',
          phone: shipping.phone ?? '',
          address_1: shipping.address1 ?? '',
          address_2: shipping.address2 ?? '',
          city: shipping.city ?? '',
          postcode: shipping.postcode ?? '',
          country: shipping.country ?? '',
        }
        orderBody.shipping = {
          first_name: shipping.firstName ?? '',
          last_name: shipping.lastName ?? '',
          address_1: shipping.address1 ?? '',
          address_2: shipping.address2 ?? '',
          city: shipping.city ?? '',
          postcode: shipping.postcode ?? '',
          country: shipping.country ?? '',
        }
      } else if (fullIntent.receipt_email) {
        orderBody.billing = { email: fullIntent.receipt_email }
      }

      const createRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${credentials}` },
        body: JSON.stringify(orderBody),
      })

      if (createRes.ok) {
        wcOrder = (await createRes.json()) as WCOrder
        justCreated = true
        console.log(`[stripe-webhook] WC order created: #${wcOrder.id} for intent ${intentId}`)

        // Write order ID to Stripe metadata — order-complete polls this for fast resolution
        stripe.paymentIntents.update(intentId, {
          metadata: {
            wc_order_id: String(wcOrder.id),
            wc_order_number: String(wcOrder.number),
          },
        }).catch((err) => console.error('[stripe-webhook] Stripe metadata update failed:', err))
      } else {
        const err = await createRes.text()
        console.error('[stripe-webhook] WC order creation failed:', err)
        return NextResponse.json({ error: 'WC order creation failed' }, { status: 502 })
      }
    }

    if (!wcOrder) {
      return NextResponse.json({ received: true })
    }

    // ── Step 2: Post-order integrations ────────────────────────────────────────
    // These use idempotent IDs so Stripe webhook retries are safe.
    const omnisendKey = process.env.OMNISEND_API_KEY
    const email = shipping?.email ?? fullIntent.receipt_email

    if (omnisendKey && email) {
      // Upsert Omnisend contact
      const contactPayload = {
        email,
        firstName: shipping?.firstName,
        lastName: shipping?.lastName,
        ...(shipping?.newsletterOptIn
          ? { status: 'subscribed', statusDate: new Date().toISOString(), tags: ['newsletter'] }
          : { status: 'nonSubscribed', statusDate: new Date().toISOString() }),
      }
      fetch('https://api.omnisend.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
        body: JSON.stringify(contactPayload),
      }).catch((err) => console.error('[stripe-webhook] Omnisend contact upsert failed:', err))

      // Omnisend order sync is handled by the WooCommerce Omnisend plugin
    }

    // Meta CAPI Purchase — event_id is stable so retries are deduplicated by Meta
    const capiToken = process.env.META_CAPI_TOKEN
    if (capiToken && shipping?.email) {
      const hash = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex')
      await fetch(`https://graph.facebook.com/v19.0/332396313251645/events?access_token=${capiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: `purchase-${wcOrder.id}`,
            event_source_url: 'https://noctisessentials.com/nl/checkout/success',
            action_source: 'website',
            user_data: {
              em: hash(shipping.email),
              fn: hash(shipping.firstName),
              ln: hash(shipping.lastName),
              ph: shipping.phone ? hash(shipping.phone.replace(/\D/g, '')) : undefined,
            },
            custom_data: {
              value: fullIntent.amount / 100,
              currency: 'EUR',
              content_ids: [String(wcOrder.id)],
              num_items: lineItems.reduce((s, i) => s + i.quantity, 0),
            },
          }],
        }),
      })
        .then(async (r) => {
          const json = await r.json().catch(() => null)
          if (!r.ok) console.error('[stripe-webhook] Meta CAPI error:', JSON.stringify(json))
          else console.log(`[stripe-webhook] Meta CAPI Purchase sent for order #${wcOrder!.id}`)
        })
        .catch((err) => console.error('[stripe-webhook] Meta CAPI fetch failed:', err))
    }

    // Delete the Omnisend cart so the abandoned cart automation stops
    if (omnisendKey) {
      fetch(`https://api.omnisend.com/v3/carts/${intentId}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': omnisendKey },
      }).catch((err) => console.error('[stripe-webhook] Omnisend cart delete failed:', err))
    }

    console.log(`[stripe-webhook] payment_intent.succeeded handled: order #${wcOrder.id} justCreated=${justCreated}`)
    return NextResponse.json({ received: true, orderId: wcOrder.id })
  }

  // ── payment_intent.payment_failed / canceled → create failed WC order ────────
  if (
    event.type !== 'payment_intent.payment_failed' &&
    event.type !== 'payment_intent.canceled'
  ) {
    return NextResponse.json({ received: true })
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent

  const existing = await findExistingOrder(WC_URL, credentials, paymentIntent.id)
  if (existing) {
    return NextResponse.json({ received: true, orderId: existing.id })
  }

  type LineItem = { wcId: number; quantity: number }
  let lineItems: LineItem[] = []
  try {
    lineItems = JSON.parse(paymentIntent.metadata.line_items ?? '[]')
  } catch { /* metadata may be empty for very early failures */ }

  const failureMessage =
    (paymentIntent as Stripe.PaymentIntent & { last_payment_error?: { message?: string } })
      .last_payment_error?.message ?? 'Betaling mislukt'

  const body: Record<string, unknown> = {
    status: 'failed',
    payment_method: 'stripe',
    payment_method_title: 'Stripe',
    transaction_id: paymentIntent.id,
    meta_data: [
      { key: '_stripe_failure_reason', value: failureMessage },
      { key: '_stripe_event_type', value: event.type },
    ],
    ...(lineItems.length > 0
      ? { line_items: lineItems.map(({ wcId, quantity }) => ({ product_id: wcId, quantity })) }
      : {}),
  }

  if (paymentIntent.receipt_email) {
    body.billing = { email: paymentIntent.receipt_email }
  }

  const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${credentials}` },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[stripe-webhook] Failed WC order creation failed:', err)
    return NextResponse.json({ error: 'Failed to create WC order' }, { status: 502 })
  }

  const order = await res.json()
  console.log(`[stripe-webhook] Created failed order #${order.id} for intent ${paymentIntent.id} (${event.type})`)

  // Notify Omnisend for abandoned cart / failed-order automation
  const omnisendKey = process.env.OMNISEND_API_KEY
  if (omnisendKey && paymentIntent.receipt_email) {
    fetch('https://api.omnisend.com/v3/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
      body: JSON.stringify({
        orderID: `failed-${paymentIntent.id}`,
        email: paymentIntent.receipt_email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: 'EUR',
        orderSum: paymentIntent.amount / 100,
        paymentStatus: 'awaitingPayment',
        fulfillmentStatus: 'unfulfilled',
        products: lineItems.map(({ wcId, quantity }) => ({
          productID: String(wcId),
          quantity,
          price: 0,
        })),
      }),
    }).catch((err) => console.error('[stripe-webhook] Omnisend failed-order POST error:', err))
  }

  return NextResponse.json({ received: true, orderId: order.id })
}
