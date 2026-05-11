'use client'

import dynamic from 'next/dynamic'
import type { Product } from '@/lib/data'

const ProductCarousel = dynamic(
  () => import('./ProductCarousel').then((m) => ({ default: m.ProductCarousel })),
  {
    ssr: false,
    loading: () => (
      <section className="section-py-sm overflow-x-hidden">
        <div className="mb-8 px-6 md:px-10 xl:px-14">
          <div className="h-7 w-44 rounded-lg bg-dark/8 animate-pulse" />
        </div>
        <div className="flex gap-4 pl-6 md:pl-10 xl:pl-14">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: 'clamp(200px, 26vw, 270px)' }}>
              <div className="aspect-[3/4] rounded-[16px] bg-dark/8 animate-pulse mb-3" />
              <div className="h-4 w-3/4 rounded bg-dark/8 animate-pulse mb-2" />
              <div className="h-3 w-1/2 rounded bg-dark/8 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    ),
  }
)

export function ProductCarouselDeferred({ products }: { products?: Product[] } = {}) {
  return <ProductCarousel products={products} />
}
