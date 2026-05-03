import type { Metadata } from 'next'
import { PolicyPage, PolicySection } from '@/components/layout/PolicyPage'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('shippingPage')
  return {
    title: `${t('title')} | Noctis`,
    description: t('title'),
  }
}

export default async function VerzendbeleidPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('shippingPage')

  if (locale === 'en') {
    return (
      <PolicyPage title={t('title')}>
        <PolicySection title="Free shipping">
          <p>We ship free within the Netherlands and Belgium. For international orders, shipping costs are calculated based on the destination country and are displayed at checkout.</p>
        </PolicySection>

        <PolicySection title="Processing and delivery time">
          <p>Orders placed before 17:00 are shipped the same day. In most cases you will receive your package the next business day. We work with PostNL and DHL. After dispatch you will receive an email with a track & trace code so you can follow your package.</p>
        </PolicySection>

        <PolicySection title="Address errors">
          <p>Please contact us immediately after placing your order if you have made an error in your address. Once the package has been dispatched, we are unable to make any address changes.</p>
        </PolicySection>

        <PolicySection title="Damaged package">
          <p>Did you receive a damaged package? Report this immediately via info@noctisessentials.com with your order number and photos of the damage. We will find a solution as quickly as possible.</p>
        </PolicySection>

        <PolicySection title="Collection">
          <p>Unfortunately this is not possible. Our warehouse is exclusively operational for shipments.</p>
        </PolicySection>

        <div className="bg-surface rounded-[18px] p-6 border border-border mt-4">
          <p className="font-semibold text-dark mb-1">Questions about your order?</p>
          <p className="text-sm text-dark/70">
            Contact us at{' '}
            <a href="mailto:info@noctisessentials.com" className="underline hover:text-accent">info@noctisessentials.com</a>
            {' '}or see our{' '}
            <a href="/veelgestelde-vragen" className="underline hover:text-accent">FAQ</a>.
          </p>
        </div>
      </PolicyPage>
    )
  }

  return (
    <PolicyPage title="Verzendbeleid">
      <PolicySection title="Gratis verzending">
        <p>Wij verzenden gratis binnen Nederland en België. Voor internationale bestellingen worden de verzendkosten berekend op basis van het bestemmingsland en worden weergegeven bij het afrekenen.</p>
      </PolicySection>

      <PolicySection title="Verwerkings- en levertijd">
        <p>Bestellingen geplaatst vóór 17:00 uur worden dezelfde dag verzonden. In de meeste gevallen ontvang je jouw pakket de volgende werkdag. Wij werken samen met PostNL en DHL. Na verzending ontvang je een e-mail met een track & trace-code waarmee je jouw pakket kunt volgen.</p>
      </PolicySection>

      <PolicySection title="Adresfouten">
        <p>Neem direct na het plaatsen van je bestelling contact op als je een fout in je adres hebt gemaakt. Zodra het pakket is verzonden, kunnen wij geen adreswijzigingen meer doorvoeren.</p>
      </PolicySection>

      <PolicySection title="Beschadigd pakket">
        <p>Ontvang je een beschadigd pakket? Meld dit direct via info@noctisessentials.com met je ordernummer en foto&apos;s van de schade. Wij zorgen dan zo snel mogelijk voor een oplossing.</p>
      </PolicySection>

      <PolicySection title="Afhalen">
        <p>Nee, helaas is dat niet mogelijk. Ons magazijn is uitsluitend operationeel voor verzendingen.</p>
      </PolicySection>

      <div className="bg-surface rounded-[18px] p-6 border border-border mt-4">
        <p className="font-semibold text-dark mb-1">Vragen over jouw bestelling?</p>
        <p className="text-sm text-dark/70">
          Neem contact op via{' '}
          <a href="mailto:info@noctisessentials.com" className="underline hover:text-accent">info@noctisessentials.com</a>
          {' '}of bekijk onze{' '}
          <a href="/veelgestelde-vragen" className="underline hover:text-accent">veelgestelde vragen</a>.
        </p>
      </div>
    </PolicyPage>
  )
}
