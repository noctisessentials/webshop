import { NextResponse } from 'next/server'

type CheckoutItem = {
  wcId: number
  quantity: number
}

export async function POST(request: Request) {
  try {
    const { items }: { items: CheckoutItem[] } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const WC_URL = process.env.NEXT_PUBLIC_WC_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 })
    }

    const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    // Create a pending WC order with the cart line items
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        status: 'pending',
        line_items: items.map(({ wcId, quantity }) => ({
          product_id: wcId,
          quantity,
        })),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[checkout] WC order creation failed:', err)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 502 })
    }

    const order = await res.json()

    // payment_url is the WooCommerce order-pay page (Stripe checkout)
    return NextResponse.json({ paymentUrl: order.payment_url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
