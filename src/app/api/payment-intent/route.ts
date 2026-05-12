import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { UTMData } from '@/lib/utm'
import { validateDiscountViaWC } from '@/lib/discounts'

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
    const { items, email, shipping, utm, discountCode }: {
      items: LineItem[]
      email?: string
      shipping?: ShippingData
      utm?: UTMData | null
      discountCode?: string
    } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Validate discount server-side so the client can't manipulate the amount
    let discountAmount = 0
    let discountLabel = ''
    if (discountCode) {
      const result = await validateDiscountViaWC(discountCode, subtotal)
      if (result.valid) {
        discountAmount = result.discountAmount
        discountLabel = result.label
      }
    }

    const amountCents = Math.round((subtotal - discountAmount) * 100)

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
        // Store UTMs so the webhook can set order attribution if the browser never reaches /success
        ...(utm ? { utm: JSON.stringify(utm) } : {}),
        ...(discountLabel ? { discount: discountLabel } : {}),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[payment-intent]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
