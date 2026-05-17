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
  if (res.ok) {
    const orders = (await res.json()) as WCOrder[]
    const exact = orders.find((o) => o.transaction_id === paymentIntentId)
    if (exact) return exact
  }

  const fallback = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?search=${encodeURIComponent(paymentIntentId)}&per_page=20`,
    { headers: { Authorization: `Basic ${credentials}` } }
  )
  if (!fallback.ok) return undefined
  const fallbackOrders = (await fallback.json()) as WCOrder[]
  return fallbackOrders.find((o) => o.transaction_id === paymentIntentId)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  try {
    const { paymentIntentId }: { paymentIntentId: string } = await request.json()

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    type LineItem = { wcId: number; quantity: number }
    const lineItems: LineItem[] = JSON.parse(paymentIntent.metadata.line_items ?? '[]')
    const total = paymentIntent.amount / 100
    const itemCount = lineItems.reduce((s, i) => s + i.quantity, 0)

    const WC_URL = process.env.NEXT_PUBLIC_WC_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 })
    }

    const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    // Fast path: webhook already stored the WC order ID in Stripe metadata
    if (paymentIntent.metadata.wc_order_id) {
      return NextResponse.json({
        orderId: Number(paymentIntent.metadata.wc_order_id),
        orderNumber: paymentIntent.metadata.wc_order_number ?? paymentIntent.metadata.wc_order_id,
        total,
        itemCount,
      })
    }

    // Poll WC — webhook is the sole order creator, give it up to ~8 seconds
    const ATTEMPTS = 5
    const INTERVAL_MS = 1600

    for (let i = 0; i < ATTEMPTS; i++) {
      if (i > 0) await sleep(INTERVAL_MS)

      // Re-fetch Stripe metadata on each attempt — webhook may have written wc_order_id
      const fresh = i > 0 ? await stripe.paymentIntents.retrieve(paymentIntentId) : paymentIntent
      if (fresh.metadata.wc_order_id) {
        return NextResponse.json({
          orderId: Number(fresh.metadata.wc_order_id),
          orderNumber: fresh.metadata.wc_order_number ?? fresh.metadata.wc_order_id,
          total,
          itemCount,
        })
      }

      const order = await findExistingOrder(WC_URL, credentials, paymentIntentId)
      if (order) {
        console.log(`[order-complete] Found WC order #${order.id} on attempt ${i + 1}`)
        return NextResponse.json({ orderId: order.id, orderNumber: order.number, total, itemCount })
      }

      console.log(`[order-complete] Waiting for webhook to create order, attempt ${i + 1}/${ATTEMPTS}`)
    }

    // Webhook hasn't fired yet — tell the client to show a pending state.
    // Stripe will retry the webhook for up to 3 days; the customer will receive a confirmation email.
    console.warn(`[order-complete] Order not found after polling for ${paymentIntentId} — returning pending`)
    return NextResponse.json({ status: 'pending', total, itemCount })
  } catch (err) {
    console.error('[order-complete]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
