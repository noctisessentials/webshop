import type { Product } from '@/lib/data'
import { getWCProducts } from '@/lib/woocommerce'

const LANDING_HANDLE_PREFIX = {
  kitchenSet: '19-piece-kitchenware',
  mills: 'pepper-salt-mills',
  cuttingBoard: 'acacia-cutting-board',
} as const

export type LandingProductKey = keyof typeof LANDING_HANDLE_PREFIX

export async function getLandingProduct(
  key: LandingProductKey
): Promise<Product | undefined> {
  const products = await getWCProducts()
  const prefix = LANDING_HANDLE_PREFIX[key]
  const candidates = products.filter((product) => product.handle.startsWith(prefix))

  return candidates.find((product) => product.inStock) ?? candidates[0]
}
