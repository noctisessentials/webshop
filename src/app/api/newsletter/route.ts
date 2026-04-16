import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
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
        sendWelcomeEmail: true,
        tags: ['newsletter', 'website'],
      }),
    })

    if (!res.ok && res.status !== 409) {
      const err = await res.text()
      console.error('[newsletter] Omnisend error:', err)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
