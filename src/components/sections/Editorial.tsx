import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SectionFrame } from '@/components/ui/SectionFrame'

export function Editorial() {
  return (
    <SectionFrame>
      <div className="bg-dark overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text side */}
          <div className="flex flex-col justify-center px-8 md:px-12 lg:px-14 xl:px-18 py-14 md:py-24 lg:py-28">
            <p className="text-xs font-sans font-semibold text-accent tracking-widest uppercase mb-8">
              The Noctis Philosophy
            </p>
            <h2
              className="font-sans font-bold text-light leading-tight mb-8 tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              Aesthetics meet
              <br />
              <span style={{ color: '#C9A882' }}>functionality.</span>
            </h2>
            <p className="font-sans text-light/55 text-base leading-relaxed mb-5 max-w-md">
              We are a young brand from Amsterdam with a clear ambition: to become
              Europe&apos;s most considered kitchen brand. Not the biggest. The most
              considered.
            </p>
            <p className="font-sans text-light/55 text-base leading-relaxed max-w-md">
              Every product starts with the same question — does this make the kitchen
              more beautiful <em>and</em> more functional? If the answer isn&apos;t yes
              to both, we don&apos;t make it.
            </p>

            <div className="mt-10 mb-10 grid grid-cols-3 gap-6">
              {[
                { value: '5,000+', label: 'Customers' },
                { value: '3', label: 'Curated products' },
                { value: '4.9★', label: 'Trustpilot' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-sans font-bold text-2xl md:text-3xl text-light mb-1">
                    {value}
                  </p>
                  <p className="text-xs font-sans text-light/35 tracking-wider uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Button variant="ghost-light" size="lg" asChild>
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Image side */}
          <div className="relative min-h-[380px] lg:min-h-0">
            <Image
              src="https://picsum.photos/seed/noctis-editorial-brand/900/1100"
              alt="Noctis kitchen styling"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{ background: 'linear-gradient(to right, #1E1D1D 0%, transparent 22%)' }}
            />
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
