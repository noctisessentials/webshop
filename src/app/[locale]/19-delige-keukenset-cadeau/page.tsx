import type { Metadata } from 'next'
import { KitchenSetCadeauClient } from '@/components/product/KitchenSetCadeauClient'
import type { Product } from '@/lib/data'
import { getLandingProduct } from '@/lib/landingPages'
import { getWCProductByHandle } from '@/lib/woocommerce'

export const metadata: Metadata = {
  title: 'Het perfecte cadeau voor keukenliefhebbers | Noctis',
  description:
    'Een cadeau dat echt blijft. De Noctis 19-delige keukenset — compleet, stijlvol en in 5 kleuren. Perfect voor verjaardag, housewarming of jubileum. Gratis verzending.',
  robots: { index: false, follow: false },
}

export default async function KitchenSetCadeauPage() {
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

  return <KitchenSetCadeauClient product={product} upsellProducts={upsellProducts} />
}
