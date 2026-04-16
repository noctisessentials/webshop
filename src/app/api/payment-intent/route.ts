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

export async function POST(request: Request) {
  try {
    const { items, email }: { items: LineItem[]; email?: string } = await request.json()

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
      // Payment methods popular in NL/BE market
      payment_method_types: ['card', 'ideal', 'bancontact', 'klarna'],
      receipt_email: email || undefined,
      metadata: {
        // Store line items as JSON for the order-complete step
        line_items: JSON.stringify(
          items.map((i) => ({ wcId: i.wcId, title: i.title, colorName: i.colorName, quantity: i.quantity, price: i.price }))
        ),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[payment-intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
