import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllBlogPosts } from '@/lib/blog'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('blog')
  return {
    title: `${t('title')} | Noctis`,
    description: t('subtitle'),
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts = getAllBlogPosts()
  const featured = posts[0]
  const remaining = posts.slice(1)
  const t = await getTranslations('blog')

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted">
            <Link href="/" className="hover:text-dark transition-colors">{t('breadcrumb') === 'Inspiratie' ? 'Home' : 'Home'}</Link>
            <span>/</span>
            <span className="text-dark">{t('breadcrumb')}</span>
          </nav>
        </div>
      </div>

      <div className="container-content py-14 md:py-20">
        <div className="mb-10 md:mb-12">
          <h1 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('title')}
          </h1>
          <p className="mt-3 text-base font-sans text-muted max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-dark/50 font-sans">{t('empty')}</p>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            <article className="group bg-white border border-border rounded-[20px] overflow-hidden">
              <Link href={{ pathname: '/blog/[slug]', params: { slug: featured.slug } }} className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px]">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 64vw"
                  />
                </div>
                <div className="p-6 md:p-8 bg-[#EEE7E1] flex flex-col justify-center">
                  <p className="text-xs font-sans uppercase tracking-[0.18em] text-accent mb-3">
                    {t('featured')}
                  </p>
                  <h2 className="font-sans font-bold text-dark leading-tight" style={{ fontSize: 'clamp(28px, 3.3vw, 48px)' }}>
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base md:text-lg font-sans text-dark/80 leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <p className="mt-5 text-sm font-sans text-dark/70">
                    {featured.author} · {formatDate(featured.date, locale)} · {featured.readTimeMinutes} {t('minRead')}
                  </p>
                  <span className="mt-6 inline-flex text-sm font-sans font-semibold text-accent-dark">
                    {t('readArticle')}
                  </span>
                </div>
              </Link>
            </article>

            {remaining.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {remaining.map((post) => (
                  <article key={post.slug} className="group bg-white border border-border rounded-[16px] overflow-hidden">
                    <Link href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}>
                      <div className="relative aspect-[16/10] bg-surface">
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4 md:p-5">
                        <p className="text-xs font-sans text-muted">
                          {formatDate(post.date, locale)} · {post.readTimeMinutes} {t('minRead')}
                        </p>
                        <h3 className="mt-2 font-sans font-semibold text-dark leading-snug text-[22px] group-hover:text-accent-dark transition-colors duration-200">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm font-sans text-dark/70 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
