import { cn } from '@/lib/utils'
import type { ProductColor } from '@/lib/data'

type ColorSwatchProps = {
  colors: ProductColor[]
  selectedColor: ProductColor
  onSelect: (color: ProductColor) => void
}

export function ColorSwatch({ colors, selectedColor, onSelect }: ColorSwatchProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-sans text-muted uppercase tracking-widest">
          Color:
        </span>
        <span className="text-xs font-sans font-medium text-dark">
          {selectedColor.name}
          {!selectedColor.inStock && (
            <span className="text-muted font-normal ml-1">— Sold out</span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.slug}
            onClick={() => color.inStock && onSelect(color)}
            disabled={!color.inStock}
            title={color.name}
            aria-label={`${color.name}${!color.inStock ? ' — sold out' : ''}`}
            className={cn(
              'relative w-9 h-9 rounded-full transition-all duration-200',
              'border-2 flex items-center justify-center',
              selectedColor.slug === color.slug
                ? 'border-dark scale-110'
                : 'border-transparent hover:border-dark/30',
              !color.inStock && 'opacity-40 cursor-not-allowed'
            )}
          >
            <span
              className="w-7 h-7 rounded-full"
              style={{ backgroundColor: color.hex }}
            />
            {/* Out of stock slash */}
            {!color.inStock && (
              <span
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <svg viewBox="0 0 36 36" width="36" height="36">
                  <line
                    x1="8" y1="28" x2="28" y2="8"
                    stroke="#1E1D1D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
