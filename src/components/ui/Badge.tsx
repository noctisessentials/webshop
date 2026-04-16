import { cn } from '@/lib/utils'

type BadgeVariant = 'dark' | 'accent' | 'light' | 'outline'

const variants: Record<BadgeVariant, string> = {
  dark: 'bg-dark text-light',
  accent: 'bg-accent text-white',
  light: 'bg-surface text-dark',
  outline: 'border border-dark text-dark',
}

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'dark', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-0.5 text-2xs font-sans font-medium uppercase tracking-widest rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
