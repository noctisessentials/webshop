'use client'

import { useEffect } from 'react'
import { X, Plus, ShoppingBag, Trash2 } from 'lucide-react'
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

const SUGGESTIONS: CartSuggestion[] = [
  {
    id: 'upsell-mills-black-white',
    handle: 'pepper-salt-mills-black-white',
    title: 'Peper- en zoutmolens zwart wit',
    titleEn: 'Pepper & Salt Mills black white',
    subtitle: 'Perfecte match op je set',
    price: 66.95,
    image: '/images/products/mills-blackwhite.jpg',
    href: '/products/pepper-salt-mills-black-white',
    color: {
      name: 'Zwart wit',
      slug: 'zwart-wit',
      hex: '#9E9E9E',
      inStock: true,
    },
  },
  {
    id: 'upsell-acacia',
    handle: 'acacia-cutting-board',
    title: 'Acacia snijplank',
    titleEn: 'Acacia Cutting Board',
    subtitle: 'Warm wood for your countertop',
    price: 76.95,
    image: '/images/products/acacia.jpg',
    href: '/products/acacia-cutting-board',
    color: {
      name: 'Acacia',
      slug: 'acacia',
      hex: '#C4894A',
      inStock: true,
    },
  },
]

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

export function CartDrawer() {
  const t = useTranslations('cart')
  const locale = useLocale()
  const isEn = locale === 'en'
  const { isOpen, closeCart, items, removeItem, updateQuantity, addItem, total, count } = useCart()

  const discountTotal = items.reduce((sum, item) => {
    const compareAt = item.product.compareAtPrice
    if (!compareAt || compareAt <= item.product.price) return sum
    return sum + (compareAt - item.product.price) * item.quantity
  }, 0)

  const shippingProgress = Math.min(total / FREE_SHIPPING_THRESHOLD, 1)
  const shippingMessage =
    total >= FREE_SHIPPING_THRESHOLD
      ? t('freeShipping')
      : t('freeShippingProgress', { amount: formatPrice(FREE_SHIPPING_THRESHOLD - total) })

  const cartHandles = new Set(items.map((item) => item.product.handle))
  const visibleSuggestions = SUGGESTIONS.filter((suggestion) => !cartHandles.has(suggestion.handle))

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
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-dark" />
                <span className="font-sans text-[34px] leading-none font-semibold text-dark">
                  {t('title')}
                </span>
              </div>
              <Dialog.Close asChild>
                <button
                  className="h-11 w-11 rounded-full bg-white border border-border text-dark hover:bg-surface transition-colors duration-200 flex items-center justify-center"
                  aria-label={t('close')}
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </Dialog.Close>
            </div>

            {count > 0 && (
              <p className="mt-1.5 text-sm font-sans text-muted">
                {count} {count === 1 ? t('itemSingular') : t('itemPlural')}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                    <li key={item.id} className="rounded-2xl border border-border bg-white p-3.5">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface border border-border">
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
                          <p className="font-sans text-lg font-semibold text-dark leading-snug">
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
                          onClick={() => removeItem(item.id)}
                          className="h-10 w-10 rounded-full border border-border bg-light text-dark hover:bg-surface transition-colors duration-200 flex items-center justify-center"
                          aria-label={t('remove')}
                        >
                          <Trash2 size={16} strokeWidth={1.6} />
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
                    <h3 className="text-2xl font-sans font-semibold text-dark mb-3">
                      {t('upsellTitle')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {visibleSuggestions.map((suggestion) => (
                        <article
                          key={suggestion.id}
                          className="rounded-xl border border-border bg-[#EAF0F4] overflow-hidden"
                        >
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={suggestion.image}
                              alt={isEn ? suggestion.titleEn : suggestion.title}
                              fill
                              className="object-contain p-3"
                              sizes="180px"
                            />
                          </div>
                          <div className="px-3 pb-3">
                            <p className="text-base font-sans font-semibold text-dark leading-snug">
                              {isEn ? suggestion.titleEn : suggestion.title}
                            </p>
                            <div className="mt-1.5 flex items-center justify-between gap-2">
                              <span className="text-base font-sans font-semibold text-dark">
                                {formatPrice(suggestion.price)}
                              </span>
                              <button
                                onClick={() => addItem(toSuggestionProduct(suggestion), suggestion.color, 1)}
                                className="h-8 w-8 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors duration-200 flex items-center justify-center"
                                aria-label={`${isEn ? 'Add' : 'Voeg toe'} ${isEn ? suggestion.titleEn : suggestion.title}`}
                              >
                                <Plus size={14} strokeWidth={2} />
                              </button>
                            </div>
                            <Link
                              href={suggestion.href as Parameters<typeof Link>[0]['href']}
                              onClick={closeCart}
                              className="mt-2 block text-xs font-sans text-muted hover:text-dark transition-colors duration-200"
                            >
                              {t('viewProduct')}
                            </Link>
                          </div>
                        </article>
                      ))}
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
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{t('discount')}</span>
                  <span>{discountTotal > 0 ? formatPrice(discountTotal) : formatPrice(0)}</span>
                </div>
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
