import type { Metadata } from 'next'
import { VanRommelNaarRustClient } from '@/components/product/VanRommelNaarRustClient'
import { getWCProducts } from '@/lib/woocommerce'

export const metadata: Metadata = {
  title: 'Van rommel naar rust — het verhaal | Noctis',
  description:
    'Eén besluit dat alles veranderde. Het verhaal achter de Noctis 19-delige keukenset.',
  robots: { index: false, follow: false },
}

export default async function VanRommelNaarRustPage() {
  const products = await getWCProducts()
  const inStockHandles = products.filter((p) => p.inStock).map((p) => p.handle)

  return <VanRommelNaarRustClient inStockHandles={inStockHandles} />
}
