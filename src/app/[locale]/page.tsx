import type { Metadata } from 'next'
import { getWCProducts } from '@/lib/woocommerce'
import { getAllBlogPosts } from '@/lib/blog'
import { Hero } from '@/components/sections/Hero'
import { ValueProps } from '@/components/sections/ValueProps'
import { ProductCarousel } from '@/components/sections/ProductCarousel'
import { EditorialBanner } from '@/components/sections/EditorialBanner'
import { Testimonials } from '@/components/sections/Testimonials'
import { HomeBlogHighlights } from '@/components/sections/HomeBlogHighlights'
import { InstagramGrid } from '@/components/sections/InstagramGrid'
import { HomeFAQ } from '@/components/sections/HomeFAQ'
import { Newsletter } from '@/components/sections/Newsletter'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/metadata'

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
  const products = await getWCProducts()
  const posts = getAllBlogPosts()
  const t = await getTranslations('home')

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
