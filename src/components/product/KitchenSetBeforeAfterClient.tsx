'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Check, ChevronRight, Minus, Pause, Play, Plus,
  ShieldCheck, Truck, Volume2, VolumeX, X,
} from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { type Product, type ProductColor } from '@/lib/data'

// ─── gallery types + helpers (copied from PDP, LP variant) ───────────────────

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
  poster: '/images/pdp/kitchen-set-video-poster.webp',
}

// PDP image order per color: [clean product photo, lifestyle, messen, pollepels]
// LP swaps [0] and [1]: lifestyle first, clean photo second
const COLOR_GALLERY_IMAGES: Record<string, GalleryMediaItem[]> = {
  '19-piece-kitchenware-black': [
    { type: 'image', src: '/images/pdp/kitchen-set-black/lifestyle-new.webp',   alt: '19-delige keukenset zwart - lifestyle' },
    { type: 'image', src: '/images/pdp/kitchen-set-black/main.jpg',             alt: '19-delige keukenset zwart - productfoto' },
    { type: 'image', src: '/images/pdp/kitchen-set-black/zwart-messen.webp',    alt: '19-delige keukenset zwart - messen' },
    { type: 'image', src: '/images/pdp/kitchen-set-black/zwart-pollepels.webp', alt: '19-delige keukenset zwart - tools' },
  ],
  '19-piece-kitchenware-nude': [
    { type: 'image', src: '/images/pdp/kitchen-set-nude/lifestyle-new.webp', alt: '19-delige keukenset nude - lifestyle' },
    { type: 'image', src: '/images/products/kitchenware-nude.jpg',           alt: '19-delige keukenset nude - productfoto' },
    { type: 'image', src: '/images/pdp/kitchen-set-nude/messen.webp',        alt: '19-delige keukenset nude - messen' },
    { type: 'image', src: '/images/pdp/kitchen-set-nude/pollepels.webp',     alt: '19-delige keukenset nude - tools' },
  ],
  '19-piece-kitchenware-grey': [
    { type: 'image', src: '/images/pdp/kitchen-set-grey/lifestyle-new.webp', alt: '19-delige keukenset grijs - lifestyle' },
    { type: 'image', src: '/images/products/kitchenware-grey.jpg',           alt: '19-delige keukenset grijs - productfoto' },
    { type: 'image', src: '/images/pdp/kitchen-set-grey/messen.webp',        alt: '19-delige keukenset grijs - messen' },
    { type: 'image', src: '/images/pdp/kitchen-set-grey/pollepels.webp',     alt: '19-delige keukenset grijs - tools' },
  ],
  '19-piece-kitchenware-pink': [
    { type: 'image', src: '/images/pdp/kitchen-set-pink/lifestyle.webp',  alt: '19-delige keukenset roze - lifestyle' },
    { type: 'image', src: '/images/products/kitchenware-pink.jpg',        alt: '19-delige keukenset roze - productfoto' },
    { type: 'image', src: '/images/pdp/kitchen-set-pink/messen.webp',     alt: '19-delige keukenset roze - messen' },
    { type: 'image', src: '/images/pdp/kitchen-set-pink/pollepels.webp',  alt: '19-delige keukenset roze - tools' },
  ],
  '19-piece-kitchenware-mint-green': [
    { type: 'image', src: '/images/pdp/kitchen-set-mint/lifestyle.webp',  alt: '19-delige keukenset mintgroen - lifestyle' },
    { type: 'image', src: '/images/products/kitchenware-mint.jpg',        alt: '19-delige keukenset mintgroen - productfoto' },
    { type: 'image', src: '/images/pdp/kitchen-set-mint/messen.webp',     alt: '19-delige keukenset mintgroen - messen' },
    { type: 'image', src: '/images/pdp/kitchen-set-mint/pollepels.webp',  alt: '19-delige keukenset mintgroen - tools' },
  ],
}

function getGalleryImages(handle: string): GalleryMediaItem[] {
  const images = COLOR_GALLERY_IMAGES[handle] ?? COLOR_GALLERY_IMAGES['19-piece-kitchenware-black'] ?? []
  return [...images, KITCHEN_SET_VIDEO_ITEM]
}

// ─── buy module helpers ───────────────────────────────────────────────────────

const DUTCH_COLOR_MAP: Record<string, string> = {
  black: 'Zwart', white: 'Wit', grey: 'Grijs', gray: 'Grijs', nude: 'Nude',
  pink: 'Roze', green: 'Groen', mint: 'Mintgroen', 'mint-green': 'Mintgroen',
  zwart: 'Zwart', wit: 'Wit', grijs: 'Grijs', roze: 'Roze', groen: 'Groen', mintgroen: 'Mintgroen',
}

function getDutchColorName(color: ProductColor): string {
  return DUTCH_COLOR_MAP[color.slug.toLowerCase()] ?? DUTCH_COLOR_MAP[color.name.toLowerCase()] ?? color.name
}

function getDeliveryLine(referenceDate: Date): string {
  const d = new Date(referenceDate)
  d.setDate(d.getDate() + 1)
  let dayLabel = 'morgen'
  if (d.getDay() === 0) { d.setDate(d.getDate() + 1); dayLabel = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' }).format(d) }
  const formatted = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(d)
  return `Voor 23:30 uur besteld, ${dayLabel} (${formatted}) in huis`
}

const INFO_ROWS = [
  { id: 'product-details', title: 'Productdetails', body: 'Afmetingen: 14 × 30 × 38 cm.' },
  { id: 'daily-use', title: 'Gemaakt voor dagelijks gebruik', body: 'Zacht voor je pannen. Stevig in de hand. Ontworpen om elke dag prettig te gebruiken.' },
]

// Maps each color slug to the product id and cart thumbnail used in checkout
const COLOR_PRODUCT_META: Record<string, { id: string; image: string }> = {
  'black':      { id: '2640', image: '/images/products/kitchenware-black.jpg' },
  'nude':       { id: '1991', image: '/images/products/kitchenware-nude.jpg' },
  'grey':       { id: '2648', image: '/images/products/kitchenware-grey.jpg' },
  'pink':       { id: '2645', image: '/images/products/kitchenware-pink.jpg' },
  'mint-green': { id: '2642', image: '/images/products/kitchenware-mint.jpg' },
}

// ─── upsell helpers ───────────────────────────────────────────────────────────

type UpsellColorOption = {
  label: string
  hex: string
  background?: string
  wcId: number
  handle: string
  image: string
}

const MILLS_COLOR_OPTIONS: UpsellColorOption[] = [
  { label: 'Zwart wit', hex: '#2A2A2A', background: 'linear-gradient(135deg, #222222 50%, #DEDEDE 50%)', wcId: 2444, handle: 'pepper-salt-mills-black-white', image: '/images/products/mills-blackwhite.jpg' },
  { label: 'Zwart',     hex: '#2C2C2C', wcId: 2617, handle: 'pepper-salt-mills-black',       image: '/images/products/mills-black.jpg' },
  { label: 'Wit',       hex: '#F5F3F0', wcId: 2619, handle: 'pepper-salt-mills-white',       image: '/images/products/mills-white.jpg' },
  { label: 'Groen',     hex: '#4A6741', wcId: 2621, handle: 'pepper-salt-mills-green',       image: '/images/products/mills-green.jpg' },
]

const KITCHEN_COLOR_OPTIONS: UpsellColorOption[] = [
  { label: 'Zwart',     hex: '#1E1D1D', wcId: 2640, handle: '19-piece-kitchenware-black',      image: '/images/products/kitchenware-black.jpg' },
  { label: 'Nude',      hex: '#D4B49A', wcId: 1991, handle: '19-piece-kitchenware-nude',       image: '/images/products/kitchenware-nude.jpg' },
  { label: 'Grijs',     hex: '#B0AEAC', wcId: 2648, handle: '19-piece-kitchenware-grey',       image: '/images/products/kitchenware-grey.jpg' },
  { label: 'Roze',      hex: '#E8B4B8', wcId: 2645, handle: '19-piece-kitchenware-pink',       image: '/images/products/kitchenware-pink.jpg' },
  { label: 'Mintgroen', hex: '#7FB5A2', wcId: 2642, handle: '19-piece-kitchenware-mint-green', image: '/images/products/kitchenware-mint.jpg' },
]

/**
 * Labels and images live here, availability comes from the product's live WooCommerce stock
 * (Product.colors is stock-merged server-side in lib/woocommerce.ts).
 */
function inStockOnly(options: UpsellColorOption[], upsell: Product): UpsellColorOption[] {
  return options.filter(
    (option) => upsell.colors.find((color) => color.wcSlug === option.handle)?.inStock !== false
  )
}

function getUpsellColorOptions(upsell: Product): UpsellColorOption[] | null {
  if (upsell.handle.includes('pepper-salt-mills')) return inStockOnly(MILLS_COLOR_OPTIONS, upsell)
  if (upsell.handle.includes('19-piece-kitchenware')) return inStockOnly(KITCHEN_COLOR_OPTIONS, upsell)
  return null
}

function getDisplayName(upsell: Product): string {
  if (upsell.handle.includes('pepper-salt-mills')) return 'Peper- en zoutmolens zwart wit'
  if (upsell.handle.includes('acacia-cutting-board')) return 'Acacia snijplank'
  return upsell.title
}

function getSavingsAmount(upsell: Product): number {
  if (!upsell.compareAtPrice || upsell.compareAtPrice <= upsell.price) return 0
  return upsell.compareAtPrice - upsell.price
}

// ─── LP static data ───────────────────────────────────────────────────────────

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

const BEFORE_AFTER = [
  { before: 'Losse tools overal verspreid',               after: 'Alles in één houder op je aanrecht' },
  { before: 'Verschillende kleuren en merken door elkaar', after: 'Één kleur, één stijl, rust op je aanrecht' },
  { before: 'Steeds zoeken in een rommelige la',           after: 'Alles binnen handbereik tijdens het koken' },
  { before: 'Goedkope tools die snel oud ogen',            after: 'BPA-vrije siliconen die mooi blijven' },
  { before: 'Spatels die je pannen bekrassen',             after: 'Zachte siliconen, geen kras op anti-aanbak' },
]

// Reviews — copied from PDP
const KITCHEN_SET_PDP_TESTIMONIALS = [
  { id: 'ks-1', name: 'Sanne M.',  rating: 5, text: 'Sinds we de set hebben oogt ons aanrecht eindelijk rustig. Alles heeft een vaste plek en koken gaat echt sneller.',                          product: '19-delige keukenset in zwart',    date: 'April 2026' },
  { id: 'ks-2', name: 'Nina K.',   rating: 5, text: 'Ik was bang dat het vooral mooi zou zijn, maar hij is ook heel praktisch. Vooral de grip en het materiaal voelen premium.',                product: '19-delige keukenset in nude',     date: 'Maart 2026' },
  { id: 'ks-3', name: 'Marike B.', rating: 5, text: 'De set kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. Kwaliteit is precies wat je verwacht in deze prijsklasse.',          product: '19-delige keukenset in roze',     date: 'Februari 2026' },
  { id: 'ks-4', name: 'Ludo V.',   rating: 5, text: 'We kozen de mintgroene set voor ons nieuwe appartement en hij staat exact zo stijlvol als op de foto. Heel tevreden.',                   product: '19-delige keukenset in mintgroen',date: 'Januari 2026' },
  { id: 'ks-5', name: 'Emma R.',   rating: 5, text: 'Elke ochtend word ik blij van het aanrecht. De set voelt stevig en niets ziet er goedkoop uit.',                                        product: '19-delige keukenset in grijs',    date: 'December 2025' },
  { id: 'ks-6', name: 'Fleur D.',  rating: 5, text: 'Had ik dit maar eerder gedaan. We gebruiken bijna elk onderdeel dagelijks en alles blijft netjes georganiseerd.',                       product: '19-delige keukenset in nude',     date: 'Februari 2026' },
] as const

const TESTIMONIAL_ROW1 = KITCHEN_SET_PDP_TESTIMONIALS
const TESTIMONIAL_ROW2 = [...KITCHEN_SET_PDP_TESTIMONIALS].reverse()
const TESTIMONIAL_ROW1_LOOP = [...TESTIMONIAL_ROW1, ...TESTIMONIAL_ROW1]
const TESTIMONIAL_ROW2_LOOP = [...TESTIMONIAL_ROW2, ...TESTIMONIAL_ROW2]

// FAQ — copied from PDP
const KITCHEN_SET_FAQS = [
  {
    id: 'material',
    question: 'Waarvan is de keukenset gemaakt?',
    answer: 'De set is gemaakt van hoogwaardige, BPA-vrije materialen. De siliconen onderdelen zijn hittebestendig tot 230°C en veilig voor pannen met anti-aanbaklaag. De messen zijn van roestvrij staal en ontworpen voor dagelijks gebruik.',
  },
  {
    id: 'contents',
    question: 'Wat zit er in de 19-delige keukenset?',
    answer: 'Alles wat je nodig hebt voor dagelijks koken: Noctis Houder, Spatel, Pastalepel, Bakspatel, Slabestek, Opscheplepel, Soeplepel, Platte spatel, Pannenlikker, Tang, Garde, Oliekwast, Snijmes, Broodmes, Chef\'s mes, Universeelmes, Fruitmes, Keukenschaar en Snijplank.',
  },
  {
    id: 'dishwasher',
    question: 'Is de keukenset vaatwasserbestendig?',
    answer: 'Nee, voor een langere levensduur adviseren wij om de onderdelen met de hand af te wassen. Vermijd het gebruik van ruwe materialen en agressieve schoonmaakmiddelen, aangezien deze de onderdelen kunnen beschadigen.',
  },
  {
    id: 'delivery',
    question: 'Hoe snel wordt de keukenset geleverd?',
    answer: 'Wij bieden snelle levering binnen 1-2 werkdagen. Bestel nu en ontvang het snel met DHL of PostNL!',
  },
  {
    id: 'returns',
    question: 'Kan ik retourneren als ik van gedachten verander?',
    answer: 'Ja, je hebt 14 dagen bedenktijd. Stuur de set eenvoudig in originele staat terug voor volledige terugbetaling.',
  },
  {
    id: 'style-match',
    question: 'Past de set bij mijn keukenstijl?',
    answer: 'Zeker. De set is verkrijgbaar in meerdere tijdloze kleuren, ontworpen om moderne, klassieke en minimalistische keukens te complementeren.',
  },
] as const

// ─── sub-components ───────────────────────────────────────────────────────────

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

function TestimonialCard({ review }: { review: (typeof KITCHEN_SET_PDP_TESTIMONIALS)[number] }) {
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

// ─── component ───────────────────────────────────────────────────────────────

type Props = { product: Product; upsellProducts: Product[] }

export function KitchenSetBeforeAfterClient({ product, upsellProducts }: Props) {
  const router = useRouter()
  const { addItem } = useCart()

  // PDP gallery state
  const productSectionRef = useRef<HTMLElement | null>(null)
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [activeColorHandle, setActiveColorHandle] = useState(product.handle)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [openInfoRow, setOpenInfoRow] = useState('')
  const [isActiveVideoPlaying, setIsActiveVideoPlaying] = useState(true)

  // Buy module state
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>([])
  const [upsellColorMap, setUpsellColorMap] = useState<Record<string, UpsellColorOption>>({})
  const [adding, setAdding] = useState(false)

  // Reviews
  const [testimonialsPaused, setTestimonialsPaused] = useState(false)

  // LP-specific state
  const [activeSetPartId, setActiveSetPartId] = useState<SetPartId>('messen-schaar')
  const [muted0, setMuted0] = useState(true)
  const [muted1, setMuted1] = useState(true)
  const [muted2, setMuted2] = useState(true)
  const [playing0, setPlaying0] = useState(true)
  const [playing1, setPlaying1] = useState(false)
  const [playing2, setPlaying2] = useState(false)
  const vid0 = useRef<HTMLVideoElement>(null)
  const vid1 = useRef<HTMLVideoElement>(null)
  const vid2 = useRef<HTMLVideoElement>(null)

  const galleryItems = getGalleryImages(activeColorHandle)
  const activeGalleryItem = galleryItems[activeImageIndex] ?? galleryItems[0] ?? KITCHEN_SET_VIDEO_ITEM

  const selectedColor = product.colors.find((c) => c.wcSlug === activeColorHandle)
    ?? product.colors.find((c) => /black|zwart/.test(`${c.slug} ${c.name}`.toLowerCase()))
    ?? product.colors[0]

  const selectedColorName = getDutchColorName(selectedColor)
  const kitchenSetTitle = `19-delige keukenset ${selectedColorName.toLowerCase()}`
  const deliveryLine = getDeliveryLine(new Date())

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null

  const basePrice = product.price
  const baseCompareAt = product.compareAtPrice ?? product.price

  const sortedUpsells = [...upsellProducts].sort((a, b) =>
    (a.handle.includes('pepper-salt-mills') ? 0 : 1) - (b.handle.includes('pepper-salt-mills') ? 0 : 1)
  )

  const selectedUpsells = sortedUpsells.filter((u) => selectedUpsellIds.includes(u.id))
  const selectedUpsellsTotal = selectedUpsells.reduce((s, u) => s + u.price, 0)
  const hasBundleDiscount = selectedUpsells.length > 0
  const bundleDiscount = hasBundleDiscount ? Math.round((basePrice + selectedUpsellsTotal) * 0.10 * 100) / 100 : 0
  const totalCartValue = basePrice + selectedUpsellsTotal - bundleDiscount
  const klarnaSplit = totalCartValue / 3

  useEffect(() => {
    if (activeGalleryItem?.type === 'video') setIsActiveVideoPlaying(true)
  }, [activeImageIndex, activeGalleryItem?.type])

  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Color selection stays on LP — updates gallery without navigation
  const handleColorSelect = (color: ProductColor) => {
    if (!color.inStock) return
    const handle = color.wcSlug ?? color.slug
    setActiveColorHandle(handle)
    setActiveImageIndex(0)
  }

  const toggleActiveVideoPlayback = async () => {
    if (activeGalleryItem?.type !== 'video' || !activeVideoRef.current) return
    if (activeVideoRef.current.paused) { await activeVideoRef.current.play(); setIsActiveVideoPlaying(true) }
    else { activeVideoRef.current.pause(); setIsActiveVideoPlaying(false) }
  }

  const toggleUpsell = (id: string) =>
    setSelectedUpsellIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleAddToCart = async () => {
    setAdding(true)
    await new Promise((r) => setTimeout(r, 450))
    const meta = COLOR_PRODUCT_META[selectedColor.slug] ?? { id: product.id, image: product.images[0]?.src ?? '' }
    addItem({
      ...product,
      id: meta.id,
      handle: activeColorHandle,
      title: kitchenSetTitle,
      images: [{ src: meta.image, alt: kitchenSetTitle }],
    }, selectedColor, 1)
    for (const upsell of selectedUpsells) {
      const opt = upsellColorMap[upsell.id]
      if (opt) {
        const color: ProductColor = { name: opt.label, slug: opt.handle, hex: opt.hex, inStock: true, wcId: opt.wcId }
        addItem({ ...upsell, handle: opt.handle, images: [{ src: opt.image, alt: opt.label }] }, color, 1)
      } else {
        addItem(upsell, upsell.colors[0] ?? selectedColor, 1)
      }
    }
    setAdding(false)
  }

  const handleUpsellNavigate = (handle: string) => router.push(`/products/${handle}`)

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
    if (states[idx]) { ref.pause(); setters[idx](false) } else { ref.play(); setters[idx](true) }
  }

  const videoRefs = [vid0, vid1, vid2]
  const mutedState = [muted0, muted1, muted2]
  const playingState = [playing0, playing1, playing2]

  return (
    <div className="bg-[#F0EDE8] overflow-x-clip">

      {/* ── HOOK BOVEN PRODUCT ───────────────────────────────────────────────── */}
      <section className="bg-light pt-10 pb-3 md:pt-14 md:pb-4">
        <div className="container-content text-center">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-4">
            19-delige keukenset
          </p>
          <h1 className="font-sans font-bold text-dark leading-none tracking-tight" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
            Van rommel{' '}
            <span className="font-normal italic" style={{ color: '#A4744C' }}>naar rust</span>
          </h1>
          <p className="mt-4 font-sans text-dark/55 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Eén set vervangt alles. Alles matched. Alles heeft een vaste plek.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm font-sans text-dark/55">
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5 text-[#16A34A]">{'★★★★★'}</span>
              <span>5.000+ klanten</span>
            </span>
            <span className="hidden sm:inline text-dark/20">·</span>
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-dark/35" />
              Morgen in huis
            </span>
            <span className="hidden sm:inline text-dark/20">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-dark/35" />
              14 dagen retour
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTIE 1: EXACT PDP PRODUCT SECTIE ──────────────────────────────── */}
      <section ref={productSectionRef} className="section-py bg-light">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 xl:gap-14 items-start">

            {/* Left column: gallery */}
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
                        <video src={item.src} poster={item.poster} className="h-full w-full object-cover object-center" muted loop playsInline autoPlay preload="metadata" />
                        <span className="absolute right-1.5 bottom-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white">
                          <Play size={11} />
                        </span>
                      </>
                    ) : (
                      <Image src={item.src} alt={item.alt} fill quality={95} className="object-cover object-center" sizes="80px" />
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
                        autoPlay loop muted playsInline controls={false} preload="metadata"
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
                      fill priority quality={95}
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
                          <video src={item.src} poster={item.poster} className="h-full w-full object-cover object-center" muted loop playsInline autoPlay preload="metadata" />
                          <span className="absolute right-1 bottom-1 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/60 text-white">
                            <Play size={9} />
                          </span>
                        </>
                      ) : (
                        <Image src={item.src} alt={item.alt} fill quality={95} className="object-cover object-center" sizes="64px" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right aside: buy module */}
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
                {kitchenSetTitle}
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
                          selectedColor.slug === color.slug ? 'border-dark scale-110' : 'border-transparent hover:border-dark/30',
                          !color.inStock && 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        <span className="h-5 w-5 rounded-full" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sortedUpsells.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-sans font-semibold text-dark flex-1">
                      Maak je keuken compleet en bespaar 10%
                    </h3>
                    <span className="flex-shrink-0 inline-flex rounded-full bg-[#EAF4FF] px-2.5 py-1 text-xs font-sans font-semibold text-[#1a6fb8]">
                      Bundle deal
                    </span>
                  </div>
                  {sortedUpsells.map((upsell) => {
                    const isSelected = selectedUpsellIds.includes(upsell.id)
                    const savingsAmount = getSavingsAmount(upsell)
                    const colorOptions = getUpsellColorOptions(upsell)
                    const activeOption = upsellColorMap[upsell.id] ?? colorOptions?.[0] ?? null
                    const activeImage = activeOption?.image ?? upsell.images[0]?.src ?? '/images/products/acacia.jpg'
                    const activeLabel = activeOption
                      ? `${upsell.handle.includes('pepper') ? 'Peper- en zoutmolens' : '19-delige keukenset'} ${activeOption.label}`
                      : getDisplayName(upsell)

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
                        <div className="flex items-start gap-3">
                          <span className={cn('h-5 w-5 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0', isSelected ? 'border-[#56A5F8] bg-[#EAF4FF]' : 'border-border bg-white')}>
                            {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#56A5F8]" />}
                          </span>
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-surface flex-shrink-0">
                            <Image src={activeImage} alt={activeLabel} fill className="object-cover object-center" sizes="48px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-sans font-semibold text-dark leading-snug">{activeLabel}</p>
                            {colorOptions && (
                              <div className="mt-1.5 flex gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                {colorOptions.map((opt) => {
                                  const isActive = activeOption?.handle === opt.handle
                                  return opt.background ? (
                                    <button
                                      key={opt.handle}
                                      type="button"
                                      title={opt.label}
                                      onClick={() => setUpsellColorMap((prev) => ({ ...prev, [upsell.id]: opt }))}
                                      className={cn('h-4 w-4 rounded-full border-2 overflow-hidden flex transition-all duration-150', isActive ? 'border-dark scale-110' : 'border-transparent hover:border-dark/40')}
                                    >
                                      <span className="flex-1 h-full" style={{ backgroundColor: '#222222' }} />
                                      <span className="flex-1 h-full" style={{ backgroundColor: '#DEDEDE' }} />
                                    </button>
                                  ) : (
                                    <button
                                      key={opt.handle}
                                      type="button"
                                      title={opt.label}
                                      onClick={() => setUpsellColorMap((prev) => ({ ...prev, [upsell.id]: opt }))}
                                      className={cn('h-4 w-4 rounded-full border-2 transition-all duration-150', isActive ? 'border-dark scale-110' : 'border-transparent hover:border-dark/40')}
                                      style={{ backgroundColor: opt.hex }}
                                    />
                                  )
                                })}
                              </div>
                            )}
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
                            onClick={(e) => { e.stopPropagation(); handleUpsellNavigate(activeOption?.handle ?? upsell.handle) }}
                            aria-label={`Ga naar ${activeLabel}`}
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

              {hasBundleDiscount && (
                <div className="flex items-center justify-between rounded-xl bg-[#EAF4FF] px-4 py-3 text-sm font-sans">
                  <span className="text-[#1a6fb8] font-medium">10% bundelkorting</span>
                  <span className="text-[#1a6fb8] font-semibold">- {formatPrice(bundleDiscount)}</span>
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
                      {isOpen && <p className="pb-4 text-sm font-sans text-muted leading-relaxed">{row.body}</p>}
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER (copied from PDP) ─────────────────────────────────────── */}
      <section className="bg-light py-2 md:py-3">
        <div className="container-content">
          <p className="text-center text-xs md:text-sm font-sans text-muted">
            Niet vaatwasserbestendig. Voor langdurige kwaliteit raden we handwas aan.
          </p>
        </div>
      </section>

      {/* ── EDITORIAL SECTIES (exact van PDP) ───────────────────────────────── */}
      <section className="bg-light section-py">
        <div className="container-content space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative overflow-hidden rounded-[24px] bg-surface aspect-square">
              <video
                src="/videos/nude-grab-set-comp.mp4"
                poster="/images/pdp/nude-grab-set-poster.jpg"
                className="h-full w-full object-cover"
                autoPlay loop muted playsInline
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
                poster="/images/pdp/spatel-pan-grijs-poster.jpg"
                className="h-full w-full object-cover"
                autoPlay loop muted playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIE 2: HERKENNING ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div data-animate className="text-center mb-10">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">Herkenbaar?</p>
            <h2 className="font-sans font-bold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}>
              Dit verandert er als je overstapt op Noctis.
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
            {BEFORE_AFTER.map((item, i) => (
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
        </div>
      </section>

      {/* ── SECTIE 3: BEFORE/AFTER VISUAL ────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#F0EDE8]">
        <div className="max-w-5xl mx-auto">
          <div data-animate className="text-center mb-8">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">VAN ROMMEL NAAR RUST</p>
            <h2 className="font-sans font-bold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}>Het verschil zit in één keuze.</h2>
          </div>
          <div className="relative w-full rounded-[20px] overflow-hidden aspect-square md:hidden">
            <Image src="/content/before_after_PDP_mobile.jpg" alt="Voor en na" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute bottom-0 left-0 right-0 flex">
              <div className="flex-1 bg-black/50 backdrop-blur-sm py-2 text-center">
                <span className="text-white text-xs font-sans font-semibold uppercase tracking-widest">Voorheen</span>
              </div>
              <div className="flex-1 bg-[#A4744C]/80 backdrop-blur-sm py-2 text-center">
                <span className="text-white text-xs font-sans font-semibold uppercase tracking-widest">Met Noctis</span>
              </div>
            </div>
          </div>
          <div className="relative w-full rounded-[24px] overflow-hidden hidden md:block" style={{ aspectRatio: '8/3' }}>
            <Image src="/content/before_after_PDP.jpeg" alt="Voor en na" fill className="object-cover object-center" sizes="90vw" />
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

      {/* ── SECTIE 4: WAT ZIT ERIN ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div data-animate className="relative rounded-[20px] border border-[#E8E4DE] bg-[#F8F5F1] p-4">
            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[#F8F5F1]">
              <Image src="/content/transp-set-nude-website-banner.webp" alt="Alle 19 tools" fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, 50vw" />
              {SET_PARTS.map((part, index) => {
                const isActive = part.id === activeSetPartId
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActiveSetPartId(part.id)}
                    className={cn('absolute z-10 h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-200 hotspot-bubble text-sm font-sans font-bold', part.markerClassName, isActive ? 'border-accent bg-accent text-white shadow-[0_8px_20px_rgba(164,116,76,0.35)]' : 'border-[#1F2937]/20 bg-[#1F2937] text-white hover:bg-[#111827]')}
                    aria-label={part.title}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
          <div data-animate>
            <h2 className="font-sans font-bold text-dark leading-tight mb-1" style={{ fontSize: 'clamp(24px, 2.8vw, 40px)' }}>
              Alles wat je nodig hebt.
            </h2>
            <p className="font-sans font-normal italic mb-4" style={{ fontSize: 'clamp(22px, 2.6vw, 38px)', color: '#A4744C' }}>
              In één set.
            </p>
            <p className="font-sans text-dark/50 text-base leading-relaxed mb-5">Geen losse tools. Geen mismatch. Gewoon compleet.</p>
            <div className="space-y-2">
              {SET_PARTS.map((part, index) => {
                const isActive = part.id === activeSetPartId
                return (
                  <div
                    key={part.id}
                    className={cn('rounded-[14px] border px-4 py-3 transition-colors duration-200 cursor-pointer', isActive ? 'border-accent/30 bg-accent/5' : 'border-[#E8E4DE] bg-white')}
                    onClick={() => setActiveSetPartId(part.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn('inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200', isActive ? 'bg-accent text-white' : 'bg-[#F0EDE8] text-dark')}>
                        {index + 1}
                      </span>
                      <span className={cn('text-sm font-sans font-medium', isActive ? 'text-accent' : 'text-dark/85')}>{part.title}</span>
                    </div>
                    {isActive && <p className="mt-3 ml-10 text-sm font-sans text-dark/60 leading-relaxed">{part.body}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIE 5: LIFESTYLE GRID ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#F0EDE8]">
        <div className="max-w-4xl mx-auto">
          <div data-animate className="text-center mb-8">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-accent mb-3">In het echt</p>
            <h2 className="font-sans font-bold text-dark" style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}>Zo ziet rust eruit.</h2>
          </div>
          <div data-animate className="flex gap-2">
            <div className="w-[62%] relative aspect-[4/5] rounded-[10px] overflow-hidden flex-shrink-0 group">
              <Image src="/content/grid-top-left.webp" alt="Noctis keukenset op aanrecht" fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" sizes="40vw" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="relative flex-1 rounded-[10px] overflow-hidden group">
                <Image src="/content/grid-top-right.webp" alt="Noctis mes in gebruik" fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" sizes="20vw" />
              </div>
              <div className="relative flex-1 rounded-[10px] overflow-hidden group">
                <Image src="/content/grid-middle-right.webp" alt="Noctis spatel in gebruik" fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" sizes="20vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIE 6: UGC VIDEOS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#F0EDE8]">
        <div className="container-content mb-8">
          <h2 className="font-sans font-bold text-dark mb-2" style={{ fontSize: 'clamp(20px, 2.2vw, 32px)' }}>Wat mensen zeggen na de switch</h2>
          <p className="font-sans text-dark/45 text-sm">Bekijk hoe het bij anderen in de keuken staat.</p>
        </div>
        <div className="flex gap-3 px-4 md:px-8 overflow-x-auto md:overflow-visible md:justify-center" style={{ WebkitOverflowScrolling: 'touch' }}>
          {videoRefs.map((ref, i) => {
            const v = [{ src: '/videos/ugc-1.mp4', autoplay: true }, { src: '/videos/ugc-2.mp4', autoplay: false }, { src: '/videos/ugc-3.mp4', autoplay: false }][i]
            return (
              <div key={v.src} className="relative flex-shrink-0 w-[150px] md:w-[200px] aspect-[9/16] rounded-[12px] overflow-hidden bg-dark">
                <video
                  ref={ref as React.RefObject<HTMLVideoElement>}
                  src={v.src}
                  className="absolute inset-0 h-full w-full object-cover brightness-90"
                  autoPlay muted loop playsInline preload="auto"
                  onLoadedData={(e) => { if (!v.autoplay) { e.currentTarget.pause(); e.currentTarget.currentTime = 0 } }}
                />
                <button type="button" onClick={() => togglePlay(i)} aria-label={playingState[i] ? 'Pauzeren' : 'Afspelen'} className="absolute left-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm">
                  {playingState[i] ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button type="button" onClick={() => toggleMute(i)} aria-label={mutedState[i] ? 'Geluid aan' : 'Dempen'} className="absolute right-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm">
                  {mutedState[i] ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── SECTIE 7: REVIEWS (exact van PDP, dual-row marquee) ──────────────── */}
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
            <h2 className="font-sans font-semibold text-dark tracking-tight" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
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
            <span className="text-dark/30">→</span>
          </a>
        </div>
      </section>

      {/* ── SECTIE 8: FAQ (exact van PDP, 3-col layout) ──────────────────────── */}
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

      {/* ── SECTIE 9: EMOTIONELE AFSLUITER + CTA ────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 bg-[#EAE5DE]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-sans font-bold text-dark leading-none mb-1" style={{ fontSize: 'clamp(28px, 3.5vw, 50px)' }}>
              Jouw aanrecht,
            </h2>
            <p className="font-sans font-normal italic mb-5" style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', color: '#A4744C' }}>
              eindelijk rustig.
            </p>
            <p className="font-sans text-dark/45 text-base mb-8">Gratis verzending · Morgen in huis · 14 dagen retour</p>
            <Button
              variant="accent"
              size="xl"
              onClick={() => productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Bestel nu ↑
            </Button>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-sm text-[#00B67A]">★</span>)}
              </div>
              <p className="text-sm font-sans font-medium text-dark/60">5.000+ tevreden klanten</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
            <Image src="/images/pdp/kitchen-set-nude/lifestyle-vrouw.webp" alt="Noctis keukenset rustig aanrecht" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

    </div>
  )
}
