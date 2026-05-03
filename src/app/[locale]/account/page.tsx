import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import OrderLookup from './OrderLookup'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('account')
  return {
    title: `${t('title')} | Noctis`,
    description: t('subtitle'),
  }
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const t = await getTranslations('account')

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted">
            <Link href="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark">{t('title')}</span>
          </nav>
        </div>
      </div>

      <div className="container-narrow py-14 md:py-20">
        <div className="mb-10">
          <h1 className="font-sans font-bold text-dark leading-tight mb-3" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
            {t('title')}
          </h1>
          <p className="text-base font-sans text-muted">
            {t('subtitle')}
          </p>
        </div>

        <OrderLookup />

        <div className="mt-16 bg-surface rounded-[18px] border border-border p-6">
          <p className="font-sans font-semibold text-dark mb-1">{t('helpTitle')}</p>
          <p className="text-sm font-sans text-dark/70">
            {t('helpText')}{' '}
            {t('noEmail')}{' '}
            <Link href="/contact" className="underline hover:text-accent transition-colors">
              {t('contactUs')}
            </Link>{' '}
            {t('orEmail')}{' '}
            <a href="mailto:info@noctisessentials.com" className="underline hover:text-accent transition-colors">
              info@noctisessentials.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
