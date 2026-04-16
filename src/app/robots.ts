import type { MetadataRoute } from 'next'

const BASE_URL = 'https://noctisessentials.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/nl/checkout/', '/en/checkout/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
