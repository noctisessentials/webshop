import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  pathnames: {
    '/': '/',
    '/winkel': {
      nl: '/winkel',
      en: '/shop',
    },
    '/products/[handle]': '/products/[handle]',
    '/collections/[handle]': '/collections/[handle]',
    '/19-delige-keukenset': {
      nl: '/19-delige-keukenset',
      en: '/19-piece-kitchen-set',
    },
    '/peper-en-zoutmolens': {
      nl: '/peper-en-zoutmolens',
      en: '/pepper-salt-mills',
    },
    '/acacia-snijplank': {
      nl: '/acacia-snijplank',
      en: '/acacia-cutting-board',
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/contact': '/contact',
    '/over-ons': {
      nl: '/over-ons',
      en: '/about',
    },
    '/veelgestelde-vragen': {
      nl: '/veelgestelde-vragen',
      en: '/faq',
    },
    '/retourneren': {
      nl: '/retourneren',
      en: '/returns',
    },
    '/privacybeleid': {
      nl: '/privacybeleid',
      en: '/privacy-policy',
    },
    '/verzendbeleid': {
      nl: '/verzendbeleid',
      en: '/shipping-policy',
    },
    '/algemene-voorwaarden': {
      nl: '/algemene-voorwaarden',
      en: '/terms-and-conditions',
    },
    '/account': '/account',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
  },
})

export type Locale = (typeof routing.locales)[number]
