'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingBag, Search, Menu, X, ChevronDown, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { SearchModal } from '@/components/ui/SearchModal'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

type LanguageCode = 'nl' | 'en'

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as LanguageCode
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const applyLanguage = (next: LanguageCode) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: next })
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-border bg-white text-dark hover:border-dark/25 transition-colors duration-200',
          compact ? 'h-8 px-2.5 text-xs' : 'h-8 px-3 text-xs'
        )}
      >
        <span className="font-sans font-semibold tracking-wide uppercase">{locale}</span>
        <ChevronDown
          size={13}
          className={cn('text-muted transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 min-w-[84px] rounded-xl border border-border bg-white shadow-[0_10px_30px_rgba(30,29,29,0.10)] p-1.5 z-50">
            {(['nl', 'en'] as LanguageCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => applyLanguage(code)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-semibold uppercase transition-colors duration-150',
                  locale === code ? 'bg-surface text-dark' : 'text-dark/80 hover:bg-surface'
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function Header() {
  const t = useTranslations('nav')
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const NAV_LINKS = [
    { label: t('shop'), href: '/winkel' as const },
    { label: t('kitchenSet'), href: '/19-delige-keukenset' as const },
    { label: t('mills'), href: '/peper-en-zoutmolens' as const },
    { label: t('cuttingBoard'), href: '/acacia-snijplank' as const },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 bg-light transition-shadow duration-250',
          scrolled && 'shadow-[0_1px_0_#E8E6E3]'
        )}
      >
        <div className="container-content">
          {/* Mobile header */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            <button
              className="p-1 -ml-1 text-dark"
              onClick={() => setMobileOpen(true)}
              aria-label={t('openNav')}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2"
              aria-label="Noctis — Home"
            >
              <Image
                src="/images/logo-color.png"
                alt="Noctis"
                width={140}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-4">
              <button
                className="relative p-1 text-dark hover:text-accent transition-colors duration-200"
                onClick={openCart}
                aria-label={`${t('cart')}, ${count}`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-white text-2xs flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block py-4">
            <div className="relative h-12">
              <Link
                href="/"
                aria-label="Noctis — Home"
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <Image
                  src="/images/logo-color.png"
                  alt="Noctis"
                  width={240}
                  height={68}
                  className="h-6 w-auto"
                  priority
                />
              </Link>

              <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-sans tracking-wide text-dark hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                <LanguageSwitcher />
                <button
                  className="p-1 text-dark hover:text-accent transition-colors duration-200"
                  aria-label={t('search')}
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
                <Link
                  href="/account"
                  className="p-1 text-dark hover:text-accent transition-colors duration-200"
                  aria-label={t('myOrders')}
                >
                  <User size={18} strokeWidth={1.5} />
                </Link>

                <button
                  className="relative p-1 text-dark hover:text-accent transition-colors duration-200"
                  onClick={openCart}
                  aria-label={`${t('cart')}, ${count}`}
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-white text-2xs flex items-center justify-center font-medium">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-dark/50"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-light flex flex-col"
            style={{ animation: 'slideRight 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <span className="font-serif text-lg font-light">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-dark"
                aria-label={t('closeNav')}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-xl font-medium text-dark hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-6 py-6 border-t border-border flex items-center justify-between">
              <p className="text-xs font-sans text-muted tracking-wide">
                {t('mobileFooter')}
              </p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
