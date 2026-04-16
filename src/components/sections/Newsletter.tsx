'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'
import { useTranslations } from 'next-intl'

export function Newsletter() {
  const t = useTranslations('home.newsletter')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <SectionFrame className="mb-10 md:mb-14">
      <div className="bg-dark section-py-sm">
        <div className="container-content">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
              {t('eyebrow')}
            </p>
            <h2
              className="font-sans font-bold text-light mb-4 tracking-tight"
              style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
            >
              {t('title1')}
              <br />
              <span style={{ color: '#C9A882', fontWeight: 400, fontStyle: 'italic', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.1em' }}>
                {t('title2')}
              </span>
            </h2>
            <p className="font-sans text-light/45 text-sm mb-8">
              {t('subtitle')}
            </p>

            {submitted ? (
              <div className="py-4">
                <p className="font-sans font-semibold text-lg text-light/80">
                  {t('success')}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  required
                  className="flex-1 h-12 px-4 bg-white/8 border border-white/15 text-light placeholder:text-light/30 text-sm font-sans rounded-full focus:outline-none focus:border-accent/60 transition-colors duration-200"
                />
                <Button variant="accent" size="md" type="submit" disabled={loading} className="rounded-full">
                  {loading ? '...' : t('submit')}
                </Button>
              </form>
            )}

            <p className="text-2xs font-sans text-light/25 mt-4 tracking-wider">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
