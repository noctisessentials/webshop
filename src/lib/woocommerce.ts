/**
 * Product data — static content, live stock.
 *
 * Titles, copy, images, prices and IDs are curated in products-static.ts. The stock status
 * is overlaid from WooCommerce on every request (see wc-stock.ts), so setting a product to
 * "out of stock" in the WP backend — or via the fulfilment feed that writes to it — takes
 * effect on the storefront without a deploy.
 *
 * When WooCommerce is unreachable the `inStock` flags checked into products-static.ts are
 * used as-is, so the shop keeps working with the last state we shipped.
 *
 * WC API is also used for order creation and webhooks (see api/ routes).
 */

import type { Product, ProductColor } from './data'
import {
  getProducts as getStaticProducts,
  getProductByHandle as getStaticProductByHandle,
} from './products-static'
import { getStockMap, type WCStockMap } from './wc-stock'

export type { Product, ProductColor } from './data'

/** Resolve one color's availability; unknown handles keep their static flag. */
function mergeColor(color: ProductColor, stock: WCStockMap): ProductColor {
  const handle = color.wcSlug
  const live = handle ? stock.get(handle) : undefined
  if (!live || live.inStock === color.inStock) return color
  return { ...color, inStock: live.inStock }
}

function mergeProduct(product: Product, stock: WCStockMap): Product {
  const live = stock.get(product.handle)
  const colors = product.colors.map((color) => mergeColor(color, stock))
  const inStock = live ? live.inStock : product.inStock

  const colorsChanged = colors.some((color, i) => color !== product.colors[i])
  if (!colorsChanged && inStock === product.inStock) return product

  return { ...product, inStock, colors }
}

/** Static catalog with live WooCommerce stock overlaid. */
async function getMergedProducts(): Promise<Product[]> {
  const products = getStaticProducts()
  const stock = await getStockMap()
  if (!stock) return products
  return products.map((product) => mergeProduct(product, stock))
}

export async function getWCProducts(): Promise<Product[]> {
  return getMergedProducts()
}

export async function getWCProductByHandle(handle: string): Promise<Product | undefined> {
  const product = getStaticProductByHandle(handle)
  if (!product) return undefined
  const stock = await getStockMap()
  return stock ? mergeProduct(product, stock) : product
}

export async function getWCRelatedProducts(currentHandle: string, limit = 3): Promise<Product[]> {
  const products = await getMergedProducts()
  const current = products.find((p) => p.handle === currentHandle)
  const others = products.filter((p) => p.handle !== currentHandle && p.inStock)
  const differentFamily = others.filter((p) => current && p.categoryHandle !== current.categoryHandle)
  const sameFamily = others.filter((p) => current && p.categoryHandle === current.categoryHandle)
  return [...differentFamily, ...sameFamily].slice(0, limit)
}

export async function getWCProductSlugs(): Promise<string[]> {
  return getStaticProducts().map((p) => p.handle)
}

export async function getWCCollections() {
  const products = await getMergedProducts()
  return [
    {
      handle: 'all',
      title: 'All Products',
      description: 'The complete Noctis collection.',
      products,
    },
    {
      handle: 'kitchen-sets',
      title: 'Kitchen Sets',
      description: 'Complete tool sets that bring cohesion and calm to your kitchen.',
      products: products.filter((p) => p.categoryHandle === 'kitchen-sets'),
    },
    {
      handle: 'accessories',
      title: 'Kitchen Accessories',
      description: 'Refined individual pieces for a considered kitchen.',
      products: products.filter((p) => p.categoryHandle === 'accessories'),
    },
  ]
}
