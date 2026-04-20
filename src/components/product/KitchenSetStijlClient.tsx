'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Minus, Palette, Plus, ShieldCheck, Sparkles, Truck, Volume2, VolumeX } from 'lucide-react'
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
  black:        { img: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp', desc: 'Strak en modern. Werkt in elke keuken.' },
  zwart:        { img: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp', desc: 'Strak en modern. Werkt in elke keuken.' },
  grey:         { img: '/images/pdp/kitchen-set-grey/lifestyle.webp',        desc: 'Rustig en veelzijdig. Combineert met alles.' },
  gray:         { img: '/images/pdp/kitchen-set-grey/lifestyle.webp',        desc: 'Rustig en veelzijdig. Combineert met alles.' },
  grijs:        { img: '/images/pdp/kitchen-set-grey/lifestyle.webp',        desc: 'Rustig en veelzijdig. Combineert met alles.' },
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

function defaultColor(p: Product): ProductColor {
  return (
    p.colors.find((c) => /pink|roze/.test(`${c.slug} ${c.name}`.toLowerCase())) ??
    p.colors.find((c) => c.wcSlug === p.handle) ??
    p.colors[0]
  )
}

// ─── static data ─────────────────────────────────────────────────────────────

const GALLERY_LARGE = '/content/grid-top-left.webp'
const GALLERY_SMALLS = [
  '/content/grid-top-right.webp',
  '/content/grid-middle-right.webp',
]
const GALLERY_ROW = [
  { src: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp', alt: 'Zwarte set' },
  { src: '/images/pdp/kitchen-set-pink/lifestyle.webp',        alt: 'Roze set' },
  { src: '/images/pdp/kitchen-set-mint/lifestyle.webp',        alt: 'Mintgroene set' },
]

const SET_PARTS = [
  {
    id: 'messen-schaar' as const,
    title: '5 messen & schaar',
    body: 'Een complete basis met koksmes, broodmes, santoku, universeel mes, schilmes en een stevige keukenschaar.',
    markerClassName: 'top-[22%] left-[40%]',
  },
  {
    id: 'tools' as const,
    title: '11 siliconen tools',
    body: 'Van spatel en pollepel tot garde en tang. Alle tools die je dagelijks gebruikt, in dezelfde rustige stijl.',
    markerClassName: 'top-[22%] right-[36%]',
  },
  {
    id: 'houder-snijplank' as const,
    title: 'Houder & snijplank',
    body: 'De houder houdt alles overzichtelijk op je aanrecht. De snijplank maakt de set direct functioneel en compleet.',
    markerClassName: 'bottom-[16%] left-1/2 -translate-x-1/2',
  },
] as const

type SetPartId = (typeof SET_PARTS)[number]['id']

const BENEFITS = [
  { icon: Palette,     title: 'Alles matcht visueel',          body: 'Eén kleur, één lijn. Rust op je aanrecht zonder extra moeite.' },
  { icon: ShieldCheck, title: 'Zacht voor je pannen',          body: 'Hittebestendig silicoen tot 230 °C. Geen krassen op anti-aanbak.' },
  { icon: Sparkles,    title: 'Gemaakt om gezien te worden',   body: 'De houder staat op je aanrecht — niet verstopt in een la.' },
]

const ALL_REVIEWS = [
  { text: 'Had ik dit maar eerder gedaan. Mijn aanrecht ziet er eindelijk rustig uit.', name: 'Fleur D.', color: 'Nude', rating: 5 },
  { text: 'Ziet er zoveel rustiger uit. Alle losse tools liggen nu eindelijk in één stijl.', name: 'Laura K.', color: 'Zwart', rating: 5 },
  { text: 'Gebruik het elke dag en het staat nog steeds prachtig. Top kwaliteit.', name: 'Sophie V.', color: 'Roze', rating: 5 },
  { text: 'Sinds we de set hebben, oogt ons aanrecht eindelijk rustig. Alles heeft een vaste plek.', name: 'Sanne M.', color: 'Zwart', rating: 5 },
  { text: 'De keukenset kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. De kwaliteit is precies wat je verwacht.', name: 'Marike B.', color: 'Roze', rating: 5 },
  { text: 'De prijs-kwaliteitverhouding is uitzonderlijk. De mintgroene set ziet er exact zo stijlvol uit als gehoopt.', name: 'Ludo V.', color: 'Mintgroen', rating: 5 },
  { text: 'Ik was bang dat het vooral mooi zou zijn, maar het werkt ook echt fijn in gebruik. Materiaal is top.', name: 'Nina K.', color: 'Nude', rating: 5 },
  { text: 'Elke ochtend word ik blij van mijn aanrecht. Eindelijk rust in de keuken.', name: 'Emma R.', color: 'Grijs', rating: 5 },
]
const REVIEW_LOOP = [...ALL_REVIEWS, ...ALL_REVIEWS]

const FAQS = [
  { id: 'q1', q: 'Welke kleur past bij mijn keuken?',   a: 'Warme tinten (hout, marmer, beige)? Kies nude. Moderne of donkere keuken? Zwart of grijs. Wil je een accent? Roze of mintgroen zijn subtiele keuzes die opvallen zonder te schreeuwen.' },
  { id: 'q2', q: 'Is de set ook echt functioneel?',      a: 'Beide. Het silicoen is hittebestendig tot 230 °C en BPA-vrij. De tools voelen prettig in de hand en zijn gemaakt voor dagelijks gebruik.' },
  { id: 'q3', q: 'Hoe snel wordt het geleverd?',         a: 'Bestel voor 23:30 uur op een werkdag en we verzenden dezelfde dag. Morgen in huis.' },
  { id: 'q4', q: 'Kan ik retourneren?',                  a: 'Ja, 14 dagen bedenktijd. Gratis retour als de set niet bij je keuken past.' },
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

export function KitchenSetStijlClient({ product }: Props) {
  const router  = useRouter()
  const { addItem } = useCart()

  const [adding, setAdding]   = useState(false)
  const [preview, setPreview] = useState<ProductColor>(defaultColor(product))
  const [activeSetPartId, setActiveSetPartId] = useState<SetPartId>('messen-schaar')
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)

  // Video mute states
  const [muted0, setMuted0] = useState(true)
  const [muted1, setMuted1] = useState(true)
  const [muted2, setMuted2] = useState(true)
  const vid0 = useRef<HTMLVideoElement>(null)
  const vid1 = useRef<HTMLVideoElement>(null)
  const vid2 = useRef<HTMLVideoElement>(null)

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

  const videoRefs  = [vid0, vid1, vid2]
  const mutedState = [muted0, muted1, muted2]

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((r) => setTimeout(r, 400))
    addItem({ ...product, title: `19-delige keukenset ${label(base).toLowerCase()}` }, base, 1)
    setAdding(false)
  }

  return (
    <div className="bg-[#F0EDE8] overflow-x-hidden">

      {/* ── S1 HERO — 50/50 ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        <div className="flex flex-col justify-center items-start px-12 md:px-20 lg:px-24 py-20 lg:py-0 order-2 lg:order-1">
          <h1
            className="font-sans font-bold text-dark leading-[1.03] mb-4"
            style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}
          >
            Jouw keuken.
            <br />
            <span
              className="font-normal italic"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.08em', color: '#A4744C' }}
            >
              Jouw stijl.
            </span>
          </h1>
          <p className="font-sans text-dark/55 text-base leading-relaxed mb-6 max-w-xs">
            Alles in één kleur. Eén lijn. Een keuken die er gewoon klopt.
          </p>
          <Button
            variant="accent"
            size="lg"
            className="mb-3"
            onClick={() => document.getElementById('kies-kleur')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ontdek jouw kleur
          </Button>
          <p className="text-[11px] font-sans text-dark/35 tracking-wide">
            Gratis verzending · Morgen in huis · 14 dagen retour
          </p>
        </div>

        <div className="relative min-h-[60vw] lg:min-h-0 order-1 lg:order-2">
          <Image
            src="/content/hero-19-delige-keukenset-stijl.webp"
            alt="Noctis keukenset lifestyle"
            fill
            priority
            loading="eager"
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* ── S3 EMOTIONAL HOOK ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 text-center">
        <p
          className="font-sans font-bold text-dark mb-1"
          style={{ fontSize: 'clamp(24px, 3vw, 44px)' }}
        >
          Je ziet het misschien niet meteen.
        </p>
        <p
          className="font-normal italic mb-2"
          style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(25px, 3.1vw, 45px)', color: '#A4744C' }}
        >
          Maar je voelt het wel.
        </p>
        <p
          className="font-sans text-dark/50"
          style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}
        >
          Een keuken klopt pas… als alles samenkomt.
        </p>
      </section>

      {/* ── S4 LIFESTYLE GRID — compact, hover zoom ──────────────────────────── */}
      <section className="px-4 md:px-8 max-w-4xl mx-auto space-y-2">
        <div className="flex gap-2">
          <div className="w-[62%] relative aspect-[4/5] rounded-[10px] overflow-hidden flex-shrink-0 group">
            <Image
              src={GALLERY_LARGE}
              alt="Noctis keukenset lifestyle"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="40vw"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {GALLERY_SMALLS.map((src) => (
              <div key={src} className="relative flex-1 rounded-[10px] overflow-hidden group">
                <Image
                  src={src}
                  alt="Detail keukenset"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="20vw"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {GALLERY_ROW.map((img) => (
            <div key={img.src} className="flex-1 relative aspect-square rounded-[10px] overflow-hidden group">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── S5 UGC VIDEO STRIP ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-content mb-8">
          <h2
            className="font-sans font-bold text-dark mb-2"
            style={{ fontSize: 'clamp(20px, 2.2vw, 32px)' }}
          >
            Wat mensen van de set vinden
          </h2>
          <p className="font-sans text-dark/45 text-sm">
            Bekijk hoe de set er bij anderen uitziet in gebruik.
          </p>
        </div>

        {/* Videos — small compact cards */}
        <div className="flex justify-center gap-3 px-4 md:px-8">
          {[vid0, vid1, vid2].map((ref, i) => {
            const v = [
              { src: '/videos/19-delige-set-pdp-video.webm', autoplay: true },
              { src: '/videos/nude-grab-set-comp.mp4',       autoplay: false },
              { src: '/videos/spatel-pan-grijs.mp4',         autoplay: false },
            ][i]
            const isMuted = mutedState[i]
            return (
              <div
                key={v.src}
                className="relative flex-shrink-0 w-[150px] md:w-[200px] aspect-[9/16] rounded-[12px] overflow-hidden bg-dark"
              >
                <video
                  ref={ref as React.RefObject<HTMLVideoElement>}
                  src={v.src}
                  className="absolute inset-0 h-full w-full object-cover brightness-90"
                  autoPlay={v.autoplay}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
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

      {/* ── S6 PRODUCT REVEAL — met wat zit erin tabs ────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="relative rounded-[20px] border border-[#E8E4DE] bg-[#F8F5F1] p-4">
            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[#F8F5F1]">
              <Image
                src="/content/transp-set-nude-website-banner.webp"
                alt="Alle 19 tools van de Noctis keukenset"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {SET_PARTS.map((part, index) => {
                const isActive = part.id === activeSetPartId
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActiveSetPartId(part.id)}
                    style={{ animationDelay: `${index * 180}ms` }}
                    className={cn(
                      'absolute z-10 h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-200 hotspot-bubble text-sm font-sans font-bold',
                      part.markerClassName,
                      isActive
                        ? 'border-accent bg-accent text-white shadow-[0_8px_20px_rgba(164,116,76,0.35)]'
                        : 'border-[#1F2937]/20 bg-[#1F2937] text-white hover:bg-[#111827]'
                    )}
                    aria-label={part.title}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <h2
              className="font-sans font-bold text-dark leading-tight mb-1"
              style={{ fontSize: 'clamp(24px, 2.8vw, 40px)' }}
            >
              Alles wat je nodig hebt.
            </h2>
            <p
              className="font-normal italic mb-3"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(22px, 2.6vw, 38px)', color: '#A4744C' }}
            >
              In één set.
            </p>
            <p className="font-sans text-dark/50 text-base leading-relaxed mb-5">
              Geen losse tools. Geen mismatch. Gewoon compleet.
            </p>

            {/* Numbered tabs */}
            <div className="space-y-2">
              {SET_PARTS.map((part, index) => {
                const isActive = part.id === activeSetPartId
                return (
                  <div
                    key={part.id}
                    className={cn(
                      'rounded-[14px] border px-4 py-3 transition-colors duration-200 cursor-pointer',
                      isActive ? 'border-accent/30 bg-accent/5' : 'border-[#E8E4DE] bg-white'
                    )}
                    onClick={() => setActiveSetPartId(part.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200',
                          isActive ? 'bg-accent text-white' : 'bg-[#F0EDE8] text-dark'
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className={cn('text-sm font-sans font-medium', isActive ? 'text-accent' : 'text-dark/85')}>
                        {part.title}
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-3 ml-10 text-sm font-sans text-dark/60 leading-relaxed">
                        {part.body}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── S7 BENEFITS — moderne cards ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="bg-white rounded-[18px] border border-[#E8E4DE] p-6 md:p-8">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="font-sans font-semibold text-dark text-base mb-2">{b.title}</h3>
                <p className="font-sans text-dark/55 text-sm leading-relaxed">{b.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── S8 COLOUR SHOWCASE + CTA ─────────────────────────────────────────── */}
      <section id="kies-kleur" className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">
              5 kleuren
            </p>
            <h2
              className="font-sans font-bold text-dark"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Kies de kleur die bij jou past
            </h2>
          </div>

          {/* Colour tab pills */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {product.colors.map((color) => {
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

          {/* Image + info */}
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

      {/* ── S9 SOCIAL PROOF — auto-scroll marquee ────────────────────────────── */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container-content mb-10 text-center">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">
            Beoordelingen
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

        {/* Marquee strip */}
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

        {/* Trustpilot CTA */}
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

      {/* ── S10 FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent text-center mb-10">
            Vragen
          </p>
          <Accordion.Root type="single" collapsible className="divide-y divide-[#EDEAE6]">
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

      {/* ── S11 FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 bg-[#EAE5DE]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="font-sans font-bold text-dark leading-none mb-1"
              style={{ fontSize: 'clamp(28px, 3.5vw, 50px)' }}
            >
              Een keuken die eindelijk
            </h2>
            <p
              className="font-normal italic mb-5"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(28px, 3.5vw, 52px)', color: '#A4744C' }}
            >
              gewoon klopt.
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
              alt="Noctis keukenset"
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
