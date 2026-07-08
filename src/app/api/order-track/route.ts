import { NextResponse } from 'next/server'

function normalizePostcode(pc: string) {
  return pc.replace(/\s/g, '').toUpperCase()
}

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

  // Match known product families and translate color suffix
  const kitchenMatch = name.match(/^19-?[Pp]iece\s+[Kk]itchenware\s+(.+)$/i)
  if (kitchenMatch) {
    const color = kitchenMatch[1].trim()
    return `19-delige keukenset — ${COLOR_NL[color] ?? color}`
  }

  const millsMatch = name.match(/^[Pp]epper\s*[&]\s*[Ss]alt\s+[Mm]ills?\s+(.+)$/i)
  if (millsMatch) {
    const color = millsMatch[1].trim()
    return `Peper- en zoutmolens — ${COLOR_NL[color] ?? color}`
  }

  if (/acacia\s+cutting\s+board/i.test(name)) {
    return 'Acacia snijplank'
  }

  return name
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const number = searchParams.get('number')?.trim()
  const postcode = searchParams.get('postcode')?.trim()

  if (!number || !postcode) {
    return NextResponse.json({ error: 'Order number and postcode required' }, { status: 400 })
  }

  const WC_URL = process.env.NEXT_PUBLIC_WC_URL
  const WC_KEY = process.env.WC_CONSUMER_KEY
  const WC_SECRET = process.env.WC_CONSUMER_SECRET

  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

  const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${encodeURIComponent(number)}`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: 'no-store',
  })

  if (res.status === 404) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 502 })
  }

  const order: {
    id: number
    number: string
    status: string
    date_created: string
    total: string
    currency: string
    billing: { first_name: string; last_name: string; email: string; postcode: string }
    shipping: { first_name: string; last_name: string; address_1: string; city: string; postcode: string; country: string }
    line_items: Array<{ id: number; name: string; quantity: number; total: string; image?: { src: string } }>
    payment_method_title: string
    meta_data: Array<{ key: string; value: string }>
  } = await res.json()

  // Verify postcode matches billing or shipping address
  const billingPostcode = normalizePostcode(order.billing.postcode ?? '')
  const shippingPostcode = normalizePostcode(order.shipping.postcode ?? '')
  const inputPostcode = normalizePostcode(postcode)

  if (billingPostcode !== inputPostcode && shippingPostcode !== inputPostcode) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Extract tracking meta — WooCommerce fulfilment plugins use various key names
  const meta = order.meta_data ?? []
  const getMeta = (...keys: string[]) =>
    keys.map((k) => meta.find((m) => m.key === k)?.value).find(Boolean) ?? null

  const trackingCarrier = getMeta('tracking_carrier', '_tracking_carrier', 'wc_shipment_tracking_items')
  const trackingCode = getMeta('tracking_code', '_tracking_code', 'tracking_number', '_tracking_number')
  const trackingUrl = getMeta('tracking_url', '_tracking_url', 'tracking_link', '_tracking_link')

  return NextResponse.json({
    id: order.id,
    number: order.number,
    status: order.status,
    date_created: order.date_created,
    total: order.total,
    currency: order.currency,
    customer_name: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
    shipping: order.shipping,
    line_items: order.line_items.map((item) => ({
      ...item,
      name: toNlProductName(item.name),
    })),
    payment_method_title: order.payment_method_title,
    tracking: {
      carrier: trackingCarrier,
      code: trackingCode,
      url: trackingUrl,
    },
  })
}
