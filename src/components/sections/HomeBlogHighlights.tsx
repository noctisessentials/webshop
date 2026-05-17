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

  const visible = posts.slice(0, 3)

  return (
    <section className="section-py-sm">
      <div className="container-content">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted">
            Inspiratie
          </p>
          <Link
            href="/blog"
            className="text-xs font-sans font-semibold uppercase tracking-widest text-muted hover:text-dark transition-colors duration-200"
          >
            Bekijk alle blogs
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {visible.map((post) => (
            <article key={post.slug} className="group flex-shrink-0 w-[72vw] max-w-[260px] md:w-auto md:max-w-none">
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden mb-3">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 260px, 33vw"
                  />
                </div>
                <p className="text-[11px] font-sans text-muted mb-1">
                  {formatDate(post.date)} · {post.readTimeMinutes} min
                </p>
                <h3 className="font-sans font-semibold text-dark text-sm leading-snug line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <span className="text-[11px] font-sans font-semibold text-accent-dark">
                  Lees →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
