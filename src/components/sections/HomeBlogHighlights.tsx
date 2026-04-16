import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function HomeBlogHighlights({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null

  const featured = posts[0]
  const secondary = posts.slice(1, 4)

  return (
    <section className="section-py">
      <div className="container-content">
        <div className="flex items-center justify-between mb-7">
          <h2
            className="font-sans font-bold text-dark tracking-tight"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
          >
            Uit ons blog
          </h2>
          <Link
            href="/blog"
            className="text-xs font-sans font-semibold uppercase tracking-widest text-muted hover:text-dark transition-colors duration-200"
          >
            Bekijk alle blogs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-4">
          <article className="group bg-white border border-border rounded-[16px] overflow-hidden">
            <Link href={`/blog/${featured.slug}`} className="grid grid-cols-1 md:grid-cols-[48%_1fr] h-full">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 720px"
                />
              </div>
              <div className="p-5 md:p-6 flex flex-col">
                <p className="text-xs font-sans text-muted">
                  {featured.author} · {formatDate(featured.date)} · {featured.readTimeMinutes} min leestijd
                </p>
                <h3 className="mt-2 font-sans font-bold text-dark leading-tight text-[30px]">
                  {featured.title}
                </h3>
                <p className="mt-3 font-sans text-dark/75 text-base leading-relaxed">
                  {featured.excerpt}
                </p>
                <span className="mt-4 inline-flex text-sm font-sans font-semibold text-accent-dark">
                  Lees artikel →
                </span>
              </div>
            </Link>
          </article>

          <div className="space-y-4">
            {secondary.map((post) => (
              <article key={post.slug} className="group bg-white border border-border rounded-[16px] overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="grid grid-cols-[110px_1fr] md:grid-cols-[120px_1fr]">
                  <div className="relative h-full min-h-[120px]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="120px"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-sans text-muted">
                      {formatDate(post.date)} · {post.readTimeMinutes} min
                    </p>
                    <h4 className="mt-1.5 font-sans font-semibold text-dark text-[20px] leading-snug">
                      {post.title}
                    </h4>
                    <p className="mt-1.5 font-sans text-dark/70 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
