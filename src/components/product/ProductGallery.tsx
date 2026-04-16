'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Product, ProductColor } from '@/lib/data'

type Props = {
  product: Product
  selectedColor: ProductColor
}

export function ProductGallery({ product, selectedColor }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent, total: number) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      if (delta > 0) setActiveIndex((i) => Math.min(i + 1, total - 1))
      else setActiveIndex((i) => Math.max(i - 1, 0))
    }
    touchStartX.current = null
  }

  const images = product.images.length > 0
    ? product.images
    : [{ src: '/images/products/kitchenware-black.jpg', alt: product.title }]

  // Reset to first image when color changes (handled by key on parent if needed)
  const activeImg = images[activeIndex] ?? images[0]

  return (
    <div className="flex gap-3 md:gap-4">
      {/* Vertical thumbnail strip — desktop */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2.5 w-[72px] flex-shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative aspect-square rounded-[10px] overflow-hidden border-2 transition-all duration-200 flex-shrink-0',
                activeIndex === i
                  ? 'border-dark shadow-sm'
                  : 'border-transparent hover:border-border'
              )}
              aria-label={img.alt}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 flex flex-col gap-3">
        <div
          className="relative rounded-[18px] overflow-hidden bg-surface aspect-square md:aspect-[4/5]"
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, images.length)}
        >
          <Image
            key={activeImg.src}
            src={activeImg.src}
            alt={activeImg.alt}
            fill
            priority
            className="object-cover object-center transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    i === activeIndex ? 'w-4 bg-dark' : 'w-1.5 bg-dark/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile horizontal thumbnail strip */}
        {images.length > 1 && (
          <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative w-16 h-16 flex-shrink-0 rounded-[10px] overflow-hidden border-2 transition-all duration-200',
                  activeIndex === i
                    ? 'border-dark'
                    : 'border-transparent hover:border-border'
                )}
                aria-label={img.alt}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
