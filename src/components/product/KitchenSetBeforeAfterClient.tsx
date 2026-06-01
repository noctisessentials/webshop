'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Minus, Pause, Play, Plus, ShieldCheck, Truck, Volume2, VolumeX, X, Check } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { type Product, type ProductColor } from '@/lib/data'

// ─── helpers ─────────────────────────────────────────────────────────────────

const DUTCH: Record<string, string> = {
  black: 'Zwart', white: 'Wit', grey: 'Grijs', gray: 'Grijs', nude: 'Nude',
  pink: 'Roze', green: 'Groen', mint: 'Mintgroen', 'mint-green': 'Mintgroen',
  zwart: 'Zwart', wit: 'Wit', grijs: 'Grijs', roze: 'Roze', groen: 'Groen', mintgroen: 'Mintgroen',
}

const COLOR_DATA: Record<string, { img: string; desc: string }> = {
  nude:         { img: '/images/pdp/kitchen-set-nude/lifestyle-new.webp',   desc: 'Warm en tijdloos. Past bij hout, beige en marmer.' },
  black:        { img: '/images/pdp/kitchen-set-black/lifestyle-new.webp',  desc: 'Strak en modern. Werkt in elke keuken.' },
  zwart:        { img: '/images/pdp/kitchen-set-black/lifestyle-new.webp',  desc: 'Strak en modern. Werkt in elke keuken.' },
  grey:         { img: '/images/pdp/kitchen-set-grey/lifestyle-new.webp',    desc: 'Rustig en veelzijdig. Combineert met alles.' },
  gray:         { img: '/images/pdp/kitchen-set-grey/lifestyle-new.webp',    desc: 'Rustig en veelzijdig. Combineert met alles.' },
  grijs:        { img: '/images/pdp/kitchen-set-grey/lifestyle-new.webp',    desc: 'Rustig en veelzijdig. Combineert met alles.' },
  pink:         { img: '/images/pdp/kitchen-set-pink/lifestyle.webp',        desc: 'Fris en vrouwelijk. Een subtiel accent.' },
  roze:         { img: '/images/pdp/kitchen-set-pink/lifestyle.webp',        desc: 'Fris en vrouwelijk. Een subtiel accent.' },
  mint:         { img: '/images/pdp/kitchen-set-mint/lifestyle.webp',        desc: 'Fris en speels. Brengt leven in je keuken.' },
  'mint-green': { img: '/images/pdp/kitchen-set-mint/lifestyle.webp',        desc: 'Fris en speels. Brengt leven in je keuken.' },
  green:        { img: '/images/pdp/kitchen-set-mint/lifestyle.webp',        desc: 'Fris en speels. Brengt leven in je keuken.' },
  mintgroen:    { img: '/images/pdp/kitchen-set-mint/lifestyle.webp',        desc: 'Fris en speels. Brengt leven in je keuken.' },
}

const label = (c: ProductColor) =>
  DUTCH[c.slug.toLowerCase()] ?? DUTCH[c.name.toLowerCase()] ?? c.name

const getColorData = (c: ProductColor) =>
  COLOR_DATA[c.slug.toLowerCase()] ??
  COLOR_DATA[c.name.toLowerCase()] ??
  COLOR_DATA[c.slug.toLowerCase().replace(/\s+/g, '-')] ??
  COLOR_DATA['nude']

const COLOR_ORDER = ['black', 'zwart', 'nude', 'grey', 'gray', 'grijs', 'pink', 'roze', 'mint-green', 'mint', 'mintgroen', 'green']

function sortColors(colors: ProductColor[]): ProductColor[] {
  return [...colors].sort((a, b) => {
    const ai = COLOR_ORDER.indexOf(a.slug.toLowerCase())
    const bi = COLOR_ORDER.indexOf(b.slug.toLowerCase())
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
}

function defaultColor(p: Product): ProductColor {
  return (
    p.colors.find((c) => /^black$|^zwart$/.test(c.slug.toLowerCase())) ??
    p.colors.find((c) => c.wcSlug === p.handle) ??
    p.colors[0]
  )
}

// ─── static data ─────────────────────────────────────────────────────────────

const BEFORE_AFTER = [
  { before: 'Losse tools overal verspreid',         after: 'Alles in één houder op je aanrecht' },
  { before: 'Verschillende kleuren en merken door elkaar', after: 'Één kleur, één stijl, rust op je aanrecht' },
  { before: 'Steeds zoeken in een rommelige la of houder', after: 'Alles binnen handbereik tijdens het koken' },
  { before: 'Goedkope tools die snel oud ogen',     after: 'BPA-vrije siliconen die mooi blijven' },
  { before: 'Spatels die je pannen bekrassen',      after: 'Zachte siliconen, geen kras op anti-aanbak' },
]

const ALL_REVIEWS = [
  { text: 'Mijn aanrecht was altijd een ramp. Nu staat alles netjes in de houder en oogt het eindelijk rustig.', name: 'Fleur D.', color: 'Nude', rating: 5 },
  { text: 'Van een la vol rommel naar één mooie set. Had ik dit maar eerder gedaan.', name: 'Laura K.', color: 'Zwart', rating: 5 },
  { text: 'Het verschil is echt enorm. Elke ochtend word ik blij van mijn aanrecht.', name: 'Emma R.', color: 'Grijs', rating: 5 },
  { text: 'Alle losse tools weg, nu alles in één kleur. Het is verrassend hoeveel rust dat geeft.', name: 'Sanne M.', color: 'Zwart', rating: 5 },
  { text: 'Ziet er zoveel rustiger uit. De houder is compact maar houdt alles netjes bij elkaar.', name: 'Marike B.', color: 'Roze', rating: 5 },
  { text: 'Mijn vriend zei direct: waarom hebben we dit niet eerder gekocht. Aanrecht ziet er geweldig uit.', name: 'Nina K.', color: 'Nude', rating: 5 },
  { text: 'De prijs-kwaliteitverhouding is echt top. Na drie maanden nog steeds als nieuw.', name: 'Ludo V.', color: 'Mintgroen', rating: 5 },
  { text: 'Gebruik het elke dag en het staat nog steeds prachtig. Het is echt een complete upgrade.', name: 'Sophie V.', color: 'Roze', rating: 5 },
]
const REVIEW_LOOP = [...ALL_REVIEWS, ...ALL_REVIEWS]

const FAQS = [
  { id: 'q1', q: 'Hoe snel zie ik het verschil?',               a: 'Direct. Zodra de set op je aanrecht staat, is het verschil meteen zichtbaar. Alles in één houder, één kleur, de rommel verdwijnt direct.' },
  { id: 'q2', q: 'Past dit ook in een kleine keuken?',          a: 'Ja. De houder heeft een compacte footprint, kleiner dan een gemiddeld broodtrommel. Juist in kleine keukens merk je het meeste verschil, omdat elke centimeter telt.' },
  { id: 'q3', q: 'Is het ook echt functioneel of alleen mooi?', a: 'Beide. Het siliconen is hittebestendig tot 230°C en BPA-vrij. De tools voelen prettig in de hand en zijn gemaakt voor dagelijks gebruik. Mooi én functioneel.' },
  { id: 'q4', q: 'Welke kleur kies ik als ik twijfel?',         a: 'Zwart of nude. Die passen bij vrijwel elke keukenstijl en ogen altijd verzorgd. Heb je een warme keuken met hout of marmer? Nude. Moderne of donkere keuken? Zwart.' },
  { id: 'q5', q: 'Kan ik retourneren als het niet past?',       a: 'Ja, 14 dagen bedenktijd. Gratis retour. We vergoeden de volledige aankoopprijs als de set niet bij je keuken past.' },
  { id: 'q6', q: 'Hoe snel wordt het geleverd?',                a: 'Bestel voor 23:59 uur op een werkdag en we verzenden dezelfde dag. Morgen in huis.' },
]

// ─── sub-components ───────────────────────────────────────────────────────────

function ReviewCard({ r }: { r: (typeof ALL_REVIEWS)[number] }) {
  return (
    <article className="flex-shrink-0 w-[280px] md:w-[320px] mx-3 bg-white rounded-[18px] border border-[#E8E4DE] p-5">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: r.rating }).map((_, i) => (
          <span key={i} className="text-accent text-sm">★</span>
        ))}
      </div>
      <p className="font-sans text-dark/80 text-sm leading-relaxed mb-4 line-clamp-3">
        &ldquo;{r.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs font-sans font-semibold text-dark">{r.name}</p>
        <span className="text-[10px] font-sans text-dark/35 uppercase tracking-widest">{r.color}</span>
      </div>
    </article>
  )
}

// ─── component ───────────────────────────────────────────────────────────────

type Props = { product: Product; upsellProducts: Product[] }

export function KitchenSetBeforeAfterClient({ product }: Props) {
  const router  = useRouter()
  const { addItem } = useCart()

  const [adding, setAdding]   = useState(false)
  const [preview, setPreview] = useState<ProductColor>(defaultColor(product))
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)

  // Video states
  const [muted0, setMuted0] = useState(true)
  const [muted1, setMuted1] = useState(true)
  const [muted2, setMuted2] = useState(true)
  const [playing0, setPlaying0] = useState(true)
  const [playing1, setPlaying1] = useState(false)
  const [playing2, setPlaying2] = useState(false)
  const vid0 = useRef<HTMLVideoElement>(null)
  const vid1 = useRef<HTMLVideoElement>(null)
  const vid2 = useRef<HTMLVideoElement>(null)

  const sortedColors = sortColors(product.colors)

  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          } else {
            entry.target.classList.remove('in-view')
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const base = defaultColor(product)
  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const toggleMute = (idx: number) => {
    if (idx === 0) { const m = !muted0; setMuted0(m); if (vid0.current) vid0.current.muted = m }
    if (idx === 1) { const m = !muted1; setMuted1(m); if (vid1.current) vid1.current.muted = m }
    if (idx === 2) { const m = !muted2; setMuted2(m); if (vid2.current) vid2.current.muted = m }
  }

  const togglePlay = (idx: number) => {
    const refs = [vid0, vid1, vid2]
    const setters = [setPlaying0, setPlaying1, setPlaying2]
    const states = [playing0, playing1, playing2]
    const ref = refs[idx].current
    if (!ref) return
    if (states[idx]) { ref.pause(); setters[idx](false) }
    else              { ref.play();  setters[idx](true)  }
  }

  const videoRefs   = [vid0, vid1, vid2]
  const mutedState  = [muted0, muted1, muted2]
  const playingState = [playing0, playing1, playing2]

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((r) => setTimeout(r, 400))
    addItem({ ...product, title: `19-delige keukenset ${label(base).toLowerCase()}` }, base, 1)
    setAdding(false)
  }

  void adding
  void handleAddToCart

  return (
    <div className="bg-[#F0EDE8] overflow-x-hidden">

      {/* ── HERO — Before/After als hoofdvisual ──────────────────────────────── */}
      <section className="relative pt-8 pb-0">
        {/* Headline boven het beeld */}
        <div className="text-center px-6 mb-6">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">
            19-delige keukenset
          </p>
          <h1
            className="font-sans font-bold text-dark leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(32px, 5vw, 62px)' }}
          >
            Van rommel{' '}
            <span className="font-normal italic" style={{ color: '#A4744C' }}>
              naar rust
            </span>
          </h1>
          <p className="font-sans text-dark/55 text-base leading-relaxed mb-5 md:whitespace-nowrap">
            Eén set vervangt alles. Alles matched. Alles heeft een vaste plek.
          </p>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-sm text-[#00B67A]">★</span>
                ))}
              </div>
              <span className="text-sm font-sans text-dark/60 font-medium">5.000+ klanten</span>
            </div>
            <span className="hidden sm:block text-dark/20">·</span>
            <span className="text-sm font-sans text-dark/50 flex items-center gap-1.5">
              <Truck size={13} className="text-dark/30" />
              Morgen in huis
            </span>
            <span className="hidden sm:block text-dark/20">·</span>
            <span className="text-sm font-sans text-dark/50 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-dark/30" />
              14 dagen retour
            </span>
          </div>

          <Button
            variant="accent"
            size="lg"
            onClick={() => document.getElementById('kies-kleur')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Kies jouw kleur
          </Button>
        </div>

        {/* Before/After image — full width hero */}
        <div className="px-4 md:px-8 max-w-5xl mx-auto">
          {/* Mobile */}
          <div className="relative w-full rounded-[20px] overflow-hidden aspect-square md:hidden">
            <Image
              src="/content/before_after_PDP_mobile.jpg"
              alt="Voor en na — van een rommelige keuken naar een rustige Noctis keuken"
              fill
              priority
              loading="eager"
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute bottom-0 left-0 right-0 flex">
              <div className="flex-1 bg-black/50 backdrop-blur-sm py-2 text-center">
                <span className="text-white text-xs font-sans font-semibold uppercase tracking-widest">Voorheen</span>
              </div>
              <div className="flex-1 bg-[#A4744C]/80 backdrop-blur-sm py-2 text-center">
                <span className="text-white text-xs font-sans font-semibold uppercase tracking-widest">Met Noctis</span>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="relative w-full rounded-[24px] overflow-hidden hidden md:block" style={{ aspectRatio: '8/3' }}>
            <Image
              src="/content/before_after_PDP.jpeg"
              alt="Voor en na — van een rommelijke keuken naar een rustige Noctis keuken"
              fill
              priority
              loading="eager"
              className="object-cover object-center"
              sizes="90vw"
            />
            <div className="absolute bottom-0 left-0 right-0 flex">
              <div className="flex-1 bg-black/40 backdrop-blur-sm py-3 text-center">
                <span className="text-white text-sm font-sans font-semibold uppercase tracking-widest">Voorheen</span>
              </div>
              <div className="flex-1 bg-[#A4744C]/70 backdrop-blur-sm py-3 text-center">
                <span className="text-white text-sm font-sans font-semibold uppercase tracking-widest">Met Noctis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE/AFTER COMPARISON ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div data-animate className="text-center mb-10">
            <h2
              className="font-sans font-bold text-dark"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Herkenbaar?
            </h2>
            <p className="font-sans text-dark/50 text-sm mt-2">
              Dit verandert er als je overstapt op Noctis.
            </p>
          </div>

          {/* Header row */}
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
            {BEFORE_AFTER.map((item, i) => (
              <div
                key={i}
                data-animate
                data-delay={String(i + 1)}
                className="grid grid-cols-2 bg-white rounded-[14px] border border-[#E8E4DE] overflow-hidden"
              >
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
        </div>
      </section>

      {/* ── COLOUR PICKER + CTA ──────────────────────────────────────────────── */}
      <section id="kies-kleur" className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div data-animate className="text-center mb-10">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">
              5 kleuren
            </p>
            <h2
              className="font-sans font-bold text-dark"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Kies de kleur die past bij jouw keuken
            </h2>
          </div>

          <div data-animate data-delay="1" className="flex justify-center gap-2 mb-10 flex-wrap">
            {sortedColors.map((color) => {
              const isActive = preview.slug === color.slug
              return (
                <button
                  key={color.slug}
                  onClick={() => setPreview(color)}
                  disabled={!color.inStock}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-all duration-200',
                    isActive
                      ? 'border-dark bg-dark text-white shadow-sm'
                      : 'border-[#E0DCD7] bg-white text-dark hover:border-dark/40',
                    !color.inStock && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <span className="h-4 w-4 rounded-full flex-shrink-0 border border-black/10" style={{ backgroundColor: color.hex }} />
                  {label(color)}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 items-center">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#F8F5F1]">
              <Image
                key={getColorData(preview).img}
                src={getColorData(preview).img}
                alt={`Keukenset ${label(preview)}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            <div className="flex flex-col gap-5 lg:px-6">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: preview.hex }} />
                <h3 className="font-sans font-semibold text-dark text-xl">{label(preview)}</h3>
              </div>

              <p className="font-sans text-dark/60 text-base leading-relaxed">
                {getColorData(preview).desc}
              </p>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-sans font-semibold text-dark">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm font-sans text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                {discountPct && (
                  <span className="text-xs font-sans font-semibold bg-[#EFB74A] text-dark rounded-full px-2.5 py-1">
                    {discountPct}% korting
                  </span>
                )}
              </div>

              <Button
                variant="accent"
                size="lg"
                className="self-start"
                onClick={() => {
                  if (preview.wcSlug) {
                    router.push(`/products/${preview.wcSlug}`)
                  } else {
                    router.push('/19-delige-keukenset')
                  }
                }}
              >
                Bekijk {label(preview).toLowerCase()}
              </Button>

              <div className="space-y-2 pt-1 border-t border-[#E8E4DE]">
                <p className="flex items-center gap-2 text-sm font-sans text-dark/50 pt-3">
                  <Truck size={13} className="text-dark/30 flex-shrink-0" />
                  <span suppressHydrationWarning>Voor 23:59 besteld = morgen in huis</span>
                </p>
                <p className="flex items-center gap-2 text-sm font-sans text-dark/50">
                  <ShieldCheck size={13} className="text-dark/30 flex-shrink-0" />
                  Gratis verzending &amp; retour
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UGC VIDEO STRIP ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#F0EDE8]">
        <div className="container-content mb-8">
          <h2
            className="font-sans font-bold text-dark mb-2"
            style={{ fontSize: 'clamp(20px, 2.2vw, 32px)' }}
          >
            Wat mensen zeggen na de switch
          </h2>
          <p className="font-sans text-dark/45 text-sm">
            Bekijk hoe het bij anderen in de keuken staat.
          </p>
        </div>

        <div
          className="flex gap-3 px-4 md:px-8 overflow-x-auto md:overflow-visible md:justify-center scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {[vid0, vid1, vid2].map((ref, i) => {
            const v = [
              { src: '/videos/ugc-1.mp4', autoplay: true },
              { src: '/videos/ugc-2.mp4', autoplay: false },
              { src: '/videos/ugc-3.mp4', autoplay: false },
            ][i]
            const isMuted   = mutedState[i]
            const isPlaying = playingState[i]
            return (
              <div
                key={v.src}
                className="relative flex-shrink-0 w-[150px] md:w-[200px] aspect-[9/16] rounded-[12px] overflow-hidden bg-dark"
              >
                <video
                  ref={ref as React.RefObject<HTMLVideoElement>}
                  src={v.src}
                  className="absolute inset-0 h-full w-full object-cover brightness-90"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onLoadedData={(e) => {
                    if (!v.autoplay) {
                      e.currentTarget.pause()
                      e.currentTarget.currentTime = 0
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePlay(i)}
                  aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
                  className="absolute left-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleMute(i)}
                  aria-label={isMuted ? 'Geluid aan' : 'Dempen'}
                  className="absolute right-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── SOCIAL PROOF MARQUEE ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container-content mb-10 text-center">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">
            Klantbeoordelingen
          </p>
          <h2
            className="font-sans font-bold text-dark mb-6"
            style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
          >
            Wat klanten zeggen
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/content/trustpilot-logo-sml.png.webp"
              alt="Trustpilot"
              width={100}
              height={24}
              className="h-6 w-auto"
            />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-base ${i < 4 ? 'text-[#00B67A]' : 'text-[#00B67A]/50'}`}>★</span>
              ))}
            </div>
            <span className="text-sm font-sans text-dark/60">4,5 / 5</span>
          </div>
        </div>

        <div
          className="relative -mx-4 md:-mx-8"
          onMouseEnter={() => setTestimonialsPaused(true)}
          onMouseLeave={() => setTestimonialsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#F0EDE8] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#F0EDE8] to-transparent" />
          <div className="overflow-hidden">
            <div
              className="marquee-track"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
              {REVIEW_LOOP.map((r, i) => (
                <ReviewCard key={i} r={r} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <a
            href="https://nl.trustpilot.com/review/noctisessentials.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#E0DCD7] bg-white px-6 py-3 text-sm font-sans font-medium text-dark hover:border-dark/40 transition-colors duration-200"
          >
            Lees alle reviews op Trustpilot
            <span className="text-dark/30">→</span>
          </a>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#F0EDE8]">
        <div data-animate className="max-w-2xl mx-auto">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent text-center mb-10">
            Vragen
          </p>
          <Accordion.Root type="single" collapsible className="divide-y divide-[#DEDAD5]">
            {FAQS.map((faq) => (
              <Accordion.Item key={faq.id} value={faq.id} className="group">
                <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans text-dark hover:text-accent transition-colors duration-200 cursor-pointer text-sm md:text-base">
                  <span>{faq.q}</span>
                  <span className="flex-shrink-0 text-dark/25">
                    <Plus size={17} className="group-data-[state=open]:hidden" />
                    <Minus size={17} className="hidden group-data-[state=open]:block" />
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="accordion-content overflow-hidden">
                  <p className="font-sans text-dark/50 text-sm leading-relaxed pb-5">{faq.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 bg-[#EAE5DE]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="font-sans font-bold text-dark leading-none mb-1"
              style={{ fontSize: 'clamp(28px, 3.5vw, 50px)' }}
            >
              Jouw aanrecht,
            </h2>
            <p
              className="font-sans font-normal italic mb-5"
              style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', color: '#A4744C' }}
            >
              eindelijk rustig.
            </p>
            <p className="font-sans text-dark/45 text-base mb-8">
              Gratis verzending · Morgen in huis · 14 dagen retour
            </p>
            <Button variant="accent" size="xl" onClick={() => router.push('/19-delige-keukenset')}>
              Bestel jouw set
            </Button>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-sm text-[#00B67A]">★</span>
                ))}
              </div>
              <p className="text-sm font-sans font-medium text-dark/60">5.000+ tevreden klanten</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
            <Image
              src="/images/pdp/kitchen-set-nude/lifestyle-vrouw.webp"
              alt="Noctis keukenset rustig aanrecht"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
