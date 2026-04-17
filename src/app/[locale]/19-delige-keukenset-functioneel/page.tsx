import type { Metadata } from 'next'
import { KitchenSetFunctioneelClient } from '@/components/product/KitchenSetFunctioneelClient'
import type { Product } from '@/lib/data'
import { getLandingProduct } from '@/lib/landingPages'
import { getWCProductByHandle } from '@/lib/woocommerce'

export const metadata: Metadata = {
  title: 'Complete keukenset die écht bij elkaar past | Noctis',
  description:
    'Nooit meer mismatch op je aanrecht. De Noctis 19-delige keukenset: 19 tools in één stijl, één kleur, één compleet geheel. Gratis verzending · 14 dagen retour.',
  robots: { index: false, follow: false },
}

export default async function KitchenSetFunctioneelPage() {
  const fallback = await getLandingProduct('kitchenSet')

  const product =
    (await getWCProductByHandle('19-piece-kitchenware-black-2')) ??
    (await getWCProductByHandle('19-piece-kitchenware-black')) ??
    fallback

  if (!product) return null

  const millsUpsell =
    (await getWCProductByHandle('pepper-salt-mills-black-white')) ??
    (await getWCProductByHandle('pepper-salt-mills-blackwhite'))
  const acaciaUpsell = await getWCProductByHandle('acacia-cutting-board')
  const upsellProducts = [millsUpsell, acaciaUpsell].filter(
    (item): item is Product => item !== undefined
  )

  return <KitchenSetFunctioneelClient product={product} upsellProducts={upsellProducts} />
}
