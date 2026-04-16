import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type ReviewCard = {
  id: string
  title: string
  text: string
  author: string
  image: string
  imageAlt: string
  productName: string
  productPrice: string
  productThumb: string
}

const REVIEW_CARDS: ReviewCard[] = [
  {
    id: 'prijs-kwaliteit-top',
    title: 'Prijs Kwaliteit Top',
    text: 'Uitstekende prijs-kwaliteitverhouding en goede service. Prachtig verpakt.',
    author: 'Ludo',
    image: '/content/reviews/prijs-kwaliteit-top.webp',
    imageAlt: 'Review foto van 19-delige keukenset nude op vensterbank',
    productName: '19-delige keukenset nude',
    productPrice: '€64.95',
    productThumb: '/images/products/kitchenware-nude.jpg',
  },
  {
    id: 'eerste-keer-besteld',
    title: 'Eerste Keer Besteld',
    text: 'Binnen 2 dagen bezorgd en de set is super mooi. Echt de prijs waard.',
    author: 'Snoek',
    image: '/content/reviews/eerste-keer-besteld.webp',
    imageAlt: 'Review foto van 19-delige keukenset zwart in keuken',
    productName: '19-delige keukenset zwart',
    productPrice: '€64.95',
    productThumb: '/images/products/kitchenware-black.jpg',
  },
  {
    id: 'fantastisch',
    title: 'Fantastisch',
    text: 'Mooi product, staat super in de keuken en alles wat je nodig hebt zit erbij.',
    author: 'Annemieke',
    image: '/content/reviews/fantastisch.webp',
    imageAlt: 'Review foto van 19-delige keukenset nude op keukenblad',
    productName: '19-delige keukenset nude',
    productPrice: '€64.95',
    productThumb: '/images/products/kitchenware-nude.jpg',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} van de 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13">
          <path
            d="M6.5 1l1.17 2.373L10.5 3.8 8.5 5.75l.47 2.737L6.5 7.25 4.03 8.487 4.5 5.75 2.5 3.8l2.83-.427L6.5 1z"
            fill={i < rating ? '#E8AF15' : 'none'}
            stroke={i < rating ? '#E8AF15' : '#D1C5BA'}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  )
}

function ReviewCardItem({ review }: { review: ReviewCard }) {
  return (
    <article className="group bg-white border border-border rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(30,29,29,0.12)]">
      <div className="relative aspect-[4/5]">
        <Image
          src={review.image}
          alt={review.imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
        />
      </div>

      <div className="p-3.5 md:p-4 flex flex-col">
        <StarRating rating={5} />
        <h3 className="mt-2 font-sans font-bold text-dark text-[18px] leading-tight">
          {review.title}
        </h3>
        <p className="mt-1.5 font-sans text-dark text-[15px] leading-relaxed">
          {review.text}
        </p>
        <p className="mt-1.5 font-sans font-semibold text-dark text-[16px]">{review.author}</p>

        <div className="mt-3 border-t border-border pt-3">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden bg-surface flex-shrink-0">
              <Image src={review.productThumb} alt={review.productName} fill className="object-cover object-center" sizes="44px" />
            </div>
            <div>
              <p className="font-sans font-semibold text-dark text-[14px] leading-tight">
                {review.productName}
              </p>
              <p className="mt-0.5 font-sans font-semibold text-dark text-[16px]">
                {review.productPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function Testimonials() {
  return (
    <section className="section-py">
      <div className="container-content">
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="font-sans font-bold text-dark tracking-tight"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
          >
            Geliefd bij keukenliefhebbers
          </h2>
          <p className="mt-3 text-sm md:text-base font-sans text-muted">
            Ontdek waarom duizenden mensen vertrouwen op Noctis in hun keuken.
          </p>
        </div>

        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {REVIEW_CARDS.map((review) => (
              <ReviewCardItem key={review.id} review={review} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="https://nl.trustpilot.com/review/noctisessentials.com" target="_blank" rel="noopener noreferrer">
              Bekijk alle beoordelingen
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
