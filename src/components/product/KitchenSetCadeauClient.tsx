'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ChevronRight, Gift, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { TESTIMONIALS, type Product, type ProductColor } from '@/lib/data'

const EXTRA_TESTIMONIALS = [
  {
    id: 'g1',
    name: 'Marike B.',
    rating: 5,
    text: 'De keukenset kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. De kwaliteit is precies wat je verwacht in deze prijsklasse. Alles voelt doordacht.',
    product: '19-delige keukenset in roze',
    date: 'Maart 2025',
  },
  {
    id: 'g2',
    name: 'Jessica L.',
    rating: 5,
    text: 'Cadeau gegeven als housewarming. Ze wilde meteen weten waar ik het vandaan had. De verpakking en kwaliteit maken het echt een premium ervaring.',
    product: '19-delige keukenset in nude',
    date: 'April 2026',
  },
  {
    id: 'g3',
    name: 'Els C.',
    rating: 5,
    text: 'Ik kocht de acacia snijplank als housewarming cadeau. Het oogde als een luxe item en de ontvanger kon de prijs bijna niet geloven.',
    product: 'Acacia snijplank',
    date: 'Januari 2025',
  },
  {
    id: 'g4',
    name: 'Mark T.',
    rating: 5,
    text: 'Voor mijn vriendin besteld als verjaardagscadeau. Ze was meteen enthousiast — zowel over het design als de kwaliteit. Aanrader!',
    product: '19-delige keukenset in zwart',
    date: 'Februari 2026',
  },
  {
    id: 'g5',
    name: 'Anne-Marie V.',
    rating: 5,
    text: 'Perfecte keuze voor iemand die van koken houdt maar nooit iets voor zichzelf koopt. Ze heeft hem meteen op het aanrecht gezet.',
    product: '19-delige keukenset in mintgroen',
    date: 'Maart 2026',
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

const OCCASIONS = [
  { emoji: '🎂', title: 'Verjaardag', desc: 'Een set die echt gebruikt wordt — niet weggelegd in een kast.' },
  { emoji: '🏡', title: 'Housewarming', desc: 'Het perfecte eerste cadeau voor een nieuwe keuken.' },
  { emoji: '💑', title: 'Jubileum', desc: 'Iets nuttigs, maar dan mooi. Voor een keuken die je samen deelt.' },
  { emoji: '🎓', title: 'Afstuderen', desc: 'Klaar voor de eerste eigen woning. Met een complete keuken.' },
]

const GIFT_REASONS = [
  { title: 'Premium verpakking', body: 'Geleverd in een strakke doos die direct cadeauwaardig is. Geen extra verpakking nodig.' },
  { title: 'Kies hun kleur', body: 'Van warm nude tot modern zwart — kies de kleur die past bij hun keuken en stijl.' },
  { title: 'Compleet & direct bruikbaar', body: 'Alle 19 tools die ze nodig hebben in één set. Geen losse aankopen meer.' },
  { title: 'Morgen al bezorgd', body: 'Bestel voor 23:30 uur en het is er morgen. Geen stress over levering.' },
]

const FAQS = [
  { id: 'q1', question: 'Is de set geschikt als cadeau?', answer: 'Absoluut. De set wordt geleverd in een strakke doos die direct cadeau-waardig oogt. Je hoeft hem alleen maar te overhandigen.' },
  { id: 'q2', question: 'Welke kleur moet ik kiezen?', answer: 'Voor de meeste keukens is zwart of nude het veiligst. Zwart past bij moderne stijlen, nude bij warme tinten. Weet je het niet zeker? Zwart is altijd goed.' },
  { id: 'q3', question: 'Kan ik ook een bon geven?', answer: 'Op dit moment bieden we geen digitale cadeaubonnen aan. Maar met 14 dagen retour kun je een kleur bestellen en ruilen als het toch niet past.' },
  { id: 'q4', question: 'Hoe snel wordt het geleverd?', answer: 'Bestel voor 23:30 uur en we verzenden dezelfde werkdag. In Nederland is de set er de volgende werkdag.' },
  { id: 'q5', question: 'Wat als de ontvanger al een set heeft?', answer: 'Dan kan hij of zij altijd een kleur kiezen die beter past bij de keuken. Met 14 dagen retour kun je ook gewoon ruilen.' },
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
    product.colors.find((c) => /black|zwart/.test(`${c.slug} ${c.name}`.toLowerCase())) ??
    product.colors[0]
  )
}

function getDeliveryLine(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1)
  const formatted = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(tomorrow)
  return `Voor 23:30 uur besteld, morgen (${formatted}) bezorgd`
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

export function KitchenSetCadeauClient({ product, upsellProducts }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)

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
      {/* Hero */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 text-xs font-sans font-semibold mb-6">
                <Gift size={14} />
                Perfect cadeau
              </div>
              <h1
                className="font-sans font-bold text-dark leading-tight mb-6"
                style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}
              >
                Het cadeau dat ze{' '}
                <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em' }}>
                  altijd wilden
                </span>
                <br />maar nooit kochten
              </h1>
              <p className="font-sans text-dark/75 text-lg leading-relaxed mb-8">
                Niet nog een kaars of een boekenbon. Geef iets dat echt gebruikt wordt — elke dag, in de keuken. Compleet, stijlvol en direct bruikbaar.
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
                  Bestel als cadeau
                </Button>
                <p className="flex items-center text-sm font-sans text-dark/60 gap-2">
                  <Truck size={14} /> Morgen in huis
                </p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden border border-border">
              <Image
                src="/images/pdp/kitchen-set-black/main.jpg"
                alt="19-delige Noctis keukenset — het perfecte cadeau"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discountPercentage && (
                <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-[#EFB74A] px-3 py-1 text-sm font-sans font-semibold text-dark">
                  {discountPercentage}% korting
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-surface section-py-sm">
        <div className="container-content">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2
              className="font-sans font-semibold text-dark leading-tight"
              style={{ fontSize: 'clamp(20px, 2.5vw, 34px)' }}
            >
              Perfect voor elke gelegenheid
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {OCCASIONS.map((o) => (
              <div key={o.title} className="bg-white rounded-[16px] border border-border p-5 text-center">
                <div className="text-3xl mb-3">{o.emoji}</div>
                <h3 className="font-sans font-semibold text-dark text-sm mb-1.5">{o.title}</h3>
                <p className="font-sans text-dark/60 text-xs leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it's a great gift */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-[24px] overflow-hidden border border-border">
              <Image
                src="/images/pdp/kitchen-set-black/lifestyle-new.webp"
                alt="Noctis keukenset als cadeau"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                Waarom dit cadeau werkt
              </p>
              <h2
                className="font-sans font-semibold text-dark leading-tight mb-8"
                style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
              >
                Niet weggooien. Niet vergeten.{' '}
                <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em' }}>
                  Elke dag gebruiken.
                </span>
              </h2>
              <div className="space-y-5">
                {GIFT_REASONS.map((r) => (
                  <div key={r.title} className="flex gap-4">
                    <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={15} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-dark text-sm mb-1">{r.title}</h3>
                      <p className="font-sans text-dark/65 text-sm leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buy box */}
      <section id="buy-box" className="bg-surface section-py">
        <div className="container-content">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2
              className="font-sans font-semibold text-dark"
              style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}
            >
              Kies de kleur. Bestel. Geef.
            </h2>
            <p className="mt-3 font-sans text-muted text-sm">
              Twijfel over de kleur? Zwart werkt altijd.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: '/images/pdp/kitchen-set-black/main.jpg', alt: '19-delige keukenset zwart' },
                { src: '/images/pdp/kitchen-set-nude/lifestyle-new.webp', alt: 'Keukenset lifestyle' },
                { src: '/images/pdp/kitchen-set-black/zwart-messen.webp', alt: 'Messen' },
                { src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp', alt: 'Tools' },
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

            {/* Sidebar */}
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
                {['19 tools in één complete set', 'Direct cadeau-waardig verpakt', 'Gratis verzending · morgen in huis'].map((item) => (
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
                  <h3 className="text-sm font-sans font-semibold text-dark">Maak het completer</h3>
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
                Bestel als cadeau — {formatPrice(totalCartValue)}
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

              <p className="text-xs font-sans text-center text-muted">
                Twijfel? 14 dagen retour, geen vragen gesteld.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="bg-light section-py overflow-hidden"
        onMouseEnter={() => setTestimonialsPaused(true)}
        onMouseLeave={() => setTestimonialsPaused(false)}
      >
        <div className="container-content mb-10 text-center">
          <h2 className="font-sans font-semibold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
            Anderen gingen je voor
          </h2>
          <p className="mt-2 font-sans text-muted text-sm">Wat mensen zeggen die de set cadeau gaven of kregen.</p>
        </div>
        <div className="relative -mx-4 md:-mx-8 lg:-mx-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-light to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-light to-transparent" />
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
      <section className="bg-surface section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">FAQ</p>
              <h2 className="font-sans font-bold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
                Vragen over het cadeau
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

      {/* Final CTA */}
      <section className="bg-dark section-py">
        <div className="container-content text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-2 text-xs font-sans font-semibold mb-6">
            <Gift size={14} />
            Morgen bezorgd
          </div>
          <h2
            className="font-sans font-bold text-light leading-tight mb-4"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
          >
            Maak{' '}
            <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', color: '#C9A882', fontSize: '1.1em' }}>
              indruk
            </span>
            {' '}met een cadeau dat blijft
          </h2>
          <p className="font-sans text-light/60 mb-8 text-base">
            Gratis verzending · Morgen in huis · 14 dagen retour
          </p>
          <Button
            variant="accent"
            size="xl"
            onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Bestel nu — {formatPrice(product.price)}
          </Button>
          <p className="text-xs font-sans text-light/35 mt-4">
            Meer dan 5.000 tevreden klanten gingen je voor.
          </p>
        </div>
      </section>
    </>
  )
}
