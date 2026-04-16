import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim()
  const number = searchParams.get('number')?.trim()

  if (!email || !number) {
    return NextResponse.json({ error: 'Email and order number required' }, { status: 400 })
  }

  const WC_URL = process.env.NEXT_PUBLIC_WC_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET

  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

  // Fetch the order by number
  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?number=${encodeURIComponent(number)}&per_page=1`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 502 })
  }

  const orders: Array<{ billing: { email: string } }> = await res.json()

  if (!orders.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const order = orders[0]

  // Verify email matches
  if (order.billing.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(order)
}
