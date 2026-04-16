import { Truck, RotateCcw, Star, Headphones } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

type TrustBadgesProps = {
  theme?: 'light' | 'dark'
  className?: string
}

export async function TrustBadges({ theme = 'light', className }: TrustBadgesProps) {
  const t = await getTranslations('trust')
  const isDark = theme === 'dark'

  const items = [
    { icon: Truck, title: t('shippingTitle'), body: t('shippingBody') },
    { icon: RotateCcw, title: t('returnsTitle'), body: t('returnsBody') },
    { icon: Star, title: t('customersTitle'), body: t('customersBody') },
    { icon: Headphones, title: t('supportTitle'), body: t('supportBody') },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8',
        className
      )}
    >
      {items.map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex flex-col items-center text-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isDark ? 'bg-white/10' : 'bg-surface'
            )}
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              className={isDark ? 'text-accent' : 'text-accent'}
            />
          </div>
          <div>
            <p
              className={cn(
                'text-xs font-sans font-medium uppercase tracking-widest mb-1',
                isDark ? 'text-light' : 'text-dark'
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                'text-xs font-sans leading-relaxed',
                isDark ? 'text-light/50' : 'text-muted'
              )}
            >
              {body}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
