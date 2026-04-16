import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Product } from '@/lib/data'
import { getWCProductByHandle } from '@/lib/woocommerce'
import { MillsLandingClient } from '@/components/product/MillsLandingClient'
import { getLandingProduct } from '@/lib/landingPages'
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
      title: 'Pepper & Salt Mills | Noctis',
      description: 'The Noctis Pepper & Salt Mills. Season with intention.',
    }
  }
  return {
    title: 'Peper- en zoutmolens | Noctis',
    description: 'Landingpagina voor de Noctis peper- en zoutmolens.',
  }
}

export default async function MillsLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('product')

  const product = await getLandingProduct('mills')
  if (!product) notFound()

  const kitchenUpsell =
    (await getWCProductByHandle('19-piece-kitchenware-black-2')) ??
    (await getWCProductByHandle('19-piece-kitchenware-black'))
  const acaciaUpsell = await getWCProductByHandle('acacia-cutting-board')
  const upsellProducts = [kitchenUpsell, acaciaUpsell].filter(
    (item): item is Product => item !== undefined
  )

  const breadcrumbLabel = locale === 'en' ? 'Pepper & Salt Mills' : 'Peper- en zoutmolens'

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
            <span className="text-dark truncate max-w-[220px]">{breadcrumbLabel}</span>
          </nav>
        </div>
      </div>

      <MillsLandingClient product={product} upsellProducts={upsellProducts} />
    </div>
  )
}
