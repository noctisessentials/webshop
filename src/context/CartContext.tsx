'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { Product, ProductColor } from '@/lib/data'


export type CartItem = {
  id: string
  product: Product
  color: ProductColor
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, color: ProductColor, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

function pushOmnisendCart(cartItems: CartItem[]) {
  if (typeof window === 'undefined' || !window.omnisend) return
  const lineItems = cartItems.map((item) => ({
    productID: item.product.id,
    sku: item.product.handle,
    productName: item.product.title,
    quantity: item.quantity,
    price: Math.round(item.product.price * 100),
    currency: 'EUR',
    imageUrl: item.product.images[0]?.src ?? '',
    productUrl: `https://noctisessentials.com/nl/products/${item.product.handle}`,
  }))
  window.omnisend.push(['track', '$cartUpdated', {
    origin: 'api',
    lineItems,
    cartID: 'cart',
    currency: 'EUR',
    value: Math.round(cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0) * 100),
  }])
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const abandonedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback(
    (product: Product, color: ProductColor, quantity = 1) => {
      const itemId = `${product.id}-${color.slug}`
      // Fire Meta Pixel AddToCart
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [product.id],
          content_name: product.title,
          content_type: 'product',
          value: product.price * quantity,
          currency: 'EUR',
        })
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.id === itemId)
        if (existing) {
          return prev.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
          )
        }
        return [...prev, { id: itemId, product, color, quantity }]
      })
      setIsOpen(true)
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }, [])

  useEffect(() => {
    if (abandonedTimerRef.current) clearTimeout(abandonedTimerRef.current)
    if (items.length === 0) return
    abandonedTimerRef.current = setTimeout(() => {
      pushOmnisendCart(items)
    }, 3 * 60 * 1000)
    return () => {
      if (abandonedTimerRef.current) clearTimeout(abandonedTimerRef.current)
    }
  }, [items])

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
