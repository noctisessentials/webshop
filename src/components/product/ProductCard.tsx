import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/data'

// Dutch colour names
const COLOR_NL: Record<string, string> = {
  'black': 'Zwart',
  'grey': 'Grijs',
  'pink': 'Roze',
  'mint green': 'Mintgroen',
  'nude': 'Nude',
  'white': 'Wit',
  'natural acacia': 'Naturel Acacia',
  'black & white': 'Zwart & Wit',
  'green': 'Groen',
}
function nl(color: string): string {
  return COLOR_NL[color.toLowerCase()] ?? color
}

type ProductCardProps = {
  product: Product
  priority?: boolean
  variant?: 'default' | 'carousel'
}

function getVariantFromHandle(product: Product): string | null {
  const handle = product.handle.toLowerCase()
  if (handle.includes('acacia-cutting-board')) return null
  if (handle.includes('pepper-salt-mills-black-white') || handle.includes('pepper-salt-mills-blackwhite')) {
    return 'Zwart wit'
  }
  if (handle.includes('pepper-salt-mills-green')) return 'Groen'
  if (handle.includes('pepper-salt-mills-black')) return 'Zwart'
  if (handle.includes('pepper-salt-mills-white')) return 'Wit'
  if (handle.includes('19-piece-kitchenware-black')) return 'Zwart'
  if (handle.includes('19-piece-kitchenware-nude')) return 'Nude'
  if (handle.includes('19-piece-kitchenware-grey')) return 'Grijs'
  if (handle.includes('19-piece-kitchenware-pink')) return 'Roze'
  if (handle.includes('19-piece-kitchenware-mint-green')) return 'Mintgroen'
  return null
}

export function ProductCard({
  product,
  priority = false,
  variant = 'default',
}: ProductCardProps) {
  const imageSrc = product.images[0]?.src ?? `https://picsum.photos/seed/${product.handle}/600/750`
  const hoverSrc = product.images[1]?.src ?? null
  const isCarousel = variant === 'carousel'

  // Derive the colour name for this specific card from the matching swatch/handle
  const currentColor = product.colors.find((c) => c.wcSlug === product.handle)
  const derivedFromHandle = getVariantFromHandle(product)
  const colorLabel = derivedFromHandle ?? (currentColor ? nl(currentColor.name) : null)
  const shouldShowVariant = !!colorLabel && !product.handle.includes('acacia-cutting-board')

  // Full display name including colour
  const displayName = shouldShowVariant ? `${product.title} — ${colorLabel}` : product.title

  const imgSizes = isCarousel
    ? '(max-width: 768px) 70vw, 280px'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  return (
    <Link
      href={{ pathname: '/products/[handle]', params: { handle: product.handle } }}
      className="group block"
      aria-label={displayName}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-surface mb-4 border border-border"
        style={{
          borderRadius: '16px',
          aspectRatio: isCarousel ? '3/4' : '4/5',
        }}
      >
        {/* Primary image — fades out on hover when there is a second image */}
        <Image
          src={imageSrc}
          alt={displayName}
          fill
          priority={priority}
          className={
            hoverSrc
              ? 'object-cover object-center transition-opacity duration-500 group-hover:opacity-0'
              : 'object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]'
          }
          sizes={imgSizes}
        />

        {/* Hover / second image — fades in on hover */}
        {hoverSrc && (
          <Image
            src={hoverSrc}
            alt={`${displayName} — tweede afbeelding`}
            fill
            className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes={imgSizes}
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block bg-accent text-white text-2xs font-sans font-semibold px-2.5 py-1 rounded-full tracking-wide capitalize shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <div
            className="bg-dark/90 backdrop-blur-sm text-light text-center py-2.5 text-xs font-sans font-semibold uppercase tracking-widest"
            style={{ borderRadius: '10px' }}
          >
            Bekijk product
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans font-semibold text-[15px] text-dark leading-snug group-hover:text-accent-dark transition-colors duration-200 flex-1">
            {displayName}
          </h3>
          <span className="font-sans font-semibold text-sm text-dark flex-shrink-0 pt-0.5">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
