import type { Metadata } from 'next'
import { KitchenSetBeforeAfterClient } from '@/components/product/KitchenSetBeforeAfterClient'
import type { Product } from '@/lib/data'
import { getLandingProduct } from '@/lib/landingPages'
import { getWCProductByHandle } from '@/lib/woocommerce'

export const metadata: Metadata = {
  title: 'Van rommel naar rust | Noctis 19-delige keukenset',
  description:
    'Eén set vervangt alle losse tools. Alles matched. Alles heeft een vaste plek. De Noctis 19-delige keukenset — gratis verzending, morgen in huis.',
  robots: { index: false, follow: false },
}

export default async function KitchenSetBeforeAfterPage() {
  const fallback = await getLandingProduct('kitchenSet')

  // getLandingProduct picks the first kitchen-set variant WooCommerce reports as sellable,
  // so this page never opens on a sold-out colour.
  const product = fallback

  if (!product) return null

  const millsUpsell =
    (await getWCProductByHandle('pepper-salt-mills-black-white')) ??
    (await getWCProductByHandle('pepper-salt-mills-blackwhite'))
  const acaciaUpsell = await getWCProductByHandle('acacia-cutting-board')
  const upsellProducts = [millsUpsell, acaciaUpsell].filter(
    (item): item is Product => item !== undefined
  )

  return <KitchenSetBeforeAfterClient product={product} upsellProducts={upsellProducts} />
}
