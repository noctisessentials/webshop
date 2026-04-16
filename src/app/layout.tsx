import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import { getLocale } from 'next-intl/server'
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
    'Stijlvolle keukenaccessoires en tools. Samengesteld voor rust en eenheid in je keuken. Gratis verzending. 14 dagen retourneren.',
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
      </body>
    </html>
  )
}
