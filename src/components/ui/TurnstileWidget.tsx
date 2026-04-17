'use client'

import { useEffect, useRef } from 'react'

type Props = {
  onToken: (token: string) => void
}

export function TurnstileWidget({ onToken }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)

  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!sitekey || rendered.current || !divRef.current) return

    const render = () => {
      if (!window.turnstile || !divRef.current || rendered.current) return
      rendered.current = true
      window.turnstile.render(divRef.current, {
        sitekey,
        callback: onToken,
        size: 'invisible',
        appearance: 'interaction-only',
      })
    }

    if (window.turnstile) {
      render()
    } else {
      const prev = window.onloadTurnstileCallback
      window.onloadTurnstileCallback = () => {
        prev?.()
        render()
      }
    }
  // onToken is stable per form render — safe to ignore exhaustive-deps here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={divRef} />
}
