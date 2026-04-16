import { NextResponse } from 'next/server'
import { getWCProducts } from '@/lib/woocommerce'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''

  const products = await getWCProducts()

  if (!q) {
    // Return bestsellers (first 6 instock products)
    const bestsellers = products.filter((p) => p.inStock).slice(0, 6)
    return NextResponse.json({ query: '', products: bestsellers, isBestsellers: true })
  }

  const filtered = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    )
  })

  return NextResponse.json({ query: q, products: filtered, isBestsellers: false })
}
