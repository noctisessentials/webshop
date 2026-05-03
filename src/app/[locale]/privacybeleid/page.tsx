import type { Metadata } from 'next'
import { PolicyPage, PolicySection } from '@/components/layout/PolicyPage'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('privacy')
  return {
    title: `${t('title')} | Noctis`,
    description: t('title'),
  }
}

export default async function PrivacybeleidPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('privacy')

  if (locale === 'en') {
    return (
      <PolicyPage title={t('title')}>
        <p>Noctis attaches great importance to your privacy. We only process data that is necessary for the provision of our services and the improvement of our service. Customer data is never shared with third parties for commercial purposes. This policy is effective from 5 March 2024.</p>

        <PolicySection title="What data do we process?">
          <p>We process the following personal data:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Name and address details (for delivery)</li>
            <li>Email address (for order confirmation and communication)</li>
            <li>Phone number (optional, for delivery)</li>
            <li>Payment data (processed via SSL-secured payment providers)</li>
            <li>IP address and browsing behaviour (for analysis and security)</li>
          </ul>
        </PolicySection>

        <PolicySection title="Infrastructure and processors">
          <p>Our webshop runs on WordPress / Automattic. Payments are processed via WooPayments and other secure payment providers (SSL-encrypted). Our shipping partners PostNL and DHL only receive name and address for delivery.</p>
        </PolicySection>

        <PolicySection title="Klarna">
          <p>To offer Klarna payment options, we may share your contact and order details with Klarna at checkout, so that Klarna can assess your eligibility and personalise the payment options. Your personal data is processed in accordance with Klarna&apos;s privacy statement.</p>
        </PolicySection>

        <PolicySection title="Marketing and advertising">
          <p>We may show personalised advertisements via Google, Facebook and Pinterest, based on customer behaviour. This only happens after consent via our cookie banner.</p>
        </PolicySection>

        <PolicySection title="Cookies">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Functional cookies:</strong> necessary for the operation of the website.</li>
            <li><strong>Analytical cookies:</strong> anonymous, for insight into page usage.</li>
            <li><strong>Tracking cookies:</strong> for personalised advertisements (only after consent).</li>
          </ul>
        </PolicySection>

        <PolicySection title="Your rights">
          <p>Under the GDPR you have the following rights:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Right of access to your personal data</li>
            <li>Right to rectification or supplementation</li>
            <li>Right to erasure</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>
          <p className="mt-3">You can submit a request via info@noctisessentials.com. Complaints can be submitted to the relevant data protection authority in your country.</p>
        </PolicySection>

        <PolicySection title="Retention periods">
          <p>We retain personal data for as long as the customer relationship exists. Data required for legal obligations (such as invoicing) is retained for the legally required period with limited access.</p>
        </PolicySection>

        <PolicySection title="Changes">
          <p>Noctis reserves the right to change this policy. Changes will be published on this page. For significant changes, you will receive a notification by email.</p>
        </PolicySection>

        <PolicySection title="Contact">
          <p>For questions about our privacy policy, please contact us at info@noctisessentials.com or via our <a href="/contact" className="underline hover:text-accent">contact page</a>.</p>
        </PolicySection>
      </PolicyPage>
    )
  }

  return (
    <PolicyPage title="Privacybeleid">
      <p>Noctis hecht veel waarde aan jouw privacy. We verwerken alleen gegevens die noodzakelijk zijn voor de dienstverlening en verbetering van onze service. Klantgegevens worden nooit gedeeld met derden voor commerciële doeleinden. Dit beleid is van kracht vanaf 5 maart 2024.</p>

      <PolicySection title="Welke gegevens verwerken wij?">
        <p>Wij verwerken de volgende persoonsgegevens:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Naam en adresgegevens (voor bezorging)</li>
          <li>E-mailadres (voor orderbevestiging en communicatie)</li>
          <li>Telefoonnummer (optioneel, voor bezorging)</li>
          <li>Betaalgegevens (verwerkt via SSL-beveiligde betalingsproviders)</li>
          <li>IP-adres en browsegedrag (voor analyse en veiligheid)</li>
        </ul>
      </PolicySection>

      <PolicySection title="Infrastructuur en verwerkers">
        <p>Onze webshop draait op WordPress / Automattic. Betalingen worden verwerkt via WooPayments en andere beveiligde betaalproviders (SSL-versleuteld). Onze verzendpartners PostNL en DHL ontvangen uitsluitend naam en adres voor bezorging.</p>
      </PolicySection>

      <PolicySection title="Klarna">
        <p>Om Klarna-betaalopties aan te bieden, kunnen we uw contact- en bestelgegevens tijdens het afrekenen aan Klarna doorgeven, zodat Klarna uw geschiktheid kan beoordelen en de betaalopties kan personaliseren. Uw persoonsgegevens worden verwerkt in overeenstemming met de privacyverklaring van Klarna.</p>
      </PolicySection>

      <PolicySection title="Marketing en advertenties">
        <p>Wij kunnen gepersonaliseerde advertenties tonen via Google, Facebook en Pinterest, gebaseerd op klantgedrag. Dit gebeurt alleen na toestemming via onze cookiebanner.</p>
      </PolicySection>

      <PolicySection title="Cookies">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>Functionele cookies:</strong> noodzakelijk voor de werking van de website.</li>
          <li><strong>Analytische cookies:</strong> anoniem, voor inzicht in paginagebruik.</li>
          <li><strong>Trackingcookies:</strong> voor gepersonaliseerde advertenties (alleen na toestemming).</li>
        </ul>
      </PolicySection>

      <PolicySection title="Jouw rechten">
        <p>Op grond van de AVG heb jij de volgende rechten:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Recht op inzage van jouw persoonsgegevens</li>
          <li>Recht op correctie of aanvulling</li>
          <li>Recht op vergetelheid (verwijdering)</li>
          <li>Recht op beperking van verwerking</li>
          <li>Recht op gegevensoverdraagbaarheid</li>
          <li>Recht van bezwaar</li>
        </ul>
        <p className="mt-3">Je kunt een verzoek indienen via info@noctisessentials.com. Klachten kun je indienen bij de <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Autoriteit Persoonsgegevens</a>.</p>
      </PolicySection>

      <PolicySection title="Bewaartermijnen">
        <p>Wij bewaren persoonsgegevens zolang de klantrelatie bestaat. Gegevens die nodig zijn voor wettelijke verplichtingen (zoals facturatie) bewaren wij voor de wettelijk vereiste periode met beperkte toegang.</p>
      </PolicySection>

      <PolicySection title="Wijzigingen">
        <p>Noctis behoudt het recht om dit beleid te wijzigen. Wijzigingen worden gepubliceerd op deze pagina. Bij ingrijpende wijzigingen ontvang je een melding per e-mail.</p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>Voor vragen over ons privacybeleid kun je contact opnemen via info@noctisessentials.com of via onze <a href="/contact" className="underline hover:text-accent">contactpagina</a>.</p>
      </PolicySection>
    </PolicyPage>
  )
}
