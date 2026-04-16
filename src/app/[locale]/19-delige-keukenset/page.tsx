import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { KitchenSetLandingClient } from '@/components/product/KitchenSetLandingClient'
import type { Product } from '@/lib/data'
import { getLandingProduct } from '@/lib/landingPages'
import { getWCProductByHandle } from '@/lib/woocommerce'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    return {
      title: '19-Piece Kitchen Set | Noctis',
      description: 'The Noctis 19-Piece Kitchen Set. A complete, cohesive kitchen collection.',
    }
  }
  return {
    title: '19-delige keukenset | Noctis',
    description: 'Landingpagina voor de Noctis 19-delige keukenset.',
  }
}

export default async function KitchenSetLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('product')

  const fallbackFamilyProduct = await getLandingProduct('kitchenSet')
  const blackSiblingSlug = fallbackFamilyProduct?.colors.find((color) =>
    /black|zwart/.test(`${color.slug} ${color.name}`.toLowerCase())
  )?.wcSlug
  const blackSiblingProduct = blackSiblingSlug
    ? await getWCProductByHandle(blackSiblingSlug)
    : undefined

  const product =
    (await getWCProductByHandle('19-piece-kitchenware-black-2')) ??
    (await getWCProductByHandle('19-piece-kitchenware-black')) ??
    blackSiblingProduct ??
    fallbackFamilyProduct

  if (!product) notFound()

  const millsUpsell =
    (await getWCProductByHandle('pepper-salt-mills-black-white')) ??
    (await getWCProductByHandle('pepper-salt-mills-blackwhite'))
  const acaciaUpsell = await getWCProductByHandle('acacia-cutting-board')
  const upsellProducts = [millsUpsell, acaciaUpsell].filter(
    (item): item is Product => item !== undefined
  )

  const breadcrumbLabel =
    locale === 'en' ? '19-Piece Kitchen Set' : '19-delige keukenset'

  return (
    <div>
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav
            className="flex items-center gap-2 text-xs font-sans text-muted"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-dark transition-colors">
              {t('home')}
            </Link>
            <span>/</span>
            <Link href="/winkel" className="hover:text-dark transition-colors">
              {t('shop')}
            </Link>
            <span>/</span>
            <span className="text-dark truncate max-w-[200px]">{breadcrumbLabel}</span>
          </nav>
        </div>
      </div>

      <KitchenSetLandingClient product={product} upsellProducts={upsellProducts} />
    </div>
  )
}
