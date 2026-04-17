import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

    // Layer 2: rate limit — max 5 contact submissions per IP per 10 minutes
    if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }, { status: 429 })
    }

    const { name, email, subject, message, website, turnstileToken } = await request.json()

    // Layer 1: honeypot — bots fill in the hidden 'website' field
    if (website) {
      return NextResponse.json({ ok: true }) // silently discard
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Layer 3: Cloudflare Turnstile token verification
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken)
      if (!valid) {
        return NextResponse.json({ error: 'Bot-verificatie mislukt.' }, { status: 403 })
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Noctis Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO ?? 'info@noctisessentials.nl',
      replyTo: email,
      subject: `[Contact] ${subject || 'Nieuw bericht'} — ${name}`,
      text: `Naam: ${name}\nE-mail: ${email}\nOnderwerp: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1E1D1D;margin-bottom:24px">Nieuw contactbericht</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#888;width:120px">Naam</td><td style="padding:8px 0;color:#1E1D1D"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#888">E-mail</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#1E1D1D">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Onderwerp</td><td style="padding:8px 0;color:#1E1D1D">${subject || '—'}</td></tr>
          </table>
          <div style="margin-top:24px;padding:20px;background:#F5F2EE;border-radius:12px">
            <p style="margin:0;color:#1E1D1D;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
