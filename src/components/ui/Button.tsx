import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'accent' | 'ghost' | 'ghost-light' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-dark text-light hover:bg-dark-mid active:opacity-90',
  accent:
    'bg-accent text-white hover:bg-accent-dark active:opacity-90',
  ghost:
    'border border-dark text-dark hover:bg-dark hover:text-light',
  'ghost-light':
    'border border-light/60 text-light hover:border-light hover:bg-light/10',
  outline:
    'border border-border text-dark hover:border-dark-mid',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs tracking-widest',
  md: 'h-11 px-6 text-xs tracking-widest',
  lg: 'h-13 px-8 text-sm tracking-wider',
  xl: 'h-14 px-10 text-sm tracking-wider',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center font-sans font-medium',
        'rounded-full transition-all duration-250 ease-out cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        loading && 'opacity-70 cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Processing…
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}
