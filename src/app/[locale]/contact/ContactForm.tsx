'use client'

import { useState, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { TurnstileWidget } from '@/components/ui/TurnstileWidget'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const locale = useLocale()
  const isEn = locale === 'en'
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const turnstileToken = useRef<string | null>(null)
  const onTurnstileToken = useCallback((token: string) => { turnstileToken.current = token }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken: turnstileToken.current }),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-[#E8F5E8] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#2A5C2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-sans font-semibold text-dark mb-1">
          {isEn ? 'Message sent!' : 'Bericht verzonden!'}
        </p>
        <p className="text-sm font-sans text-muted">
          {isEn
            ? 'We usually respond within 24 hours on business days.'
            : 'We reageren doorgaans binnen 24 uur op werkdagen.'}
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full h-11 px-4 rounded-xl border border-border bg-white text-sm font-sans text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark/10 focus:border-dark/30 transition-colors'
  const labelClass = 'block text-xs font-sans font-semibold text-dark mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it in */}
      <input
        name="website"
        type="text"
        value={form.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
      />
      <TurnstileWidget onToken={onTurnstileToken} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            {isEn ? 'Name' : 'Naam'}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={isEn ? 'Your name' : 'Jouw naam'}
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {isEn ? 'Email address' : 'E-mailadres'}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={isEn ? 'your@email.com' : 'jouw@email.nl'}
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          {isEn ? 'Subject' : 'Onderwerp'}
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={inputClass + ' cursor-pointer'}
        >
          {isEn ? (
            <>
              <option value="">Select a subject</option>
              <option value="Order follow-up">Order follow-up</option>
              <option value="Return request">Return request</option>
              <option value="Damaged product">Damaged product</option>
              <option value="Payment">Payment</option>
              <option value="Other">Other</option>
            </>
          ) : (
            <>
              <option value="">Selecteer een onderwerp</option>
              <option value="Bestelling opvolging">Bestelling opvolging</option>
              <option value="Retour aanvragen">Retour aanvragen</option>
              <option value="Beschadigd product">Beschadigd product</option>
              <option value="Betaling">Betaling</option>
              <option value="Overig">Overig</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {isEn ? 'Message' : 'Bericht'}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={isEn
            ? 'Describe your question or comment as clearly as possible…'
            : 'Beschrijf zo duidelijk mogelijk je vraag of opmerking…'}
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark/10 focus:border-dark/30 transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm font-sans text-red-600">
          {isEn
            ? 'Something went wrong. Please try again or email info@noctisessentials.nl.'
            : 'Er is iets misgegaan. Probeer het opnieuw of stuur een e-mail naar info@noctisessentials.nl.'}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full h-12 rounded-xl bg-dark text-white text-sm font-sans font-semibold hover:bg-dark/85 transition-colors duration-200 disabled:opacity-60"
      >
        {status === 'loading'
          ? (isEn ? 'Sending…' : 'Verzenden…')
          : (isEn ? 'Send message' : 'Verstuur bericht')}
      </button>
    </form>
  )
}
