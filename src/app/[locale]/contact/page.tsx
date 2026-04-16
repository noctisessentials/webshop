import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ContactForm from './ContactForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    return {
      title: 'Contact | Noctis',
      description: 'Get in touch with Noctis. We are happy to help with questions about your order, delivery or return.',
    }
  }
  return {
    title: 'Contact | Noctis',
    description: 'Neem contact op met Noctis. We helpen je graag met vragen over je bestelling, levering of retour.',
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('contact')
  const isEn = locale === 'en'

  const faqItems = isEn
    ? [
        {
          q: t('faqQ1'),
          a: t('faqA1'),
        },
        {
          q: t('faqQ2'),
          a: t('faqA2'),
        },
        {
          q: t('faqQ3'),
          a: t('faqA3'),
        },
        {
          q: t('faqQ4'),
          a: t('faqA4'),
        },
      ]
    : [
        {
          q: 'Waar is mijn bestelling?',
          a: 'Na verzending ontvang je een e-mail met een track & trace-link van PostNL of DHL. Heb je die e-mail niet ontvangen? Controleer je spammap of neem contact met ons op.',
        },
        {
          q: 'Hoe lang duurt de levering?',
          a: 'Bestellingen geplaatst vóór 17:00 worden dezelfde dag verzonden. Je ontvangt je pakket de volgende werkdag. Gemiddeld 1–2 werkdagen na bestelling.',
        },
        {
          q: 'Kan ik mijn bestelling annuleren?',
          a: 'Annuleren is alleen mogelijk binnen 2 uur na het plaatsen van je bestelling, zolang de order nog niet is bevestigd en verzonden. Na verzending is annulering niet meer mogelijk. Neem dan de retourprocedure aan.',
        },
        {
          q: 'Hoe werkt het retourneren?',
          a: 'Je kunt producten binnen 14 dagen retourneren. Stuur een e-mail naar info@noctisessentials.nl met je ordernummer en reden. Je ontvangt een gratis retourlabel.',
        },
      ]

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted">
            <Link href="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark">{t('breadcrumb')}</span>
          </nav>
        </div>
      </div>

      <div className="container-content py-14 md:py-20">
        <div className="mb-12">
          <h1 className="font-sans font-bold text-dark leading-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('title')}
          </h1>
          <p className="text-base font-sans text-muted max-w-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-[22px] border border-border p-8">
              <h2 className="font-sans font-semibold text-dark text-lg mb-6">{t('sendMessage')}</h2>
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-sans font-semibold text-dark text-lg mb-5">{t('contactInfo')}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-1">{t('email')}</p>
                  <a href="mailto:info@noctisessentials.nl" className="text-sm font-sans text-dark hover:text-accent transition-colors">
                    info@noctisessentials.nl
                  </a>
                </div>
                <div>
                  <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-1">{t('availability')}</p>
                  <p className="text-sm font-sans text-dark/75">{t('availabilityHours')}</p>
                  <p className="text-sm font-sans text-dark/75">{t('responseTime')}</p>
                </div>
                <div>
                  <p className="text-xs font-sans font-semibold text-muted uppercase tracking-wider mb-1">{t('returnAddress')}</p>
                  <p className="text-sm font-sans text-dark/75">
                    Noctis<br />
                    {t('country')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-[18px] border border-border p-6">
              <p className="text-sm font-sans font-semibold text-dark mb-3">{t('usefulLinks')}</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/veelgestelde-vragen" className="text-sm font-sans text-dark/70 hover:text-accent transition-colors">
                    {t('linkFaq')}
                  </Link>
                </li>
                <li>
                  <Link href="/verzendbeleid" className="text-sm font-sans text-dark/70 hover:text-accent transition-colors">
                    {t('linkShipping')}
                  </Link>
                </li>
                <li>
                  <Link href="/retourneren" className="text-sm font-sans text-dark/70 hover:text-accent transition-colors">
                    {t('linkReturns')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-sans font-bold text-dark mb-8" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            {t('faqSectionTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-surface rounded-[18px] border border-border p-6">
                <p className="font-sans font-semibold text-dark mb-2">{item.q}</p>
                <p className="text-sm font-sans text-dark/70 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-sans text-muted">
            {t('moreFaq')}{' '}
            <Link href="/veelgestelde-vragen" className="underline hover:text-dark transition-colors">
              {t('viewAllFaq')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
