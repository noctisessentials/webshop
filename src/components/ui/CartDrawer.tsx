'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Button } from './Button'
import { formatPrice } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'
import type { Product, ProductColor } from '@/lib/data'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

const FREE_SHIPPING_THRESHOLD = 50

type CartSuggestion = {
  id: string
  handle: string
  title: string
  titleEn: string
  subtitle: string
  price: number
  compareAtPrice?: number
  image: string
  href: string
  color: ProductColor
}

const ALL_SUGGESTIONS: CartSuggestion[] = [
  {
    id: 'upsell-kitchen-nude',
    handle: '19-piece-kitchenware-nude',
    title: '19-delige keukenset nude',
    titleEn: '19-Piece Kitchen Set nude',
    subtitle: 'Perfecte match bij je molens',
    price: 64.95,
    image: '/images/products/kitchenware-nude.jpg',
    href: '/products/19-piece-kitchenware-nude',
    color: { name: 'Nude', slug: 'nude', hex: '#D4B49A', inStock: true, wcId: 1991 },
  },
  {
    id: 'upsell-mills-black-white',
    handle: 'pepper-salt-mills-black-white',
    title: 'Peper- en zoutmolens zwart wit',
    titleEn: 'Pepper & Salt Mills black white',
    subtitle: 'Perfecte match op je set',
    price: 66.95,
    image: '/images/products/mills-blackwhite.jpg',
    href: '/products/pepper-salt-mills-black-white',
    color: { name: 'Zwart wit', slug: 'zwart-wit', hex: '#9E9E9E', inStock: true, wcId: 2444 },
  },
  {
    id: 'upsell-mills-black',
    handle: 'pepper-salt-mills-black',
    title: 'Peper- en zoutmolens zwart',
    titleEn: 'Pepper & Salt Mills black',
    subtitle: 'Perfecte match op je set',
    price: 66.95,
    image: '/images/products/mills-black.jpg',
    href: '/products/pepper-salt-mills-black',
    color: { name: 'Zwart', slug: 'black', hex: '#2C2C2C', inStock: true, wcId: 2617 },
  },
  {
    id: 'upsell-mills-white',
    handle: 'pepper-salt-mills-white',
    title: 'Peper- en zoutmolens wit',
    titleEn: 'Pepper & Salt Mills white',
    subtitle: 'Perfecte match op je set',
    price: 66.95,
    image: '/images/products/mills-white.jpg',
    href: '/products/pepper-salt-mills-white',
    color: { name: 'Wit', slug: 'white', hex: '#F5F3F0', inStock: true, wcId: 2619 },
  },
  {
    id: 'upsell-mills-green',
    handle: 'pepper-salt-mills-green',
    title: 'Peper- en zoutmolens groen',
    titleEn: 'Pepper & Salt Mills green',
    subtitle: 'Perfecte match op je set',
    price: 66.95,
    image: '/images/products/mills-green.jpg',
    href: '/products/pepper-salt-mills-green',
    color: { name: 'Groen', slug: 'green', hex: '#4A6741', inStock: true, wcId: 2621 },
  },
  {
    id: 'upsell-acacia',
    handle: 'acacia-cutting-board',
    title: 'Acacia snijplank',
    titleEn: 'Acacia Cutting Board',
    subtitle: 'Warm hout voor je aanrecht',
    price: 76.95,
    image: '/images/products/acacia.jpg',
    href: '/products/acacia-cutting-board',
    color: { name: 'Acacia', slug: 'acacia', hex: '#C4894A', inStock: true, wcId: 2466 },
  },
]

function getSuggestions(cartHandles: Set<string>): CartSuggestion[] {
  const acacia = ALL_SUGGESTIONS.find((s) => s.id === 'upsell-acacia')!
  const millsBlackWhite = ALL_SUGGESTIONS.find((s) => s.id === 'upsell-mills-black-white')!
  const millsWhite = ALL_SUGGESTIONS.find((s) => s.id === 'upsell-mills-white')!
  const millsGreen = ALL_SUGGESTIONS.find((s) => s.id === 'upsell-mills-green')!
  const kitchenNude = ALL_SUGGESTIONS.find((s) => s.id === 'upsell-kitchen-nude')!

  const hasKitchenBlack = [...cartHandles].some((h) => h.includes('19-piece-kitchenware-black'))
  const hasKitchenNude = [...cartHandles].some((h) => h.includes('19-piece-kitchenware-nude'))
  const hasKitchenGreen = [...cartHandles].some((h) => h.includes('19-piece-kitchenware-green') || h.includes('19-piece-kitchenware-mint'))
  const hasKitchen = hasKitchenBlack || hasKitchenNude || hasKitchenGreen || [...cartHandles].some((h) => h.includes('19-piece-kitchenware'))
  const hasMillsBlackWhite = [...cartHandles].some((h) => h.includes('pepper-salt-mills-black-white') || h.includes('pepper-salt-mills-blackwhite'))
  const hasMillsBlack = [...cartHandles].some((h) => h === 'pepper-salt-mills-black')
  const hasMillsWhite = [...cartHandles].some((h) => h.includes('pepper-salt-mills-white'))
  const hasMillsGreen = [...cartHandles].some((h) => h.includes('pepper-salt-mills-green'))
  const hasMills = hasMillsBlackWhite || hasMillsBlack || hasMillsWhite || hasMillsGreen || [...cartHandles].some((h) => h.includes('pepper-salt-mills'))
  const hasAcacia = cartHandles.has('acacia-cutting-board')

  const candidates: CartSuggestion[] = []

  if (hasKitchenNude && !hasMills) candidates.push(millsWhite)
  else if (hasKitchenBlack && !hasMills) candidates.push(millsBlackWhite)
  else if (hasKitchenGreen && !hasMills) candidates.push(millsGreen)
  else if (hasKitchen && !hasMills) candidates.push(millsBlackWhite)

  if (hasMillsWhite && !hasKitchen) candidates.push(kitchenNude)
  else if ((hasMillsBlackWhite || hasMillsGreen) && !hasKitchen) candidates.push(kitchenNude)
  else if (hasMills && !hasKitchen) candidates.push(kitchenNude)

  if (hasAcacia && !hasKitchen) candidates.push(kitchenNude)
  if (hasAcacia && !hasMills) candidates.push(millsBlackWhite)

  if (!hasAcacia) candidates.push(acacia)
  if (!hasMills && !candidates.some((c) => c.id.includes('mills'))) candidates.push(millsBlackWhite)
  if (!hasKitchen && !candidates.some((c) => c.id.includes('kitchen'))) candidates.push(kitchenNude)

  const seen = new Set<string>()
  return candidates.filter((s) => {
    if (cartHandles.has(s.handle) || seen.has(s.id)) return false
    seen.add(s.id)
    return true
  }).slice(0, 2)
}

const COLOR_MAP_NL: Record<string, string> = {
  black: 'Zwart',
  white: 'Wit',
  grey: 'Grijs',
  gray: 'Grijs',
  nude: 'Nude',
  pink: 'Roze',
  green: 'Groen',
  mint: 'Mintgroen',
  beige: 'Beige',
  acacia: 'Acacia',
  'zwart-wit': 'Zwart wit',
}

const COLOR_MAP_EN: Record<string, string> = {
  black: 'Black',
  white: 'White',
  grey: 'Grey',
  gray: 'Grey',
  nude: 'Nude',
  pink: 'Pink',
  green: 'Green',
  mint: 'Mint Green',
  beige: 'Beige',
  acacia: 'Acacia',
  'zwart-wit': 'Black White',
}

function getColorName(color: ProductColor, isEn: boolean): string {
  const map = isEn ? COLOR_MAP_EN : COLOR_MAP_NL
  const slugKey = color.slug.trim().toLowerCase()
  const nameKey = color.name.trim().toLowerCase()
  return map[slugKey] ?? map[nameKey] ?? color.name
}

function getCartItemTitle(product: Product, color: ProductColor, isEn: boolean): string {
  const colorName = getColorName(color, isEn).toLowerCase()
  const handle = product.handle.toLowerCase()

  if (handle.includes('19-piece-kitchenware')) {
    return isEn ? `19-Piece Kitchen Set ${colorName}` : `19-delige keukenset ${colorName}`
  }
  if (handle.includes('pepper-salt-mills')) {
    return isEn ? `Pepper & Salt Mills ${colorName}` : `Peper- en zoutmolens ${colorName}`
  }
  if (handle.includes('acacia-cutting-board')) {
    return isEn ? 'Acacia Cutting Board' : 'Acacia snijplank'
  }
  return product.title
}

function toSuggestionProduct(suggestion: CartSuggestion): Product {
  return {
    id: suggestion.id,
    handle: suggestion.handle,
    title: suggestion.title,
    subtitle: suggestion.subtitle,
    price: suggestion.price,
    compareAtPrice: suggestion.compareAtPrice,
    category: 'Accessoires',
    categoryHandle: 'accessories',
    description: suggestion.subtitle,
    shortDescription: suggestion.subtitle,
    images: [{ src: suggestion.image, alt: suggestion.title }],
    colors: [suggestion.color],
    features: [],
    specs: [],
    inStock: true,
  }
}

const KITCHEN_VARIANTS = ALL_SUGGESTIONS.filter((s) => s.id.includes('kitchen'))
const MILLS_VARIANTS = ALL_SUGGESTIONS.filter((s) => s.id.includes('mills'))

function getGroupKey(s: CartSuggestion): string {
  if (s.id.includes('kitchen')) return 'kitchen'
  if (s.id.includes('mills')) return 'mills'
  return s.id
}

function getGroupVariants(s: CartSuggestion): CartSuggestion[] {
  if (s.id.includes('kitchen')) return KITCHEN_VARIANTS
  if (s.id.includes('mills')) return MILLS_VARIANTS
  return [s]
}

export function CartDrawer() {
  const t = useTranslations('cart')
  const locale = useLocale()
  const isEn = locale === 'en'
  const { isOpen, closeCart, items, removeItem, updateQuantity, addItem, subtotal, bundleDiscount, total, count } = useCart()

  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<string, string>>({})

  const discountTotal = items.reduce((sum, item) => {
    const compareAt = item.product.compareAtPrice
    if (!compareAt || compareAt <= item.product.price) return sum
    return sum + (compareAt - item.product.price) * item.quantity
  }, 0)

  const shippingProgress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1)
  const shippingMessage =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? t('freeShipping')
      : t('freeShippingProgress', { amount: formatPrice(FREE_SHIPPING_THRESHOLD - subtotal) })

  const cartHandles = new Set(items.map((item) => item.product.handle))
  const visibleSuggestions = getSuggestions(cartHandles)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-dark/45 data-[state=open]:animate-[fadeIn_260ms_ease-out] data-[state=closed]:animate-[fadeOut_220ms_ease-in]"
        />

        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-[540px] bg-[#F6F4F0] border-l border-border/80 flex flex-col shadow-drawer data-[state=open]:animate-[drawerIn_420ms_cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-[drawerOut_300ms_cubic-bezier(0.4,0,1,1)]"
          aria-label={t('title')}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} strokeWidth={1.5} className="text-dark" />
                <span className="font-sans text-xl leading-none font-semibold text-dark">
                  {t('title')}
                </span>
                {count > 0 && (
                  <span className="text-sm font-sans text-muted">
                    ({count} {count === 1 ? t('itemSingular') : t('itemPlural')})
                  </span>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  className="h-9 w-9 rounded-full bg-white border border-border text-dark hover:bg-surface transition-colors duration-200 flex items-center justify-center"
                  aria-label={t('close')}
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-2 text-center">
                <ShoppingBag size={46} strokeWidth={1.2} className="text-border" />
                <p className="font-sans text-xl font-semibold text-dark">{t('emptyTitle')}</p>
                <p className="text-sm font-sans text-muted">{t('emptyBody')}</p>
                <Button variant="accent" size="md" asChild onClick={closeCart}>
                  <Link href="/winkel">{t('shopNow')}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-[#EFECE5] p-4">
                  <p className="text-base font-sans font-semibold text-dark">{shippingMessage}</p>
                  <div className="mt-4 h-[3px] rounded-full bg-[#E6E0D6] overflow-hidden">
                    <div
                      className="h-full bg-[#16A34A] transition-all duration-500"
                      style={{ width: `${Math.max(8, shippingProgress * 100)}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-2xl border border-border bg-white p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface border border-border">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0].src}
                              alt={item.product.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.color.hex }} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm font-semibold text-dark leading-snug">
                            {getCartItemTitle(item.product, item.color, isEn)}
                          </p>
                          <p className="text-sm font-sans text-muted mt-0.5">
                            {t('quantity')} {item.quantity}
                          </p>
                          <p className="text-sm font-sans text-muted mt-0.5">
                            {t('colour')} {getColorName(item.color, isEn)}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-sans font-semibold text-dark">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                              <span className="text-sm font-sans text-muted line-through">
                                {formatPrice(item.product.compareAtPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                          className="h-10 w-10 rounded-full border border-border bg-light text-dark hover:bg-surface transition-colors duration-200 flex items-center justify-center"
                          aria-label={item.quantity === 1 ? t('remove') : t('removeOne')}
                        >
                          {item.quantity === 1 ? <Trash2 size={16} strokeWidth={1.6} /> : <Minus size={16} strokeWidth={1.6} />}
                        </button>
                        <span className="min-w-4 text-center text-base font-sans font-medium text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 rounded-full border border-border bg-light text-dark hover:bg-surface transition-colors duration-200 flex items-center justify-center"
                          aria-label={t('addOne')}
                        >
                          <Plus size={16} strokeWidth={1.6} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {visibleSuggestions.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base font-sans font-semibold text-dark">
                        {t('upsellTitle')}
                      </h3>
                      <span className="flex-shrink-0 inline-flex rounded-full bg-[#EAF4FF] px-2.5 py-1 text-xs font-sans font-semibold text-[#1a6fb8]">
                        Bespaar 10%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {visibleSuggestions.map((suggestion) => {
                        const groupKey = getGroupKey(suggestion)
                        const variants = getGroupVariants(suggestion)
                        const activeId = selectedVariantIds[groupKey] ?? suggestion.id
                        const active = variants.find((v) => v.id === activeId) ?? suggestion
                        const cartHandleSet = new Set(items.map((i) => i.product.handle))
                        return (
                          <article
                            key={suggestion.id}
                            className="rounded-xl border border-border bg-[#EAF0F4] overflow-hidden"
                          >
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={active.image}
                                alt={isEn ? active.titleEn : active.title}
                                fill
                                className="object-contain p-3"
                                sizes="180px"
                              />
                            </div>
                            <div className="px-3 pb-3">
                              <p className="text-sm font-sans font-semibold text-dark leading-snug">
                                {isEn ? active.titleEn : active.title}
                              </p>
                              {variants.length > 1 && (
                                <div className="mt-2 flex gap-1.5 flex-wrap">
                                  {variants.map((v) => (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => setSelectedVariantIds((prev) => ({ ...prev, [groupKey]: v.id }))}
                                      title={isEn ? v.titleEn : v.title}
                                      className={`h-5 w-5 rounded-full border-2 overflow-hidden flex transition-all duration-150 ${active.id === v.id ? 'border-dark scale-110' : 'border-transparent hover:border-dark/40'} ${cartHandleSet.has(v.handle) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                      style={v.color.slug !== 'zwart-wit' ? { backgroundColor: v.color.hex } : undefined}
                                    >
                                      {v.color.slug === 'zwart-wit' && (
                                        <>
                                          <span className="flex-1 h-full" style={{ backgroundColor: '#222222' }} />
                                          <span className="flex-1 h-full" style={{ backgroundColor: '#DEDEDE' }} />
                                        </>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span className="text-sm font-sans font-semibold text-dark">
                                  {formatPrice(active.price)}
                                </span>
                                <button
                                  onClick={() => !cartHandleSet.has(active.handle) && addItem(toSuggestionProduct(active), active.color, 1)}
                                  disabled={cartHandleSet.has(active.handle)}
                                  className="h-8 w-8 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                                  aria-label={`${isEn ? 'Add' : 'Voeg toe'} ${isEn ? active.titleEn : active.title}`}
                                >
                                  <Plus size={14} strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border bg-light px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                {discountTotal > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>{t('discount')}</span>
                    <span>- {formatPrice(discountTotal)}</span>
                  </div>
                )}
                {bundleDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm font-medium text-[#1a6fb8]">
                    <span>10% bundelkorting</span>
                    <span>- {formatPrice(bundleDiscount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{t('shipping')}</span>
                  <span>{t('free')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-lg font-semibold text-dark">{t('subtotal')}</span>
                  <span className="font-sans text-2xl font-semibold text-dark">{formatPrice(total)}</span>
                </div>
              </div>

              <Button variant="accent" size="lg" fullWidth asChild onClick={closeCart}>
                <Link href="/checkout">{t('checkout')}</Link>
              </Button>

              <div className="pt-1">
                <Image
                  src="/images/payment-methodes2.png"
                  alt={t('paymentAlt')}
                  width={326}
                  height={18}
                  className="h-[22px] w-auto mx-auto opacity-95"
                />
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
