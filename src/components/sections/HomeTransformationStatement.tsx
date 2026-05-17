import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'

export function HomeTransformationStatement() {
  return (
    <section className="overflow-hidden mb-16 md:mb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px] md:min-h-[560px]">
        {/* Text — left */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 md:py-20 bg-dark order-last md:order-first">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-5">
            VOOR JOUW KEUKEN
          </p>
          <h2
            className="font-sans font-bold text-light leading-tight mb-5 tracking-tight"
            style={{ fontSize: 'clamp(26px, 3vw, 44px)' }}
          >
            Niet zomaar een set.
            <br />
            <span className="font-normal italic" style={{ color: '#C9A882' }}>Een compleet gevoel.</span>
          </h2>
          <p className="font-sans text-light/55 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            Elke kleur. Elk detail. Zorgvuldig samengesteld zodat jouw keuken eindelijk klopt. Functioneel én mooi.
          </p>
          <div>
            <Button variant="ghost-light" size="lg" asChild>
              <Link href="/winkel">Bekijk de collectie</Link>
            </Button>
          </div>
        </div>

        {/* Image — right */}
        <div className="relative min-h-[300px] md:min-h-0 order-first md:order-last">
          <Image
            src="/images/pdp/kitchen-set-black/lifestyle-new.webp"
            alt="Noctis keukenset in een rustige stijlvolle keuken"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
