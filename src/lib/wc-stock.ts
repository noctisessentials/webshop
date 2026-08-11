/**
 * Live stock from WooCommerce.
 *
 * Product *content* (titles, copy, images, features) stays static in products-static.ts —
 * only the stock status (and nothing else) is read from WooCommerce, so a change in the WP
 * backend, or in the fulfilment feed that writes to it, shows up on the storefront.
 *
 * Availability strategy — WooCommerce being down must never take the shop down, and must
 * never silently start selling sold-out stock:
 *   1. live WC response          (cached `REVALIDATE_SECONDS`, busted by the WC webhook)
 *   2. last known good response  (in-memory, per server instance)
 *   3. `null` → callers fall back to the `inStock` flags checked into products-static.ts
 *
 * Checkout uses `getStockMap({ fresh: true })` to bypass the cache — see api/payment-intent.
 */

export const WC_STOCK_TAG = 'wc-stock'

/** How long a cached stock response is served before Next revalidates it. */
const REVALIDATE_SECONDS = 300

/** WooCommerce caps per_page at 100; the catalog is far smaller, but page defensively. */
const PER_PAGE = 100
const MAX_PAGES = 5

export type WCStockEntry = {
  id: number
  slug: string
  inStock: boolean
  /** null when WooCommerce does not manage a numeric stock level for this product. */
  stockQuantity: number | null
}

export type WCStockMap = Map<string, WCStockEntry>

type WCProductStockFields = {
  id: number
  slug: string
  stock_status: string
  stock_quantity: number | null
  status: string
}

/**
 * Last successful response, kept per server instance. Survives a WooCommerce outage within
 * the lifetime of the instance; a cold start with WC down falls through to the static flags.
 */
let lastKnownGood: WCStockMap | null = null

function getCredentials(): { url: string; auth: string } | null {
  const url = process.env.NEXT_PUBLIC_WC_URL
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET
  if (!url || !key || !secret) return null
  return {
    url: url.replace(/\/$/, ''),
    auth: Buffer.from(`${key}:${secret}`).toString('base64'),
  }
}

async function fetchStockPage(
  page: number,
  fresh: boolean
): Promise<WCProductStockFields[] | null> {
  const creds = getCredentials()
  if (!creds) return null

  const params = new URLSearchParams({
    per_page: String(PER_PAGE),
    page: String(page),
    status: 'publish',
    _fields: 'id,slug,stock_status,stock_quantity,status',
  })

  try {
    const res = await fetch(`${creds.url}/wp-json/wc/v3/products?${params}`, {
      headers: { Authorization: `Basic ${creds.auth}` },
      ...(fresh
        ? { cache: 'no-store' as const }
        : { next: { revalidate: REVALIDATE_SECONDS, tags: [WC_STOCK_TAG] } }),
    })

    if (!res.ok) {
      console.error(`[wc-stock] WooCommerce returned ${res.status} for page ${page}`)
      return null
    }

    const json: unknown = await res.json()
    return Array.isArray(json) ? (json as WCProductStockFields[]) : null
  } catch (err) {
    console.error('[wc-stock] fetch failed:', err)
    return null
  }
}

/**
 * Stock for every published product, keyed by slug (which matches Product.handle).
 * Returns null when WooCommerce is unreachable and no previous response is cached.
 */
export async function getStockMap(
  { fresh = false }: { fresh?: boolean } = {}
): Promise<WCStockMap | null> {
  const map: WCStockMap = new Map()

  for (let page = 1; page <= MAX_PAGES; page++) {
    const products = await fetchStockPage(page, fresh)
    if (products === null) return lastKnownGood
    for (const product of products) {
      map.set(product.slug, {
        id: product.id,
        slug: product.slug,
        // Treat anything other than an explicit "instock" (outofstock, onbackorder) as
        // unavailable — never oversell what the fulfilment partner cannot ship.
        inStock: product.stock_status === 'instock',
        stockQuantity: product.stock_quantity ?? null,
      })
    }
    if (products.length < PER_PAGE) break
  }

  // An empty catalog means a misconfigured request, not "everything sold out".
  if (map.size === 0) return lastKnownGood

  lastKnownGood = map
  return map
}

/**
 * Stock for one handle. `null` means "WooCommerce could not tell us" — the caller should
 * fall back to its own default rather than guessing.
 */
export async function isHandleInStock(
  handle: string,
  options?: { fresh?: boolean }
): Promise<boolean | null> {
  const map = await getStockMap(options)
  if (!map) return null
  return map.get(handle)?.inStock ?? null
}

/**
 * Last line of defence before taking money: which of these WooCommerce product IDs are not
 * sellable right now. Always checked against a fresh (uncached) WooCommerce response.
 *
 * If WooCommerce cannot be reached we fall back to the static flags rather than blocking every
 * order — an outage should not stop the shop, and WC order creation would fail anyway.
 */
export async function getSoldOutWcIds(wcIds: number[]): Promise<number[]> {
  const unique = [...new Set(wcIds)]
  if (unique.length === 0) return []

  const map = await getStockMap({ fresh: true })

  if (map) {
    const byId = new Map([...map.values()].map((entry) => [entry.id, entry]))
    // An ID WooCommerce does not know about is not something we can sell.
    return unique.filter((id) => !byId.get(id)?.inStock)
  }

  const { STATIC_PRODUCTS } = await import('./products-static')
  return unique.filter((id) => {
    const product = STATIC_PRODUCTS.find((p) => p.id === String(id))
    return product ? !product.inStock : false
  })
}
