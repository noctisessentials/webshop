import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/data'

function StarRating({ rating = 4.9, count = 214 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M7 1l1.3 2.633L11 4.09 9 6.04l.469 2.733L7 7.5 4.531 8.773 5 6.04 3 4.09l2.7-.457L7 1z"
              fill={i < Math.floor(rating) ? '#A4744C' : 'none'}
              stroke={i < Math.floor(rating) ? '#A4744C' : '#D1C5BA'}
              strokeWidth="0.8"
            />
          </svg>
        ))}
      </div>
      <span className="text-xs font-sans text-muted">
        {rating} · {count} reviews
      </span>
    </div>
  )
}

export function ProductSpotlight({ product }: { product: Product }) {
  return (
    <SectionFrame>
      <div className="bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image side — full bleed */}
          <div className="relative min-h-[440px] lg:min-h-[620px] bg-surface">
            <Image
              src={product.images[0]?.src ?? `https://picsum.photos/seed/${product.handle}/900/1100`}
              alt={product.images[0]?.alt ?? product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Color chips overlay */}
            <div className="absolute bottom-5 right-5 flex flex-col gap-1.5">
              {product.colors.map((c) => (
                <div
                  key={c.slug}
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-2xs font-sans font-medium text-dark tracking-wide">
                    {c.name}
                    {!c.inStock && <span className="text-muted ml-1">· Sold out</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info side */}
          <div className="flex items-center px-8 md:px-12 lg:px-14 py-14 md:py-20">
            <div className="max-w-md w-full">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-5">
                Featured Product
              </p>

              {product.badge && (
                <span className="inline-block bg-accent text-white text-2xs font-sans font-semibold px-3 py-1 rounded-full tracking-wide capitalize mb-5">
                  {product.badge}
                </span>
              )}

              <h2
                className="font-sans font-bold text-dark leading-tight mb-3 tracking-tight"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
              >
                {product.title}
              </h2>

              <p className="font-sans italic text-muted text-base mb-5">
                {product.subtitle}
              </p>

              <StarRating />

              <p className="font-sans text-dark/65 text-sm leading-relaxed mt-5 mb-6">
                {product.description.slice(0, 200)}…
              </p>

              {/* Color row */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="text-2xs font-sans font-semibold text-muted uppercase tracking-widest">
                  {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}:
                </span>
                {product.colors.map((c) => (
                  <span
                    key={c.slug}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: c.hex, opacity: c.inStock ? 1 : 0.4 }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="flex items-baseline gap-3 mb-7">
                <span className="font-sans font-bold text-2xl text-dark">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-sans font-medium text-muted uppercase tracking-wide">
                  Free shipping
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg" asChild>
                  <Link href={`/products/${product.handle}`}>Shop Now</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link href={`/products/${product.handle}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
