import { notFound } from 'next/navigation'
import { getWCProductByHandle, getWCProductSlugs } from '@/lib/woocommerce'
import { ProductPageClient } from '@/components/product/ProductPageClient'
import { KitchenSetLandingClient } from '@/components/product/KitchenSetLandingClient'
import { MillsLandingClient } from '@/components/product/MillsLandingClient'
import { AcaciaLandingClient } from '@/components/product/AcaciaLandingClient'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Testimonials } from '@/components/sections/Testimonials'
import { HomeFAQ } from '@/components/sections/HomeFAQ'
import type { Product } from '@/lib/data'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { buildDynamicAlternates } from '@/lib/metadata'

const DUTCH_COLOR_MAP: Record<string, string> = {
  black: 'Zwart',
  white: 'Wit',
  grey: 'Grijs',
  gray: 'Grijs',
  nude: 'Nude',
  pink: 'Roze',
  green: 'Groen',
  mint: 'Mintgroen',
  'mint-green': 'Mintgroen',
}

const EN_COLOR_MAP: Record<string, string> = {
  black: 'Black',
  white: 'White',
  grey: 'Grey',
  gray: 'Grey',
  nude: 'Nude',
  pink: 'Pink',
  green: 'Green',
  mint: 'Mint Green',
  'mint-green': 'Mint Green',
}

function getColorName(raw: string, locale: string): string {
  const key = raw.trim().toLowerCase()
  if (locale === 'en') return EN_COLOR_MAP[key] ?? raw
  return DUTCH_COLOR_MAP[key] ?? raw
}

export async function generateStaticParams() {
  const slugs = await getWCProductSlugs()
  return routing.locales.flatMap((locale) =>
    slugs.map((handle) => ({ locale, handle }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}): Promise<Metadata> {
  const { handle, locale } = await params
  const product = await getWCProductByHandle(handle)
  if (!product) return {}

  if (handle.startsWith('19-piece-kitchenware')) {
    const activeColor =
      product.colors.find((color) => color.wcSlug === product.handle) ?? product.colors[0]
    const colorName = getColorName(activeColor?.name ?? '', locale)
    if (locale === 'en') {
      return {
        title: `19-Piece Kitchen Set ${colorName} | Noctis`,
        description: `The Noctis 19-Piece Kitchen Set in ${colorName.toLowerCase()}. A complete, cohesive kitchen collection.`,
      }
    }
    return {
      title: `19-delige keukenset ${colorName.toLowerCase()} | Noctis`,
      description: `Landingpagina voor de Noctis 19-delige keukenset in ${colorName.toLowerCase()}.`,
    }
  }

  if (handle.startsWith('pepper-salt-mills')) {
    const activeColor =
      product.colors.find((color) => color.wcSlug === product.handle) ?? product.colors[0]
    const colorName = getColorName(activeColor?.name ?? '', locale)
    if (locale === 'en') {
      return {
        title: `Pepper & Salt Mills ${colorName} | Noctis`,
        description: `The Noctis Pepper & Salt Mills in ${colorName.toLowerCase()}. Season with intention.`,
      }
    }
    return {
      title: `Peper- en zoutmolens ${colorName.toLowerCase()} | Noctis`,
      description: `Landingpagina voor de Noctis peper- en zoutmolens in ${colorName.toLowerCase()}.`,
    }
  }

  if (handle.startsWith('acacia-cutting-board')) {
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

  return {
    title: `${product.title} | Noctis`,
    description: product.shortDescription,
    alternates: buildDynamicAlternates(
      `/products/${handle}`,
      `/products/${handle}`
    ),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle, locale } = await params
  let product
  try {
    product = await getWCProductByHandle(handle)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const t = await getTranslations('product')

  const isKitchenSetVariant = handle.startsWith('19-piece-kitchenware')
  const isMillsVariant = handle.startsWith('pepper-salt-mills')
  const isAcaciaVariant = handle.startsWith('acacia-cutting-board')

  const shopLabel = t('shop')
  const homeLabel = t('home')

  if (isKitchenSetVariant) {
    const millsUpsell =
      await getWCProductByHandle('pepper-salt-mills-black-white') ??
      await getWCProductByHandle('pepper-salt-mills-blackwhite')
    const acaciaUpsell = await getWCProductByHandle('acacia-cutting-board')
    const upsellProducts = [millsUpsell, acaciaUpsell].filter(
      (item): item is Product => item !== undefined
    )
    const breadcrumbLabel = locale === 'en' ? '19-Piece Kitchen Set' : '19-delige keukenset'

    return (
      <div>
        <div className="bg-surface border-b border-border">
          <div className="container-content py-3.5">
            <nav className="flex items-center gap-2 text-xs font-sans text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-dark transition-colors">{homeLabel}</Link>
              <span>/</span>
              <Link href="/winkel" className="hover:text-dark transition-colors">{shopLabel}</Link>
              <span>/</span>
              <span className="text-dark truncate max-w-[260px]">{breadcrumbLabel}</span>
            </nav>
          </div>
        </div>
        <KitchenSetLandingClient product={product} upsellProducts={upsellProducts} />
      </div>
    )
  }

  if (isMillsVariant) {
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
            <nav className="flex items-center gap-2 text-xs font-sans text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-dark transition-colors">{homeLabel}</Link>
              <span>/</span>
              <Link href="/winkel" className="hover:text-dark transition-colors">{shopLabel}</Link>
              <span>/</span>
              <span className="text-dark truncate max-w-[260px]">{breadcrumbLabel}</span>
            </nav>
          </div>
        </div>
        <MillsLandingClient product={product} upsellProducts={upsellProducts} />
      </div>
    )
  }

  if (isAcaciaVariant) {
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
            <nav className="flex items-center gap-2 text-xs font-sans text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-dark transition-colors">{homeLabel}</Link>
              <span>/</span>
              <Link href="/winkel" className="hover:text-dark transition-colors">{shopLabel}</Link>
              <span>/</span>
              <span className="text-dark truncate max-w-[260px]">{breadcrumbLabel}</span>
            </nav>
          </div>
        </div>
        <AcaciaLandingClient product={product} upsellProducts={upsellProducts} />
      </div>
    )
  }

  return (
    <div>
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-dark transition-colors">{homeLabel}</Link>
            <span>/</span>
            <Link href="/winkel" className="hover:text-dark transition-colors">{shopLabel}</Link>
            <span>/</span>
            <span className="text-dark truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>
      <ProductPageClient product={product} />
      <Testimonials />
      <HomeFAQ />
      <RelatedProducts currentHandle={product.handle} />
    </div>
  )
}
