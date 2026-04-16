import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'
import { getWCProducts } from '@/lib/woocommerce'
import { ProductCarousel } from '@/components/sections/ProductCarousel'
import type { Product } from '@/lib/data'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { buildDynamicAlternates } from '@/lib/metadata'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllBlogPosts().map((post) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Artikel niet gevonden | Noctis' }

  return {
    title: `${post.title} | Noctis`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: buildDynamicAlternates(`/blog/${post.slug}`, `/blog/${post.slug}`),
    openGraph: {
      title: `${post.title} | Noctis`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function headingToId(heading: string) {
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function pickByHandleOrder(products: Product[], handleHints: string[]): Product[] {
  const picked: Product[] = []
  const seen = new Set<string>()
  for (const hint of handleHints) {
    const match = products.find((product) => product.handle.includes(hint))
    if (!match || seen.has(match.id)) continue
    picked.push(match)
    seen.add(match.id)
  }
  return picked
}

function getRelatedProductsForPost(slug: string, products: Product[]): Product[] {
  if (slug === 'de-perfecte-keuken-setup-voor-een-rustig-aanrecht') {
    const ordered = pickByHandleOrder(products, [
      '19-piece-kitchenware-black',
      '19-piece-kitchenware-nude',
      'pepper-salt-mills-black-white',
      'pepper-salt-mills-green',
      'acacia-cutting-board',
    ])
    if (ordered.length >= 3) return ordered
  }
  if (slug === 'waarom-een-acacia-snijplank-de-beste-keuze-is') {
    const ordered = pickByHandleOrder(products, [
      'acacia-cutting-board',
      '19-piece-kitchenware-nude',
      '19-piece-kitchenware-black',
      'pepper-salt-mills-black-white',
    ])
    if (ordered.length >= 3) return ordered
  }
  if (slug === 'hoe-kies-je-de-juiste-kleur-voor-je-keuken') {
    const ordered = pickByHandleOrder(products, [
      '19-piece-kitchenware-nude',
      '19-piece-kitchenware-grey',
      '19-piece-kitchenware-pink',
      '19-piece-kitchenware-mint-green',
      '19-piece-kitchenware-black',
    ])
    if (ordered.length >= 3) return ordered
  }
  return products.slice(0, 5)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const wcProducts = await getWCProducts()
  const relatedProducts = getRelatedProductsForPost(slug, wcProducts)
  const sectionNav = post.sections.map((section) => ({
    ...section,
    id: headingToId(section.heading),
  }))
  const t = await getTranslations('blog')

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Noctis',
      url: 'https://noctisessentials.com',
    },
    image: [post.image],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://noctisessentials.com/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <div className="bg-light min-h-screen">
      <Script id={`article-schema-${post.slug}`} type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </Script>
      <Script id={`faq-schema-${post.slug}`} type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </Script>

      <div className="container-content py-8 md:py-10">
        <article>
          <section className="overflow-hidden rounded-[20px] border border-border bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-[#EEE7E1] px-8 md:px-10 lg:px-12 py-8 md:py-10 flex flex-col justify-between">
                <div className="mb-10">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-sans font-medium text-dark hover:text-accent transition-colors"
                  >
                    {t('backToAll')}
                  </Link>
                </div>
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.18em] text-accent mb-3">{t('guideLabel')}</p>
                  <h1 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 62px)' }}>
                    {post.title}
                  </h1>
                  <p className="mt-6 text-base md:text-lg font-sans text-dark/85">
                    {post.author} <span className="mx-2 text-dark/45">|</span> {formatDate(post.date, locale)}
                    <span className="mx-2 text-dark/45">|</span>
                    {post.readTimeMinutes} {t('minRead')}
                  </p>
                </div>
              </div>
              <div className="relative min-h-[320px] md:min-h-[540px]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </section>

          <section className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-12">
            <div className="min-w-0">
              <div className="rounded-[16px] border border-border bg-white px-6 py-6 md:px-8 md:py-8">
                <h2 className="font-sans font-semibold text-dark text-2xl md:text-3xl">{t('summary')}</h2>
                <p className="mt-3 font-sans text-dark/80 text-base md:text-lg leading-relaxed">{post.excerpt}</p>
                <p className="mt-4 text-sm font-sans text-muted">{post.sourceNote}</p>
              </div>

              {post.supportImage && (
                <figure className="mt-8 rounded-[16px] overflow-hidden border border-border bg-white">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.supportImage}
                      alt={post.supportImageAlt ?? post.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                  </div>
                </figure>
              )}

              <div className="mt-10 space-y-10 md:space-y-12">
                {sectionNav.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="font-sans font-semibold text-dark leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}>
                      {section.heading}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index} className="font-sans text-dark/85 text-base md:text-[20px] leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-5 space-y-2 pl-5">
                        {section.bullets.map((item) => (
                          <li key={item} className="list-disc font-sans text-dark/85 text-base md:text-[20px] leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <section className="mt-14">
                <h2 className="font-sans font-semibold text-dark mb-5" style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
                  {t('faqTitle')}
                </h2>
                <div className="space-y-4">
                  {post.faq.map((item, index) => (
                    <details key={item.question} className="group rounded-[16px] border border-border bg-white px-6 py-5" open={index === 0}>
                      <summary className="cursor-pointer list-none font-sans font-semibold text-dark text-lg flex items-center justify-between gap-4">
                        {item.question}
                        <span className="text-muted group-open:rotate-45 transition-transform duration-200">+</span>
                      </summary>
                      <p className="mt-3 font-sans text-dark/80 text-base leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start rounded-[16px] border border-border bg-white p-5 h-fit">
              <p className="text-xs font-sans uppercase tracking-[0.18em] text-accent">{t('contents')}</p>
              <p className="mt-3 text-sm font-sans text-dark/75">
                {formatDate(post.date, locale)} · {post.readTimeMinutes} {t('minRead')}
              </p>
              <nav className="mt-4 max-h-[52vh] overflow-y-auto pr-1">
                <ul className="space-y-2.5">
                  {sectionNav.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block text-sm font-sans text-dark/75 hover:text-accent transition-colors duration-200 leading-relaxed"
                      >
                        {index + 1}. {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </section>

          <div className="pt-12 md:pt-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-dark hover:text-accent transition-colors"
            >
              {t('backToInspiration')}
            </Link>
          </div>
        </article>
      </div>

      {relatedProducts.length > 0 && (
        <div className="pb-16 md:pb-20">
          <ProductCarousel
            products={wcProducts}
            customProducts={relatedProducts}
            title={t('relatedTitle')}
            showViewAllLink={true}
            viewAllHref="/winkel"
            viewAllLabel={t('viewAll')}
          />
        </div>
      )}
    </div>
  )
}
