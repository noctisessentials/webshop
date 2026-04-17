import type { Metadata } from 'next'
import { KitchenSetStijlClient } from '@/components/product/KitchenSetStijlClient'
import type { Product } from '@/lib/data'
import { getLandingProduct } from '@/lib/landingPages'
import { getWCProductByHandle } from '@/lib/woocommerce'

export const metadata: Metadata = {
  title: 'Keukenset die je aanrecht compleet maakt | Noctis',
  description:
    'Een keuken die er gewoon klopt. De Noctis 19-delige keukenset in 5 tijdloze kleuren — alles in één stijl. Gratis verzending · 14 dagen retour.',
  robots: { index: false, follow: false },
}

export default async function KitchenSetStijlPage() {
  const fallback = await getLandingProduct('kitchenSet')

  const product =
    (await getWCProductByHandle('19-piece-kitchenware-nude')) ??
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

  return <KitchenSetStijlClient product={product} upsellProducts={upsellProducts} />
}
