'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ChevronRight, Minus, Pause, Play, Plus, ShieldCheck, Truck, X } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { type Product, type ProductColor } from '@/lib/data'

type GalleryMediaItem = {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
}

const KITCHEN_SET_VIDEO_ITEM: GalleryMediaItem = {
  type: 'video',
  src: '/videos/19-delige-set-pdp-video.webm',
  alt: 'Video van de 19-delige keukenset in gebruik',
  poster: '/images/pdp/kitchen-set-black/main.jpg',
}

const BLACK_GALLERY_IMAGES: GalleryMediaItem[] = [
  {
    type: 'image',
    src: '/images/pdp/kitchen-set-black/main.jpg',
    alt: '19-delige keukenset zwart - hoofdafbeelding',
  },
  {
    type: 'image',
    src: '/images/pdp/kitchen-set-black/lifestyle-vrouw.webp',
    alt: '19-delige keukenset zwart - lifestyle',
  },
  {
    type: 'image',
    src: '/images/pdp/kitchen-set-black/zwart-messen.webp',
    alt: '19-delige keukenset zwart - messen',
  },
  {
    type: 'image',
    src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp',
    alt: '19-delige keukenset zwart - tools',
  },
]

function toImageMediaItems(items: { src: string; alt: string }[]): GalleryMediaItem[] {
  return items.map((item) => ({ ...item, type: 'image' as const }))
}

function getKitchenSetGalleryImages(product: Product): GalleryMediaItem[] {
  let imageItems: GalleryMediaItem[] = []

  // Black set uses its dedicated curated array (slightly different filenames)
  if (/19-piece-kitchenware-black/.test(product.handle)) {
    imageItems = BLACK_GALLERY_IMAGES
  } else if (product.images.length > 1) {
    // All other colours: use the full image set injected by woocommerce.ts
    // product.images = [main, lifestyle, messen, pollepels]
    imageItems = toImageMediaItems(product.images)
  } else if (product.images[0]) {
    // Fallback: just the main image
    imageItems = toImageMediaItems([product.images[0]])
  } else {
    imageItems = BLACK_GALLERY_IMAGES
  }

  const deduped: GalleryMediaItem[] = []
  const seen = new Set<string>()
  for (const item of imageItems) {
    if (seen.has(item.src)) continue
    seen.add(item.src)
    deduped.push(item)
  }

  if (deduped.length === 0) {
    return [KITCHEN_SET_VIDEO_ITEM]
  }

  return [...deduped, KITCHEN_SET_VIDEO_ITEM]
}

type KitchenSetLandingClientProps = {
  product: Product
  upsellProducts: Product[]
}

const INFO_ROWS = [
  {
    id: 'product-details',
    title: 'Productdetails',
    body: 'Afmetingen: 14 × 30 × 38 cm.',
  },
  {
    id: 'daily-use',
    title: 'Gemaakt voor dagelijks gebruik',
    body: 'Zacht voor je pannen. Stevig in de hand. Ontworpen om elke dag prettig te gebruiken.',
  },
]

const KITCHEN_SET_FAQS = [
  {
    id: 'material',
    question: 'Waarvan is de keukenset gemaakt?',
    answer:
      'De set is gemaakt van hoogwaardige, BPA-vrije materialen. De siliconen onderdelen zijn hittebestendig tot 230°C en veilig voor pannen met anti-aanbaklaag. De messen zijn van roestvrij staal en ontworpen voor dagelijks gebruik.',
  },
  {
    id: 'contents',
    question: 'Wat zit er in de 19-delige keukenset?',
    answer:
      'Alles wat je nodig hebt voor dagelijks koken: Noctis Houder, Spatel, Pastalepel, Bakspatel, Slabestek, Opscheplepel, Soeplepel, Platte spatel, Pannenlikker, Tang, Garde, Oliekwast, Snijmes, Broodmes, Chef’s mes, Universeelmes, Fruitmes, Keukenschaar en Snijplank.',
  },
  {
    id: 'dishwasher',
    question: 'Is de keukenset vaatwasserbestendig?',
    answer:
      'Nee, voor een langere levensduur adviseren wij om de onderdelen met de hand af te wassen. Vermijd het gebruik van ruwe materialen en agressieve schoonmaakmiddelen, aangezien deze de onderdelen kunnen beschadigen.',
  },
  {
    id: 'delivery',
    question: 'Hoe snel wordt de keukenset geleverd?',
    answer:
      'Wij bieden snelle levering binnen 1-2 werkdagen. Bestel nu en ontvang het snel met DHL of PostNL!',
  },
  {
    id: 'returns',
    question: 'Kan ik retourneren als ik van gedachten verander?',
    answer:
      'Ja, je hebt 14 dagen bedenktijd. Stuur de set eenvoudig in originele staat terug voor volledige terugbetaling.',
  },
  {
    id: 'style-match',
    question: 'Past de set bij mijn keukenstijl?',
    answer:
      'Zeker. De set is verkrijgbaar in meerdere tijdloze kleuren, ontworpen om moderne, klassieke en minimalistische keukens te complementeren.',
  },
] as const

const SET_PARTS = [
  {
    id: 'messen-schaar',
    title: '5 messen & schaar',
    body:
      'Een complete basis met koksmes, broodmes, santoku, universeel mes, schilmes en een stevige keukenschaar.',
    markerClassName: 'top-[22%] left-[40%]',
    labelClassName: 'left-9 top-1/2 -translate-y-1/2',
  },
  {
    id: 'tools',
    title: '11 tools',
    body:
      'Van spatel en pollepel tot garde en tang. Alle tools die je dagelijks gebruikt, in dezelfde rustige stijl.',
    markerClassName: 'top-[22%] right-[36%]',
    labelClassName: 'right-9 top-1/2 -translate-y-1/2',
  },
  {
    id: 'houder-snijplank',
    title: 'Houder & snijplank',
    body:
      'De houder houdt alles overzichtelijk op je aanrecht. De snijplank maakt de set direct functioneel en compleet.',
    markerClassName: 'bottom-[16%] left-1/2 -translate-x-1/2',
    labelClassName: 'top-9 left-1/2 -translate-x-1/2',
  },
] as const

type SetPartId = (typeof SET_PARTS)[number]['id']

const DUTCH_COLOR_MAP: Record<string, string> = {
  black: 'Zwart',
  white: 'Wit',
  grey: 'Grijs',
  gray: 'Grijs',
  nude: 'Nude',
  pink: 'Roze',
  green: 'Groen',
  mint: 'Mintgroen',
  beige: 'Beige',
  acacia: 'Acacia',
  zwart: 'Zwart',
  wit: 'Wit',
  grijs: 'Grijs',
  roze: 'Roze',
  groen: 'Groen',
  mintgroen: 'Mintgroen',
}

const KITCHEN_SET_PDP_TESTIMONIALS = [
  {
    id: 'ks-1',
    name: 'Sanne M.',
    rating: 5,
    text: 'Sinds we de set hebben oogt ons aanrecht eindelijk rustig. Alles heeft een vaste plek en koken gaat echt sneller.',
    product: '19-delige keukenset in zwart',
    date: 'April 2026',
  },
  {
    id: 'ks-2',
    name: 'Nina K.',
    rating: 5,
    text: 'Ik was bang dat het vooral mooi zou zijn, maar hij is ook heel praktisch. Vooral de grip en het materiaal voelen premium.',
    product: '19-delige keukenset in nude',
    date: 'Maart 2026',
  },
  {
    id: 'ks-3',
    name: 'Marike B.',
    rating: 5,
    text: 'De set kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. Kwaliteit is precies wat je verwacht in deze prijsklasse.',
    product: '19-delige keukenset in roze',
    date: 'Februari 2026',
  },
  {
    id: 'ks-4',
    name: 'Ludo V.',
    rating: 5,
    text: 'We kozen de mintgroene set voor ons nieuwe appartement en hij staat exact zo stijlvol als op de foto. Heel tevreden.',
    product: '19-delige keukenset in mintgroen',
    date: 'Januari 2026',
  },
  {
    id: 'ks-5',
    name: 'Emma R.',
    rating: 5,
    text: 'Elke ochtend word ik blij van het aanrecht. De set voelt stevig en niets ziet er goedkoop uit.',
    product: '19-delige keukenset in grijs',
    date: 'December 2025',
  },
  {
    id: 'ks-6',
    name: 'Fleur D.',
    rating: 5,
    text: 'Had ik dit maar eerder gedaan. We gebruiken bijna elk onderdeel dagelijks en alles blijft netjes georganiseerd.',
    product: '19-delige keukenset in nude',
    date: 'Februari 2026',
  },
] as const

const TESTIMONIAL_ROW1 = KITCHEN_SET_PDP_TESTIMONIALS
const TESTIMONIAL_ROW2 = [...KITCHEN_SET_PDP_TESTIMONIALS].reverse()
const TESTIMONIAL_ROW1_LOOP = [...TESTIMONIAL_ROW1, ...TESTIMONIAL_ROW1]
const TESTIMONIAL_ROW2_LOOP = [...TESTIMONIAL_ROW2, ...TESTIMONIAL_ROW2]

const COMPARISON_FEATURE_ROWS = [
  {
    title: 'Volledig matchend design',
    subtitle: 'Alles in één stijl in kleur. Rust op je aanrecht.',
    noctis: true,
    other: false,
  },
  {
    title: 'Veilig voor je pannen',
    subtitle: 'Zacht siliconen voorkomt krassen op antiaanbak & pannen.',
    noctis: true,
    other: false,
  },
  {
    title: 'Alles-in-één set',
    subtitle: '19 essentiële tools in één aankoop, messen inbegrepen.',
    noctis: true,
    other: false,
  },
  {
    title: 'Premium uiterlijk',
    subtitle: 'Stijlvolle houder die gezien mag worden.',
    noctis: true,
    other: false,
  },
  {
    title: 'Hygiënisch & duurzaam',
    subtitle: 'Makkelijk schoon te maken en gemaakt voor dagelijks gebruik.',
    noctis: true,
    other: false,
  },
  {
    title: 'BPA-vrij',
    subtitle: 'Gemaakt van hoogwaardig BPA-vrij siliconen.',
    noctis: true,
    other: false,
  },
  {
    title: 'Hittebestendig tot 230 °C',
    subtitle: 'Veilig bij bakken, roerbakken en dagelijks koken.',
    noctis: true,
    other: false,
  },
] as const

function getSelectedColor(product: Product): ProductColor {
  return (
    product.colors.find((color) => color.wcSlug === product.handle) ??
    product.colors.find((color) => /black|zwart/.test(`${color.slug} ${color.name}`.toLowerCase())) ??
    product.colors[0]
  )
}

function getDisplayName(product: Product): string {
  if (product.handle.includes('pepper-salt-mills')) return 'Peper- en zoutmolens zwart wit'
  if (product.handle.includes('acacia-cutting-board')) return 'Acacia snijplank'
  return product.title
}

function getSavingsAmount(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0
  return product.compareAtPrice - product.price
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

function ComparisonMark({ isPositive }: { isPositive: boolean }) {
  if (isPositive) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2A5C2A] text-white">
        <Check size={15} strokeWidth={2.5} />
      </span>
    )
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D1CECA] bg-white text-[#BCBAB8]">
      <X size={15} strokeWidth={2.25} />
    </span>
  )
}

function TestimonialCard({ review }: { review: (typeof KITCHEN_SET_PDP_TESTIMONIALS)[number] }) {
  return (
    <article className="flex-shrink-0 w-[320px] md:w-[360px] mx-3 bg-white rounded-[18px] border border-border p-5">
      {/* Big quote mark */}
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

function getDutchColorName(color: ProductColor): string {
  const slugKey = color.slug.trim().toLowerCase()
  const nameKey = color.name.trim().toLowerCase()
  return DUTCH_COLOR_MAP[slugKey] ?? DUTCH_COLOR_MAP[nameKey] ?? color.name
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

export function KitchenSetLandingClient({ product, upsellProducts }: KitchenSetLandingClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [openInfoRow, setOpenInfoRow] = useState('sleep')
  const [activeSetPartId, setActiveSetPartId] = useState<SetPartId>('messen-schaar')
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)
  const [isActiveVideoPlaying, setIsActiveVideoPlaying] = useState(true)

  const selectedColor = getSelectedColor(product)
  const galleryItems = getKitchenSetGalleryImages(product)
  const activeGalleryItem = galleryItems[activeImageIndex] ?? galleryItems[0] ?? KITCHEN_SET_VIDEO_ITEM
  const selectedColorName = getDutchColorName(selectedColor)
  const kitchenSetTitle = `19-delige keukenset ${selectedColorName.toLowerCase()}`

  useEffect(() => {
    if (activeGalleryItem?.type === 'video') {
      setIsActiveVideoPlaying(true)
    }
  }, [activeImageIndex, activeGalleryItem?.type])

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const basePrice = product.price
  const baseCompareAt = product.compareAtPrice ?? product.price

  const sortedUpsells = [...upsellProducts].sort((a, b) => {
    const aRank = a.handle.includes('pepper-salt-mills') ? 0 : 1
    const bRank = b.handle.includes('pepper-salt-mills') ? 0 : 1
    return aRank - bRank
  })

  const selectedUpsells = sortedUpsells.filter((item) => selectedUpsellIds.includes(item.id))
  const selectedUpsellsTotal = selectedUpsells.reduce((sum, item) => sum + item.price, 0)
  const totalCartValue = basePrice + selectedUpsellsTotal
  const klarnaSplit = totalCartValue / 3
  const deliveryLine = getDeliveryLine(new Date())

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 450))
    addItem({ ...product, title: kitchenSetTitle }, selectedColor, 1)
    for (const upsell of selectedUpsells) {
      const upsellColor = getSelectedColor(upsell)
      addItem(upsell, upsellColor, 1)
    }
    setAdding(false)
  }

  const toggleUpsell = (upsellId: string) => {
    setSelectedUpsellIds((prev) =>
      prev.includes(upsellId) ? prev.filter((id) => id !== upsellId) : [...prev, upsellId]
    )
  }

  const handleColorSelect = (color: ProductColor) => {
    if (!color.inStock || !color.wcSlug || color.wcSlug === product.handle) return
    router.push(`/products/${color.wcSlug}`)
  }

  const handleUpsellNavigate = (upsellHandle: string) => {
    router.push(`/products/${upsellHandle}`)
  }

  const toggleActiveVideoPlayback = async () => {
    if (activeGalleryItem?.type !== 'video' || !activeVideoRef.current) return
    if (activeVideoRef.current.paused) {
      await activeVideoRef.current.play()
      setIsActiveVideoPlaying(true)
      return
    }
    activeVideoRef.current.pause()
    setIsActiveVideoPlaying(false)
  }



  return (
    <>
      <section className="section-py bg-light">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 xl:gap-14 items-start">
          {/* Left column: sticky image gallery until end of right section */}
          <div className="flex gap-4 lg:sticky lg:top-28 lg:h-fit self-start">
            <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
              {galleryItems.map((item, index) => (
                <button
                  key={`${item.type}-${item.src}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    'relative aspect-[3/4] rounded-lg overflow-hidden border transition-colors duration-200',
                    activeImageIndex === index
                      ? 'border-dark'
                      : 'border-border hover:border-dark/40'
                  )}
                  aria-label={item.alt}
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.src}
                        poster={item.poster}
                        className="h-full w-full object-cover object-center"
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                      <span className="absolute right-1.5 bottom-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white">
                        <Play size={11} />
                      </span>
                    </>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      quality={95}
                      className="object-cover object-center"
                      sizes="80px"
                    />
                  )}
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
                    if (delta > 0) setActiveImageIndex((i) => Math.min(i + 1, galleryItems.length - 1))
                    else setActiveImageIndex((i) => Math.max(i - 1, 0))
                  }
                  touchStartXRef.current = null
                }}
              >
                {activeGalleryItem.type === 'video' ? (
                  <>
                    <video
                      ref={activeVideoRef}
                      src={activeGalleryItem.src}
                      poster={activeGalleryItem.poster}
                      className="h-full w-full object-cover object-center"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                      preload="metadata"
                      onPlay={() => setIsActiveVideoPlaying(true)}
                      onPause={() => setIsActiveVideoPlaying(false)}
                    />
                    <button
                      type="button"
                      onClick={toggleActiveVideoPlayback}
                      aria-label={isActiveVideoPlaying ? 'Video pauzeren' : 'Video afspelen'}
                      className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                    >
                      {isActiveVideoPlaying ? <Pause size={17} /> : <Play size={17} />}
                    </button>
                  </>
                ) : (
                  <Image
                    src={activeGalleryItem.src}
                    alt={activeGalleryItem.alt}
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                )}
                {galleryItems.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                    {galleryItems.map((_, i) => (
                      <div key={i} className={cn('h-1.5 rounded-full transition-all duration-200', i === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50')} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1">
                {galleryItems.map((item, index) => (
                  <button
                    key={`mobile-${item.type}-${item.src}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'relative w-14 h-[74px] rounded-md overflow-hidden border flex-shrink-0 transition-colors duration-200',
                      activeImageIndex === index ? 'border-dark' : 'border-border'
                    )}
                    aria-label={item.alt}
                  >
                    {item.type === 'video' ? (
                      <>
                        <video
                          src={item.src}
                          poster={item.poster}
                          className="h-full w-full object-cover object-center"
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                        />
                        <span className="absolute right-1 bottom-1 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/60 text-white">
                          <Play size={9} />
                        </span>
                      </>
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        quality={95}
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right info bar */}
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

            <h1
              className="font-sans font-bold text-dark leading-tight"
              style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}
            >
              {kitchenSetTitle}
            </h1>

            <div className="flex items-center gap-3">
              <span className="text-lg font-sans font-semibold text-dark">{formatPrice(basePrice)}</span>
              {baseCompareAt > basePrice && (
                <span className="text-sm font-sans text-muted line-through">
                  {formatPrice(baseCompareAt)}
                </span>
              )}
              {discountPercentage && (
                <span className="inline-flex items-center rounded-full bg-[#EFB74A] px-3 py-1 text-sm font-sans font-semibold text-dark">
                  {discountPercentage}% korting
                </span>
              )}
            </div>

            <ul className="space-y-2 text-sm font-sans text-dark">
              {[
                'Blijft opgeruimd en stijlvol op je aanrecht',
                '19 essentiële tools in één complete set',
                'Hittebestendig en veilig voor anti-aanbakpannen',
                'Materiaal: food-safe siliconen + RVS',
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

            {product.colors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-sans text-muted">Geselecteerde kleur</p>
                <p className="text-sm font-sans font-semibold text-dark">{getDutchColorName(selectedColor)}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.colors.map((color) => (
                    <button
                      key={color.slug}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      disabled={!color.inStock}
                      aria-label={getDutchColorName(color)}
                      title={getDutchColorName(color)}
                      className={cn(
                        'relative h-8 w-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                        selectedColor.slug === color.slug
                          ? 'border-dark scale-110'
                          : 'border-transparent hover:border-dark/30',
                        !color.inStock && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <span
                        className="h-5.5 w-5.5 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sortedUpsells.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-sans font-semibold text-dark">
                  Selecteer populaire add-ons
                </h3>
                {sortedUpsells.map((upsell) => {
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
                          {isSelected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#56A5F8]" />
                          )}
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
                          <p className="text-sm font-sans font-semibold text-dark">
                            {getDisplayName(upsell)}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="font-sans font-semibold text-dark">
                              {formatPrice(upsell.price)}
                            </span>
                            {upsell.compareAtPrice && upsell.compareAtPrice > upsell.price && (
                              <span className="font-sans text-muted line-through">
                                {formatPrice(upsell.compareAtPrice)}
                              </span>
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

            <Button
              variant="accent"
              size="xl"
              fullWidth
              loading={adding}
              onClick={handleAddToCart}
            >
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
              {INFO_ROWS.map((row) => {
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
                      <p className="pb-4 text-sm font-sans text-muted leading-relaxed">
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
      <section className="bg-light py-2 md:py-3">
        <div className="container-content">
          <p className="text-center text-xs md:text-sm font-sans text-muted">
            Niet vaatwasserbestendig. Voor langdurige kwaliteit raden we handwas aan.
          </p>
        </div>
      </section>
      <section className="bg-light section-py">
        <div className="container-content space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative overflow-hidden rounded-[24px] bg-surface aspect-square">
            <video
              src="/videos/nude-grab-set-comp.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-dark leading-tight mb-5" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
              Waarom deze set in jouw
              <br />
              <span className="italic font-normal">keuken hoort</span>
            </h2>
            <p className="font-sans text-dark/85 text-base leading-relaxed">
              Een keuken kan er strak uitzien en toch onrustig aanvoelen. Het zit in de details die je elke dag gebruikt.
              Losse spatels, verschillende materialen en kleuren zorgen voor onrust, ook als je het niet meteen doorhebt.
            </p>
            <p className="font-sans text-dark/85 text-base leading-relaxed mt-5">
              Deze set brengt alles samen. Eén stijl, één geheel, zichtbaar op je aanrecht.
              Niet om weg te stoppen, maar om je keuken rustiger te laten voelen elke keer dat je erin staat.
            </p>
          </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-sans font-semibold text-dark leading-tight mb-5" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
              Koken voelt makkelijker
              <br />
              <span className="italic font-normal">als alles matched</span>
            </h2>
            <p className="font-sans text-dark/85 text-base leading-relaxed">
              Wanneer alles bij elkaar past, wordt koken vanzelf makkelijker. Je pakt wat je nodig hebt en kunt door.
            </p>
            <p className="font-sans text-dark/85 text-base leading-relaxed mt-5">
              Geen rommel. Geen mismatch. Gewoon één set die werkt en er goed uitziet.
            </p>
          </div>
          <div className="order-1 lg:order-2 relative overflow-hidden rounded-[24px] bg-surface aspect-square">
            <video
              src="/videos/spatel-pan-grijs.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          </div>
        </div>
      </section>
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
              Ontdek wat er in de set zit
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-muted">
              Klik op de onderdelen en bekijk precies hoe deze set is opgebouwd.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 items-center">
            <div className="relative rounded-[24px] border border-border bg-white p-4 md:p-6">
              <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-surface">
                <Image
                  src="/content/transp-set-nude-website-banner.webp"
                  alt="Opbouw van de Noctis 19-delige keukenset"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 900px"
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

            <aside className="rounded-[18px] border border-border bg-white p-5 md:p-6">
              <div className="space-y-2">
                {SET_PARTS.map((part, index) => {
                  const isActive = part.id === activeSetPartId
                  return (
                    <div
                      key={`${part.id}-row`}
                      className={cn(
                        'rounded-xl border px-4 py-3 transition-colors duration-200',
                        isActive ? 'border-accent/30 bg-accent/5' : 'border-border bg-white'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSetPartId(part.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200',
                              isActive ? 'bg-accent text-white' : 'bg-surface text-dark'
                            )}
                          >
                            {index + 1}
                          </span>
                          <span className={cn('text-base font-sans', isActive ? 'font-semibold text-accent' : 'text-dark/85')}>
                            {part.title}
                          </span>
                        </div>
                      </button>

                      {isActive && (
                        <p className="mt-3 ml-10 text-sm md:text-base font-sans text-dark/85 leading-relaxed">
                          {part.body}
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

        {/* Dual-row marquee — opposite directions, infinite loop */}
        <div
          className="relative -mx-4 md:-mx-8 lg:-mx-12 xl:-mx-18"
          onMouseEnter={() => setTestimonialsPaused(true)}
          onMouseLeave={() => setTestimonialsPaused(false)}
        >
          {/* Left + right gradient shadow fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-light to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-light to-transparent" />

          {/* Row 1 — scrolls left */}
          <div className="overflow-hidden mb-5">
            <div
              className="marquee-track"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
              {TESTIMONIAL_ROW1_LOOP.map((review, i) => (
                <TestimonialCard key={`r1-${i}`} review={review} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="overflow-hidden">
            <div
              className="marquee-track-reverse"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
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
            <span className="text-dark/30">→</span>
          </a>
        </div>
      </section>
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
              Noctis vs rommelige houders
            </h2>
            <p className="mt-3 text-sm md:text-base font-sans text-muted">
              Zie direct waarom Noctis de slimme keuze is voor een rustige en complete keuken.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="min-w-[340px] max-w-[1120px] mx-auto">

              {/* Table body */}
              <div className="bg-white rounded-[20px] border border-[#1E1D1D]/12 overflow-hidden">
                {/* Product column headers */}
                <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2.3fr_1fr_1fr] border-b border-[#EDEBE8]">
                  <div className="px-3 md:px-6 py-4 md:py-5" />
                  <div className="border-l border-[#EDEBE8] bg-[#FAF7F4] px-3 md:px-5 py-4 md:py-5 text-center w-24 md:w-auto">
                    <div className="relative mx-auto h-14 w-14 md:h-[88px] md:w-[88px]">
                      <Image
                        src="/content/noctis-houder.webp"
                        alt="Noctis 19-delige set"
                        fill
                        className="object-contain"
                        sizes="88px"
                      />
                    </div>
                    <p className="mt-2 font-sans font-semibold text-xs md:text-base text-dark leading-snug">
                      Noctis set
                    </p>
                  </div>
                  <div className="border-l border-[#EDEBE8] px-3 md:px-5 py-4 md:py-5 text-center w-24 md:w-auto">
                    <div className="relative mx-auto h-14 w-14 md:h-[88px] md:w-[88px]">
                      <Image
                        src="/content/rommelige-houder.webp"
                        alt="Rommelige houder"
                        fill
                        className="object-contain"
                        sizes="88px"
                      />
                    </div>
                    <p className="mt-2 font-sans font-semibold text-xs md:text-base text-muted leading-snug">
                      Rommelig
                    </p>
                  </div>
                </div>

                {/* Feature rows */}
                {COMPARISON_FEATURE_ROWS.map((row) => (
                  <div key={row.title} className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2.3fr_1fr_1fr] border-b border-[#EDEBE8]">
                    <div className="px-3 md:px-6 py-4 md:py-5">
                      <p className="font-sans font-semibold text-sm md:text-[22px] text-dark">{row.title}</p>
                      <p className="mt-1 text-xs md:text-[18px] font-sans text-muted leading-relaxed">{row.subtitle}</p>
                    </div>
                    <div className="border-l border-[#EDEBE8] bg-[#FAF7F4] w-24 md:w-auto px-3 md:px-5 py-4 md:py-5 flex items-center justify-center">
                      <ComparisonMark isPositive={row.noctis} />
                    </div>
                    <div className="border-l border-[#EDEBE8] w-24 md:w-auto px-3 md:px-5 py-4 md:py-5 flex items-center justify-center">
                      <ComparisonMark isPositive={row.other} />
                    </div>
                  </div>
                ))}

                {/* Price footer */}
                <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2.3fr_1fr_1fr] bg-[#FAFAF8]">
                  <div className="px-3 md:px-6 py-4 md:py-5">
                    <p className="font-sans font-semibold text-sm md:text-[22px] text-dark">Prijsvoordeel</p>
                    <p className="mt-1 text-xs md:text-[18px] font-sans text-muted">Complete set vs losse tools.</p>
                  </div>
                  <div className="border-l border-[#EDEBE8] bg-[#FAF7F4] w-24 md:w-auto px-3 md:px-5 py-4 md:py-5 flex items-center justify-center text-center">
                    <div>
                      <p className="font-sans text-base md:text-[24px] font-bold text-dark">{formatPrice(basePrice)}</p>
                      <p className="text-xs md:text-[16px] font-sans text-muted mt-1">complete set</p>
                    </div>
                  </div>
                  <div className="border-l border-[#EDEBE8] w-24 md:w-auto px-3 md:px-5 py-4 md:py-5 flex items-center justify-center text-center">
                    <div>
                      <p className="font-sans text-base md:text-[24px] font-semibold text-dark">€115,95+</p>
                      <p className="text-xs md:text-[16px] font-sans text-muted mt-1">aan losse tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-light section-py">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
                Veelgestelde vragen
              </p>
              <h2
                className="font-sans font-bold text-dark tracking-tight leading-tight"
                style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}
              >
                Nog vragen?
              </h2>
              <p className="font-sans text-muted text-sm mt-4 leading-relaxed">
                Snel antwoord op de meestgestelde vragen over de 19-delige set.
              </p>
            </div>

            <Accordion.Root type="single" collapsible className="lg:col-span-2 divide-y divide-border">
              {KITCHEN_SET_FAQS.map((faq) => (
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
    </>
  )
}
