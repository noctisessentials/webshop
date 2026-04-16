import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const SOCIALS = [
  { label: 'Facebook', href: 'http://facebook.com/noctisessentials' },
  { label: 'TikTok', href: 'http://tiktok.com/@noctisessentials' },
  { label: 'Pinterest', href: 'http://pinterest.com/noctisessentials' },
  { label: 'Instagram', href: 'http://instagram.com/noctisessentials' },
]

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (label === 'Facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M13.7 21v-8h2.7l.4-3.1h-3.1V8c0-.9.2-1.6 1.5-1.6h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.1H8v3.1h2.3v8h3.4z" />
      </svg>
    )
  }
  if (label === 'Pinterest') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.2 20.2 10.7 14" />
        <path d="M10.7 14c.6.9 1.5 1.3 2.5 1.3 2.6 0 4.3-2.3 4.3-5 0-2.4-1.8-4.3-4.9-4.3-3.7 0-5.7 2.6-5.7 5.2 0 1.3.5 2.4 1.6 2.8.2.1.4 0 .4-.2l.3-1.2c.1-.2 0-.3-.2-.5-.3-.4-.5-.9-.5-1.6 0-2 1.5-3.8 4-3.8 2.2 0 3.4 1.4 3.4 3.2 0 2.4-1.1 4.5-2.7 4.5-.9 0-1.5-.8-1.3-1.7.2-1.1.7-2.2.7-3 0-.7-.4-1.3-1.2-1.3-.9 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4Z" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M15.9 3.2c.4 1.2 1.4 2.2 2.7 2.6V8c-1.1 0-2.1-.3-3-.9v5.8A4.9 4.9 0 1 1 10.7 8a6 6 0 0 1 1 .1v2.3a2.7 2.7 0 0 0-1-.2c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V3.2h2.5z" />
    </svg>
  )
}

export async function Footer() {
  const t = await getTranslations('footer')

  const LINKS = [
    {
      heading: t('general'),
      items: [
        { label: t('aboutUs'), href: '/over-ons' as const },
        { label: t('inspiration'), href: '/blog' as const },
        { label: t('terms'), href: '/algemene-voorwaarden' as const },
        { label: t('privacy'), href: '/privacybeleid' as const },
      ],
    },
    {
      heading: t('service'),
      items: [
        { label: t('contact'), href: '/contact' as const },
        { label: t('faq'), href: '/veelgestelde-vragen' as const },
        { label: t('shipping'), href: '/verzendbeleid' as const },
        { label: t('returns'), href: '/retourneren' as const },
      ],
    },
  ]

  return (
    <footer className="bg-dark text-light">
      <div className="container-content py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr] gap-12 lg:gap-10">
          {/* Brand column */}
          <div className="flex flex-col justify-between gap-8">
            <Link href="/" aria-label="Noctis Home">
              <Image
                src="/images/logo-color.png"
                alt="Noctis"
                width={160}
                height={42}
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-light/70 hover:text-light hover:border-white/40 transition-colors duration-200"
                >
                  <SocialIcon label={label} />
                </a>
              ))}
            </div>
            <p className="text-sm text-light/55 font-sans leading-relaxed max-w-[300px]">
              {t('tagline')}
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-sans uppercase tracking-widest text-light/35 mb-5">
                {group.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm md:text-base leading-tight font-sans text-light/75 hover:text-light transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans text-light/30 tracking-wide">
            © {new Date().getFullYear()} Noctis. {t('rights')}
          </p>
          <Image
            src="/images/payment-methodes2.png"
            alt="Ondersteunde betaalmethoden"
            width={240}
            height={28}
            className="h-5 w-auto opacity-90"
          />
        </div>
      </div>
    </footer>
  )
}
