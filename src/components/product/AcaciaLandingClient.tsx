'use client'

import { useState, useRef, type ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as Accordion from '@radix-ui/react-accordion'
import { Check, ChevronRight, Leaf, Minus, Package, Plus, Ruler, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { type Product, type ProductColor } from '@/lib/data'

type AcaciaLandingClientProps = {
  product: Product
  upsellProducts: Product[]
}

const ACACIA_FAQS = [
  {
    id: 'material',
    question: 'Waarvan is de snijplank gemaakt?',
    answer:
      'Elke snijplank is gemaakt van hoogwaardig massief acaciahout, dat garant staat voor een lange levensduur en natuurlijke antibacteriële eigenschappen.',
  },
  {
    id: 'dishwasher',
    question: 'Zijn de snijplanken vaatwasserbestendig?',
    answer:
      'Om de kwaliteit en uitstraling te behouden, raden we aan om met de hand af te wassen. Vermijd langdurig weken en gebruik van de vaatwasser.',
  },
  {
    id: 'knife-safe',
    question: 'Beschadigen deze planken mijn messen?',
    answer:
      'Nee! Acacia is zacht voor de snijkanten van messen, waardoor het een uitstekende keuze is voor het scherp houden van messen.',
  },
  {
    id: 'liquids',
    question: 'Absorberen de snijplanken vloeistoffen?',
    answer:
      'Het hout is van nature vochtbestendig en de diepe groeven zorgen ervoor dat sappen worden opgevangen. Ideaal voor het snijden van vlees of sappig fruit.',
  },
  {
    id: 'care',
    question: 'Hoe maak ik ze schoon en verzorg ik ze?',
    answer:
      'Reinigen met milde zeep en warm water. Voor een langere levensduur regelmatig minerale olie van voedingskwaliteit aanbrengen.',
  },
  {
    id: 'dimensions',
    question: 'Wat zijn de afmetingen van de borden?',
    answer: '• Groot: 38 × 28 cm\n• Middelgroot: 33 × 23 cm\n• Klein: 28 × 20 cm',
  },
  {
    id: 'in-box',
    question: 'Wat zit er in de doos?',
    answer: 'U ontvangt 3 snijplanken en 1 houder van acaciahout, klaar om te gebruiken of cadeau te geven.',
  },
] as const

const ACACIA_STORY_SECTIONS = [
  {
    id: 'sizes',
    title: 'Drie maten, één stijlvolle oplossing',
    body:
      'Deze 3-delige snijplankenset is gemaakt van eersteklas acaciahout en biedt de perfecte maat voor elke voorbereidingstaak - van het snijden van fruit tot het serveren van snacks. De set is voorzien van een strakke gouden houder, zodat je keuken er georganiseerd en moeiteloos elegant uitziet.',
    image: '/content/acacia-snijplank-maten.jpg',
    imageAlt: 'Afmetingen van de Noctis acacia snijplankenset',
    reverse: false,
  },
  {
    id: 'functional',
    title: 'Functioneel, stijlvol en duurzaam',
    body:
      'Ontworpen voor meer dan alleen snijden - gebruik ze om je gerechten te serveren, presenteren of stijlvol te stylen. De warme tinten van acaciahout en de gladde afwerking maken dit een onmisbaar accessoire voor zowel koken als feesten.',
    image: '/content/acacia-snijplank-lifestyle-2.jpg',
    imageAlt: 'Acacia snijplanken in gebruik op keukenblad',
    reverse: true,
  },
] as const

type AcaciaFeature = {
  id: string
  title: string
  body: string
  icon: ComponentType<{ size?: string | number; className?: string }>
}

const LEFT_FEATURES: AcaciaFeature[] = [
  {
    id: 'solid-wood',
    title: 'Massief acaciahout',
    body: 'Gemaakt van eersteklas acaciahout, bekend om zijn duurzaamheid, rijke kleur en natuurlijke weerstand tegen vocht.',
    icon: Leaf,
  },
  {
    id: 'three-sizes',
    title: '3 perfecte maten',
    body: 'Grote, middelgrote en kleine snijplanken, elk ontworpen voor een andere voorbereidingstaak, van brood tot vlees.',
    icon: Ruler,
  },
  {
    id: 'easy-clean',
    title: 'Gemakkelijk schoon te maken en te onderhouden',
    body: 'Natuurlijk hygiënisch en onderhoudsarm. Gewoon met de hand wassen en behandelen met olie voor langdurige schoonheid.',
    icon: ShieldCheck,
  },
]

const RIGHT_FEATURES: AcaciaFeature[] = [
  {
    id: 'knife-friendly',
    title: 'Mesvriendelijk oppervlak',
    body: 'Zacht voor de messen: u hoeft uw favoriete messen niet meer bot te maken op plastic of glazen snijplanken.',
    icon: Check,
  },
  {
    id: 'anti-slip',
    title: 'Antislip siliconen pads',
    body: 'Ingebouwde handgrepen aan de onderkant zorgen ervoor dat de plank stevig op zijn plaats blijft tijdens het snijden, dobbelstenen of hakken.',
    icon: Package,
  },
  {
    id: 'stylish-storage',
    title: 'Sta voor stijlvolle opslag',
    body: 'Inclusief moderne houten houder om uw snijplanken netjes op te bergen en stijlvol te presenteren op het aanrecht.',
    icon: Plus,
  },
]

const ACACIA_PDP_TESTIMONIALS = [
  {
    id: 'a-1',
    name: 'Lisa V.',
    rating: 5,
    text: 'Prachtige planken. De houder is heel handig en de set ziet er veel duurder uit dan de prijs doet vermoeden.',
    product: 'Acacia snijplank set',
    date: 'April 2026',
  },
  {
    id: 'a-2',
    name: 'Tom B.',
    rating: 5,
    text: 'De drie maten zijn echt ideaal. Voor elk snijwerk pak je automatisch de juiste plank.',
    product: 'Acacia snijplank set',
    date: 'Maart 2026',
  },
  {
    id: 'a-3',
    name: 'Chantal D.',
    rating: 5,
    text: 'Al maanden in gebruik en nog steeds mooi vlak. Ook fijn dat mijn messen scherp blijven.',
    product: 'Acacia snijplank set',
    date: 'Februari 2026',
  },
  {
    id: 'a-4',
    name: 'Rens H.',
    rating: 5,
    text: 'De sapgroef werkt goed bij vlees en fruit, geen nat aanrecht meer. Kwaliteit van het hout is top.',
    product: 'Acacia snijplank set',
    date: 'Januari 2026',
  },
  {
    id: 'a-5',
    name: 'Marleen C.',
    rating: 5,
    text: 'Staat prachtig op het aanrecht en is tegelijk super praktisch. We gebruiken de middelste plank het vaakst.',
    product: 'Acacia snijplank set',
    date: 'December 2025',
  },
  {
    id: 'a-6',
    name: 'Jordi K.',
    rating: 5,
    text: 'Voor het eerst een houten set gekocht en geen seconde spijt. Robuust, netjes afgewerkt en makkelijk schoon te houden.',
    product: 'Acacia snijplank set',
    date: 'November 2025',
  },
] as const

const ACACIA_ROW1_LOOP = [...ACACIA_PDP_TESTIMONIALS, ...ACACIA_PDP_TESTIMONIALS]
const ACACIA_ROW2_LOOP = [...[...ACACIA_PDP_TESTIMONIALS].reverse(), ...[...ACACIA_PDP_TESTIMONIALS].reverse()]

const ACACIA_INFO_ROWS = [
  {
    id: 'description',
    title: 'Beschrijving',
    body:
      'Upgrade je kookervaring met de Noctis set van 3 massief acaciahouten snijplanken. Perfect formaat voor elke voorbereidingstaak, voorzien van diepe sapgroeven, antislipnoppen en een moderne standaard voor stijlvolle organisatie. Deze planken zijn gemaakt van duurzaam geproduceerd acaciahout en zijn niet alleen van nature mooi, maar ook zeer duurzaam en vriendelijk voor je messen.\n\nOf u nu groenten snijdt, vlees trancheert of hapjes serveert: met deze set kunt u het allemaal.',
  },
  {
    id: 'details',
    title: 'Productdetails',
    body:
      'Kleur: Natuurlijk acaciahout\nMateriaal: Acaciahout\nSet bevat: 3 snijplanken + houten standaard\nAfmetingen: Groot 38 × 28 cm · Middelgroot 33 × 23 cm · Klein 28 × 20 cm',
  },
] as const

function getSelectedColor(product: Product): ProductColor {
  return product.colors.find((color) => color.wcSlug === product.handle) ?? product.colors[0]
}

function getDeliveryLine(referenceDate: Date): string {
  const deliveryDate = new Date(referenceDate)
  deliveryDate.setDate(deliveryDate.getDate() + 1)

  let dayLabel = 'morgen'
  if (deliveryDate.getDay() === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1)
    dayLabel = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' }).format(deliveryDate)
  }

  const formattedDate = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
  }).format(deliveryDate)

  return `Voor 23:30 uur besteld, ${dayLabel} (${formattedDate}) in huis`
}

function getDisplayName(product: Product): string {
  if (product.handle.includes('19-piece-kitchenware')) return '19-delige keukenset'
  if (product.handle.includes('pepper-salt-mills')) return 'Peper- en zoutmolens'
  if (product.handle.includes('acacia-cutting-board')) return 'Acacia snijplank'
  return product.title
}

function getSavingsAmount(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0
  return product.compareAtPrice - product.price
}

function getAcaciaGalleryImages(product: Product): { src: string; alt: string }[] {
  const baseImage = product.images[0]?.src ?? '/images/products/acacia.jpg'
  const secondImage = '/content/acacia-snijplank-lifestyle-1-800x1067.webp'
  return [
    { src: baseImage, alt: 'Acacia snijplank productfoto' },
    { src: secondImage, alt: 'Acacia snijplank lifestyle foto' },
  ]
}

function FeatureItem({ feature }: { feature: AcaciaFeature }) {
  const Icon = feature.icon
  return (
    <div className="bg-white rounded-[16px] border border-border p-6 flex flex-col gap-4">
      <span className="inline-flex h-10 w-10 items-center justify-center text-accent">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="font-sans font-semibold text-dark text-base leading-tight">{feature.title}</h3>
        <p className="mt-2 font-sans text-dark/70 text-sm leading-relaxed">{feature.body}</p>
      </div>
    </div>
  )
}

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

function AcaciaTestimonialCard({ review }: { review: (typeof ACACIA_PDP_TESTIMONIALS)[number] }) {
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

export function AcaciaLandingClient({ product, upsellProducts }: AcaciaLandingClientProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const touchStartXRef = useRef<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [openInfoRow, setOpenInfoRow] = useState<
    (typeof ACACIA_INFO_ROWS)[number]['id'] | ''
  >(ACACIA_INFO_ROWS[0].id)
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)

  const selectedColor = getSelectedColor(product)
  const galleryImages = getAcaciaGalleryImages(product)
  const activeGalleryImage = galleryImages[activeImageIndex] ?? galleryImages[0]

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const selectedUpsells = upsellProducts.filter((item) => selectedUpsellIds.includes(item.id))
  const selectedUpsellsTotal = selectedUpsells.reduce((sum, item) => sum + item.price, 0)
  const totalCartValue = product.price + selectedUpsellsTotal
  const klarnaSplit = totalCartValue / 3
  const deliveryLine = getDeliveryLine(new Date())

  const handleColorSelect = (color: ProductColor) => {
    if (!color.inStock || !color.wcSlug || color.wcSlug === product.handle) return
    router.push(`/products/${color.wcSlug}`)
  }

  const toggleUpsell = (upsellId: string) => {
    setSelectedUpsellIds((prev) =>
      prev.includes(upsellId) ? prev.filter((id) => id !== upsellId) : [...prev, upsellId]
    )
  }

  const handleUpsellNavigate = (upsellHandle: string) => {
    router.push(`/products/${upsellHandle}`)
  }

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 450))
    addItem({ ...product, title: 'Acacia snijplank' }, selectedColor, 1)
    for (const upsell of selectedUpsells) {
      const upsellColor = getSelectedColor(upsell)
      addItem(upsell, upsellColor, 1)
    }
    setAdding(false)
  }

  return (
    <>
      <section className="section-py bg-light">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 xl:gap-14 items-start">
            <div className="flex gap-4 lg:sticky lg:top-28 lg:h-fit self-start">
              <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.src}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'relative aspect-[3/4] rounded-lg overflow-hidden border transition-colors duration-200',
                      activeImageIndex === index ? 'border-dark' : 'border-border hover:border-dark/40'
                    )}
                    aria-label={image.alt}
                  >
                    <Image src={image.src} alt={image.alt} fill quality={95} className="object-cover object-center" sizes="80px" />
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <div
                  className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-border bg-white"
                  onTouchStart={(e) => { touchStartXRef.current = e.touches[0].clientX }}
                  onTouchEnd={(e) => {
                    if (touchStartXRef.current === null) return
                    const delta = touchStartXRef.current - e.changedTouches[0].clientX
                    if (Math.abs(delta) > 40) {
                      if (delta > 0) setActiveImageIndex((i) => Math.min(i + 1, galleryImages.length - 1))
                      else setActiveImageIndex((i) => Math.max(i - 1, 0))
                    }
                    touchStartXRef.current = null
                  }}
                >
                  <Image
                    src={activeGalleryImage.src}
                    alt={activeGalleryImage.alt}
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                      {galleryImages.map((_, i) => (
                        <div key={i} className={cn('h-1.5 rounded-full transition-all duration-200', i === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50')} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image.src}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        'relative w-14 h-[74px] rounded-md overflow-hidden border flex-shrink-0 transition-colors duration-200',
                        activeImageIndex === index ? 'border-dark' : 'border-border'
                      )}
                      aria-label={image.alt}
                    >
                      <Image src={image.src} alt={image.alt} fill quality={95} className="object-cover object-center" sizes="56px" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="self-start rounded-[18px] border border-border bg-white p-5 md:p-6 space-y-4">
              <a
                href="https://www.trustpilot.com/review/noctisessentials.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image src="/content/stars-4.5.svg" alt="4.4 sterren op Trustpilot" width={96} height={18} className="h-[18px] w-auto" />
                <p className="text-xs font-sans text-dark">
                  4,4/5 <span className="text-muted">Gebaseerd op 37 reviews</span>
                </p>
              </a>

              <h1 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
                Acacia snijplank
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-lg font-sans font-semibold text-dark">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm font-sans text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                {discountPercentage && (
                  <span className="inline-flex items-center rounded-full bg-[#EFB74A] px-3 py-1 text-sm font-sans font-semibold text-dark">
                    {discountPercentage}% korting
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-sm font-sans text-dark">
                {[
                  'Massief acaciahout van hoge kwaliteit',
                  '3 snijplanken + stijlvolle houder',
                  'Mesvriendelijk oppervlak met sapgroeven',
                  'Antislip en gemaakt voor dagelijks gebruik',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} className="text-[#16A34A] mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {discountPercentage && (
                <div className="rounded-xl bg-[#F4C657] px-4 py-3">
                  <p className="text-sm font-sans font-semibold text-dark">Tijdelijke deal</p>
                  <p className="text-base font-sans text-dark">Profiteer nu tijdelijk van {discountPercentage}% korting.</p>
                </div>
              )}

              {product.colors.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs font-sans text-muted">Geselecteerde kleur</p>
                  <p className="text-sm font-sans font-semibold text-dark">{selectedColor.name}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.colors.map((color) => (
                      <button
                        key={color.slug}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        disabled={!color.inStock}
                        aria-label={color.name}
                        title={color.name}
                        className={cn(
                          'relative h-8 w-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                          selectedColor.slug === color.slug
                            ? 'border-dark scale-110'
                            : 'border-transparent hover:border-dark/30',
                          !color.inStock && 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        <span className="h-5.5 w-5.5 rounded-full" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {upsellProducts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-sans font-semibold text-dark">Selecteer populaire add-ons</h3>
                  {upsellProducts.map((upsell) => {
                    const isSelected = selectedUpsellIds.includes(upsell.id)
                    const savingsAmount = getSavingsAmount(upsell)
                    return (
                      <div
                        key={upsell.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => toggleUpsell(upsell.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            toggleUpsell(upsell.id)
                          }
                        }}
                        className={cn(
                          'w-full rounded-xl border p-3 text-left transition-colors duration-200 cursor-pointer',
                          isSelected ? 'border-[#8AC5FF] bg-[#F7FBFF]' : 'border-border bg-white'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              'h-5 w-5 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0',
                              isSelected ? 'border-[#56A5F8] bg-[#EAF4FF]' : 'border-border bg-white'
                            )}
                          >
                            {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#56A5F8]" />}
                          </span>
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-surface flex-shrink-0">
                            <Image
                              src={upsell.images[0]?.src ?? '/images/products/acacia.jpg'}
                              alt={getDisplayName(upsell)}
                              fill
                              className="object-cover object-center"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-sans font-semibold text-dark">{getDisplayName(upsell)}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="font-sans font-semibold text-dark">{formatPrice(upsell.price)}</span>
                              {upsell.compareAtPrice && upsell.compareAtPrice > upsell.price && (
                                <span className="font-sans text-muted line-through">{formatPrice(upsell.compareAtPrice)}</span>
                              )}
                            </div>
                          </div>
                          {savingsAmount > 0 && (
                            <span className="inline-flex rounded-full bg-[#CDEBFF] px-2.5 py-1 text-xs font-sans font-semibold text-dark">
                              Bespaar {formatPrice(savingsAmount)}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleUpsellNavigate(upsell.handle)
                            }}
                            aria-label={`Ga naar ${getDisplayName(upsell)}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-dark transition-colors duration-200 hover:bg-surface"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <Button variant="accent" size="xl" fullWidth loading={adding} onClick={handleAddToCart}>
                In winkelwagen - {formatPrice(totalCartValue)}
              </Button>

              <div className="border-y border-border py-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-dark">
                  <Truck size={15} className="text-muted" />
                  <span suppressHydrationWarning>{deliveryLine}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark">
                  <ShieldCheck size={15} className="text-muted" />
                  <span>Gratis verzending &amp; 14 dagen retour</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark">
                  <span className="inline-flex rounded bg-[#FFB5CF] px-1.5 py-0.5 text-[10px] font-sans font-semibold text-dark">Klarna</span>
                  Betaal in 3 delen van {formatPrice(klarnaSplit)} +
                </div>
              </div>

              <div className="divide-y divide-border">
                {ACACIA_INFO_ROWS.map((row) => {
                  const isOpen = openInfoRow === row.id
                  return (
                    <div key={row.id}>
                      <button
                        type="button"
                        onClick={() => setOpenInfoRow(isOpen ? '' : row.id)}
                        className="w-full py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-base font-sans font-medium text-dark">{row.title}</span>
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      {isOpen && (
                        <p className="pb-4 text-sm font-sans text-muted leading-relaxed whitespace-pre-line">
                          {row.body}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-light section-py">
        <div className="container-content space-y-20">
          {ACACIA_STORY_SECTIONS.map((section) => (
            <div key={section.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className={cn('relative overflow-hidden rounded-[24px] bg-surface aspect-square', section.reverse && 'order-1 lg:order-2')}>
                <Image src={section.image} alt={section.imageAlt} fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 680px" />
              </div>
              <div className={cn(section.reverse && 'order-2 lg:order-1')}>
                <h2 className="font-sans font-semibold text-dark leading-tight mb-5" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
                  {section.title}
                </h2>
                <p className="font-sans text-dark/85 text-base leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface section-py">
        <div className="container-content">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
              Met vertrouwen snijden
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-muted">
              Gemaakt van eersteklas acaciahout voor duurzame sterkte en een tijdloze stijl
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((feature) => (
              <FeatureItem key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light section-py overflow-hidden">
        <div className="container-content">
          <div className="text-center mb-12">
            <Image
              src="/content/trustpilot-logo-sml.png.webp"
              alt="Trustpilot"
              width={224}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
            />
            <h2
              className="font-sans font-semibold text-dark tracking-tight"
              style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
            >
              Geliefd bij keukenliefhebbers
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-muted">
              Ontdek waarom duizenden mensen vertrouwen op Noctis in hun keuken.
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
            <div
              className="marquee-track"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
              {ACACIA_ROW1_LOOP.map((review, i) => (
                <AcaciaTestimonialCard key={`r1-${i}`} review={review} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="marquee-track-reverse"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
              {ACACIA_ROW2_LOOP.map((review, i) => (
                <AcaciaTestimonialCard key={`r2-${i}`} review={review} />
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
            <span className="text-dark/30">→</span>
          </a>
        </div>
      </section>

      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                Veelgestelde vragen
              </p>
              <h2 className="font-sans font-bold text-dark tracking-tight leading-tight" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}>
                Nog vragen?
              </h2>
              <p className="font-sans text-muted text-sm mt-4 leading-relaxed">
                Alles wat je wilt weten over de Noctis acacia snijplank.
              </p>
            </div>

            <Accordion.Root type="single" collapsible className="lg:col-span-2 divide-y divide-border">
              {ACACIA_FAQS.map((faq) => (
                <Accordion.Item key={faq.id} value={faq.id} className="group">
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-sm text-dark hover:text-accent transition-colors duration-200 cursor-pointer">
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 text-muted group-data-[state=open]:text-accent transition-colors duration-200">
                      <Plus size={18} strokeWidth={2} className="group-data-[state=open]:hidden" />
                      <Minus size={18} strokeWidth={2} className="hidden group-data-[state=open]:block" />
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="accordion-content overflow-hidden">
                    <p className="font-sans text-muted text-sm leading-relaxed pb-5 max-w-2xl whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </section>
    </>
  )
}
