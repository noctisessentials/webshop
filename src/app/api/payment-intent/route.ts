import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

type LineItem = {
  wcId: number
  title: string
  colorName: string
  quantity: number
  price: number // unit price in EUR
}

type ShippingData = {
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

export async function POST(request: Request) {
  try {
    const { items, email, shipping }: { items: LineItem[]; email?: string; shipping?: ShippingData } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    // Total in cents
    const amountCents = Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    )

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      payment_method_types: ['ideal', 'card', 'bancontact', 'klarna'],
      receipt_email: email || undefined,
      metadata: {
        line_items: JSON.stringify(
          items.map((i) => ({ wcId: i.wcId, title: i.title, colorName: i.colorName, quantity: i.quantity, price: i.price }))
        ),
        // Store shipping so the webhook can create a WC order if the browser never reaches /success
        ...(shipping ? { shipping: JSON.stringify(shipping) } : {}),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[payment-intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
