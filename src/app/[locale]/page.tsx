import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getAllBlogPosts } from '@/lib/blog'
import { getWCProducts } from '@/lib/woocommerce'
import { Hero } from '@/components/sections/Hero'
import { ValueProps } from '@/components/sections/ValueProps'
import { EditorialBanner } from '@/components/sections/EditorialBanner'
import { Testimonials } from '@/components/sections/Testimonials'
import { HomeBlogHighlights } from '@/components/sections/HomeBlogHighlights'
import { InstagramGrid } from '@/components/sections/InstagramGrid'
import { HomeFAQ } from '@/components/sections/HomeFAQ'
import { Newsletter } from '@/components/sections/Newsletter'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/metadata'
import type { Product } from '@/lib/data'

// Deferred outside initial hydration — RAF loop + 30 Image components cause
// a 5-8s main thread block when hydrated synchronously with the rest of the page.
const ProductCarousel = dynamic<{ products: Product[] }>(
  () => import('@/components/sections/ProductCarousel').then((m) => ({ default: m.ProductCarousel })),
  {
    ssr: false,
    loading: () => (
      <section className="section-py-sm overflow-x-hidden">
        <div className="mb-8 px-6 md:px-10 xl:px-14">
          <div className="h-7 w-44 rounded-lg bg-dark/8 animate-pulse" />
        </div>
        <div className="flex gap-4 pl-6 md:pl-10 xl:pl-14">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: 'clamp(200px, 26vw, 270px)' }}>
              <div className="aspect-[3/4] rounded-[16px] bg-dark/8 animate-pulse mb-3" />
              <div className="h-4 w-3/4 rounded bg-dark/8 animate-pulse mb-2" />
              <div className="h-3 w-1/2 rounded bg-dark/8 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    ),
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  const title = isEn ? 'Noctis — Stylish Kitchen Accessories' : 'Noctis — Stijlvolle Keukenaccessoires'
  const description = isEn
    ? 'Discover Noctis: stylish kitchen accessories that bring calm and cohesion to your kitchen. Free shipping · 14-day returns · 5,000+ happy customers.'
    : 'Ontdek de collectie van Noctis: stijlvolle keukenaccessoires die rust en eenheid brengen in jouw keuken. Gratis verzending · 14 dagen retourneren · 5.000+ tevreden klanten.'
  return {
    title,
    description,
    alternates: buildAlternates(),
    openGraph: {
      title,
      description,
      images: [{ url: '/images/og-home.webp', width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function HomePage() {
  const posts = getAllBlogPosts()
  const [products, t] = await Promise.all([
    getWCProducts(),
    getTranslations('home'),
  ])

  return (
    <>
      <Hero />
      <ProductCarousel products={products} />
      <ValueProps />

      <div className="mx-auto w-full max-w-[980px] pt-8 md:pt-14">
        <EditorialBanner
          imageSrc="/images/pepre-en-zoutmolens-zwart-wit-lifestyle-keuken.webp"
          imageAlt="Noctis merkverhaal in een rustige keukenomgeving"
          eyebrow={t('editorial.eyebrow')}
          headlineLine1={t('editorial.headline')}
          body={t('editorial.body')}
          ctaLabel={t('editorial.cta')}
          ctaHref="/winkel"
          imagePosition="right"
          theme="light"
        />
      </div>

      <Testimonials />
      <HomeBlogHighlights posts={posts} />
      <InstagramGrid />
      <HomeFAQ />
      <Newsletter />
    </>
  )
}
