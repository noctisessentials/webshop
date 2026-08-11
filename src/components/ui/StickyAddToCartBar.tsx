'use client'

import { useEffect, useState, type RefObject } from 'react'
import Image from 'next/image'
import { Check, Truck, RotateCcw, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { type ProductColor } from '@/lib/data'

const USPS = [
  { icon: Truck, label: 'Gratis verzending' },
  { icon: RotateCcw, label: '14 dagen retour' },
  { icon: Check, label: 'Snel in huis' },
]

type StickyAddToCartBarProps = {
  anchorRef: RefObject<HTMLElement | null>
  image: string
  title: string
  price: number
  compareAtPrice?: number
  colors: ProductColor[]
  selectedColor: ProductColor
  onSelectColor: (color: ProductColor) => void
  onAddToCart: () => void
  adding: boolean
  soldOut?: boolean
}

export function StickyAddToCartBar({
  anchorRef,
  image,
  title,
  price,
  compareAtPrice,
  colors,
  selectedColor,
  onSelectColor,
  onAddToCart,
  adding,
  soldOut = false,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.classList.add('has-sticky-bar')
    return () => document.body.classList.remove('has-sticky-bar')
  }, [])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [anchorRef])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-3 md:bottom-4 z-40 px-3 md:px-0 transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
      aria-hidden={!visible}
    >
      <div className="container-content">
        <div className="flex items-center gap-3 md:gap-6 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
            <div className="relative h-11 w-11 md:h-12 md:w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
            <p className="truncate text-sm font-sans font-semibold text-dark max-w-[120px] sm:max-w-[220px]">{title}</p>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {USPS.map((usp) => (
              <span key={usp.label} className="flex items-center gap-1.5 text-xs font-sans text-dark/70 whitespace-nowrap">
                <Check size={13} className="text-accent flex-shrink-0" />
                {usp.label}
              </span>
            ))}
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center gap-3 lg:ml-0">
            {colors.length > 1 && (
              <div className="hidden flex-shrink-0 items-center gap-1.5 sm:flex">
                {colors.map((color) => {
                  const isActive = selectedColor.slug === color.slug
                  const isBlackWhite = color.slug === 'black-white' || color.slug === 'zwart-wit'
                  return (
                    <button
                      key={color.slug}
                      type="button"
                      onClick={() => onSelectColor(color)}
                      disabled={!color.inStock}
                      aria-label={color.name}
                      title={color.name}
                      className={cn(
                        'h-6 w-6 rounded-full border-2 overflow-hidden flex transition-all duration-150',
                        isActive ? 'border-dark scale-110' : 'border-transparent hover:border-dark/30',
                        !color.inStock && 'opacity-40 cursor-not-allowed'
                      )}
                      style={!isBlackWhite ? { backgroundColor: color.hex } : undefined}
                    >
                      {isBlackWhite && (
                        <>
                          <span className="flex-1 h-full" style={{ backgroundColor: '#222222' }} />
                          <span className="flex-1 h-full" style={{ backgroundColor: '#DEDEDE' }} />
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-sans font-semibold text-dark">{formatPrice(price)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xs font-sans text-muted line-through">{formatPrice(compareAtPrice)}</span>
              )}
            </div>

            <Button
              variant="accent"
              size="md"
              loading={adding}
              disabled={soldOut}
              onClick={onAddToCart}
              aria-label={soldOut ? 'Uitverkocht' : 'In winkelwagen'}
              className="flex-shrink-0 px-3.5 sm:px-6"
            >
              {soldOut ? (
                <span className="text-xs sm:text-sm">Uitverkocht</span>
              ) : (
                <>
                  <ShoppingBag size={18} className="sm:hidden" />
                  <span className="hidden sm:inline">In winkelwagen</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
