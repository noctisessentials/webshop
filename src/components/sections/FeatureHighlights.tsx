import { SectionFrame } from '@/components/ui/SectionFrame'

const HIGHLIGHTS = [
  {
    number: '01',
    title: 'Designed for the long term',
    body: 'Premium materials, built with care — your Noctis pieces will still look beautiful in five years.',
  },
  {
    number: '02',
    title: 'A palette for every kitchen',
    body: 'Curated color tones designed to complement any interior style without competing with it.',
  },
  {
    number: '03',
    title: 'Gift-worthy by default',
    body: 'Every Noctis order arrives in premium presentation packaging. No extra wrapping required.',
  },
  {
    number: '04',
    title: 'Backed by a no-fuss guarantee',
    body: 'Free shipping, 14-day returns, next-day dispatch. Completely risk-free.',
  },
]

export function FeatureHighlights() {
  return (
    <SectionFrame>
      <div className="bg-white section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-5">
                Why Noctis
              </p>
              <h2
                className="font-sans font-bold text-dark tracking-tight leading-tight"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
              >
                Built for beauty.
                <br />
                <span
                  className="font-normal italic"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
                >
                  Made to be used.
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {HIGHLIGHTS.map(({ number, title, body }) => (
              <div
                key={number}
                className="group flex gap-5 p-6 bg-[#F9F8F6] hover:bg-surface transition-colors duration-250"
                style={{ borderRadius: '16px' }}
              >
                <span className="font-sans font-bold text-3xl text-border group-hover:text-accent/20 transition-colors duration-350 flex-shrink-0 leading-none mt-1">
                  {number}
                </span>
                <div>
                  <h3 className="font-sans font-semibold text-sm text-dark uppercase tracking-wider mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
