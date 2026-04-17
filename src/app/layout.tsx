import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import Script from 'next/script'
import { CookieBanner } from '@/components/ui/CookieBanner'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = '933186462850674'

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
        <CookieBanner />

        {/* GA4 Consent Mode v2 — default denied until user accepts */}
        {GA_ID && (
          <>
            <Script id="ga4-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
                gtag('js', new Date());
              `}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-config" strategy="afterInteractive">
              {`gtag('config','${GA_ID}',{send_page_view:true});`}
            </Script>
          </>
        )}

        {/* Meta Pixel — revoked by default until consent */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
        </noscript>

        {/* Omnisend */}
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
