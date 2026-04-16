'use client'

import { useRouter } from 'next/navigation'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import { ProductAccordion } from './ProductAccordion'
import type { Product, ProductColor } from '@/lib/data'

type ProductPageClientProps = {
  product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const router = useRouter()

  // The "active" color is the swatch whose wcSlug matches the current product handle
  const selectedColor =
    product.colors.find((c) => c.wcSlug === product.handle) ?? product.colors[0]

  // Clicking a sibling color navigates to that product's page
  const handleColorChange = (color: ProductColor) => {
    if (color.wcSlug) {
      router.push(`/products/${color.wcSlug}`)
    }
  }

  return (
    <>
      {/* Main product section */}
      <section className="section-py bg-light">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">
            <ProductGallery key={product.handle} product={product} selectedColor={selectedColor} />
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          </div>
        </div>
      </section>

      {/* Accordion details */}
      <section className="bg-light border-t border-border">
        <div className="container-content section-py-sm">
          <div className="max-w-2xl">
            <ProductAccordion product={product} />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      {product.features.length > 0 && (
        <section className="section-py bg-surface border-t border-border">
          <div className="container-content">
            <h2
              className="font-serif font-light text-dark mb-12 md:mb-14"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Why it works.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.features.map((f) => (
                <div key={f.title} className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-light border border-border flex items-center justify-center">
                    <span className="text-accent text-sm">✦</span>
                  </div>
                  <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-dark">
                    {f.title}
                  </h3>
                  <p className="font-sans text-sm text-muted leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-light border-t border-border p-4 shadow-[0_-4px_20px_rgba(30,29,29,0.08)]">
        <button
          className="w-full h-13 bg-accent text-white text-xs font-sans uppercase tracking-widest rounded-sm font-medium"
          onClick={() => {
            const addBtn = document.querySelector<HTMLButtonElement>('[data-add-to-cart]')
            addBtn?.click()
          }}
        >
          {product.inStock
            ? `Add to Cart — ${product.price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })}`
            : 'Sold Out'}
        </button>
      </div>
    </>
  )
}
