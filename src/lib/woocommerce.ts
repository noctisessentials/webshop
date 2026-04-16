/**
 * WooCommerce REST API client.
 *
 * Each WC product (one per color, e.g. "19-Piece Kitchenware Pink") becomes
 * its own storefront Product with its own route. The `colors` array on each
 * Product contains all sibling variants — used on the PDP to render navigation
 * swatches that link to the sibling's route.
 */

import type { Product, ProductColor } from './data'
import { PRODUCT_STATIC } from './data'

// ── Raw WC API types ─────────────────────────────────────────────────────────

interface WCProduct {
  id: number
  name: string
  slug: string
  type: string
  price: string
  regular_price: string
  sale_price: string
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  short_description: string
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
  featured: boolean
}

// ── Local image map (keyed by WC slug) ───────────────────────────────────────

const LOCAL_IMAGES: Record<string, string> = {
  '19-piece-kitchenware-black-2': '/images/products/kitchenware-black.jpg',
  '19-piece-kitchenware-black': '/images/products/kitchenware-black.jpg',
  '19-piece-kitchenware-grey': '/images/products/kitchenware-grey.jpg',
  '19-piece-kitchenware-pink': '/images/products/kitchenware-pink.jpg',
  '19-piece-kitchenware-mint-green': '/images/products/kitchenware-mint.jpg',
  '19-piece-kitchenware-nude': '/images/products/kitchenware-nude.jpg',
  'acacia-cutting-board': '/images/products/acacia.jpg',
  'pepper-salt-mills-green': '/images/products/mills-green.jpg',
  'pepper-salt-mills-white': '/images/products/mills-white.jpg',
  'pepper-salt-mills-black': '/images/products/mills-black.jpg',
  'pepper-salt-mills-black-white': '/images/products/mills-blackwhite.jpg',
}

// Extra images per color: [lifestyle (hover), detail1, detail2]
// images[0] = main product shot (from LOCAL_IMAGES)
// images[1] = lifestyle — used as hover image on cards
// images[2] = messen / detail
// images[3] = pollepels / detail
const LOCAL_EXTRA_IMAGES: Record<string, { src: string; alt: string }[]> = {
  'black': [
    { src: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp', alt: '19-delige keukenset Zwart — lifestyle' },
    { src: '/images/pdp/kitchen-set-black/zwart-messen.webp',    alt: '19-delige keukenset Zwart — messen' },
    { src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp', alt: '19-delige keukenset Zwart — pollepels' },
  ],
  'pink': [
    { src: '/images/pdp/kitchen-set-pink/lifestyle.webp',   alt: '19-delige keukenset Roze — lifestyle' },
    { src: '/images/pdp/kitchen-set-pink/messen.webp',      alt: '19-delige keukenset Roze — messen' },
    { src: '/images/pdp/kitchen-set-pink/pollepels.webp',   alt: '19-delige keukenset Roze — pollepels' },
  ],
  'nude': [
    { src: '/images/pdp/kitchen-set-nude/lifestyle.webp',   alt: '19-delige keukenset Nude — lifestyle' },
    { src: '/images/pdp/kitchen-set-nude/messen.webp',      alt: '19-delige keukenset Nude — messen' },
    { src: '/images/pdp/kitchen-set-nude/pollepels.webp',   alt: '19-delige keukenset Nude — pollepels' },
  ],
  'grey': [
    { src: '/images/pdp/kitchen-set-grey/lifestyle.webp',   alt: '19-delige keukenset Grijs — lifestyle' },
    { src: '/images/pdp/kitchen-set-grey/messen.webp',      alt: '19-delige keukenset Grijs — messen' },
    { src: '/images/pdp/kitchen-set-grey/pollepels.webp',   alt: '19-delige keukenset Grijs — pollepels' },
  ],
  'mint green': [
    { src: '/images/pdp/kitchen-set-mint/lifestyle.webp',   alt: '19-delige keukenset Mintgroen — lifestyle' },
    { src: '/images/pdp/kitchen-set-mint/messen.webp',      alt: '19-delige keukenset Mintgroen — messen' },
    { src: '/images/pdp/kitchen-set-mint/pollepels.webp',   alt: '19-delige keukenset Mintgroen — pollepels' },
  ],
}

// ── Color hex palette ────────────────────────────────────────────────────────

function colorNameToHex(name: string): string {
  const palette: Record<string, string> = {
    black: '#2C2C2C',
    grey: '#B0ADA9',
    pink: '#E8B4B8',
    'mint green': '#A8C5B5',
    nude: '#E9E3D8',
    white: '#F5F3F0',
    green: '#6B7F6A',
    'black & white': '#9E9E9E',
    'black&white': '#9E9E9E',
    natural: '#C4894A',
    'natural acacia': '#C4894A',
  }
  return palette[name.toLowerCase()] ?? '#C0BDB9'
}

// ── Product family definitions ───────────────────────────────────────────────

const FAMILIES = [
  {
    handle: '19-piece-kitchenware',
    title: '19-delige keukenset',
    subtitle: 'Een complete keuken, zorgvuldig samengesteld.',
    categoryHandle: 'kitchen-sets' as const,
    category: 'Keukensets',
    badge: 'Bestseller' as string | undefined,
    matches: (name: string) => /kitchenware/i.test(name),
    extractColor: (name: string) =>
      name.replace(/19-piece\s+kitchenware\s*/i, '').replace(/\s+2$/, '').trim() || 'Black',
  },
  {
    handle: 'pepper-salt-mills',
    title: 'Peper- en zoutmolens',
    subtitle: 'Kruiden met intentie.',
    categoryHandle: 'accessories' as const,
    category: 'Keukenaccessoires',
    badge: undefined,
    matches: (name: string) => /pepper.*salt|salt.*pepper|mills/i.test(name),
    extractColor: (name: string) =>
      name.replace(/pepper\s*[&]\s*salt\s+mills\s*/i, '').replace(/&amp;/g, '&').trim() || 'Black',
  },
  {
    handle: 'acacia-cutting-board',
    title: 'Acacia snijplank',
    subtitle: 'Het middelpunt van een bewuste keuken.',
    categoryHandle: 'accessories' as const,
    category: 'Keukenaccessoires',
    badge: undefined,
    matches: (name: string) => /acacia/i.test(name),
    extractColor: () => 'Natural Acacia',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim()
}

function normalizeColorKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/&amp;|&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function getExtraImagesForVariant(
  familyHandle: string,
  productSlug: string,
  colorName: string
): { src: string; alt: string }[] {
  if (familyHandle === '19-piece-kitchenware') {
    return LOCAL_EXTRA_IMAGES[normalizeColorKey(colorName)] ?? []
  }

  if (familyHandle === 'pepper-salt-mills') {
    if (productSlug.includes('green')) {
      return [{ src: '/content/pepper-salt-mills-green-second.webp', alt: 'Peper- en zoutmolens groen — lifestyle' }]
    }
    if (productSlug.includes('black-white') || productSlug.includes('blackwhite')) {
      return [{ src: '/content/pepper-salt-mills-black-white-second.webp', alt: 'Peper- en zoutmolens zwart wit — lifestyle' }]
    }
    if (productSlug.includes('black')) {
      return [{ src: '/content/pepper-salt-mills-black-second.webp', alt: 'Peper- en zoutmolens zwart — lifestyle' }]
    }
    if (productSlug.includes('white')) {
      return [{ src: '/content/pepper-salt-mills-white-second.webp', alt: 'Peper- en zoutmolens wit — lifestyle' }]
    }
  }

  if (familyHandle === 'acacia-cutting-board') {
    return [{ src: '/content/acacia-snijplank-lifestyle-1-800x1067.webp', alt: 'Acacia snijplank — lifestyle' }]
  }

  return []
}

// ── Fetch ────────────────────────────────────────────────────────────────────

async function fetchRawProducts(): Promise<WCProduct[]> {
  const base = process.env.NEXT_PUBLIC_WC_URL
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET

  if (!base || !key || !secret) {
    console.warn('[WC] Missing env vars — returning empty product list')
    return []
  }

  const url = new URL(`${base}/wp-json/wc/v3/products`)
  url.searchParams.set('consumer_key', key)
  url.searchParams.set('consumer_secret', secret)
  url.searchParams.set('per_page', '100')
  url.searchParams.set('status', 'publish')
  url.searchParams.set(
    '_fields',
    'id,name,slug,type,price,regular_price,sale_price,stock_status,short_description,images,categories,featured'
  )

  const res = await fetch(url.toString(), {
    next: { revalidate: false },
    signal: AbortSignal.timeout(8000),
  }).catch((err) => {
    console.error('[WC] Fetch failed:', err)
    return null
  })

  if (!res || !res.ok) {
    console.error(`[WC] API error ${res?.status ?? 'no response'}`)
    return []
  }
  return res.json()
}

// ── Map raw WC products → storefront Products ─────────────────────────────────

export async function getWCProducts(): Promise<Product[]> {
  const raw = await fetchRawProducts()

  // Step 1: group by family + deduplicate colors within each family
  // (e.g. "Black" and "Black 2" → prefer instock/cheaper)
  const familyGroups = new Map<
    string,
    { family: (typeof FAMILIES)[0]; chosen: Map<string, WCProduct> }
  >()

  for (const wcp of raw) {
    const family = FAMILIES.find((f) => f.matches(wcp.name))
    if (!family) continue

    if (!familyGroups.has(family.handle)) {
      familyGroups.set(family.handle, { family, chosen: new Map() })
    }

    const group = familyGroups.get(family.handle)!
    const colorName = family.extractColor(wcp.name).toLowerCase()
    const existing = group.chosen.get(colorName)

    // Prefer instock; if both same stock status, prefer cheaper
    const existingInStock = existing?.stock_status === 'instock'
    const newInStock = wcp.stock_status === 'instock'
    const newCheaper = parseFloat(wcp.price) < parseFloat(existing?.price ?? '9999')

    if (!existing || (!existingInStock && newInStock) || (existingInStock === newInStock && newCheaper)) {
      group.chosen.set(colorName, wcp)
    }
  }

  // Step 2: for each group, build the shared colors array and create Products
  const products: Product[] = []

  for (const { family, chosen } of familyGroups.values()) {
    const staticData = PRODUCT_STATIC[family.handle]
    const variants = Array.from(chosen.values())

    // Shared color list for all products in this family
    const familyColors: ProductColor[] = variants.map((v) => {
      const colorName = family.extractColor(v.name)
      return {
        name: colorName,
        slug: colorName.toLowerCase().replace(/[\s&]+/g, '-'),
        hex: colorNameToHex(colorName),
        inStock: v.stock_status === 'instock',
        wcId: v.id,
        wcSlug: v.slug,
      }
    })

    // One Product per variant (color)
    for (const wcp of variants) {
      const colorName = family.extractColor(wcp.name)
      const inStock = wcp.stock_status === 'instock'
      const price = parseFloat(wcp.price) || 0
      const regularPrice = parseFloat(wcp.regular_price) || price

      // Local image takes priority; fall back to WC image; then Picsum
      // Extra images (lifestyle + details) keyed by colour name — appended after main image
      const localImg = LOCAL_IMAGES[wcp.slug]
      const extraImgs = getExtraImagesForVariant(family.handle, wcp.slug, colorName)
      const images = localImg
        ? [{ src: localImg, alt: `${family.title} — ${colorName}` }, ...extraImgs]
        : wcp.images.length > 0
          ? wcp.images
          : [{ src: `https://picsum.photos/seed/${wcp.slug}/600/750`, alt: family.title }]

      // Badge: "sale" if sale price is active, otherwise "Bestseller" only on black & nude kitchen sets
      const hasSale = !!wcp.sale_price && parseFloat(wcp.sale_price) < regularPrice
      const colorLower = colorName.toLowerCase()
      const isBestseller = family.badge === 'Bestseller' && (colorLower === 'black' || colorLower === 'nude')
      const badge = hasSale ? 'Sale' : (isBestseller ? family.badge : undefined)

      products.push({
        id: String(wcp.id),
        handle: wcp.slug,
        title: family.title,
        subtitle: `${colorName} — ${family.subtitle}`,
        price,
        compareAtPrice: regularPrice > price ? regularPrice : undefined,
        category: family.category,
        categoryHandle: family.categoryHandle,
        description: staticData?.description ?? '',
        shortDescription: staticData?.shortDescription ?? stripHtml(wcp.short_description),
        badge,
        images,
        colors: familyColors,
        features: staticData?.features ?? [],
        specs: staticData?.specs ?? [],
        inStock,
      })
    }
  }

  // Sort by Dutch title family order, then by preferred color within kitchen sets
  // (Can't use f.matches() here — that checks WC names, not our Dutch titles)
  const TITLE_FAMILY_ORDER: Record<string, number> = {
    '19-delige keukenset': 0,
    'Peper- en zoutmolens': 1,
    'Acacia snijplank': 2,
  }
  const KITCHEN_COLOR_ORDER = ['black', 'nude', 'grey', 'pink', 'mint green', 'white']
  function kitchenColorRank(subtitle: string): number {
    const lower = subtitle.toLowerCase()
    const idx = KITCHEN_COLOR_ORDER.findIndex((c) => lower.startsWith(c))
    return idx === -1 ? 99 : idx
  }

  return products.sort((a, b) => {
    const aFam = TITLE_FAMILY_ORDER[a.title] ?? 99
    const bFam = TITLE_FAMILY_ORDER[b.title] ?? 99
    if (aFam !== bFam) return aFam - bFam
    // Within kitchen set family (0), sort Black → Nude → Grey → Pink → Mint → White
    if (aFam === 0) return kitchenColorRank(a.subtitle) - kitchenColorRank(b.subtitle)
    return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)
  })
}

export async function getWCProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await getWCProducts()
  return products.find((p) => p.handle === handle)
}

export async function getWCRelatedProducts(currentHandle: string, limit = 3): Promise<Product[]> {
  const products = await getWCProducts()
  // Prefer products from a different family, instock first
  const current = products.find((p) => p.handle === currentHandle)
  const others = products.filter((p) => p.handle !== currentHandle && p.inStock)
  const differentFamily = others.filter(
    (p) => current && p.categoryHandle !== current.categoryHandle
  )
  const sameFamily = others.filter(
    (p) => current && p.categoryHandle === current.categoryHandle
  )
  return [...differentFamily, ...sameFamily].slice(0, limit)
}

export async function getWCCollections() {
  const products = await getWCProducts()
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

// Returns all slugs for generateStaticParams
export async function getWCProductSlugs(): Promise<string[]> {
  const products = await getWCProducts()
  return products.map((p) => p.handle)
}
