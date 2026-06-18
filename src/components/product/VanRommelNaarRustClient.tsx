'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import * as Accordion from '@radix-ui/react-accordion'
import { ArrowRight, Check, Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

// ─── reused from PDP: reviews ──────────────────────────────────────────────

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} van de 5 sterren`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} width="13" height="13" viewBox="0 0 13 13" aria-hidden>
          <path
            d="M6.5 1l1.17 2.373L10.5 3.8 8.5 5.75l.47 2.737L6.5 7.25 4.03 8.487 4.5 5.75 2.5 3.8l2.83-.427L6.5 1z"
            fill={index < rating ? '#A4744C' : 'none'}
            stroke={index < rating ? '#A4744C' : '#D1C5BA'}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  )
}

const TESTIMONIALS = [
  { id: 'ks-1', name: 'Sanne M.', rating: 5, text: 'Sinds we de set hebben oogt ons aanrecht eindelijk rustig. Alles heeft een vaste plek en koken gaat echt sneller.', product: '19-delige keukenset in zwart', date: 'April 2026' },
  { id: 'ks-2', name: 'Nina K.', rating: 5, text: 'Ik was bang dat het vooral mooi zou zijn, maar hij is ook heel praktisch. Vooral de grip en het materiaal voelen premium.', product: '19-delige keukenset in nude', date: 'Maart 2026' },
  { id: 'ks-3', name: 'Marike B.', rating: 5, text: 'De set kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. Kwaliteit is precies wat je verwacht in deze prijsklasse.', product: '19-delige keukenset in roze', date: 'Februari 2026' },
  { id: 'ks-4', name: 'Ludo V.', rating: 5, text: 'We kozen de mintgroene set voor ons nieuwe appartement en hij staat exact zo stijlvol als op de foto. Heel tevreden.', product: '19-delige keukenset in mintgroen', date: 'Januari 2026' },
  { id: 'ks-5', name: 'Emma R.', rating: 5, text: 'Elke ochtend word ik blij van het aanrecht. De set voelt stevig en niets ziet er goedkoop uit.', product: '19-delige keukenset in grijs', date: 'December 2025' },
  { id: 'ks-6', name: 'Fleur D.', rating: 5, text: 'Had ik dit maar eerder gedaan. We gebruiken bijna elk onderdeel dagelijks en alles blijft netjes georganiseerd.', product: '19-delige keukenset in nude', date: 'Februari 2026' },
] as const

const TESTIMONIAL_ROW1_LOOP = [...TESTIMONIALS, ...TESTIMONIALS]
const TESTIMONIAL_ROW2_LOOP = [...[...TESTIMONIALS].reverse(), ...[...TESTIMONIALS].reverse()]

function TestimonialCard({ review }: { review: (typeof TESTIMONIALS)[number] }) {
  return (
    <article className="flex-shrink-0 w-[320px] md:w-[360px] mx-3 bg-white rounded-[18px] border border-border p-5">
      <div className="text-accent font-serif font-bold leading-none mb-3" style={{ fontSize: '40px', lineHeight: 1 }}>
        &ldquo;
      </div>
      <blockquote className="text-sm md:text-base font-sans text-dark/85 leading-relaxed line-clamp-4">
        {review.text}
      </blockquote>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-sans font-semibold text-dark truncate">{review.name}</p>
          <p className="text-xs font-sans text-muted truncate">{review.product} · {review.date}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <ReviewStars rating={review.rating} />
        </div>
      </div>
    </article>
  )
}

const COLOR_SWATCHES = [
  { label: 'Zwart', image: '/images/products/kitchenware-black.jpg', handle: '19-piece-kitchenware-black' },
  { label: 'Nude', image: '/images/products/kitchenware-nude.jpg', handle: '19-piece-kitchenware-nude' },
  { label: 'Grijs', image: '/images/products/kitchenware-grey.jpg', handle: '19-piece-kitchenware-grey' },
  { label: 'Roze', image: '/images/products/kitchenware-pink.jpg', handle: '19-piece-kitchenware-pink' },
  { label: 'Mintgroen', image: '/images/products/kitchenware-mint.jpg', handle: '19-piece-kitchenware-mint-green' },
]

const COMPARISON_ITEMS = [
  { before: 'Spatels die je pan na een jaar al beschadigen', after: 'Siliconen die zacht blijven, ook na duizend keer roeren' },
  { before: 'Messen die binnen een maand stomp aanvoelen', after: 'Mesranden die hun scherpte vasthouden' },
  { before: 'Een lade die je liever dichthoudt voor gasten', after: 'Een aanrecht dat je juist wilt laten zien' },
]

const FAQ_ITEMS = [
  { id: 'damage', question: 'Beschadigen de tools mijn pannen?', answer: 'Nee, juist niet. De siliconen koppen zijn zacht en veilig voor anti-aanbaklagen, zodat je pannen langer mooi blijven.' },
  { id: 'heat', question: 'Zijn de tools hittebestendig?', answer: 'Ja, het siliconen materiaal is hittebestendig tot 230°C, dus het smelt of vervormt niet tijdens het koken.' },
  { id: 'dishwasher', question: 'Mag het in de vaatwasser?', answer: 'Liever niet. Handwas houdt alles op zijn mooist, voor langere tijd.' },
  { id: 'returns', question: 'Wat als het toch niet past?', answer: '14 dagen bedenktijd. Gewoon terugsturen, geen vragen nodig.' },
  { id: 'delivery', question: 'Hoe snel heb ik hem in huis?', answer: 'Voor 23:30 besteld, morgen al op je aanrecht.' },
]

const PDP_HREF = '/19-delige-keukenset' as const

const STICKY_USPS = ['Gratis verzending', '14 dagen retour', 'Snel in huis']

function MicroCta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href={PDP_HREF}
      className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-accent hover:text-accent-dark transition-colors"
    >
      {children}
      <ArrowRight size={14} />
    </Link>
  )
}

export function VanRommelNaarRustClient() {
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const heroAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.add('has-sticky-bar')
    return () => document.body.classList.remove('has-sticky-bar')
  }, [])

  useEffect(() => {
    const anchor = heroAnchorRef.current
    if (!anchor) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#F0EDE8] overflow-x-clip">

      {/* ── HERO — bridge, niet herhaling ───────────────────────────────── */}
      <section className="pt-10 md:pt-16 pb-12 md:pb-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-4">
            De complete keukenset
          </p>
          <h1 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Alles wat je nodig hebt.
            <br />
            <span className="italic font-normal">In één stijl.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg font-sans text-dark/70 leading-relaxed max-w-lg mx-auto">
            Alles wat je dagelijks gebruikt, perfect op elkaar afgestemd. Geen losse aankopen, geen mismatch.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-sm text-[#00B67A]">★</span>)}
            </div>
            <p className="text-sm font-sans font-medium text-dark/60">5.000+ keukens gingen je voor</p>
          </div>
        </div>

        <div className="max-w-md md:max-w-5xl mx-auto mt-10" ref={heroAnchorRef}>
          <div className="relative aspect-[4/5] md:aspect-video w-full rounded-[24px] overflow-hidden">
            <Image src="/images/story/hero.webp" alt="Vrouw in keuken met de 19-delige keukenset" fill quality={95} className="object-cover" priority />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <Button asChild size="lg" className="px-10">
            <Link href={PDP_HREF}>
              Bekijk de set <ArrowRight size={16} className="ml-1.5" />
            </Link>
          </Button>
          <a href="#dieper" className="text-sm font-sans text-dark/50 hover:text-dark/80 transition-colors">
            Of lees eerst verder ↓
          </a>
        </div>
      </section>

      {/* ── HET PROBLEEM, DIEPER ─────────────────────────────────────────── */}
      <section id="dieper" className="bg-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">

          <div data-animate className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden">
              <Image src="/images/story/rommel-lade.webp" alt="Rommelige keukenlade vol losse tools" fill quality={95} className="object-cover" />
            </div>
            <div>
              <p className="font-sans text-xl md:text-2xl font-semibold text-dark leading-relaxed">
                Een lade vol losse tools lijkt onschuldig.
              </p>
              <p className="mt-4 font-sans text-base md:text-lg text-dark/70 leading-relaxed">
                Tot je &apos;m elke dag opentrekt. Niks dat matcht, alles door elkaar — en dat ene
                rommelige hoekje dat je keuken nét niet af laat voelen. Het is klein. Maar je ziet het elke keer.
              </p>
            </div>
          </div>

          <div data-animate className="text-center">
            <MicroCta>Bekijk de set</MicroCta>
          </div>

        </div>
      </section>

      {/* ── ALLES IN ÉÉN SET ─────────────────────────────────────────────── */}
      <section className="bg-[#FAF8F5] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          <div data-animate className="text-center max-w-xl mx-auto mb-14 md:mb-20">
            <h2 className="font-sans font-semibold text-dark leading-tight mb-3" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>
              Alles wat je nodig hebt,
              <br />
              <span className="italic font-normal">in één set</span>
            </h2>
            <p className="font-sans text-base md:text-lg text-dark/70">
              19 tools, perfect op elkaar afgestemd.
            </p>
          </div>

          <div data-animate className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
            <div className="bg-white rounded-[20px] p-6 md:p-8">
              <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden">
                <Image src="/images/story/spatel-soep.webp" alt="Pollepel in tomatensoep" fill quality={95} className="object-cover" />
              </div>
              <h3 className="font-sans font-semibold text-dark text-lg mt-5 mb-2">
                11 tools voor dagelijks gebruik
              </h3>
              <p className="text-sm md:text-base font-sans text-dark/85 leading-relaxed">
                Van soeplepel tot spatel, alles wat je elke dag pakt, in één stijl.
                Geen losse aankopen meer, geen mismatch.
              </p>
            </div>
            <div className="bg-white rounded-[20px] p-6 md:p-8">
              <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden">
                <Image src="/images/story/mes-snijden.webp" alt="Mes snijdt moeiteloos door tomaat" fill quality={95} className="object-cover" />
              </div>
              <h3 className="font-sans font-semibold text-dark text-lg mt-5 mb-2">
                5 messen die moeiteloos snijden
              </h3>
              <p className="text-sm md:text-base font-sans text-dark/85 leading-relaxed">
                Scherp waar het moet, zodat je zonder moeite door alles heen glijdt.
                Mooi in de hand én op het aanrecht.
              </p>
            </div>
          </div>

          <div data-animate className="text-center">
            <MicroCta>Bekijk de set</MicroCta>
          </div>

        </div>
      </section>

      {/* ── BEWIJS IN DETAIL: voor/na ────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div data-animate className="text-center mb-10">
            <h2 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
              Wat er verandert.
            </h2>
          </div>

          <div data-animate className="grid grid-cols-2 mb-3 px-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-dark/10 flex items-center justify-center flex-shrink-0">
                <X size={12} className="text-dark/40" />
              </div>
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-dark/40">Voorheen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-accent" />
              </div>
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-accent">Met Noctis</span>
            </div>
          </div>

          <div className="space-y-2">
            {COMPARISON_ITEMS.map((item, i) => (
              <div key={i} data-animate className="grid grid-cols-2 bg-white rounded-[14px] border border-[#E8E4DE] overflow-hidden">
                <div className="flex items-start gap-3 p-4 border-r border-[#E8E4DE]">
                  <X size={14} className="text-dark/25 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-sans text-dark/50 leading-snug">{item.before}</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#FAF8F5]">
                  <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-sans text-dark font-medium leading-snug">{item.after}</p>
                </div>
              </div>
            ))}
          </div>

          <div data-animate className="text-center mt-10">
            <MicroCta>Bekijk de set</MicroCta>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
      <section className="bg-light section-py overflow-hidden">
        <div className="container-content">
          <div data-animate className="text-center mb-12">
            <Image
              src="/content/trustpilot-logo-sml.png.webp"
              alt="Trustpilot"
              width={224}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
            />
            <h2 className="font-sans font-semibold text-dark tracking-tight" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
              Niet de enige met dit verhaal
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-muted">
              Duizenden mensen gingen je al voor.
            </p>
          </div>
        </div>

        <div
          className="relative -mx-4 md:-mx-8 lg:-mx-12 xl:-mx-18"
          onMouseEnter={() => setTestimonialsPaused(true)}
          onMouseLeave={() => setTestimonialsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-light to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-light to-transparent" />

          <div className="overflow-hidden mb-5">
            <div className="marquee-track" style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}>
              {TESTIMONIAL_ROW1_LOOP.map((review, i) => (
                <TestimonialCard key={`r1-${i}`} review={review} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="marquee-track-reverse" style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}>
              {TESTIMONIAL_ROW2_LOOP.map((review, i) => (
                <TestimonialCard key={`r2-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>

        <div className="container-content mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Image src="/content/stars-4.5.svg" alt="4.4 sterren op Trustpilot" width={96} height={18} className="h-[18px] w-auto" />
            <span className="text-sm font-sans text-dark/60">4,4/5 · 37 reviews</span>
          </div>
          <a
            href="https://www.trustpilot.com/review/noctisessentials.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#E0DCD7] bg-white px-6 py-3 text-sm font-sans font-medium text-dark hover:border-dark/40 transition-colors duration-200"
          >
            Lees alle reviews op Trustpilot
          </a>
        </div>
      </section>

      {/* ── ESTHETIEK / KLEUREN ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div data-animate className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden">
              <Image src="/images/story/kleur-sectie-2.webp" alt="De 19-delige keukenset in vijf kleuren naast elkaar" fill quality={95} className="object-cover" />
            </div>
            <div>
              <p className="font-sans text-xl md:text-2xl font-semibold text-dark leading-relaxed">
                En het staat zó mooi op je aanrecht.
              </p>
              <p className="mt-4 font-sans text-base md:text-lg text-dark/70 leading-relaxed">
                Te mooi om weg te stoppen. Kies de kleur die bij jouw keuken hoort,
                en laat &apos;m gewoon staan.
              </p>

              <div className="flex gap-4 md:gap-5 mt-8 flex-wrap">
                {COLOR_SWATCHES.map((c) => (
                  <Link
                    key={c.label}
                    href={{ pathname: '/products/[handle]', params: { handle: c.handle } }}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden border border-border transition-transform duration-200 group-hover:scale-105">
                      <Image src={c.image} alt={c.label} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-sans text-dark/70 group-hover:text-dark transition-colors">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWIJFEL WEGNEMEN ─────────────────────────────────────────────── */}
      <section className="bg-[#FAF8F5] section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div data-animate>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                Veelgestelde vragen
              </p>
              <h2
                className="font-sans font-bold text-dark tracking-tight leading-tight"
                style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}
              >
                Nog twijfels?
              </h2>
              <p className="font-sans text-muted text-sm mt-4 leading-relaxed">
                Snel antwoord op de meestgestelde vragen.
              </p>
            </div>

            <Accordion.Root type="single" collapsible className="lg:col-span-2 divide-y divide-border">
              {FAQ_ITEMS.map((faq) => (
                <Accordion.Item key={faq.id} value={faq.id} className="group">
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-sm text-dark hover:text-accent transition-colors duration-200 cursor-pointer">
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 text-muted group-data-[state=open]:text-accent transition-colors duration-200">
                      <Plus size={18} strokeWidth={2} className="group-data-[state=open]:hidden" />
                      <Minus size={18} strokeWidth={2} className="hidden group-data-[state=open]:block" />
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="accordion-content overflow-hidden">
                    <p className="font-sans text-muted text-sm leading-relaxed pb-5 max-w-2xl">
                      {faq.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </section>

      {/* ── SLOT + FINALE CTA ────────────────────────────────────────────── */}
      <section className="bg-[#F0EDE8] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-xl mx-auto text-center">
          <p data-animate className="font-sans text-base md:text-lg text-dark/70 italic leading-relaxed mb-10 max-w-md mx-auto">
            Wij geloven dat een keuken rust mag uitstralen. Dat begint bij de kleine details.
          </p>

          <h2 data-animate className="font-sans font-semibold text-dark leading-tight mb-6" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
            Klaar voor jouw rustige aanrecht?
          </h2>

          <div data-animate>
            <Button asChild size="xl" className="px-12">
              <Link href={PDP_HREF}>
                Bekijk de set <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA BAR ───────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-3 md:bottom-4 z-40 px-3 md:px-0 transition-all duration-300',
          stickyVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        )}
        aria-hidden={!stickyVisible}
      >
        <div className="container-content">
          <div className="flex items-center gap-3 md:gap-6 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
              <div className="relative h-11 w-11 md:h-12 md:w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                <Image src="/images/products/kitchenware-black.jpg" alt="19-delige keukenset zwart" fill className="object-cover" />
              </div>
              <p className="hidden sm:block text-sm font-sans font-medium text-dark max-w-[220px]">
                19-delige keukenset — alles in één
              </p>
            </div>

            <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
              {STICKY_USPS.map((usp) => (
                <span key={usp} className="flex items-center gap-1.5 text-xs font-sans text-dark/70 whitespace-nowrap">
                  <Check size={13} className="text-accent flex-shrink-0" />
                  {usp}
                </span>
              ))}
            </div>

            <Button asChild size="md" className="ml-auto flex-shrink-0">
              <Link href={PDP_HREF}>
                Bekijk de set <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
