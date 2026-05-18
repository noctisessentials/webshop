import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { UTMData } from '@/lib/utm'
import { validateDiscountViaWC } from '@/lib/discounts'
import { STATIC_PRODUCTS } from '@/lib/products-static'

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

    const cap = (s: string) => s.slice(0, 500)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      payment_method_types: ['ideal', 'card', 'bancontact', 'klarna'],
      receipt_email: email || undefined,
      metadata: {
        line_items: cap(JSON.stringify(
          items.map((i) => ({ wcId: i.wcId, title: i.title, colorName: i.colorName, quantity: i.quantity, price: i.price }))
        )),
        // Store shipping so the webhook can create a WC order if the browser never reaches /success
        ...(shipping ? { shipping: cap(JSON.stringify(shipping)) } : {}),
        // Store UTMs so the webhook can set order attribution if the browser never reaches /success
        ...(utm ? { utm: cap(JSON.stringify(utm)) } : {}),
        ...(discountLabel ? { discount: discountLabel } : {}),
      },
    })

    // Push cart to Omnisend for abandoned cart automation (fire-and-forget)
    const omnisendKey = process.env.OMNISEND_API_KEY
    const contactEmail = shipping?.email ?? email
    if (omnisendKey && contactEmail) {
      const BASE_URL = 'https://noctisessentials.com'
      const cartProducts = items.map((item) => {
        const product = STATIC_PRODUCTS.find((p) => p.id === String(item.wcId))
        const handle = product?.handle ?? ''
        const imageUrl = product?.images[0]?.src ? `${BASE_URL}${product.images[0].src}` : undefined
        const isSingleProduct = items.length === 1
        const recoveryUrl = isSingleProduct && handle
          ? `${BASE_URL}/nl/products/${handle}`
          : `${BASE_URL}/nl/winkel`
        return {
          productID: String(item.wcId),
          variantID: String(item.wcId),
          title: item.colorName ? `${item.title} — ${item.colorName}` : item.title,
          quantity: item.quantity,
          price: item.price,
          currency: 'EUR',
          ...(imageUrl ? { imageUrl } : {}),
          productUrl: `${BASE_URL}/nl/products/${handle}`,
          _recoveryUrl: recoveryUrl,
        }
      })
      const recoveryUrl = cartProducts[0]?._recoveryUrl ?? `${BASE_URL}/nl/winkel`
      const cleanProducts = cartProducts.map(({ _recoveryUrl: _, ...rest }) => rest)

      // Delete the early cart (created at email blur) so only one cart exists per contact
      fetch(`https://api.omnisend.com/v3/carts/early-${encodeURIComponent(contactEmail)}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': omnisendKey },
      }).catch(() => { /* early cart may not exist — ignore */ })

      fetch('https://api.omnisend.com/v3/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
        body: JSON.stringify({
          cartID: paymentIntent.id,
          email: contactEmail,
          currency: 'EUR',
          cartSum: amountCents / 100,
          cartRecoveryUrl: recoveryUrl,
          products: cleanProducts,
        }),
      }).catch((err) => console.error('[payment-intent] Omnisend cart push failed:', err))
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[payment-intent]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
