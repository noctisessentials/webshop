import Image from 'next/image'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function Hero() {
  const t = await getTranslations('home.hero')

  return (
    <SectionFrame>
      <section
        className="relative bg-dark overflow-hidden flex items-center"
        style={{ minHeight: 'clamp(520px, 85vh, 880px)' }}
      >
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="Noctis keuken sfeerbeeld"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(30,29,29,0.56) 0%, rgba(30,29,29,0.44) 22%, rgba(30,29,29,0.20) 45%, rgba(30,29,29,0.06) 68%, rgba(30,29,29,0) 100%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to top, rgba(30,29,29,0.38) 0%, transparent 100%)' }}
          />
        </div>

        {/* Content */}
        <div className="relative w-full">
          <div className="container-content w-full">
            <div
              className="max-w-2xl"
              style={{ animation: 'fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
            >
              {/* Eyebrow */}
              <div className="mb-7 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-light">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 md:h-5 md:w-5 fill-current"
                      strokeWidth={1.8}
                    />
                  ))}
                </div>
                <p className="text-sm md:text-base font-sans font-semibold text-light">
                  {t('socialProof')}
                </p>
              </div>

              {/* Headline */}
              <h1
                className="font-sans font-black text-light leading-none mb-6 tracking-tight"
                style={{ fontSize: 'clamp(30px, 3.9vw, 60px)' }}
              >
                {t('headline1')}
                <br />
                {t('headline2')}
              </h1>

              {/* Subhead */}
              <p
                className="font-sans font-normal text-light/75 leading-relaxed mb-10 max-w-2xl"
                style={{ fontSize: 'clamp(14px, 1.3vw, 18px)' }}
              >
                {t('subhead')}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" size="xl" asChild>
                  <Link href="/winkel">{t('cta')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </section>
    </SectionFrame>
  )
}
