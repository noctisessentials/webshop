import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'

export function HomeBeforeAfter() {
  return (
    <section className="overflow-hidden bg-[#F5F3F0] mt-10 md:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px] md:min-h-[560px]">
        {/* Image — left on desktop, top on mobile */}
        <div className="relative min-h-[300px] md:min-h-0">
          <Image
            src="/content/before_after_homepage.jpg"
            alt="Voor en na — van een rommelige keuken naar een rustige Noctis keuken"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text — right */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 md:py-20">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-5">
            DE TRANSFORMATIE
          </p>
          <h2
            className="font-sans font-bold text-dark leading-tight mb-5 tracking-tight"
            style={{ fontSize: 'clamp(26px, 3vw, 44px)' }}
          >
            Van rommel{' '}
            <span className="font-normal italic" style={{ color: '#A4744C' }}>naar rust.</span>
          </h2>
          <p className="font-sans text-muted text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            Een keuken voelt pas goed als alles samenwerkt. Niet een la vol losse dingen die nergens bij passen. Maar één set die matcht, klopt en rust geeft. Elke dag opnieuw.
          </p>
          <div>
            <Button variant="primary" size="lg" asChild>
              <Link href="/winkel">Ontdek de collectie</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
