import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'

type EditorialBannerProps = {
  imageSrc?: string
  imageSeed?: string
  imageAlt?: string
  eyebrow?: string
  headlineLine1: string
  headlineLine2?: string
  body?: string
  ctaLabel: string
  ctaHref: string
  imagePosition?: 'left' | 'right'
  theme?: 'light' | 'dark'
}

export function EditorialBanner({
  imageSrc,
  imageSeed = 'noctis-editorial',
  imageAlt = 'Noctis lifestyle',
  eyebrow,
  headlineLine1,
  headlineLine2,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'left',
  theme = 'light',
}: EditorialBannerProps) {
  const isDark = theme === 'dark'
  const imageFirst = imagePosition === 'left'

  const textBlock = (
    <div
      className={`flex flex-col justify-center px-8 md:px-12 lg:px-14 py-14 md:py-20 ${
        isDark ? 'bg-dark' : 'bg-white'
      }`}
    >
      {eyebrow && (
        <p className="text-xs font-sans font-semibold uppercase tracking-widest mb-5 text-accent">
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-sans font-bold leading-tight mb-6 tracking-tight ${
          isDark ? 'text-light' : 'text-dark'
        }`}
        style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
      >
        {headlineLine1}
        {headlineLine2 ? (
          <>
            <br />
            <span style={{ color: isDark ? '#C9A882' : '#A4744C' }}>{headlineLine2}</span>
          </>
        ) : null}
      </h2>
      {body && (
        <p
          className={`font-sans text-sm md:text-base leading-relaxed whitespace-pre-line mb-8 max-w-sm ${
            isDark ? 'text-light/50' : 'text-muted'
          }`}
        >
          {body}
        </p>
      )}
      <div>
        <Button
          variant={isDark ? 'ghost-light' : 'primary'}
          size="lg"
          asChild
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  )

  const imageBlock = (
    <div className="relative min-h-[340px] md:min-h-[480px] overflow-hidden">
      <Image
        src={imageSrc ?? `https://picsum.photos/seed/${imageSeed}/800/650`}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  return (
    <SectionFrame>
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {imageFirst ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </SectionFrame>
  )
}
