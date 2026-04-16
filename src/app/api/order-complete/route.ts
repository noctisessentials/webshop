import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

type ShippingAddress = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address1: string
  address2?: string
  city: string
  postcode: string
  country: string
  newsletterOptIn?: boolean
}

type WCOrder = {
  id: number
  number: string
  transaction_id?: string
}

async function findExistingOrderByTransactionId(
  WC_URL: string,
  credentials: string,
  paymentIntentId: string
): Promise<WCOrder | undefined> {
  const byTransactionRes = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?transaction_id=${encodeURIComponent(paymentIntentId)}&per_page=5`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  )

  if (byTransactionRes.ok) {
    const orders = (await byTransactionRes.json()) as WCOrder[]
    const exact = orders.find((order) => order.transaction_id === paymentIntentId)
    if (exact) return exact
  }

  const fallbackSearchRes = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?search=${encodeURIComponent(paymentIntentId)}&per_page=20`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  )

  if (!fallbackSearchRes.ok) return undefined
  const fallbackOrders = (await fallbackSearchRes.json()) as WCOrder[]
  return fallbackOrders.find((order) => order.transaction_id === paymentIntentId)
}

export async function POST(request: Request) {
  try {
    const {
      paymentIntentId,
      shipping,
    }: { paymentIntentId: string; shipping: ShippingAddress } = await request.json()

    // Verify the payment actually succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Parse line items stored in payment intent metadata
    type LineItem = { wcId: number; quantity: number }
    const lineItems: LineItem[] = JSON.parse(paymentIntent.metadata.line_items ?? '[]')

    const WC_URL = process.env.NEXT_PUBLIC_WC_URL
    const WC_KEY = process.env.WC_CONSUMER_KEY
    const WC_SECRET = process.env.WC_CONSUMER_SECRET

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 })
    }

    const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

    const existingOrder = await findExistingOrderByTransactionId(
      WC_URL,
      credentials,
      paymentIntentId
    )
    if (existingOrder) {
      return NextResponse.json({
        orderId: existingOrder.id,
        orderNumber: existingOrder.number,
      })
    }

    // Create the WooCommerce order with status "processing" (paid)
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        status: 'processing',
        payment_method: 'stripe',
        payment_method_title: 'Stripe',
        set_paid: true,
        transaction_id: paymentIntentId,
        ...(shipping.newsletterOptIn
          ? {
              meta_data: [
                {
                  key: 'newsletter_opt_in',
                  value: 'yes',
                },
              ],
            }
          : {}),
        billing: {
          first_name: shipping.firstName,
          last_name: shipping.lastName,
          email: shipping.email,
          phone: shipping.phone ?? '',
          address_1: shipping.address1,
          address_2: shipping.address2 ?? '',
          city: shipping.city,
          postcode: shipping.postcode,
          country: shipping.country,
        },
        shipping: {
          first_name: shipping.firstName,
          last_name: shipping.lastName,
          address_1: shipping.address1,
          address_2: shipping.address2 ?? '',
          city: shipping.city,
          postcode: shipping.postcode,
          country: shipping.country,
        },
        line_items: lineItems.map(({ wcId, quantity }) => ({
          product_id: wcId,
          quantity,
        })),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[order-complete] WC order creation failed:', err)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 502 })
    }

    const order = await res.json()
    return NextResponse.json({ orderId: order.id, orderNumber: order.number })
  } catch (err) {
    console.error('[order-complete]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
