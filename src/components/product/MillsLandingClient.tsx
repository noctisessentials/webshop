'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as Accordion from '@radix-ui/react-accordion'
import { Check, ChevronRight, Minus, Pause, Play, Plus, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { type Product, type ProductColor } from '@/lib/data'

type MillsLandingClientProps = {
  product: Product
  upsellProducts: Product[]
}

type GalleryMediaItem = {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
}

const MILLS_VIDEO_ITEM: GalleryMediaItem = {
  type: 'video',
  src: '/videos/peper-en-zoutmolens-pdp-video.webm',
  alt: 'Video van de peper- en zoutmolens in gebruik',
  poster: '/images/products/mills-blackwhite.jpg',
}

const DUTCH_COLOR_MAP: Record<string, string> = {
  black: 'Zwart',
  white: 'Wit',
  'black-white': 'Zwart wit',
  blackwhite: 'Zwart wit',
  green: 'Groen',
  zwart: 'Zwart',
  wit: 'Wit',
  'zwart-wit': 'Zwart wit',
  groen: 'Groen',
}

const MILLS_FAQS = [
  {
    id: 'materials',
    question: 'Waarvan zijn de molens gemaakt?',
    answer:
      'De molens zijn gemaakt van hoogwaardig ABS-kunststof met een transparante acrylkamer, wat zowel duurzaamheid als een helder zicht op de inhoud biedt. Het keramische maalwerk garandeert langdurige prestaties en is volledig roestvrij.',
  },
  {
    id: 'charging',
    question: 'Hoe laad ik de molens op?',
    answer:
      'Gebruik de meegeleverde USB-C-kabel om de molens op te laden via elke standaard USB-poort. Volledig opladen duurt slechts 60 minuten en gaat wekenlang mee bij regelmatig gebruik.',
  },
  {
    id: 'grind-size',
    question: 'Kan ik de maalgraad aanpassen?',
    answer:
      'Jazeker! Elke molen heeft een verstelbare maalgraad. Draai simpelweg aan de knop aan de onderkant om te wisselen tussen fijn of grof malen - precies zoals jij het wilt.',
  },
  {
    id: 'led',
    question: 'Hoe werkt de ingebouwde LED-lamp?',
    answer:
      'Het geïntegreerde LED-lampje gaat automatisch aan tijdens gebruik. Zo heeft u goed zicht op de kruiden en kunt u ze nauwkeurig op smaak brengen, zelfs bij weinig licht.',
  },
  {
    id: 'other-spices',
    question: 'Kan ik de molens ook voor andere kruiden gebruiken?',
    answer:
      'Absoluut. Naast zout en peper kun je de molens ook gebruiken voor andere droge kruiden zoals komijn of korianderzaad. Zorg er wel voor dat de kruiden droog en niet plakkerig zijn voor een optimale maalgraad.',
  },
  {
    id: 'cleaning',
    question: 'Hoe maak ik de molens schoon?',
    answer:
      'Gebruik de meegeleverde reinigingsborstel om voorzichtig resten van de keramische molen en de binnenkant van de ketel te verwijderen. Dompel de molen niet onder in water en gebruik geen agressieve reinigingsmiddelen.',
  },
  {
    id: 'box',
    question: 'Wat zit er in de doos?',
    answer:
      '2x Groene peper- en zoutmolens\n\n1x USB-C-oplaadkabel\n\n1x Reinigingsborstel\n\n1x Gebruikershandleiding',
  },
  {
    id: 'dimensions',
    question: 'Wat zijn de afmetingen en het gewicht?',
    answer:
      'Elke molen is 22 cm hoog en heeft een diameter van 5 cm. Met een gewicht van ongeveer 250 gram liggen ze stevig en comfortabel in de hand.',
  },
] as const

const STORY_SECTIONS = [
  {
    id: 'designed-visible',
    title: 'Ontworpen om zichtbaar te blijven',
    subtitle: 'Niet om op te bergen',
    body:
      'De meeste peper en zoutmolens verdwijnen na gebruik in een keukenkast. Ze zijn functioneel, maar geen onderdeel van het interieur. Deze molens zijn anders. Ze zijn ontworpen om op het aanrecht te blijven staan.',
    image: '/content/peper-en-zoutmolens-lifestyle-zwart-wit.webp',
    imageAlt: 'Peper- en zoutmolens op aanrecht in keuken',
    reverse: false,
  },
  {
    id: 'one-press',
    title: 'Eén simpele druk',
    subtitle: 'Niets meer',
    body:
      'Koken vraagt aandacht voor smaak, niet voor handelingen. Met één druk op de knop voeg je moeiteloos kruiden toe, precies op het moment dat je ze nodig hebt. Met één hand, moeiteloos en zonder onderbreking van je ritme. Je handeling blijft vloeiend en je focus ligt waar die hoort.',
    image: '/content/peper-en-zoutmolens-groen-boven-pan.webp',
    imageAlt: 'Groene peper- en zoutmolens boven pan tijdens koken',
    reverse: true,
  },
  {
    id: 'less-think',
    title: 'Minder om aan te denken',
    subtitle: 'Meer rust',
    body:
      'Je laadt één keer op en kunt er lange tijd mee vooruit. Geen losse batterijen, geen onnodig onderhoud. Het ontwerp is eenvoudig schoon te maken en gemaakt om dagelijks te gebruiken, zonder dat het aandacht vraagt. Zo blijft je keuken rustig en je focus bij het koken.',
    image: '/content/peper-en-zoutmolens-zwart-doos-kabel.webp',
    imageAlt: 'Zwarte peper- en zoutmolens met kabel en reinigingsborstel',
    reverse: false,
  },
] as const

const MILLS_INFO_ROWS = [
  {
    id: 'box-content',
    title: 'Wat zit er in de doos?',
    body:
      '- 2x elektrische peper- en zoutmolens\n- 1x USB-C-oplaadkabel\n- 1x Reinigingsborstel\n- 1x Handleiding',
  },
  {
    id: 'product-details',
    title: 'Productdetails',
    body:
      '- Verstelbare maalgraad\n- Ingebouwde LED-lamp\n- USB-C oplaadbaar\n- Minimalistisch premium design',
  },
  {
    id: 'materials',
    title: 'Materiaal & onderhoud',
    body:
      'Hoogwaardig ABS-kunststof met transparante acrylkamer en keramisch maalwerk. Niet onderdompelen in water. Reinig met de meegeleverde borstel.',
  },
] as const

const MILLS_PDP_TESTIMONIALS = [
  {
    id: 'm-1',
    name: 'Florian R.',
    rating: 5,
    text: 'Eindelijk molens die niet rommelig ogen op het aanrecht. Ze staan altijd mooi en malen heel gelijkmatig.',
    product: 'Peper- en zoutmolens zwart wit',
    date: 'April 2026',
  },
  {
    id: 'm-2',
    name: 'Yasmin H.',
    rating: 5,
    text: 'De LED is echt handig in de avond en de knop werkt super soepel. Ontwerp voelt luxe aan.',
    product: 'Peper- en zoutmolens groen',
    date: 'Maart 2026',
  },
  {
    id: 'm-3',
    name: 'Koen L.',
    rating: 5,
    text: 'Cadeau gekregen en direct blij mee. USB-C opladen is top, geen gedoe meer met losse batterijen.',
    product: 'Peper- en zoutmolens zwart wit',
    date: 'Februari 2026',
  },
  {
    id: 'm-4',
    name: 'Ilse P.',
    rating: 5,
    text: 'De maalgraad is makkelijk in te stellen en ze voelen stevig in de hand. We gebruiken ze elke dag.',
    product: 'Peper- en zoutmolens zwart',
    date: 'Januari 2026',
  },
  {
    id: 'm-5',
    name: 'Ruben T.',
    rating: 5,
    text: 'Binnen twee dagen binnen en direct in gebruik. Ze zijn stil, snel en staan heel strak op het aanrecht.',
    product: 'Peper- en zoutmolens wit',
    date: 'December 2025',
  },
  {
    id: 'm-6',
    name: 'Sahar B.',
    rating: 5,
    text: 'Heel blij met de groene set. Kleur is in het echt net zo mooi als op de site en het malen is super consistent.',
    product: 'Peper- en zoutmolens groen',
    date: 'November 2025',
  },
] as const

const MILLS_ROW1_LOOP = [...MILLS_PDP_TESTIMONIALS, ...MILLS_PDP_TESTIMONIALS]
const MILLS_ROW2_LOOP = [...[...MILLS_PDP_TESTIMONIALS].reverse(), ...[...MILLS_PDP_TESTIMONIALS].reverse()]

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

function MillsTestimonialCard({ review }: { review: (typeof MILLS_PDP_TESTIMONIALS)[number] }) {
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

function getDutchColorName(color: ProductColor): string {
  const slugKey = color.slug.trim().toLowerCase()
  const nameKey = color.name.trim().toLowerCase()
  return DUTCH_COLOR_MAP[slugKey] ?? DUTCH_COLOR_MAP[nameKey] ?? color.name
}

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
  if (product.handle.includes('acacia-cutting-board')) return 'Acacia snijplank'
  if (product.handle.includes('pepper-salt-mills')) return 'Peper- en zoutmolens'
  return product.title
}

function getSavingsAmount(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0
  return product.compareAtPrice - product.price
}

function getMillsGalleryImages(product: Product): GalleryMediaItem[] {
  const handle = product.handle.toLowerCase()
  const baseImage = product.images[0]?.src ?? '/images/products/mills-blackwhite.jpg'
  const items: GalleryMediaItem[] = [{ type: 'image', src: baseImage, alt: `${product.title} - product` }]

  if (handle.includes('green')) {
    items.push({ type: 'image', src: '/content/pepper-salt-mills-green-second.webp', alt: 'Groene molens detail' })
  } else if (handle.includes('black-white') || handle.includes('blackwhite')) {
    items.push({ type: 'image', src: '/content/pepper-salt-mills-black-white-second.webp', alt: 'Zwart-witte molens detail' })
  } else if (handle.includes('black')) {
    items.push({ type: 'image', src: '/content/pepper-salt-mills-black-second.webp', alt: 'Zwarte molens detail' })
  } else if (handle.includes('white')) {
    items.push({ type: 'image', src: '/content/pepper-salt-mills-white-second.webp', alt: 'Witte molens detail' })
  } else {
    const fallbackSecond = product.images[1]?.src
    if (fallbackSecond) {
      items.push({ type: 'image', src: fallbackSecond, alt: `${product.title} - detail` })
    }
  }

  const deduped: GalleryMediaItem[] = []
  const seen = new Set<string>()
  for (const item of items) {
    if (seen.has(item.src)) continue
    seen.add(item.src)
    deduped.push(item)
  }

  if (deduped.length === 0) {
    return [MILLS_VIDEO_ITEM]
  }

  return [...deduped, MILLS_VIDEO_ITEM]
}

function getMillsSwatchStyle(color: ProductColor): { background?: string; backgroundColor?: string } {
  const slugKey = color.slug.trim().toLowerCase()
  const nameKey = color.name.trim().toLowerCase()
  const key = `${slugKey} ${nameKey}`

  if (key.includes('black-white') || key.includes('blackwhite') || key.includes('zwart-wit')) {
    return { background: 'linear-gradient(90deg, #212121 0%, #212121 50%, #F4F2ED 50%, #F4F2ED 100%)' }
  }
  if (key.includes('black') || key.includes('zwart')) {
    return { backgroundColor: '#2A2A2A' }
  }
  if (key.includes('white') || key.includes('wit')) {
    return { backgroundColor: '#F4F2ED' }
  }
  if (key.includes('green') || key.includes('groen')) {
    return { backgroundColor: '#9CB595' }
  }

  return { backgroundColor: color.hex }
}

export function MillsLandingClient({ product, upsellProducts }: MillsLandingClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [openInfoRow, setOpenInfoRow] = useState<
    (typeof MILLS_INFO_ROWS)[number]['id'] | ''
  >(MILLS_INFO_ROWS[0].id)
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)
  const [isActiveVideoPlaying, setIsActiveVideoPlaying] = useState(true)

  const selectedColor = getSelectedColor(product)
  const galleryItems = getMillsGalleryImages(product)
  const activeGalleryItem = galleryItems[activeImageIndex] ?? galleryItems[0] ?? MILLS_VIDEO_ITEM
  const selectedColorName = getDutchColorName(selectedColor)
  const millsTitle = `Peper- en zoutmolens ${selectedColorName.toLowerCase()}`

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

  const selectedUpsells = upsellProducts.filter((item) => selectedUpsellIds.includes(item.id))
  const selectedUpsellsTotal = selectedUpsells.reduce((sum, item) => sum + item.price, 0)
  const totalCartValue = basePrice + selectedUpsellsTotal
  const klarnaSplit = totalCartValue / 3
  const deliveryLine = getDeliveryLine(new Date())

  const handleColorSelect = (color: ProductColor) => {
    if (!color.inStock || !color.wcSlug || color.wcSlug === product.handle) return
    router.push(`/products/${color.wcSlug}`)
  }

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 450))
    addItem({ ...product, title: millsTitle }, selectedColor, 1)
    for (const upsell of selectedUpsells) {
      const upsellColor = getSelectedColor(upsell)
      addItem(upsell, upsellColor, 1)
    }
    setAdding(false)
  }

  const handleUpsellNavigate = (upsellHandle: string) => {
    router.push(`/products/${upsellHandle}`)
  }

  const toggleUpsell = (upsellId: string) => {
    setSelectedUpsellIds((prev) =>
      prev.includes(upsellId) ? prev.filter((id) => id !== upsellId) : [...prev, upsellId]
    )
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
            <div className="flex gap-4 lg:sticky lg:top-28 lg:h-fit self-start">
              <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
                {galleryItems.map((item, index) => (
                  <button
                    key={`${item.type}-${item.src}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'relative aspect-[3/4] rounded-lg overflow-hidden border transition-colors duration-200',
                      activeImageIndex === index ? 'border-dark' : 'border-border hover:border-dark/40'
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
                        <Image src={item.src} alt={item.alt} fill quality={95} className="object-cover object-center" sizes="56px" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="self-start rounded-[18px] border border-border bg-white p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < 4 ? 'text-[#16A34A]' : 'text-[#16A34A]/60'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs font-sans text-dark">
                  4,5/5 <span className="text-muted">Gebaseerd op 32 beoordelingen</span>
                </p>
              </div>

              <h1 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
                {millsTitle}
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-lg font-sans font-semibold text-dark">{formatPrice(basePrice)}</span>
                {baseCompareAt > basePrice && (
                  <span className="text-sm font-sans text-muted line-through">{formatPrice(baseCompareAt)}</span>
                )}
                {discountPercentage && (
                  <span className="inline-flex items-center rounded-full bg-[#EFB74A] px-3 py-1 text-sm font-sans font-semibold text-dark">
                    {discountPercentage}% korting
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-sm font-sans text-dark">
                {[
                  'Verstelbare maalgraad voor elke bereiding',
                  'Ingebouwde LED-lamp voor nauwkeurig kruiden',
                  'USB-C oplaadbaar in circa 60 minuten',
                  'Keramisch maalwerk, duurzaam en roestvrij',
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
                        <span className="h-5.5 w-5.5 rounded-full" style={getMillsSwatchStyle(color)} />
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
                {MILLS_INFO_ROWS.map((row) => {
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
          {STORY_SECTIONS.map((section) => (
            <div key={section.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className={cn('relative overflow-hidden rounded-[24px] bg-surface aspect-square', section.reverse && 'order-1 lg:order-2')}>
                <Image src={section.image} alt={section.imageAlt} fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 680px" />
              </div>
              <div className={cn(section.reverse && 'order-2 lg:order-1')}>
                <h2 className="font-sans font-semibold text-dark leading-tight mb-5" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)' }}>
                  {section.title}
                  <br />
                  <span className="italic font-normal">{section.subtitle}</span>
                </h2>
                <p className="font-sans text-dark/85 text-base leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
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
              {MILLS_ROW1_LOOP.map((review, i) => (
                <MillsTestimonialCard key={`r1-${i}`} review={review} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="marquee-track-reverse"
              style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
            >
              {MILLS_ROW2_LOOP.map((review, i) => (
                <MillsTestimonialCard key={`r2-${i}`} review={review} />
              ))}
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
              <h2 className="font-sans font-bold text-dark tracking-tight leading-tight" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}>
                Nog vragen?
              </h2>
              <p className="font-sans text-muted text-sm mt-4 leading-relaxed">
                Alles wat je wilt weten over de Noctis peper- en zoutmolens.
              </p>
            </div>

            <Accordion.Root type="single" collapsible className="lg:col-span-2 divide-y divide-border">
              {MILLS_FAQS.map((faq) => (
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
