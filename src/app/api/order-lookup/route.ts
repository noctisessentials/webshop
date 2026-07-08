import { NextResponse } from 'next/server'

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

const COLOR_NL: Record<string, string> = {
  'Black & White': 'Zwart/Wit',
  'Black':         'Zwart',
  'White':         'Wit',
  'Grey':          'Grijs',
  'Pink':          'Roze',
  'Mint Green':    'Mintgroen',
  'Green':         'Groen',
  'Nude':          'Nude',
  'Natural Acacia':'Naturel Acacia',
}

function toNlProductName(rawName: string): string {
  const name = decodeHtmlEntities(rawName)
  const kitchenMatch = name.match(/^19-?[Pp]iece\s+[Kk]itchenware\s+(.+)$/i)
  if (kitchenMatch) return `19-delige keukenset — ${COLOR_NL[kitchenMatch[1].trim()] ?? kitchenMatch[1].trim()}`
  const millsMatch = name.match(/^[Pp]epper\s*[&]\s*[Ss]alt\s+[Mm]ills?\s+(.+)$/i)
  if (millsMatch) return `Peper- en zoutmolens — ${COLOR_NL[millsMatch[1].trim()] ?? millsMatch[1].trim()}`
  if (/acacia\s+cutting\s+board/i.test(name)) return 'Acacia snijplank'
  return name
}

function wcFetch(path: string, credentials: string) {
  const WC_URL = process.env.NEXT_PUBLIC_WC_URL
  return fetch(`${WC_URL}/wp-json/wc/v3${path}`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: 'no-store',
  })
}

function buildCredentials() {
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET
  if (!key || !secret || !process.env.NEXT_PUBLIC_WC_URL) return null
  return Buffer.from(`${key}:${secret}`).toString('base64')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim().toLowerCase()
  const number = searchParams.get('number')?.trim()

  if (!email || !number) {
    return NextResponse.json({ error: 'Email and order number required' }, { status: 400 })
  }

  const credentials = buildCredentials()
  if (!credentials) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // Fetch order directly by ID (WC order number = order ID in standard setups)
  const res = await wcFetch(`/orders/${encodeURIComponent(number)}`, credentials)

  if (res.status === 404) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 502 })
  }

  const order: {
    billing: { email: string }
    line_items?: Array<{ name: string;[key: string]: unknown }>
    [key: string]: unknown
  } = await res.json()

  if (order.billing.email.toLowerCase() !== email) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Normalize product names to Dutch and decode HTML entities
  if (Array.isArray(order.line_items)) {
    order.line_items = order.line_items.map((item) => ({
      ...item,
      name: toNlProductName(item.name),
    }))
  }

  return NextResponse.json(order)
}
