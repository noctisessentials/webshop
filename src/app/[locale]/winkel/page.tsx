import type { Metadata } from 'next'
import Image from 'next/image'
import { getWCProducts } from '@/lib/woocommerce'
import { ProductCard } from '@/components/product/ProductCard'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('shop')
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: buildAlternates('/winkel'),
  }
}

export default async function WinkelPage() {
  const products = await getWCProducts()
  const t = await getTranslations('shop')

  return (
    <div className="bg-light">
      <div className="relative overflow-hidden py-16 md:py-24">
        <Image
          src="/content/winkel-header.webp"
          alt="Noctis winkel header"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/58" />

        <div className="container-content text-center relative">
          <p className="text-xs font-sans uppercase tracking-ultra text-accent mb-4">
            {products.length} {products.length === 1 ? t('product') : t('products')}
          </p>
          <h1
            className="font-sans font-bold text-light"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-light/50 text-base mt-4 max-w-md mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="border-b border-border bg-surface">
        <div className="container-content py-8">
          <TrustBadges theme="light" />
        </div>
      </div>

      <section className="section-py">
        <div className="container-content">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl font-light text-muted">
                {t('empty')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
