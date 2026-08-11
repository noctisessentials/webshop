/**
 * Curated product content. The `inStock` flags here are the *fallback* used when WooCommerce
 * is unreachable — live stock is overlaid per request in woocommerce.ts (see wc-stock.ts).
 * Read products through `@/lib/woocommerce`, never straight from here, unless you only need
 * static content (titles, images) and explicitly do not care about availability.
 */

import type { Product, ProductColor } from './data'
import { PRODUCT_STATIC } from './data'

// ── Color palettes ────────────────────────────────────────────────────────────

const KITCHEN_COLORS: ProductColor[] = [
  { name: 'Black',      slug: 'black',      hex: '#2C2C2C', inStock: false, wcId: 2640, wcSlug: '19-piece-kitchenware-black' },
  { name: 'Nude',       slug: 'nude',       hex: '#E9E3D8', inStock: true,  wcId: 1991, wcSlug: '19-piece-kitchenware-nude' },
  { name: 'Grey',       slug: 'grey',       hex: '#B0ADA9', inStock: false, wcId: 2648, wcSlug: '19-piece-kitchenware-grey' },
  { name: 'Pink',       slug: 'pink',       hex: '#E8B4B8', inStock: true, wcId: 2645, wcSlug: '19-piece-kitchenware-pink' },
  { name: 'Mint Green', slug: 'mint-green', hex: '#A8C5B5', inStock: true, wcId: 2642, wcSlug: '19-piece-kitchenware-mint-green' },
]

const MILLS_COLORS: ProductColor[] = [
  { name: 'Black & White', slug: 'black-white', hex: '#9E9E9E', inStock: true, wcId: 2444, wcSlug: 'pepper-salt-mills-black-white' },
  { name: 'Black',         slug: 'black',       hex: '#2C2C2C', inStock: true, wcId: 2617, wcSlug: 'pepper-salt-mills-black' },
  { name: 'White',         slug: 'white',       hex: '#F5F3F0', inStock: true, wcId: 2619, wcSlug: 'pepper-salt-mills-white' },
  { name: 'Green',         slug: 'green',       hex: '#6B7F6A', inStock: true, wcId: 2621, wcSlug: 'pepper-salt-mills-green' },
]

const ACACIA_COLORS: ProductColor[] = [
  { name: 'Natural Acacia', slug: 'natural-acacia', hex: '#C4894A', inStock: true, wcId: 2466, wcSlug: 'acacia-cutting-board' },
]

// ── Static content references ─────────────────────────────────────────────────

const KS = PRODUCT_STATIC['19-piece-kitchenware']
const MS = PRODUCT_STATIC['pepper-salt-mills']
const AS = PRODUCT_STATIC['acacia-cutting-board']

// ── Products ─────────────────────────────────────────────────────────────────

export const STATIC_PRODUCTS: Product[] = [
  // ── 19-delige keukenset ───────────────────────────────────────────────────
  {
    id: '2640',
    handle: '19-piece-kitchenware-black',
    title: '19-delige keukenset',
    subtitle: 'Black — Een complete keuken, zorgvuldig samengesteld.',
    price: 64.95,
    compareAtPrice: undefined,
    category: 'Keukensets',
    categoryHandle: 'kitchen-sets',
    description: KS?.description ?? '',
    shortDescription: KS?.shortDescription ?? '',
    badge: 'Bestseller',
    inStock: false,
    images: [
      { src: '/images/products/kitchenware-black.jpg',            alt: '19-delige keukenset Zwart' },
      { src: '/images/pdp/kitchen-set-black/lifestyle-new.webp', alt: '19-delige keukenset Zwart — lifestyle' },
      { src: '/images/pdp/kitchen-set-black/zwart-messen.webp',  alt: '19-delige keukenset Zwart — messen' },
      { src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp', alt: '19-delige keukenset Zwart — pollepels' },
    ],
    colors: KITCHEN_COLORS,
    features: KS?.features ?? [],
    specs: KS?.specs ?? [],
  },
  {
    id: '1991',
    handle: '19-piece-kitchenware-nude',
    title: '19-delige keukenset',
    subtitle: 'Nude — Een complete keuken, zorgvuldig samengesteld.',
    price: 64.95,
    compareAtPrice: undefined,
    category: 'Keukensets',
    categoryHandle: 'kitchen-sets',
    description: KS?.description ?? '',
    shortDescription: KS?.shortDescription ?? '',
    badge: 'Bestseller',
    inStock: true,
    images: [
      { src: '/images/products/kitchenware-nude.jpg',             alt: '19-delige keukenset Nude' },
      { src: '/images/pdp/kitchen-set-nude/lifestyle-new.webp',  alt: '19-delige keukenset Nude — lifestyle' },
      { src: '/images/pdp/kitchen-set-nude/messen.webp',         alt: '19-delige keukenset Nude — messen' },
      { src: '/images/pdp/kitchen-set-nude/pollepels.webp',      alt: '19-delige keukenset Nude — pollepels' },
    ],
    colors: KITCHEN_COLORS,
    features: KS?.features ?? [],
    specs: KS?.specs ?? [],
  },
  {
    id: '2648',
    handle: '19-piece-kitchenware-grey',
    title: '19-delige keukenset',
    subtitle: 'Grey — Een complete keuken, zorgvuldig samengesteld.',
    price: 64.95,
    compareAtPrice: undefined,
    category: 'Keukensets',
    categoryHandle: 'kitchen-sets',
    description: KS?.description ?? '',
    shortDescription: KS?.shortDescription ?? '',
    badge: undefined,
    inStock: false,
    images: [
      { src: '/images/products/kitchenware-grey.jpg',             alt: '19-delige keukenset Grijs' },
      { src: '/images/pdp/kitchen-set-grey/lifestyle-new.webp',  alt: '19-delige keukenset Grijs — lifestyle' },
      { src: '/images/pdp/kitchen-set-grey/messen.webp',         alt: '19-delige keukenset Grijs — messen' },
      { src: '/images/pdp/kitchen-set-grey/pollepels.webp',      alt: '19-delige keukenset Grijs — pollepels' },
    ],
    colors: KITCHEN_COLORS,
    features: KS?.features ?? [],
    specs: KS?.specs ?? [],
  },
  {
    id: '2645',
    handle: '19-piece-kitchenware-pink',
    title: '19-delige keukenset',
    subtitle: 'Pink — Een complete keuken, zorgvuldig samengesteld.',
    price: 64.95,
    compareAtPrice: undefined,
    category: 'Keukensets',
    categoryHandle: 'kitchen-sets',
    description: KS?.description ?? '',
    shortDescription: KS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/kitchenware-pink.jpg',            alt: '19-delige keukenset Roze' },
      { src: '/images/pdp/kitchen-set-pink/lifestyle.webp',     alt: '19-delige keukenset Roze — lifestyle' },
      { src: '/images/pdp/kitchen-set-pink/messen.webp',        alt: '19-delige keukenset Roze — messen' },
      { src: '/images/pdp/kitchen-set-pink/pollepels.webp',     alt: '19-delige keukenset Roze — pollepels' },
    ],
    colors: KITCHEN_COLORS,
    features: KS?.features ?? [],
    specs: KS?.specs ?? [],
  },
  {
    id: '2642',
    handle: '19-piece-kitchenware-mint-green',
    title: '19-delige keukenset',
    subtitle: 'Mint Green — Een complete keuken, zorgvuldig samengesteld.',
    price: 64.95,
    compareAtPrice: undefined,
    category: 'Keukensets',
    categoryHandle: 'kitchen-sets',
    description: KS?.description ?? '',
    shortDescription: KS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/kitchenware-mint.jpg',            alt: '19-delige keukenset Mintgroen' },
      { src: '/images/pdp/kitchen-set-mint/lifestyle.webp',     alt: '19-delige keukenset Mintgroen — lifestyle' },
      { src: '/images/pdp/kitchen-set-mint/messen.webp',        alt: '19-delige keukenset Mintgroen — messen' },
      { src: '/images/pdp/kitchen-set-mint/pollepels.webp',     alt: '19-delige keukenset Mintgroen — pollepels' },
    ],
    colors: KITCHEN_COLORS,
    features: KS?.features ?? [],
    specs: KS?.specs ?? [],
  },

  // ── Peper- en zoutmolens ──────────────────────────────────────────────────
  {
    id: '2444',
    handle: 'pepper-salt-mills-black-white',
    title: 'Peper- en zoutmolens',
    subtitle: 'Black & White — Kruiden met intentie.',
    price: 66.95,
    compareAtPrice: undefined,
    category: 'Keukenaccessoires',
    categoryHandle: 'accessories',
    description: MS?.description ?? '',
    shortDescription: MS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/mills-blackwhite.jpg',              alt: 'Peper- en zoutmolens Zwart wit' },
      { src: '/content/pepper-salt-mills-black-white-second.webp', alt: 'Peper- en zoutmolens Zwart wit — lifestyle' },
    ],
    colors: MILLS_COLORS,
    features: MS?.features ?? [],
    specs: MS?.specs ?? [],
  },
  {
    id: '2617',
    handle: 'pepper-salt-mills-black',
    title: 'Peper- en zoutmolens',
    subtitle: 'Black — Kruiden met intentie.',
    price: 66.95,
    compareAtPrice: undefined,
    category: 'Keukenaccessoires',
    categoryHandle: 'accessories',
    description: MS?.description ?? '',
    shortDescription: MS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/mills-black.jpg',          alt: 'Peper- en zoutmolens Zwart' },
      { src: '/content/pepper-salt-mills-black-second.webp', alt: 'Peper- en zoutmolens Zwart — lifestyle' },
    ],
    colors: MILLS_COLORS,
    features: MS?.features ?? [],
    specs: MS?.specs ?? [],
  },
  {
    id: '2619',
    handle: 'pepper-salt-mills-white',
    title: 'Peper- en zoutmolens',
    subtitle: 'White — Kruiden met intentie.',
    price: 66.95,
    compareAtPrice: undefined,
    category: 'Keukenaccessoires',
    categoryHandle: 'accessories',
    description: MS?.description ?? '',
    shortDescription: MS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/mills-white.jpg',          alt: 'Peper- en zoutmolens Wit' },
      { src: '/content/pepper-salt-mills-white-second.webp', alt: 'Peper- en zoutmolens Wit — lifestyle' },
    ],
    colors: MILLS_COLORS,
    features: MS?.features ?? [],
    specs: MS?.specs ?? [],
  },
  {
    id: '2621',
    handle: 'pepper-salt-mills-green',
    title: 'Peper- en zoutmolens',
    subtitle: 'Green — Kruiden met intentie.',
    price: 69.95,
    compareAtPrice: undefined,
    category: 'Keukenaccessoires',
    categoryHandle: 'accessories',
    description: MS?.description ?? '',
    shortDescription: MS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/images/products/mills-green.jpg',           alt: 'Peper- en zoutmolens Groen' },
      { src: '/content/pepper-salt-mills-green-second.webp', alt: 'Peper- en zoutmolens Groen — lifestyle' },
    ],
    colors: MILLS_COLORS,
    features: MS?.features ?? [],
    specs: MS?.specs ?? [],
  },

  // ── Acacia snijplank ──────────────────────────────────────────────────────
  {
    id: '2466',
    handle: 'acacia-cutting-board',
    title: 'Acacia snijplank',
    subtitle: 'Natural Acacia — Vakmanschap voor je keuken.',
    price: 76.95,
    compareAtPrice: undefined,
    category: 'Keukenaccessoires',
    categoryHandle: 'accessories',
    description: AS?.description ?? '',
    shortDescription: AS?.shortDescription ?? '',
    badge: undefined,
    inStock: true,
    images: [
      { src: '/content/acacia-snijplank-product-foto-scaled.jpg', alt: 'Acacia snijplank' },
      { src: '/content/acacia-snijplank-lifestyle-1-800x1067.webp', alt: 'Acacia snijplank — lifestyle' },
      { src: '/content/acacia-snijplank-lifestyle-2.jpg',           alt: 'Acacia snijplank — detail' },
      { src: '/content/acacia-snijplank-maten.jpg',                 alt: 'Acacia snijplank — maten' },
    ],
    colors: ACACIA_COLORS,
    features: AS?.features ?? [],
    specs: AS?.specs ?? [],
  },
]

// ── Public API ────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return STATIC_PRODUCTS
}

export function getProductByHandle(handle: string): Product | undefined {
  return STATIC_PRODUCTS.find((p) => p.handle === handle)
}

export function getProductSlugs(): string[] {
  return STATIC_PRODUCTS.map((p) => p.handle)
}
