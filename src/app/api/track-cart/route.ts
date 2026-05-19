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

    const cartProducts = items.map((item) => {
      const product = STATIC_PRODUCTS.find((p) => p.id === String(item.wcId))
      const handle = product?.handle ?? ''
      const imageUrl = product?.images[0]?.src ? `${BASE_URL}${product.images[0].src}` : undefined
      const isSingleProduct = items.length === 1
      const recoveryUrl = isSingleProduct && handle
        ? `${BASE_URL}/nl/products/${handle}`
        : `${BASE_URL}/nl/winkel`
      return {
        cartProductID: String(item.wcId),
        productID: String(item.wcId),
        variantID: String(item.wcId),
        title: item.colorName ? `${item.title} — ${item.colorName}` : item.title,
        quantity: item.quantity,
        price: Math.round(item.price * 100),
        currency: 'EUR',
        ...(imageUrl ? { imageUrl } : {}),
        productUrl: `${BASE_URL}/nl/products/${handle}`,
        recoveryUrl,
      }
    })

    const recoveryUrl = cartProducts[0]?.recoveryUrl ?? `${BASE_URL}/nl/winkel`
    const cleanProducts = cartProducts.map(({ recoveryUrl: _, ...rest }) => rest)
    const cartSum = Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100)

    // Fire both calls in parallel, don't block the response
    Promise.all([
      fetch('https://api.omnisend.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
        body: JSON.stringify({ email, status: 'nonSubscribed', statusDate: new Date().toISOString() }),
      }).then(async (r) => {
        if (!r.ok) console.error('[track-cart] contact upsert failed:', r.status, await r.text())
        else console.log('[track-cart] contact upserted:', email)
      }),
      fetch('https://api.omnisend.com/v3/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': omnisendKey },
        body: JSON.stringify({ cartID, email, currency: 'EUR', cartSum, cartRecoveryUrl: recoveryUrl, products: cleanProducts }),
      }).then(async (r) => {
        if (!r.ok) console.error('[track-cart] cart push failed:', r.status, await r.text())
        else console.log('[track-cart] cart pushed:', email, cartID)
      }),
    ]).catch((err) => console.error('[track-cart] unexpected error:', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[track-cart]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
