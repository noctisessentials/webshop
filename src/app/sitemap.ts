import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'
import { getWCProductSlugs } from '@/lib/woocommerce'

const BASE_URL = 'https://noctisessentials.com'
const LOCALES = ['nl', 'en'] as const

// NL internal path → EN slug mapping for translated routes
const ROUTE_MAP: Record<string, string> = {
  '/winkel': '/shop',
  '/19-delige-keukenset': '/19-piece-kitchen-set',
  '/peper-en-zoutmolens': '/pepper-salt-mills',
  '/acacia-snijplank': '/acacia-cutting-board',
  '/over-ons': '/about',
  '/veelgestelde-vragen': '/faq',
  '/retourneren': '/returns',
  '/privacybeleid': '/privacy-policy',
  '/verzendbeleid': '/shipping-policy',
  '/algemene-voorwaarden': '/terms-and-conditions',
  '/contact': '/contact',
  '/blog': '/blog',
  '/account': '/account',
}

function getLocalePath(nlPath: string, locale: string): string {
  if (locale === 'en') {
    const enPath = ROUTE_MAP[nlPath]
    return enPath ? `/${locale}${enPath}` : `/${locale}${nlPath}`
  }
  return `/${locale}${nlPath}`
}

function staticEntry(
  nlPath: string,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'],
  priority: number,
  lastModified?: Date
): MetadataRoute.Sitemap[0][] {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}${getLocalePath(nlPath, locale)}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getWCProductSlugs()
  const blogPosts = getAllBlogPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    // Homepage
    ...LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    })),

    // Shop
    ...staticEntry('/winkel', 'daily', 0.9),

    // Landing pages
    ...staticEntry('/19-delige-keukenset', 'weekly', 0.85),
    ...staticEntry('/peper-en-zoutmolens', 'weekly', 0.85),
    ...staticEntry('/acacia-snijplank', 'weekly', 0.85),

    // Blog
    ...staticEntry('/blog', 'weekly', 0.7),

    // Info pages
    ...staticEntry('/over-ons', 'monthly', 0.5),
    ...staticEntry('/contact', 'monthly', 0.5),
    ...staticEntry('/veelgestelde-vragen', 'monthly', 0.6),
    ...staticEntry('/retourneren', 'monthly', 0.4),
    ...staticEntry('/privacybeleid', 'yearly', 0.3),
    ...staticEntry('/verzendbeleid', 'monthly', 0.4),
    ...staticEntry('/algemene-voorwaarden', 'yearly', 0.3),
    ...staticEntry('/account', 'monthly', 0.4),
  ]

  const productRoutes: MetadataRoute.Sitemap = productSlugs.flatMap((handle) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))
  )

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
