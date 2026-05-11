import { NextResponse } from 'next/server'

// PDOK Locatieserver — gratis officiële overheids-API voor NL adressen
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postcode = searchParams.get('postcode')?.replace(/\s/g, '').toUpperCase()
  const number   = searchParams.get('number')?.trim()

  if (!postcode || !number) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const query = `${postcode}+${number}`
  const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(query)}&fq=type:adres&fl=straatnaam,woonplaatsnaam,postcode,huisnummer&rows=1`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Noctis-Storefront/1.0' },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return NextResponse.json({ error: 'Lookup failed' }, { status: 502 })

    const data = await res.json()
    const doc = data?.response?.docs?.[0]
    if (!doc?.straatnaam) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      street: doc.straatnaam as string,
      city:   doc.woonplaatsnaam as string,
    })
  } catch {
    return NextResponse.json({ error: 'Lookup timeout' }, { status: 504 })
  }
}
