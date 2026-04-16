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
  return {
    title: isEn
      ? 'Noctis — Stylish Kitchen Accessories'
      : 'Noctis — Stijlvolle Keukenaccessoires',
    description: isEn
      ? 'Stylish kitchen accessories and tools. Curated for calm and cohesion. Free shipping. 14-day returns.'
      : 'Stijlvolle keukenaccessoires en tools. Samengesteld voor rust en eenheid in je keuken. Gratis verzending. 14 dagen retourneren.',
    alternates: buildAlternates(),
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
