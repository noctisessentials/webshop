// ── Types ────────────────────────────────────────────────────────────────────

export type ProductColor = {
  name: string
  slug: string
  hex: string
  inStock: boolean
  wcId?: number    // WooCommerce product ID for this color variant
  wcSlug?: string  // WooCommerce product slug
}

export type Product = {
  id: string
  handle: string
  title: string
  subtitle: string
  price: number
  compareAtPrice?: number
  category: string
  categoryHandle: string
  description: string
  shortDescription: string
  badge?: string
  images: { src: string; alt: string }[]
  colors: ProductColor[]
  features: { icon: string; title: string; body: string }[]
  specs: { label: string; value: string }[]
  inStock: boolean
}

export type Collection = {
  handle: string
  title: string
  description: string
  products: Product[]
}

// ── Static product content ───────────────────────────────────────────────────
// Features, specs, and marketing copy that don't live in WooCommerce.
// Keyed by product family handle — consumed by lib/woocommerce.ts.

export const PRODUCT_STATIC: Record<
  string,
  {
    shortDescription: string
    description: string
    features: { icon: string; title: string; body: string }[]
    specs: { label: string; value: string }[]
  }
> = {
  '19-piece-kitchenware': {
    shortDescription:
      'Complete 19-piece kitchen tool collection. Food-safe. Matte finish. Available in curated tones.',
    description:
      'Everything you need, nothing you don\'t. The Noctis 19-Piece Kitchen Set brings a cohesive aesthetic to your countertop. Crafted from food-safe materials with a refined matte finish, each piece is designed to look as good as it performs.',
    features: [
      {
        icon: 'shield',
        title: 'Food-Safe Materials',
        body: 'All 19 pieces are made from BPA-free, food-grade materials that meet EU safety standards.',
      },
      {
        icon: 'palette',
        title: 'Curated Color Palette',
        body: 'Refined tones designed to complement any kitchen interior — from nordic neutrals to soft pastels.',
      },
      {
        icon: 'package',
        title: 'Complete Set',
        body: 'Spatulas, ladles, spoons, tongs, and more. A full kitchen toolkit in one cohesive set.',
      },
      {
        icon: 'gift',
        title: 'Gift-Ready Packaging',
        body: 'Arrives in premium packaging — ideal for housewarmings, birthdays, or self-gifting.',
      },
    ],
    specs: [
      { label: 'Pieces', value: '19' },
      { label: 'Material', value: 'Food-safe nylon & stainless steel' },
      { label: 'Care', value: 'Dishwasher safe' },
    ],
  },
  'pepper-salt-mills': {
    shortDescription:
      'Electric pepper and salt mills with ceramic grinding mechanism. Multiple colorways.',
    description:
      'Precision grinding. Refined form. The Noctis Pepper & Salt Mills are built for both performance and presence. A ceramic grinding mechanism ensures consistent results, while the clean silhouette adds quiet sophistication to any kitchen counter or dining table.',
    features: [
      {
        icon: 'zap',
        title: 'Electric Grinding',
        body: 'One-handed electric operation for effortless grinding at any grind setting.',
      },
      {
        icon: 'settings',
        title: 'Adjustable Coarseness',
        body: 'From fine to coarse — dial in the exact grind for any recipe.',
      },
      {
        icon: 'droplets',
        title: 'Ceramic Mechanism',
        body: 'Corrosion-resistant ceramic grinder maintains flavour integrity and lasts years.',
      },
      {
        icon: 'sparkles',
        title: 'Statement Design',
        body: 'Refined silhouette that looks equally at home on a countertop or a dinner table.',
      },
    ],
    specs: [
      { label: 'Mechanism', value: 'Ceramic electric' },
      { label: 'Power', value: 'Battery operated (included)' },
      { label: 'Height', value: '21 cm' },
    ],
  },
  'acacia-cutting-board': {
    shortDescription:
      'Solid acacia wood cutting board. Responsibly sourced. Naturally beautiful.',
    description:
      'Solid acacia wood, responsibly sourced. The Noctis Acacia Cutting Board is dense, durable, and naturally beautiful — the kind of object that improves with use. A generous cutting surface makes prep effortless, while the warm grain tone makes it the most elegant thing on your counter.',
    features: [
      {
        icon: 'tree-pine',
        title: 'Solid Acacia Wood',
        body: 'Dense, naturally antimicrobial hardwood that is gentle on knife edges.',
      },
      {
        icon: 'leaf',
        title: 'Responsibly Sourced',
        body: 'From sustainably managed forests. Better for the planet, better for your kitchen.',
      },
      {
        icon: 'shield',
        title: 'Naturally Antimicrobial',
        body: 'Acacia\'s tight grain inhibits bacterial growth without chemical treatments.',
      },
      {
        icon: 'rotate-ccw',
        title: 'Reversible',
        body: 'Two usable surfaces — flat for prep, grooved side catches juices from meat and fruit.',
      },
    ],
    specs: [
      { label: 'Material', value: 'Solid acacia wood' },
      { label: 'Dimensions', value: '40 × 30 × 2.5 cm' },
      { label: 'Care', value: 'Hand wash, oil regularly' },
      { label: 'Sides', value: 'Reversible (flat + grooved)' },
    ],
  },
}

// ── Static content ───────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Marike B.',
    rating: 5,
    text: 'De keukenset kwam prachtig verpakt aan, echt alsof je een cadeau uitpakt. De kwaliteit is precies wat je verwacht in deze prijsklasse. Alles voelt doordacht.',
    product: '19-delige keukenset in roze',
    date: 'Maart 2025',
  },
  {
    id: '2',
    name: 'Ludo V.',
    rating: 5,
    text: 'De prijs-kwaliteitverhouding is uitzonderlijk. We bestelden de mintgroene set voor ons nieuwe appartement en het ziet er exact zo stijlvol uit als gehoopt. Ook snel geleverd.',
    product: '19-delige keukenset in mintgroen',
    date: 'Februari 2025',
  },
  {
    id: '3',
    name: 'Els C.',
    rating: 5,
    text: 'Ik kocht de acacia snijplank als housewarming cadeau. Het oogde als een luxe item en de ontvanger kon de prijs bijna niet geloven. Ik kom zeker terug voor de molens.',
    product: 'Acacia snijplank',
    date: 'Januari 2025',
  },
]

export const FAQS = [
  {
    id: 'shipping',
    question: 'Hoe snel wordt mijn bestelling geleverd?',
    answer:
      'Bestel je voor 23:30 uur, dan verzenden we dezelfde werkdag. In Nederland en Belgie is je bestelling meestal binnen 1-2 werkdagen in huis.',
  },
  {
    id: 'returns',
    question: 'Wat is jullie retourbeleid?',
    answer:
      'Je hebt 14 dagen bedenktijd na ontvangst. Retour aanmelden is eenvoudig via onze klantenservice en we helpen je snel verder.',
  },
  {
    id: 'vision',
    question: 'Wat is de visie van Noctis?',
    answer:
      'Noctis is ontstaan vanuit één idee: rust in de keuken. We ontwerpen collecties waarin materialen, kleuren en functionaliteit op elkaar aansluiten, zodat je aanrecht rustig oogt en prettig werkt.',
  },
  {
    id: 'support',
    question: 'Hoe snel reageren jullie op vragen?',
    answer:
      'Ons supportteam reageert doorgaans binnen 24 uur op werkdagen. We helpen je met productadvies, bestellingen en retouren.',
  },
  {
    id: 'why-noctis',
    question: 'Waarom kiezen klanten voor Noctis?',
    answer:
      'Klanten kiezen Noctis voor de combinatie van stijl en gebruiksgemak: één lijn in kleur en uitstraling, zorgvuldig geselecteerde sets en betrouwbare levering.',
  },
]

export const FAQS_EN = [
  {
    id: 'shipping',
    question: 'How quickly will my order be delivered?',
    answer:
      'Order before 11:30 PM and we ship the same business day. In the Netherlands and Belgium your order usually arrives within 1–2 business days.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'You have 14 days to return after receiving your order. Registering a return is easy via our customer service and we will help you quickly.',
  },
  {
    id: 'vision',
    question: 'What is the Noctis vision?',
    answer:
      'Noctis was born from one idea: calm in the kitchen. We design collections where materials, colours and functionality align, so your countertop looks serene and works beautifully.',
  },
  {
    id: 'support',
    question: 'How quickly do you respond to questions?',
    answer:
      'Our support team typically responds within 24 hours on business days. We help you with product advice, orders and returns.',
  },
  {
    id: 'why-noctis',
    question: 'Why do customers choose Noctis?',
    answer:
      'Customers choose Noctis for the combination of style and ease of use: a consistent look and feel, carefully selected sets and reliable delivery.',
  },
]

export function getFAQS(locale: string) {
  return locale === 'en' ? FAQS_EN : FAQS
}

// ── Collection handles (static — used for generateStaticParams) ───────────────

export const COLLECTION_HANDLES = ['all', 'kitchen-sets', 'accessories']

// ── Product handles (static — used for generateStaticParams) ─────────────────

export const PRODUCT_HANDLES = [
  '19-piece-kitchenware',
  'pepper-salt-mills',
  'acacia-cutting-board',
]
