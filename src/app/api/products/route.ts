import { NextResponse } from 'next/server'
import { getWCProducts } from '@/lib/woocommerce'

export async function GET() {
  const products = await getWCProducts()
  return NextResponse.json(products)
}
