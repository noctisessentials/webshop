'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ChevronRight, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { TESTIMONIALS, type Product, type ProductColor } from '@/lib/data'

const EXTRA_TESTIMONIALS = [
  {
    id: 's1',
    name: 'Fleur D.',
    rating: 5,
    text: 'Mijn keuken zag er altijd iets rommelig uit, ook als alles schoon was. Na de nude set is dat voorbij. Het staat écht mooi.',
    product: '19-delige keukenset in nude',
    date: 'April 2026',
  },
  {
    id: 's2',
    name: 'Laura K.',
    rating: 5,
    text: 'De kleur nude paste perfect bij ons marmeren aanrecht. Ik had niet verwacht dat keukengerei zó veel verschil kan maken in je totaalplaatje.',
    product: '19-delige keukenset in nude',
    date: 'Maart 2026',
  },
  {
    id: 's3',
    name: 'Sophie V.',
    rating: 5,
    text: 'Ik had de roze versie besteld voor ons nieuwe huis. Elke keer dat gasten de keuken zien, krijg ik een compliment. Het oogt echt luxe.',
    product: '19-delige keukenset in roze',
    date: 'Februari 2026',
  },
  {
    id: 's4',
    name: 'Nina K.',
    rating: 5,
    text: 'Ik was bang dat het vooral mooi zou zijn, maar het werkt ook echt fijn in gebruik. Vooral de grip en het materiaal zijn top.',
    product: '19-delige keukenset in nude',
    date: 'Februari 2026',
  },
]

const ALL_TESTIMONIALS = [...TESTIMONIALS, ...EXTRA_TESTIMONIALS]
const ROW1 = [...ALL_TESTIMONIALS, ...ALL_TESTIMONIALS]
const ROW2 = [...ALL_TESTIMONIALS].reverse().concat([...ALL_TESTIMONIALS].reverse())

const DUTCH_COLOR_MAP: Record<string, string> = {
  black: 'Zwart', white: 'Wit', grey: 'Grijs', gray: 'Grijs', nude: 'Nude',
  pink: 'Roze', green: 'Groen', mint: 'Mintgroen', beige: 'Beige',
  zwart: 'Zwart', wit: 'Wit', grijs: 'Grijs', roze: 'Roze', groen: 'Groen', mintgroen: 'Mintgroen',
}

const COLOR_SHOWCASE = [
  { name: 'Nude', desc: 'Warm en tijdloos. Past bij hout, beige en marmer.', img: '/images/pdp/kitchen-set-nude/lifestyle.webp', hex: '#C8A98A' },
  { name: 'Zwart', desc: 'Strak en modern. Werkt in elke keuken.', img: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp', hex: '#1E1D1D' },
  { name: 'Grijs', desc: 'Rustig en veelzijdig. Combineert met alles.', img: '/images/pdp/kitchen-set-grey/lifestyle.webp', hex: '#8C8C8C' },
  { name: 'Roze', desc: 'Fris en vrouwelijk. Een subtiel accent.', img: '/images/pdp/kitchen-set-pink/lifestyle.webp', hex: '#D4A0A7' },
  { name: 'Mintgroen', desc: 'Fris en speels. Brengt leven in je keuken.', img: '/images/pdp/kitchen-set-mint/lifestyle.webp', hex: '#7FC4B4' },
]

const STYLE_REASONS = [
  { title: 'Eén lijn, één gevoel', body: 'Wanneer alle tools dezelfde kleur en vorm hebben, oogt je aanrecht direct rustiger — ook zonder verbouwing.' },
  { title: 'Zichtbaar mogen blijven', body: 'De Noctis houder is ontworpen om op het aanrecht te staan. Niet weggestopt, maar als stijlvol element in je keuken.' },
  { title: 'Jouw kleur, jouw keuken', body: '5 tijdloze kleuren, elk ontworpen om te passen bij moderne en klassieke keukenstijlen.' },
]

const FAQS = [
  { id: 'q1', question: 'Welke kleur past bij een lichte keuken?', answer: 'Nude en wit passen het best bij lichte keukens met warme tinten (hout, steen, marmer). Mintgroen en roze werken als fris accent. Zwart is het meest veelzijdig en werkt in elke keuken.' },
  { id: 'q2', question: 'Past de set bij Ikea-keukens?', answer: 'Absoluut. De neutrale tinten van de Noctis set zijn ontworpen om te combineren met de meeste standaard keukenstijlen, inclusief Ikea, NEXT125 en andere merken.' },
  { id: 'q3', question: 'Is de set ook functioneel of alleen mooi?', answer: 'Allebei. De tools zijn gemaakt van hittebestendig silicoen (tot 230°C), BPA-vrij en prettig in gebruik. Mooi én praktisch.' },
  { id: 'q4', question: 'Hoe snel wordt de set geleverd?', answer: 'Bestel voor 23:30 uur op een werkdag en we verzenden dezelfde dag. In Nederland is je bestelling er de volgende werkdag.' },
  { id: 'q5', question: 'Wat als ik twijfel over de kleur?', answer: 'Je hebt 14 dagen bedenktijd. Als de kleur toch niet past bij je keuken, stuur je gratis terug.' },
]

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13">
          <path
            d="M6.5 1l1.17 2.373L10.5 3.8 8.5 5.75l.47 2.737L6.5 7.25 4.03 8.487 4.5 5.75 2.5 3.8l2.83-.427L6.5 1z"
            fill={i < rating ? '#A4744C' : 'none'}
            stroke={i < rating ? '#A4744C' : '#D1C5BA'}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ review }: { review: typeof ALL_TESTIMONIALS[number] }) {
  const initials = review.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <article className="flex-shrink-0 w-[300px] md:w-[340px] mx-3 bg-white rounded-[18px] border border-border p-5">
      <div className="text-accent font-serif font-bold leading-none mb-3" style={{ fontSize: '40px', lineHeight: 1 }}>&ldquo;</div>
      <blockquote className="text-sm font-sans text-dark/85 leading-relaxed line-clamp-4">{review.text}</blockquote>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-sans font-semibold text-dark/70">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-sans font-semibold text-dark truncate">{review.name}</p>
          <p className="text-xs font-sans text-muted truncate">{review.product}</p>
        </div>
        <div className="ml-auto flex-shrink-0"><ReviewStars rating={review.rating} /></div>
      </div>
    </article>
  )
}

function getDutchColorName(color: ProductColor): string {
  return DUTCH_COLOR_MAP[color.slug.toLowerCase()] ?? DUTCH_COLOR_MAP[color.name.toLowerCase()] ?? color.name
}

function getSelectedColor(product: Product): ProductColor {
  return (
    product.colors.find((c) => c.wcSlug === product.handle) ??
    product.colors.find((c) => /nude|black|zwart/.test(`${c.slug} ${c.name}`.toLowerCase())) ??
    product.colors[0]
  )
}

function getDeliveryLine(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1)
  const formatted = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(tomorrow)
  return `Voor 23:30 uur besteld, morgen (${formatted}) in huis`
}

function getSavingsAmount(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0
  return product.compareAtPrice - product.price
}

function getDisplayName(product: Product): string {
  if (product.handle.includes('pepper-salt-mills')) return 'Peper- en zoutmolens zwart wit'
  if (product.handle.includes('acacia-cutting-board')) return 'Acacia snijplank'
  return product.title
}

type Props = { product: Product; upsellProducts: Product[] }

export function KitchenSetStijlClient({ product, upsellProducts }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)
  const [activeColor, setActiveColor] = useState(0)

  const selectedColor = getSelectedColor(product)
  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const sortedUpsells = [...upsellProducts].sort((a, b) =>
    a.handle.includes('pepper-salt-mills') ? -1 : b.handle.includes('pepper-salt-mills') ? 1 : 0
  )
  const selectedUpsells = sortedUpsells.filter((u) => selectedUpsellIds.includes(u.id))
  const totalCartValue = product.price + selectedUpsells.reduce((sum, u) => sum + u.price, 0)

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((r) => setTimeout(r, 450))
    const title = `19-delige keukenset ${getDutchColorName(selectedColor).toLowerCase()}`
    addItem({ ...product, title }, selectedColor, 1)
    for (const u of selectedUpsells) addItem(u, getSelectedColor(u), 1)
    setAdding(false)
  }

  const toggleUpsell = (id: string) =>
    setSelectedUpsellIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleColorSelect = (color: ProductColor) => {
    if (!color.inStock || !color.wcSlug || color.wcSlug === product.handle) return
    router.push(`/products/${color.wcSlug}`)
  }

  return (
    <>
      {/* Hero — full-width lifestyle */}
      <section className="relative bg-[#EEE7E1] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
          <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 lg:py-20">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-5">
              19-delige keukenset
            </p>
            <h1
              className="font-sans font-bold text-dark leading-tight mb-6"
              style={{ fontSize: 'clamp(28px, 3.5vw, 54px)' }}
            >
              Jouw keuken.{' '}
              <br />
              <span
                className="font-normal italic"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em', color: '#A4744C' }}
              >
                Jouw stijl.
              </span>
            </h1>
            <p className="font-sans text-dark/75 text-lg leading-relaxed mb-8 max-w-md">
              Alles in één kleur. Één lijn. Een keuken die er gewoon klopt — elke dag opnieuw.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[#A4744C] text-base">★</span>
                ))}
              </div>
              <p className="text-sm font-sans text-dark/70">4,5/5 · 32 beoordelingen</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="accent"
                size="xl"
                onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ontdek de kleuren
              </Button>
              <p className="flex items-center text-sm font-sans text-dark/60 gap-2">
                <Truck size={14} /> Gratis verzending
              </p>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src="/images/pdp/kitchen-set-nude/lifestyle-vrouw.webp"
              alt="Noctis 19-delige keukenset nude — stijlvol op het aanrecht"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Style reasons */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="font-sans font-semibold text-dark leading-tight"
              style={{ fontSize: 'clamp(22px, 2.5vw, 38px)' }}
            >
              Het kleine detail dat{' '}
              <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em' }}>
                alles verandert
              </span>
            </h2>
            <p className="mt-4 font-sans text-muted text-base leading-relaxed">
              Een keuken hoeft niet duur te zijn om er geweldig uit te zien. Het zit in consistentie.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STYLE_REASONS.map((r) => (
              <div key={r.title} className="bg-white rounded-[18px] border border-border p-7">
                <h3 className="font-sans font-semibold text-dark text-base mb-3">{r.title}</h3>
                <p className="font-sans text-dark/70 text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color showcase */}
      <section className="bg-surface section-py">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-3">5 kleuren</p>
            <h2
              className="font-sans font-semibold text-dark leading-tight"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Kies de kleur die bij jou past
            </h2>
          </div>

          {/* Color tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {COLOR_SHOWCASE.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActiveColor(i)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-colors duration-200',
                  activeColor === i ? 'border-dark bg-dark text-white' : 'border-border bg-white text-dark hover:border-dark/40'
                )}
              >
                <span className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>

          {/* Active color display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden border border-border bg-white">
              <Image
                src={COLOR_SHOWCASE[activeColor].img}
                alt={`19-delige keukenset in ${COLOR_SHOWCASE[activeColor].name}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-6 w-6 rounded-full" style={{ backgroundColor: COLOR_SHOWCASE[activeColor].hex }} />
                <h3 className="font-sans font-semibold text-dark text-xl">{COLOR_SHOWCASE[activeColor].name}</h3>
              </div>
              <p className="font-sans text-dark/75 text-base leading-relaxed mb-6">
                {COLOR_SHOWCASE[activeColor].desc}
              </p>
              <Button
                variant="accent"
                size="lg"
                onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Bekijk {COLOR_SHOWCASE[activeColor].name.toLowerCase()}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Buy box */}
      <section id="buy-box" className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: '/images/pdp/kitchen-set-nude/lifestyle.webp', alt: '19-delige keukenset lifestyle' },
                { src: '/images/pdp/kitchen-set-nude/lifestyle-vrouw.webp', alt: 'Keukenset lifestyle vrouw' },
                { src: '/images/pdp/kitchen-set-nude/messen.webp', alt: 'Messen uit de keukenset' },
                { src: '/images/pdp/kitchen-set-nude/pollepels.webp', alt: 'Tools uit de keukenset' },
              ].map((img, i) => (
                <div
                  key={img.src}
                  className={cn(
                    'relative rounded-[16px] overflow-hidden border border-border bg-white',
                    i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                  )}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 400px" />
                </div>
              ))}
            </div>

            {/* Info sidebar */}
            <aside className="rounded-[18px] border border-border bg-white p-5 md:p-6 space-y-4 lg:sticky lg:top-28 lg:h-fit">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < 4 ? 'text-[#16A34A]' : 'text-[#16A34A]/60'}`}>★</span>
                  ))}
                </div>
                <p className="text-xs font-sans text-dark">4,5/5 <span className="text-muted">· 32 beoordelingen</span></p>
              </div>

              <h2 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
                19-delige keukenset {getDutchColorName(selectedColor).toLowerCase()}
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-xl font-sans font-semibold text-dark">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm font-sans text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                {discountPercentage && (
                  <span className="inline-flex rounded-full bg-[#EFB74A] px-2.5 py-0.5 text-xs font-sans font-semibold text-dark">
                    {discountPercentage}% korting
                  </span>
                )}
              </div>

              <ul className="space-y-1.5 text-sm font-sans text-dark">
                {['19 tools in één stijl', 'Hittebestendig silicoen · BPA-vrij', '5 tijdloze kleuren beschikbaar'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#16A34A] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-sans text-muted">Kleur: <span className="font-semibold text-dark">{getDutchColorName(selectedColor)}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.slug}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        disabled={!color.inStock}
                        title={getDutchColorName(color)}
                        className={cn(
                          'relative h-8 w-8 rounded-full border-2 transition-all duration-200',
                          selectedColor.slug === color.slug ? 'border-dark scale-110' : 'border-transparent hover:border-dark/30',
                          !color.inStock && 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        <span className="block h-5 w-5 rounded-full mx-auto" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sortedUpsells.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-sans font-semibold text-dark">Populaire add-ons</h3>
                  {sortedUpsells.map((upsell) => {
                    const isSelected = selectedUpsellIds.includes(upsell.id)
                    const savings = getSavingsAmount(upsell)
                    return (
                      <div
                        key={upsell.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => toggleUpsell(upsell.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleUpsell(upsell.id) } }}
                        className={cn(
                          'w-full rounded-xl border p-3 text-left transition-colors duration-200 cursor-pointer',
                          isSelected ? 'border-[#8AC5FF] bg-[#F7FBFF]' : 'border-border bg-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn('h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0', isSelected ? 'border-[#56A5F8] bg-[#EAF4FF]' : 'border-border')}>
                            {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#56A5F8]" />}
                          </span>
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-surface flex-shrink-0">
                            <Image src={upsell.images[0]?.src ?? '/images/products/acacia.jpg'} alt={getDisplayName(upsell)} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-sans font-semibold text-dark">{getDisplayName(upsell)}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-sans font-semibold text-dark">{formatPrice(upsell.price)}</span>
                              {upsell.compareAtPrice && upsell.compareAtPrice > upsell.price && (
                                <span className="text-xs font-sans text-muted line-through">{formatPrice(upsell.compareAtPrice)}</span>
                              )}
                            </div>
                          </div>
                          {savings > 0 && (
                            <span className="text-xs font-sans font-semibold text-dark bg-[#CDEBFF] rounded-full px-2 py-0.5 flex-shrink-0">
                              -{formatPrice(savings)}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); router.push(`/products/${upsell.handle}`) }}
                            className="h-7 w-7 rounded-full border border-border flex items-center justify-center flex-shrink-0"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <Button variant="accent" size="xl" fullWidth loading={adding} onClick={handleAddToCart}>
                In winkelwagen — {formatPrice(totalCartValue)}
              </Button>

              <div className="border-y border-border py-4 space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-dark">
                  <Truck size={14} className="text-muted flex-shrink-0" />
                  <span suppressHydrationWarning>{getDeliveryLine()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark">
                  <ShieldCheck size={14} className="text-muted flex-shrink-0" />
                  <span>Gratis verzending &amp; 14 dagen retour</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark">
                  <span className="inline-flex rounded bg-[#FFB5CF] px-1.5 py-0.5 text-[10px] font-sans font-semibold text-dark">Klarna</span>
                  Betaal in 3 delen van {formatPrice(totalCartValue / 3)} +
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Testimonials marquee */}
      <section
        className="bg-surface section-py overflow-hidden"
        onMouseEnter={() => setTestimonialsPaused(true)}
        onMouseLeave={() => setTestimonialsPaused(false)}
      >
        <div className="container-content mb-10 text-center">
          <Image
            src="/content/trustpilot-logo-sml.png.webp"
            alt="Trustpilot"
            width={180}
            height={38}
            className="mx-auto mb-4 h-10 w-auto"
          />
          <h2 className="font-sans font-semibold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
            Klanten die al voor je gingen
          </h2>
        </div>
        <div className="relative -mx-4 md:-mx-8 lg:-mx-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />
          <div className="overflow-hidden mb-4">
            <div className="marquee-track" style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}>
              {ROW1.map((r, i) => <TestimonialCard key={`r1-${i}`} review={r} />)}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="marquee-track-reverse" style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}>
              {ROW2.map((r, i) => <TestimonialCard key={`r2-${i}`} review={r} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">FAQ</p>
              <h2 className="font-sans font-bold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
                Veelgestelde vragen
              </h2>
            </div>
            <Accordion.Root type="single" collapsible className="lg:col-span-2 divide-y divide-border">
              {FAQS.map((faq) => (
                <Accordion.Item key={faq.id} value={faq.id} className="group">
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-sm text-dark hover:text-accent transition-colors duration-200 cursor-pointer">
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 text-muted">
                      <Plus size={18} className="group-data-[state=open]:hidden" />
                      <Minus size={18} className="hidden group-data-[state=open]:block" />
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="accordion-content overflow-hidden">
                    <p className="font-sans text-muted text-sm leading-relaxed pb-5 max-w-2xl">{faq.answer}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#EEE7E1] section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                className="font-sans font-bold text-dark leading-tight mb-4"
                style={{ fontSize: 'clamp(24px, 3vw, 42px)' }}
              >
                Een keuken die er{' '}
                <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em' }}>
                  gewoon klopt
                </span>
              </h2>
              <p className="font-sans text-dark/70 text-base leading-relaxed mb-6">
                Kies jouw kleur. Gratis verzending. Morgen in huis.
              </p>
              <Button
                variant="accent"
                size="xl"
                onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Bestel nu — {formatPrice(product.price)}
              </Button>
              <p className="text-xs font-sans text-dark/40 mt-3">14 dagen retour · 5.000+ tevreden klanten</p>
            </div>
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden border border-border">
              <Image
                src="/images/pdp/kitchen-set-nude/lifestyle.webp"
                alt="Noctis keukenset stijlvol op het aanrecht"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
