import type { Metadata } from 'next'

const BASE_URL = 'https://noctisessentials.com'

// NL internal path → EN slug mapping
const EN_SLUG: Record<string, string> = {
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

/**
 * Generate hreflang alternates for a given NL-canonical path.
 * Pass undefined for the home page.
 */
export function buildAlternates(nlPath?: string): Metadata['alternates'] {
  const nlUrl = nlPath ? `${BASE_URL}/nl${nlPath}` : `${BASE_URL}/nl`
  const enSlug = nlPath ? (EN_SLUG[nlPath] ?? nlPath) : ''
  const enUrl = `${BASE_URL}/en${enSlug}`

  return {
    canonical: nlUrl,
    languages: {
      nl: nlUrl,
      en: enUrl,
      'x-default': nlUrl,
    },
  }
}

/**
 * Generate hreflang alternates for dynamic routes (products, blog posts).
 * Pass both the NL and EN slugs explicitly.
 */
export function buildDynamicAlternates(nlSegment: string, enSegment: string): Metadata['alternates'] {
  const nlUrl = `${BASE_URL}/nl${nlSegment}`
  const enUrl = `${BASE_URL}/en${enSegment}`

  return {
    canonical: nlUrl,
    languages: {
      nl: nlUrl,
      en: enUrl,
      'x-default': nlUrl,
    },
  }
}
