'use client'

import { useState } from 'react'
import { Truck, RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ColorSwatch } from './ColorSwatch'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { Product, ProductColor } from '@/lib/data'

type ProductInfoProps = {
  product: Product
  selectedColor: ProductColor
  onColorChange: (color: ProductColor) => void
}

export function ProductInfo({ product, selectedColor, onColorChange }: ProductInfoProps) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((r) => setTimeout(r, 600))
    addItem(product, selectedColor)
    setAdding(false)
  }

  const canAdd = selectedColor.inStock

  return (
    <div className="sticky top-24 space-y-6">
      {/* Category breadcrumb */}
      <p className="text-xs font-sans text-muted uppercase tracking-widest">
        {product.category}
      </p>

      {/* Title + badge */}
      <div className="flex items-start gap-3">
        <h1
          className="font-serif font-light text-dark leading-tight"
          style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
        >
          {product.title}
        </h1>
        {product.badge && (
          <Badge variant="accent" className="mt-2 flex-shrink-0">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Subtitle */}
      <p className="font-serif italic text-muted text-lg -mt-2">
        {product.subtitle}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-sans text-2xl font-medium text-dark">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="font-sans text-base text-muted line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Short description */}
      <p className="font-sans text-dark/65 text-sm leading-relaxed border-t border-border pt-5">
        {product.shortDescription}
      </p>

      {/* Color selector */}
      {product.colors.length > 0 && (
        <div className="border-t border-border pt-5">
          <ColorSwatch
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={onColorChange}
          />
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant={canAdd ? 'accent' : 'outline'}
          size="xl"
          fullWidth
          loading={adding}
          disabled={!canAdd}
          onClick={handleAddToCart}
          data-add-to-cart
        >
          {canAdd
            ? `Add to Cart — ${formatPrice(product.price)}`
            : 'Currently Sold Out'}
        </Button>

        <Button variant="ghost" size="xl" fullWidth>
          Buy Now
        </Button>
      </div>

      {/* Trust strip */}
      <div className="border-t border-border pt-5 grid grid-cols-3 gap-4">
        {[
          { icon: Truck, text: 'Free shipping' },
          { icon: RotateCcw, text: '14-day returns' },
          { icon: Shield, text: 'Secure checkout' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-1.5 text-center">
            <Icon size={16} strokeWidth={1.5} className="text-accent" />
            <span className="text-2xs font-sans text-muted uppercase tracking-wider leading-tight">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
