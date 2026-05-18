import { NextResponse } from 'next/server'
import { STATIC_PRODUCTS } from '@/lib/products-static'

type LineItem = {
  wcId: number
  title: string
  colorName: string
  quantity: number
  price: number
}

export async function POST(request: Request) {
  try {
    const { email, items }: { email: string; items: LineItem[] } = await request.json()

    if (!email || !items?.length) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const omnisendKey = process.env.OMNISEND_API_KEY
    if (!omnisendKey) {
      return NextResponse.json({ ok: true })
    }

    const BASE_URL = 'https://noctisessentials.com'
    const cartID = `early-${email}`
    const cartSum = items.reduce((s, i) => s + i.price * i.quantity, 0)

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
        recoveryUrl,
      }
    })

    const recoveryUrl = cartProducts[0]?.recoveryUrl ?? `${BASE_URL}/nl/winkel`
    const cleanProducts = cartProducts.map(({ recoveryUrl: _, ...rest }) => rest)

    // Upsert contact first (awaited so the contact exists before the cart is created)
    const contactRes = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
      body: JSON.stringify({ email, status: 'nonSubscribed' }),
    })
    if (!contactRes.ok) {
      const body = await contactRes.text()
      console.error('[track-cart] Omnisend contact upsert failed:', contactRes.status, body)
    } else {
      console.log('[track-cart] Omnisend contact upserted:', email)
    }

    // Push cart — triggers "Started checkout" automation in Omnisend
    const cartRes = await fetch('https://api.omnisend.com/v3/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
      body: JSON.stringify({
        cartID,
        email,
        currency: 'EUR',
        cartSum,
        cartRecoveryUrl: recoveryUrl,
        products: cleanProducts,
      }),
    })
    if (!cartRes.ok) {
      const body = await cartRes.text()
      console.error('[track-cart] Omnisend cart push failed:', cartRes.status, body)
      return NextResponse.json({ ok: false, error: body }, { status: 502 })
    }

    console.log('[track-cart] Omnisend cart pushed for:', email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[track-cart]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
