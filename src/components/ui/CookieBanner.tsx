'use client'

import { useEffect, useState } from 'react'

type ConsentState = 'pending' | 'accepted' | 'declined'

function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'pending'
  const val = localStorage.getItem('cookie_consent') as ConsentState | null
  return val ?? 'pending'
}

function grantConsent() {
  if (typeof window === 'undefined') return
  // GA4 Consent Mode v2
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  }
  // Meta Pixel consent
  if (typeof window.fbq === 'function') {
    window.fbq('consent', 'grant')
  }
}

function revokeConsent() {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
  if (typeof window.fbq === 'function') {
    window.fbq('consent', 'revoke')
  }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>('pending')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    setConsent(stored)
    setMounted(true)
    if (stored === 'accepted') grantConsent()
    if (stored === 'declined') revokeConsent()
  }, [])

  if (!mounted || consent !== 'pending') return null

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setConsent('accepted')
    grantConsent()
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setConsent('declined')
    revokeConsent()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 md:flex md:justify-center pointer-events-none">
      <div className="bg-dark text-light rounded-[16px] px-5 py-4 shadow-xl max-w-2xl w-full pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <p className="text-sm font-sans flex-1 leading-relaxed">
            Wij gebruiken cookies voor analytics en marketing om je ervaring te verbeteren.{' '}
            <a href="/privacybeleid" className="underline underline-offset-2 hover:text-accent transition-colors">
              Meer info
            </a>
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="h-9 px-4 rounded-xl border border-white/20 text-xs font-sans font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors duration-200"
            >
              Weigeren
            </button>
            <button
              onClick={accept}
              className="h-9 px-5 rounded-xl bg-accent text-white text-xs font-sans font-semibold hover:bg-accent/90 transition-colors duration-200"
            >
              Accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
