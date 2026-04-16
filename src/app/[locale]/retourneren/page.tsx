import type { Metadata } from 'next'
import { PolicyPage, PolicySection } from '@/components/layout/PolicyPage'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('returns')
  return {
    title: `${t('title')} | Noctis`,
    description: t('title'),
  }
}

export default async function RetournerenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('returns')

  if (locale === 'en') {
    return (
      <PolicyPage title={t('title')}>
        <p className="text-base font-medium text-dark/85">
          Not completely satisfied with your order? No problem. At Noctis you can return or exchange your item within <strong>14 days</strong>.
        </p>

        <PolicySection title="How to return?">
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Send an email to info@noctisessentials.nl with your order number and reason for return.</li>
            <li>You will receive return instructions and a free return label.</li>
            <li>Pack the product carefully, preferably in the original packaging.</li>
            <li>Send the package via the designated shipping location.</li>
            <li>After receipt and inspection you will receive the refund within 5 business days.</li>
          </ol>
        </PolicySection>

        <PolicySection title="Conditions">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Products must be unused and in their original condition.</li>
            <li>All original packaging and accessories must be present.</li>
            <li>Products damaged through use are not eligible for a refund.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Exchange">
          <p>Want to exchange? Return the item and place a new order for the desired variant. This is the fastest way to process your order.</p>
        </PolicySection>

        <PolicySection title="Refund">
          <p>After receipt and inspection of your return, your payment will be refunded within <strong>5 business days</strong> via the original payment method.</p>
        </PolicySection>

        <PolicySection title="Return costs">
          <p>We offer free return shipping within the Netherlands and Belgium. For international returns, the costs are at the customer&apos;s expense.</p>
        </PolicySection>

        <div className="bg-surface rounded-[18px] p-6 border border-border mt-4">
          <p className="font-semibold text-dark mb-1">Need help?</p>
          <p className="text-sm text-dark/70">
            Send us a message at{' '}
            <a href="mailto:info@noctisessentials.nl" className="underline hover:text-accent">info@noctisessentials.nl</a>
            {' '}or visit our{' '}
            <Link href="/contact" className="underline hover:text-accent">contact page</Link>.
          </p>
        </div>
      </PolicyPage>
    )
  }

  return (
    <PolicyPage title="Retourneren en terugbetalingen">
      <p className="text-base font-medium text-dark/85">
        Niet helemaal tevreden met je bestelling? Geen probleem. Bij Noctis kun je je item binnen <strong>14 dagen</strong> retourneren of ruilen.
      </p>

      <PolicySection title="Hoe retourneer je?">
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Stuur een e-mail naar info@noctisessentials.nl met je ordernummer en reden van retour.</li>
          <li>Je ontvangt retourinstructies en een gratis retourlabel.</li>
          <li>Verpak het product zorgvuldig, bij voorkeur in de originele verpakking.</li>
          <li>Stuur het pakket op via de aangewezen verzendlocatie.</li>
          <li>Na ontvangst en controle ontvang je de terugbetaling binnen 5 werkdagen.</li>
        </ol>
      </PolicySection>

      <PolicySection title="Voorwaarden">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Producten moeten ongebruikt zijn en in originele staat.</li>
          <li>Alle originele verpakking en accessoires moeten aanwezig zijn.</li>
          <li>Producten die zijn beschadigd door gebruik komen niet in aanmerking voor restitutie.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Omruilen">
        <p>Wil je omruilen? Retourneer het artikel en plaats een nieuwe bestelling voor de gewenste variant. Zo wordt je bestelling het snelst verwerkt.</p>
      </PolicySection>

      <PolicySection title="Terugbetaling">
        <p>Na ontvangst en controle van je retourzending wordt je betaling binnen <strong>5 werkdagen</strong> teruggestort via de oorspronkelijke betaalmethode.</p>
      </PolicySection>

      <PolicySection title="Retourkosten">
        <p>Wij bieden gratis retourzending binnen Nederland en België. Voor internationale retourzendingen zijn de kosten voor rekening van de klant.</p>
      </PolicySection>

      <div className="bg-surface rounded-[18px] p-6 border border-border mt-4">
        <p className="font-semibold text-dark mb-1">Hulp nodig?</p>
        <p className="text-sm text-dark/70">
          Stuur ons een bericht via{' '}
          <a href="mailto:info@noctisessentials.nl" className="underline hover:text-accent">info@noctisessentials.nl</a>
          {' '}of ga naar onze{' '}
          <Link href="/contact" className="underline hover:text-accent">contactpagina</Link>.
        </p>
      </div>
    </PolicyPage>
  )
}
