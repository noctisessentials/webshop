import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import Script from 'next/script'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noctisessentials.com'),
  title: {
    default: 'Noctis — Stijlvolle Keukenaccessoires',
    template: '%s | Noctis',
  },
  description:
    'Ontdek de collectie van Noctis: stijlvolle keukenaccessoires die rust en eenheid brengen in jouw keuken. Gratis verzending vanaf €0 · 14 dagen retourneren · 5.000+ tevreden klanten.',
  keywords: [
    'keukenaccessoires',
    'keukenset',
    'peper en zoutmolen',
    'acacia snijplank',
    'keukengerei',
    'noctis',
    'stijlvolle keuken',
    'keuken accessoires nederland',
  ],
  authors: [{ name: 'Noctis Essentials' }],
  creator: 'Noctis Essentials',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    alternateLocale: 'en_GB',
    url: 'https://noctisessentials.com',
    siteName: 'Noctis',
    title: 'Noctis — Stijlvolle Keukenaccessoires',
    description:
      'Ontdek de collectie van Noctis: stijlvolle keukenaccessoires die rust en eenheid brengen in jouw keuken. Gratis verzending · 14 dagen retourneren.',
    images: [
      {
        url: '/images/og-home.webp',
        width: 1200,
        height: 630,
        alt: 'Noctis — Stijlvolle Keukenaccessoires',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noctis — Stijlvolle Keukenaccessoires',
    description:
      'Stijlvolle keukenaccessoires die rust en eenheid brengen. Gratis verzending · 14 dagen retourneren.',
    images: ['/images/og-home.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-[#F0EDE8]">
        {children}
        <Script id="omnisend-tracking" strategy="afterInteractive">
          {`
            window.omnisend = window.omnisend || [];
            omnisend.push(["accountID", "67c0fd1073be448eba67656f"]);
            omnisend.push(["track", "$pageViewed"]);
            !function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://omnisnippet1.com/inshop/launcher-v2.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();
          `}
        </Script>
      </body>
    </html>
  )
}
