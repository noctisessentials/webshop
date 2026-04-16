import { cn } from '@/lib/utils'

type SectionFrameProps = {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  /** Skip the outer gap/padding — for sections that should stretch full width (e.g. hero) */
  flush?: boolean
}

/**
 * Wraps a section in the floating-card system:
 * - Outer: adds horizontal + vertical gap (the "space between sections" feel)
 * - Inner: applies rounded corners + clips children
 */
export function SectionFrame({
  children,
  className,
  innerClassName,
  flush = false,
}: SectionFrameProps) {
  if (flush) {
    return (
      <div className={cn('section-gap', className)}>
        <div className={cn('section-frame', innerClassName)}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('section-gap', className)}>
      <div className={cn('section-frame', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
