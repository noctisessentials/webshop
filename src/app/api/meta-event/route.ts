import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

const PIXEL_ID = '933186462850674'
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN

function hash(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function POST(request: Request) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: 'CAPI token not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { eventName, eventId, eventSourceUrl, userData = {}, customData = {} } = body

    const headersList = await headers()
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
    const userAgent = headersList.get('user-agent') ?? ''

    const userDataPayload: Record<string, string> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    }
    if (userData.email) userDataPayload.em = hash(userData.email)
    if (userData.phone) userDataPayload.ph = hash(userData.phone.replace(/\D/g, ''))
    if (userData.firstName) userDataPayload.fn = hash(userData.firstName)
    if (userData.lastName) userDataPayload.ln = hash(userData.lastName)

    const event = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userDataPayload,
      custom_data: customData,
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event] }),
      }
    )

    const result = await res.json()
    return NextResponse.json({ ok: res.ok, result })
  } catch (err) {
    console.error('[CAPI]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
