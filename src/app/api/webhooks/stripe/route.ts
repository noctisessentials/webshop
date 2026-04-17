import { NextResponse } from 'next/server'
import Stripe from 'stripe'

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

  // Must use raw body for signature verification
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (
    event.type !== 'payment_intent.payment_failed' &&
    event.type !== 'payment_intent.canceled'
  ) {
    return NextResponse.json({ received: true })
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent

  const WC_URL = process.env.NEXT_PUBLIC_WC_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET

  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    console.error('[stripe-webhook] WooCommerce not configured')
    return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 })
  }

  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

  // Don't create a duplicate if we already logged this intent
  const existing = await findExistingOrder(WC_URL, credentials, paymentIntent.id)
  if (existing) {
    return NextResponse.json({ received: true, orderId: existing.id })
  }

  type LineItem = { wcId: number; quantity: number }
  let lineItems: LineItem[] = []
  try {
    lineItems = JSON.parse(paymentIntent.metadata.line_items ?? '[]')
  } catch {
    // metadata may be empty for very early failures
  }

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
      ? {
          line_items: lineItems.map(({ wcId, quantity }) => ({
            product_id: wcId,
            quantity,
          })),
        }
      : {}),
  }

  // Add billing info if available (receipt_email is the most we reliably have)
  if (paymentIntent.receipt_email) {
    body.billing = { email: paymentIntent.receipt_email }
  }

  const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[stripe-webhook] WC order creation failed:', err)
    return NextResponse.json({ error: 'Failed to create WC order' }, { status: 502 })
  }

  const order = await res.json()
  console.log(
    `[stripe-webhook] Created failed order #${order.id} for intent ${paymentIntent.id} (${event.type})`
  )

  return NextResponse.json({ received: true, orderId: order.id })
}
