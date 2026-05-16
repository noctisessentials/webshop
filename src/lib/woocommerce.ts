/**
 * Product data — fully static, decoupled from WooCommerce API.
 * Prices and IDs are hardcoded; update via products-static.ts when products change.
 * WC API is still used for order creation and webhooks (see api/ routes).
 */

import {
  getProducts,
  getProductByHandle,
  getRelatedProducts,
  getProductSlugs,
  getCollections,
} from './products-static'

export type { Product, ProductColor } from './data'

// Async wrappers kept for backwards-compat with all existing callers
export async function getWCProducts() {
  return getProducts()
}

export async function getWCProductByHandle(handle: string) {
  return getProductByHandle(handle)
}

export async function getWCRelatedProducts(currentHandle: string, limit = 3) {
  return getRelatedProducts(currentHandle, limit)
}

export async function getWCProductSlugs() {
  return getProductSlugs()
}

export async function getWCCollections() {
  return getCollections()
}
