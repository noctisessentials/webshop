import { notFound } from 'next/navigation'
import { getWCCollections } from '@/lib/woocommerce'
import { COLLECTION_HANDLES } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import { TrustBadges } from '@/components/ui/TrustBadges'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COLLECTION_HANDLES.map((handle) => ({ locale, handle }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const collections = await getWCCollections()
  const collection = collections.find((c) => c.handle === handle)
  if (!collection) return {}
  return {
    title: collection.title,
    description: collection.description,
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle } = await params
  const collections = await getWCCollections()
  const collection = collections.find((c) => c.handle === handle)

  if (!collection) notFound()

  const t = await getTranslations('collection')

  return (
    <div className="bg-light">
      <div className="bg-dark py-16 md:py-24">
        <div className="container-content text-center">
          <p className="text-xs font-sans uppercase tracking-ultra text-accent mb-4">
            {collection.products.length} {collection.products.length === 1 ? t('product') : t('products')}
          </p>
          <h1
            className="font-serif font-light text-light"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p className="font-sans text-light/50 text-base mt-4 max-w-md mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      <div className="border-b border-border bg-surface">
        <div className="container-content py-8">
          <TrustBadges theme="light" />
        </div>
      </div>

      <section className="section-py">
        <div className="container-content">
          {collection.products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl font-light text-muted">
                {t('empty')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {collection.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
