import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

    // Layer 2: rate limit — max 3 newsletter signups per IP per 10 minutes
    if (!rateLimit(`newsletter:${ip}`, 3, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }, { status: 429 })
    }

    const { email, website, turnstileToken, locale } = await request.json()

    // Layer 1: honeypot
    if (website) {
      return NextResponse.json({ success: true }) // silently discard
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Layer 3: Cloudflare Turnstile
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken)
      if (!valid) {
        return NextResponse.json({ error: 'Bot-verificatie mislukt.' }, { status: 403 })
      }
    }

    const res = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.OMNISEND_API_KEY!,
      },
      body: JSON.stringify({
        email,
        status: 'subscribed',
        statusDate: new Date().toISOString(),
        channels: {
          email: {
            status: 'subscribed',
            statusDate: new Date().toISOString(),
          },
        },
        tags: ['newsletter', 'website', locale === 'en' ? 'language_en' : 'language_nl'],
      }),
    })

    const body = await res.json().catch(() => ({}))
    console.log('[newsletter] Omnisend response:', res.status, JSON.stringify(body))

    if (res.status === 409) {
      return NextResponse.json({ alreadySubscribed: true })
    }

    if (!res.ok) {
      console.error('[newsletter] Omnisend error:', res.status, body)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
