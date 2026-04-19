import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { CHATBOT_POLICIES } from '@/lib/chatbot/knowledge'
import { rateLimit } from '@/lib/rate-limit'

type TranscriptMessage = {
  role: 'user' | 'assistant'
  content: string
}

function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function sanitizeTranscript(input: unknown): TranscriptMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .filter((item): item is TranscriptMessage => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Partial<TranscriptMessage>
      if (candidate.role !== 'user' && candidate.role !== 'assistant') return false
      return typeof candidate.content === 'string'
    })
    .map((item) => ({
      role: item.role,
      content: item.content.replace(/\s+/g, ' ').trim().slice(0, 600),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-12)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request)

    if (!rateLimit(`chat-escalate:ip:${ip}`, 4, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Te veel escalaties vanaf dit adres.' }, { status: 429 })
    }

    const body = await request.json()

    const website = typeof body?.website === 'string' ? body.website : ''
    if (website) {
      return NextResponse.json({ ok: true })
    }

    const locale = body?.locale === 'en' ? 'en' : 'nl'
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : ''
    const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 160).toLowerCase() : ''
    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 300) : 'manual-escalation'
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.slice(0, 80) : 'unknown'
    const transcript = sanitizeTranscript(body?.conversation)

    if (!rateLimit(`chat-escalate:session:${sessionId}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Escalation limit reached for this session.'
              : 'Escalatielimiet bereikt voor deze sessie.',
        },
        { status: 429 }
      )
    }

    if (!name || !email) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Please provide your name and email address.'
              : 'Vul alsjeblieft je naam en e-mailadres in.',
        },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Please enter a valid email address.'
              : 'Vul een geldig e-mailadres in.',
        },
        { status: 400 }
      )
    }

    const transcriptText = transcript
      .map((line, index) => `${index + 1}. ${line.role.toUpperCase()}: ${line.content}`)
      .join('\n')

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeLocale = escapeHtml(locale)
    const safeReason = escapeHtml(reason)
    const safeTranscript = escapeHtml(transcriptText || '(no transcript)')

    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'SMTP is not fully configured (SMTP_HOST/SMTP_USER/SMTP_PASS).'
              : 'SMTP is niet volledig ingesteld (SMTP_HOST/SMTP_USER/SMTP_PASS).',
        },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: `"Noctis Chatbot" <${smtpUser}>`,
      to: process.env.CHATBOT_ESCALATION_TO ?? process.env.SMTP_TO ?? CHATBOT_POLICIES.supportEmail,
      replyTo: email,
      subject: `[Chatbot Escalation] ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Locale: ${locale}`,
        `Reason: ${reason}`,
        '',
        'Recent conversation:',
        transcriptText || '(no transcript)',
      ].join('\n'),
      html: `
        <div style="font-family:sans-serif;max-width:680px;margin:0 auto;color:#1E1D1D">
          <h2 style="margin-bottom:12px">Nieuwe chatbot-escalatie</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:8px">
            <tr><td style="padding:8px 0;color:#888;width:140px">Naam</td><td style="padding:8px 0"><strong>${safeName}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#888">E-mail</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#1E1D1D">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Taal</td><td style="padding:8px 0">${safeLocale}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Reden</td><td style="padding:8px 0">${safeReason}</td></tr>
          </table>
          <div style="margin-top:18px;padding:16px;background:#F5F2EE;border-radius:12px;white-space:pre-wrap;line-height:1.6">${safeTranscript}</div>
        </div>
      `,
    })

    return NextResponse.json({
      ok: true,
      confirmation:
        locale === 'en'
          ? `Thanks, we received your request. We will get back to you within ${CHATBOT_POLICIES.escalationSlaHours} hours.`
          : `Dankjewel, we hebben je verzoek ontvangen. We komen binnen ${CHATBOT_POLICIES.escalationSlaHours} uur bij je terug.`,
    })
  } catch (error) {
    console.error('[chatbot-escalate]', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to submit escalation: ${message}` }, { status: 500 })
  }
}
