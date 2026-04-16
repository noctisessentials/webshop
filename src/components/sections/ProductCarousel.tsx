'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import PlainLink from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/data'

type CarouselItem = {
  id: string
  handle: string
  title: string
  variant: string
  price: number
  compareAtPrice?: number
  image: string
  hoverImage?: string
}

type BestsellerSpec = {
  id: string
  title: string
  variant: string
  handleCandidates: string[]
}

type ProductCarouselProps = {
  products: Product[]
  customProducts?: Product[]
  title?: string
  showViewAllLink?: boolean
  viewAllHref?: string
  viewAllLabel?: string
}

const BESTSELLER_SPECS: BestsellerSpec[] = [
  {
    id: 'kitchen-black',
    title: '19-delige keukenset',
    variant: 'Zwart',
    handleCandidates: ['19-piece-kitchenware-black-2', '19-piece-kitchenware-black'],
  },
  {
    id: 'kitchen-nude',
    title: '19-delige keukenset',
    variant: 'Nude',
    handleCandidates: ['19-piece-kitchenware-nude'],
  },
  {
    id: 'mills-green',
    title: 'Peper- en zoutmolens',
    variant: 'Groen',
    handleCandidates: ['pepper-salt-mills-green'],
  },
  {
    id: 'mills-black-white',
    title: 'Peper- en zoutmolens',
    variant: 'Zwart wit',
    handleCandidates: ['pepper-salt-mills-black-white', 'pepper-salt-mills-blackwhite'],
  },
  {
    id: 'acacia-board',
    title: 'Acacia snijplank',
    variant: 'Acacia',
    handleCandidates: ['acacia-cutting-board'],
  },
]

function getDiscountPercentage(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price || compareAtPrice <= 0) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

function getHoverImageFallback(handle: string): string | undefined {
  if (handle.includes('pepper-salt-mills-green')) return '/content/pepper-salt-mills-green-second.webp'
  if (handle.includes('pepper-salt-mills-black-white') || handle.includes('pepper-salt-mills-blackwhite')) {
    return '/content/pepper-salt-mills-black-white-second.webp'
  }
  if (handle.includes('pepper-salt-mills-black')) return '/content/pepper-salt-mills-black-second.webp'
  if (handle.includes('pepper-salt-mills-white')) return '/content/pepper-salt-mills-white-second.webp'
  if (handle.includes('acacia-cutting-board')) return '/content/acacia-snijplank-lifestyle-1-800x1067.webp'
  return undefined
}

function getVariantLabelFromProduct(product: Product): string {
  const handle = product.handle.toLowerCase()
  if (handle.includes('acacia-cutting-board')) return 'Acacia'
  if (handle.includes('pepper-salt-mills-black-white') || handle.includes('pepper-salt-mills-blackwhite')) return 'Zwart wit'
  if (handle.includes('pepper-salt-mills-green')) return 'Groen'
  if (handle.includes('pepper-salt-mills-black')) return 'Zwart'
  if (handle.includes('pepper-salt-mills-white')) return 'Wit'
  if (handle.includes('19-piece-kitchenware-black')) return 'Zwart'
  if (handle.includes('19-piece-kitchenware-nude')) return 'Nude'
  if (handle.includes('19-piece-kitchenware-grey')) return 'Grijs'
  if (handle.includes('19-piece-kitchenware-pink')) return 'Roze'
  if (handle.includes('19-piece-kitchenware-mint-green')) return 'Mintgroen'
  const currentColor = product.colors.find((c) => c.wcSlug === product.handle)
  return currentColor?.name ?? ''
}

function buildCarouselItems(products: Product[], customProducts?: Product[]): CarouselItem[] {
  if (customProducts && customProducts.length > 0) {
    return customProducts.map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      variant: getVariantLabelFromProduct(product),
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0]?.src ?? `https://picsum.photos/seed/${product.handle}/560/700`,
      hoverImage: product.images[1]?.src ?? getHoverImageFallback(product.handle),
    }))
  }

  const findByCandidates = (candidates: string[]) => {
    for (const candidate of candidates) {
      const exactInStock = products.find((p) => p.handle === candidate && p.inStock)
      if (exactInStock) return exactInStock

      const exact = products.find((p) => p.handle === candidate)
      if (exact) return exact
    }

    for (const candidate of candidates) {
      const partialInStock = products.find((p) => p.handle.includes(candidate) && p.inStock)
      if (partialInStock) return partialInStock

      const partial = products.find((p) => p.handle.includes(candidate))
      if (partial) return partial
    }

    return undefined
  }

  const items: CarouselItem[] = []
  for (const spec of BESTSELLER_SPECS) {
    const product = findByCandidates(spec.handleCandidates)
    if (!product) continue

    items.push({
      id: spec.id,
      handle: product.handle,
      title: spec.title,
      variant: spec.variant,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0]?.src ?? `https://picsum.photos/seed/${product.handle}/560/700`,
      hoverImage: product.images[1]?.src ?? getHoverImageFallback(product.handle),
    })
  }

  return items
}

export function ProductCarousel({
  products,
  customProducts,
  title = 'Onze bestsellers',
  showViewAllLink = true,
  viewAllHref = '/winkel',
  viewAllLabel = 'Bekijk alle producten',
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pauseAutoScrollRef = useRef(false)
  const isDraggingRef = useRef(false)
  const movedDuringDragRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const items = buildCarouselItems(products, customProducts)
  const loopItems = items.length > 0 ? [...items, ...items, ...items] : items

  const wrapLoopPosition = useCallback(() => {
    const scroller = scrollRef.current
    if (!scroller || items.length <= 1) return

    const copyWidth = scroller.scrollWidth / 3
    if (copyWidth <= 0) return

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
    if (scroller.scrollLeft >= copyWidth * 2 || scroller.scrollLeft >= maxScrollLeft - 1) {
      scroller.scrollLeft -= copyWidth
    } else if (scroller.scrollLeft <= 1) {
      scroller.scrollLeft += copyWidth
    }
  }, [items.length])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller || items.length <= 1) return

    const copyWidth = scroller.scrollWidth / 3
    if (copyWidth > 0 && scroller.scrollLeft <= 1) {
      scroller.scrollLeft = copyWidth
    }
  }, [items.length, wrapLoopPosition])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller || items.length <= 1) return

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = ts - lastTsRef.current
      lastTsRef.current = ts

      if (!pauseAutoScrollRef.current) {
        scroller.scrollLeft += dt * 0.045
        wrapLoopPosition()
      }

      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [items.length, wrapLoopPosition])

  const onDragStart = (clientX: number) => {
    const scroller = scrollRef.current
    if (!scroller) return

    isDraggingRef.current = true
    movedDuringDragRef.current = false
    dragStartXRef.current = clientX
    dragStartScrollLeftRef.current = scroller.scrollLeft
    pauseAutoScrollRef.current = true
  }

  const onDragMove = (clientX: number) => {
    if (!isDraggingRef.current || !scrollRef.current) return

    const delta = clientX - dragStartXRef.current
    if (Math.abs(delta) > 3) movedDuringDragRef.current = true
    scrollRef.current.scrollLeft = dragStartScrollLeftRef.current - delta
    wrapLoopPosition()
  }

  const onDragEnd = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    pauseAutoScrollRef.current = false
  }

  return (
    <section className="section-py-sm overflow-x-hidden">
      <div className="w-full">
        <div className="mb-8 px-6 md:px-10 xl:px-14">
          <h2
            className="font-sans font-bold text-dark tracking-tight"
            style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}
          >
            {title}
          </h2>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-6 md:px-10 xl:px-14 pb-2 cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
            onMouseLeave={() => {
              onDragEnd()
            }}
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseMove={(e) => onDragMove(e.clientX)}
            onMouseUp={onDragEnd}
            onTouchStart={(e) => {
              pauseAutoScrollRef.current = true
              onDragStart(e.touches[0].clientX)
            }}
            onTouchMove={(e) => {
              onDragMove(e.touches[0].clientX)
            }}
            onTouchEnd={() => {
              onDragEnd()
              setTimeout(() => { pauseAutoScrollRef.current = false }, 1200)
            }}
            onScroll={wrapLoopPosition}
            onClickCapture={(e) => {
              if (movedDuringDragRef.current) {
                e.preventDefault()
                e.stopPropagation()
                movedDuringDragRef.current = false
              }
            }}
            onDragStart={(e) => e.preventDefault()}
          >
            {loopItems.map((item, index) => {
              const discount = getDiscountPercentage(item.price, item.compareAtPrice)
              return (
                <Link
                  key={`${item.id}-${index}`}
                  href={{ pathname: '/products/[handle]', params: { handle: item.handle } }}
                  className="group flex-shrink-0"
                  style={{ width: 'clamp(200px, 26vw, 270px)' }}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ borderRadius: '16px' }}>
                    <Image
                      src={item.image}
                      alt={`${item.title} in ${item.variant}`}
                      fill
                      draggable={false}
                      className={`pointer-events-none object-cover object-center transition-opacity duration-500 ${item.hoverImage ? 'group-hover:opacity-0' : 'transition-transform duration-600 group-hover:scale-[1.04]'}`}
                      sizes="270px"
                    />
                    {item.hoverImage && (
                      <Image
                        src={item.hoverImage}
                        alt={`${item.title} in ${item.variant} — tweede afbeelding`}
                        fill
                        draggable={false}
                        className="pointer-events-none object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        sizes="270px"
                      />
                    )}

                    {discount && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-block bg-accent text-white text-[10px] leading-none font-sans font-semibold px-1.5 py-0.5 rounded-full tracking-normal shadow-sm">
                          -{discount}% korting
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-1 mt-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-sm text-dark leading-snug group-hover:text-accent-dark transition-colors duration-200">
                        {item.title}
                      </p>
                      <p className="text-xs font-sans text-muted mt-0.5">{item.variant}</p>
                    </div>
                    <span className="font-sans font-semibold text-sm text-dark flex-shrink-0 pt-0.5">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {showViewAllLink && (
          <div className="mt-5 text-center">
            <PlainLink
              href={viewAllHref}
              className="text-xs font-sans font-semibold uppercase tracking-widest text-muted hover:text-dark transition-colors duration-200 underline underline-offset-4"
            >
              {viewAllLabel}
            </PlainLink>
          </div>
        )}
      </div>
    </section>
  )
}
