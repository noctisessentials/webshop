'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ChevronRight, Minus, Plus, ShieldCheck, Truck, X } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { TESTIMONIALS, type Product, type ProductColor } from '@/lib/data'

const EXTRA_TESTIMONIALS = [
  {
    id: 'f1',
    name: 'Kevin R.',
    rating: 5,
    text: 'Eindelijk een keuken zonder rommelige mix van spullen. Alles zit in de houder, alles past bij elkaar. Koken voelt gewoon rustiger.',
    product: '19-delige keukenset in zwart',
    date: 'April 2026',
  },
  {
    id: 'f2',
    name: 'Daniëlle S.',
    rating: 5,
    text: 'We hadden tools van 6 verschillende merken. Na deze set is dat voorbij. Alles past bij elkaar en het staat geweldig.',
    product: '19-delige keukenset in nude',
    date: 'Maart 2026',
  },
  {
    id: 'f3',
    name: 'Thomas W.',
    rating: 5,
    text: 'Ik dacht dat het overdreven was om zoveel tools in één set te kopen. Maar nu ik hem heb, snap ik het helemaal. Compleet en praktisch.',
    product: '19-delige keukenset in grijs',
    date: 'Februari 2026',
  },
  {
    id: 'f4',
    name: 'Sanne M.',
    rating: 5,
    text: 'Sinds we de set hebben, oogt ons aanrecht eindelijk rustig. Alles heeft een vaste plek en dat scheelt elke dag tijd.',
    product: '19-delige keukenset in zwart',
    date: 'April 2026',
  },
  {
    id: 'f5',
    name: 'Rachid A.',
    rating: 5,
    text: 'De peper- en zoutmolens samen met de set besteld. Kwaliteit voelt premium en het staat echt mooi in onze open keuken.',
    product: 'Peper- en zoutmolens zwart wit',
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

const PAIN_POINTS = [
  {
    icon: '🎨',
    title: 'Losse tools, losse kleuren',
    body: 'Een spatel van IKEA, een pollepel van Blokker, messen van een ander merk. Het werkblad ziet er rommelig uit, ook als het opgeruimd is.',
  },
  {
    icon: '🔍',
    title: 'Elke keer zoeken',
    body: 'Waar is de tang ook alweer? De garde ligt ergens los in een la. Koken duurt langer dan het moet omdat je tools niet op een vaste plek staan.',
  },
  {
    icon: '🔄',
    title: 'Steeds iets nieuws kopen',
    body: 'Weer een nieuwe spatel. Maar hij past niet bij de rest. Je stapelt tools op zonder dat het ooit een geheel wordt.',
  },
]

const BENEFITS = [
  { title: '19 tools in 1 aankoop', body: 'Van spatels tot messen: alles wat je dagelijks nodig hebt, in één keer geregeld.' },
  { title: 'Veilig voor pannen', body: 'Hittebestendig silicoen tot 230 °C. Geen krassen op je anti-aanbakpannen.' },
  { title: 'Kies jouw kleur', body: 'Verkrijgbaar in 5 tijdloze kleuren: zwart, nude, grijs, roze en mintgroen.' },
  { title: 'BPA-vrij & hygiënisch', body: 'Voedselzeker silicoen en roestvrij staal. Makkelijk schoon te maken.' },
  { title: 'Gratis levering', body: 'Gratis verzending. Besteld voor 23:30 uur? Morgen al in huis.' },
  { title: '14 dagen retour', body: 'Niet tevreden? Stuur gratis terug. Geen vragen, geen gedoe.' },
]

const FAQS = [
  { id: 'q1', question: 'Wat zit er precies in de set?', answer: 'De set bevat 19 tools: Noctis Houder, Spatel, Pastalepel, Bakspatel, Slabestek, Opscheplepel, Soeplepel, Platte spatel, Pannenlikker, Tang, Garde, Oliekwast, Snijmes, Broodmes, Chef\'s mes, Universeelmes, Fruitmes, Keukenschaar en een snijplank. Alles voor dagelijks koken, in één stijl.' },
  { id: 'q2', question: 'Is de set vaatwasserbestendig?', answer: 'Voor langdurige kwaliteit adviseren we handwas. Vermijd ruwe schuurmiddelen en de vaatwasser, die kunnen het silicoen en hout beïnvloeden.' },
  { id: 'q3', question: 'Welke kleur past het best bij mijn keuken?', answer: 'Heb je warme tinten (beige, hout, steen)? Dan past nude of zwart goed. Koelere keukens? Grijs of mintgroen. Wil je een frisse look? Roze is een subtiel accent zonder te opdringerig te zijn.' },
  { id: 'q4', question: 'Hoe snel wordt de set geleverd?', answer: 'Bestel voor 23:30 uur op een werkdag en we verzenden dezelfde dag. In Nederland is je bestelling er de volgende werkdag.' },
  { id: 'q5', question: 'Kan ik retourneren als het niet bevalt?', answer: 'Ja, je hebt 14 dagen bedenktijd na ontvangst. Retour aanmelden doe je eenvoudig via onze klantenservice.' },
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

export function KitchenSetFunctioneelClient({ product, upsellProducts }: Props) {
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
      {/* Hero — problem recognition */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                19-delige keukenset
              </p>
              <h1
                className="font-sans font-bold text-dark leading-tight mb-6"
                style={{ fontSize: 'clamp(30px, 3.5vw, 52px)' }}
              >
                Nooit meer tools die{' '}
                <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em' }}>
                  niet bij elkaar passen
                </span>
              </h1>
              <p className="font-sans text-dark/80 text-lg leading-relaxed mb-8">
                De meeste keukens hebben genoeg tools. Maar ze staan vol met spullen van verschillende merken, in allerlei kleuren. Het resultaat? Altijd rommelig, ook als je net opgeruimd hebt.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#A4744C] text-base">★</span>
                  ))}
                </div>
                <p className="text-sm font-sans text-dark">4,5/5 · 32 beoordelingen</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="accent"
                  size="xl"
                  onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Bekijk de set
                </Button>
                <span className="flex items-center text-sm font-sans text-muted gap-2">
                  <Truck size={15} /> Gratis verzending · morgen in huis
                </span>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden border border-border">
              <Image
                src="/images/pdp/kitchen-set-black/main.jpg"
                alt="19-delige keukenset zwart van Noctis"
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

      {/* Pain points */}
      <section className="bg-surface section-py-sm">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              className="font-sans font-semibold text-dark leading-tight"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Herken je dit?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAIN_POINTS.map((point) => (
              <div key={point.title} className="bg-white rounded-[18px] border border-border p-6">
                <div className="text-3xl mb-4">{point.icon}</div>
                <h3 className="font-sans font-semibold text-dark text-base mb-2">{point.title}</h3>
                <p className="font-sans text-dark/70 text-sm leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution reveal */}
      <section className="bg-dark section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                De oplossing
              </p>
              <h2
                className="font-sans font-bold text-light leading-tight mb-6"
                style={{ fontSize: 'clamp(24px, 3vw, 42px)' }}
              >
                Één set.{' '}
                <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1em', color: '#C9A882' }}>
                  Alles past.
                </span>
              </h2>
              <p className="font-sans text-light/70 text-base leading-relaxed mb-6">
                De Noctis 19-delige keukenset bevat alles wat je dagelijks nodig hebt — in één stijl, één kleur, één compleet geheel. Geen losse aankopen meer. Geen mismatch. Gewoon een keuken die werkt én er goed uitziet.
              </p>
              <ul className="space-y-3">
                {[
                  '19 tools in één complete set',
                  'Hittebestendig silicoen — veilig voor je pannen',
                  'Verkrijgbaar in 5 tijdloze kleuren',
                  'BPA-vrij en makkelijk schoon te maken',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-sans text-light/85">
                    <Check size={15} className="text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[24px] aspect-square">
              <video
                src="/videos/nude-grab-set-comp.mp4"
                className="h-full w-full object-cover"
                autoPlay loop muted playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <h2
              className="font-sans font-semibold text-dark leading-tight"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
            >
              Waarom de Noctis set?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-[16px] border border-border p-6">
                <Check size={18} className="text-accent mb-3" />
                <h3 className="font-sans font-semibold text-dark text-base mb-1">{b.title}</h3>
                <p className="font-sans text-dark/70 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy box */}
      <section id="buy-box" className="bg-surface section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: '/images/pdp/kitchen-set-black/main.jpg', alt: '19-delige keukenset zwart' },
                { src: '/images/pdp/kitchen-set-black/lifestyle-new.webp', alt: 'Lifestyle - keukenset in gebruik' },
                { src: '/images/pdp/kitchen-set-black/zwart-messen.webp', alt: 'Messen uit de keukenset' },
                { src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp', alt: 'Tools uit de keukenset' },
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

              <h2 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
                19-delige keukenset {getDutchColorName(selectedColor).toLowerCase()}
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-xl font-sans font-semibold text-dark">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm font-sans text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                {discountPercentage && (
                  <span className="inline-flex items-center rounded-full bg-[#EFB74A] px-2.5 py-0.5 text-xs font-sans font-semibold text-dark">
                    {discountPercentage}% korting
                  </span>
                )}
              </div>

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

      {/* Social proof strip */}
      <section className="bg-dark py-8">
        <div className="container-content">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { stat: '5.000+', label: 'tevreden klanten' },
              { stat: '4,5/5', label: 'gemiddelde beoordeling' },
              { stat: '19', label: 'tools in één set' },
            ].map((item) => (
              <div key={item.stat}>
                <p className="font-sans font-bold text-light" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>{item.stat}</p>
                <p className="text-xs font-sans text-light/50 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials marquee */}
      <section
        className="bg-light section-py overflow-hidden"
        onMouseEnter={() => setTestimonialsPaused(true)}
        onMouseLeave={() => setTestimonialsPaused(false)}
      >
        <div className="container-content mb-10 text-center">
          <h2 className="font-sans font-semibold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
            Wat klanten zeggen
          </h2>
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
                Veelgestelde vragen
              </h2>
              <p className="font-sans text-muted text-sm mt-3 leading-relaxed">
                Alles wat je wil weten over de 19-delige keukenset.
              </p>
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
      <section className="bg-dark section-py">
        <div className="container-content text-center max-w-2xl mx-auto">
          <h2
            className="font-sans font-bold text-light leading-tight mb-4"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
          >
            Klaar voor een keuken{' '}
            <span className="italic font-normal" style={{ fontFamily: 'var(--font-cormorant)', color: '#C9A882', fontSize: '1.1em' }}>
              die klopt?
            </span>
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
