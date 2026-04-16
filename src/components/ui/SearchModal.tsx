'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import type { Product } from '@/lib/data'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type SearchResult = {
  query: string
  products: Product[]
  isBestsellers: boolean
}

type Props = {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: Props) {
  const t = useTranslations('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchResults = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data: SearchResult = await res.json()
        setResults(data)
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60)
      fetchResults('')
    } else {
      setQuery('')
      setResults(null)
    }
  }, [open, fetchResults])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchResults(val), 300)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[80px] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-[20px] shadow-[0_20px_60px_rgba(30,29,29,0.18)] overflow-hidden">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EDEBE8]">
          <Search size={17} strokeWidth={1.5} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={t('placeholder')}
            className="search-modal-input flex-1 text-sm font-sans text-dark placeholder:text-muted bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-dark transition-colors flex-shrink-0"
            aria-label={t('close')}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Results */}
        <div className="px-5 py-5">
          {loading && !results && (
            <p className="text-xs font-sans text-muted py-2">{t('searching')}</p>
          )}

          {results && (
            <>
              <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-4">
                {results.isBestsellers ? t('suggestions') : `${t('noResults')} "${results.query}"`}
              </p>

              {results.products.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm font-sans text-dark/60 mb-3">
                    {t('noResults')} &ldquo;{results.query}&rdquo;
                  </p>
                  <Link
                    href="/winkel"
                    onClick={onClose}
                    className="text-sm font-sans font-semibold text-dark underline"
                  >
                    {t('viewAll')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {results.products.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={{ pathname: '/products/[handle]', params: { handle: product.handle } }}
                      onClick={onClose}
                      className="group text-center"
                    >
                      <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#F5F2EE] mb-2">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
                          sizes="160px"
                        />
                      </div>
                      <p className="text-xs font-sans font-semibold text-dark leading-snug line-clamp-2 mb-0.5">
                        {product.title}
                      </p>
                      <p className="text-xs font-sans text-muted">
                        €{product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer button */}
        <div className="px-5 pb-5">
          <Link
            href="/winkel"
            onClick={onClose}
            className="block w-full h-11 rounded-xl bg-dark text-white text-xs font-sans font-semibold tracking-wide uppercase text-center leading-[44px] hover:bg-dark/85 transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </div>
  )
}
