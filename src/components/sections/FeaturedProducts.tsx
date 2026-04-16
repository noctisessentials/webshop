import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'
import type { Product } from '@/lib/data'

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <SectionFrame>
      <div className="bg-white section-py">
        <div className="container-content">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-3">
                The Collection
              </p>
              <h2
                className="font-sans font-bold text-dark tracking-tight"
                style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
              >
                The full collection.
                <br />
                <span className="text-muted font-normal italic" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 400 }}>
                  Every color, every piece.
                </span>
              </h2>
            </div>
            <p className="font-sans text-muted text-sm md:text-base max-w-sm leading-relaxed">
              A small, intentional catalog. Each piece is chosen for what it adds
              to your kitchen — visually and functionally.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i === 0} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/collections/all">View All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
