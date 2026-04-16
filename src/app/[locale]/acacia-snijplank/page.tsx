import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Product } from '@/lib/data'
import { getWCProductByHandle } from '@/lib/woocommerce'
import { AcaciaLandingClient } from '@/components/product/AcaciaLandingClient'
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
      title: 'Acacia Cutting Board | Noctis',
      description: 'The Noctis Acacia Cutting Board. The centrepiece of a considered kitchen.',
    }
  }
  return {
    title: 'Acacia snijplank | Noctis',
    description: 'Landingpagina voor de Noctis acacia snijplank.',
  }
}

export default async function CuttingBoardLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('product')

  const product = await getLandingProduct('cuttingBoard')
  if (!product) notFound()

  const kitchenUpsell =
    (await getWCProductByHandle('19-piece-kitchenware-black-2')) ??
    (await getWCProductByHandle('19-piece-kitchenware-black'))
  const millsUpsell =
    (await getWCProductByHandle('pepper-salt-mills-black-white')) ??
    (await getWCProductByHandle('pepper-salt-mills-blackwhite'))
  const upsellProducts = [kitchenUpsell, millsUpsell].filter(
    (item): item is Product => item !== undefined
  )

  const breadcrumbLabel = locale === 'en' ? 'Acacia Cutting Board' : 'Acacia snijplank'

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

      <AcaciaLandingClient product={product} upsellProducts={upsellProducts} />
    </div>
  )
}
