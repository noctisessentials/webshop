import type { Metadata } from 'next'
import { PolicyPage } from '@/components/layout/PolicyPage'
import { FAQAccordion } from './FAQAccordion'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getChatbotFAQGroups } from '@/lib/chatbot/knowledge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    return {
      title: 'FAQ | Noctis',
      description: 'Answers to the most common questions about ordering, delivery, returns and payment at Noctis.',
    }
  }
  return {
    title: 'Veelgestelde vragen | Noctis',
    description: 'Antwoorden op de meest gestelde vragen over bestellen, levering, retour en betaling bij Noctis.',
  }
}

export default async function VeelgesteldeVragenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('faqPage')
  const groups = getChatbotFAQGroups(locale)

  return (
    <PolicyPage title={t('title')}>
      <p>
        {t('intro')}{' '}
        <Link href="/contact" className="underline hover:text-accent">
          {t('contactLink')}
        </Link>{' '}
        {t('introOr')}{' '}
        <a href="mailto:info@noctisessentials.nl" className="underline hover:text-accent">
          info@noctisessentials.nl
        </a>
        .
      </p>
      <FAQAccordion groups={groups} />
    </PolicyPage>
  )
}
