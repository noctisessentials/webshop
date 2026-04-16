import type { Metadata } from 'next'
import { PolicyPage, PolicySection } from '@/components/layout/PolicyPage'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('terms')
  return {
    title: `${t('title')} | Noctis`,
    description: t('title'),
  }
}

export default async function AlgemeneVoorwaardenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('terms')

  if (locale === 'en') {
    return (
      <PolicyPage title={t('title')}>
        <PolicySection title="Article 1 – Definitions">
          <p>In these terms, the following definitions apply:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Supplementary agreement:</strong> an agreement whereby the consumer acquires products, digital content and/or services in connection with a distance contract, and these are provided by the trader or a third party pursuant to an arrangement between that third party and the trader.</li>
            <li><strong>Withdrawal period:</strong> the period during which the consumer can exercise their right of withdrawal.</li>
            <li><strong>Consumer:</strong> the natural person who does not act for purposes related to their trade, business, craft or professional activity.</li>
            <li><strong>Day:</strong> calendar day.</li>
            <li><strong>Digital content:</strong> data produced and delivered in digital form.</li>
            <li><strong>Right of withdrawal:</strong> the consumer&apos;s right to withdraw from the distance contract within the withdrawal period.</li>
            <li><strong>Trader:</strong> the natural or legal person offering products, (access to) digital content and/or services to consumers at a distance.</li>
            <li><strong>Distance contract:</strong> a contract concluded between the trader and the consumer within a system for distance selling of products, digital content and/or services, using only distance communication up to and including the conclusion of the contract.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Article 2 – Identity of the trader">
          <p>Noctis<br />Amsterdam, Netherlands<br />Phone: +31 6 87267125<br />Email: info@noctisessentials.nl<br />Chamber of Commerce: 95790004<br />VAT number: NL867300875B01</p>
        </PolicySection>

        <PolicySection title="Article 3 – Applicability">
          <p>These general terms and conditions apply to every offer from the trader and to every distance contract concluded between the trader and the consumer.</p>
        </PolicySection>

        <PolicySection title="Article 4 – The offer">
          <p>The offer contains a complete and accurate description of the products, digital content and/or services offered. Obvious mistakes or errors in the offer are not binding on the trader. Offers are valid while stocks last.</p>
        </PolicySection>

        <PolicySection title="Article 5 – The contract">
          <p>The contract is concluded at the moment the consumer accepts the offer and fulfils the conditions set. The trader confirms receipt of acceptance electronically.</p>
        </PolicySection>

        <PolicySection title="Article 6 – Right of withdrawal">
          <p>The consumer has at least 14 days to withdraw from the contract without giving reasons. The withdrawal period begins on the day after the consumer received the product.</p>
        </PolicySection>

        <PolicySection title="Article 7 – Consumer obligations during the withdrawal period">
          <p>The consumer must handle the product and its packaging with care. They will only unpack or use the product to the extent necessary to assess the nature, characteristics and operation of the product. Damage caused by careless use is at the consumer&apos;s expense.</p>
        </PolicySection>

        <PolicySection title="Article 8 – Exercise of the right of withdrawal">
          <p>The consumer exercises the right of withdrawal by informing the trader within the withdrawal period via info@noctisessentials.nl. The product must be returned within 14 days of notification, complete and in original packaging.</p>
        </PolicySection>

        <PolicySection title="Article 9 – Trader obligations upon withdrawal">
          <p>Refunds (including standard shipping costs) will be made within 14 days of the withdrawal notification, using the same payment method the consumer used.</p>
        </PolicySection>

        <PolicySection title="Article 10 – Exclusion of right of withdrawal">
          <p>The trader may exclude the right of withdrawal for products whose price is subject to fluctuations in the financial market, products made to the consumer&apos;s specifications, perishable products, sealed products unsuitable for return for hygiene reasons after opening, and digital content already made available after delivery.</p>
        </PolicySection>

        <PolicySection title="Article 11 – Price">
          <p>All prices stated include VAT. During the offer period, the prices of the offered products will not be increased, except for changes in the VAT rate.</p>
        </PolicySection>

        <PolicySection title="Article 12 – Compliance and warranty">
          <p>The trader ensures that products comply with the contract, the specifications stated in the offer, and the reasonable requirements of soundness and/or fitness for purpose.</p>
        </PolicySection>

        <PolicySection title="Article 13 – Delivery and execution">
          <p>Unless otherwise agreed, orders are executed with due care and within 30 days at the latest. The risk of damage and/or loss of products lies with the trader until the moment of delivery.</p>
        </PolicySection>

        <PolicySection title="Article 14 – Payment">
          <p>Payment must be made within 14 days of receipt of the goods or conclusion of the contract. In the event of late payment, the consumer is automatically in default and statutory interest is owed.</p>
        </PolicySection>

        <PolicySection title="Article 15 – Complaints">
          <p>Complaints must be reported to the trader within a reasonable time after discovery via info@noctisessentials.nl. Complaints are answered within 14 days. If a complaint requires more time, this will be communicated within 14 days with an indication of when a substantive answer will follow.</p>
        </PolicySection>

        <PolicySection title="Article 16 – Disputes">
          <p>Contracts between the trader and the consumer are exclusively governed by Dutch law.</p>
        </PolicySection>
      </PolicyPage>
    )
  }

  return (
    <PolicyPage title="Algemene voorwaarden">
      <PolicySection title="Artikel 1 – Definities">
        <p>In deze voorwaarden wordt verstaan onder:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>Aanvullende overeenkomst:</strong> een overeenkomst waarbij de consument producten, digitale inhoud en/of diensten verwerft in verband met een overeenkomst op afstand en deze zaken, inhoud en/of diensten door de ondernemer worden geleverd of door een derde partij op basis van een afspraak tussen die derde en de ondernemer.</li>
          <li><strong>Bedenktijd:</strong> de termijn waarbinnen de consument gebruik kan maken van zijn herroepingsrecht.</li>
          <li><strong>Consument:</strong> de natuurlijke persoon die niet handelt voor doeleinden die verband houden met zijn handels-, bedrijfs-, ambachts- of beroepsactiviteit.</li>
          <li><strong>Dag:</strong> kalenderdag.</li>
          <li><strong>Digitale content:</strong> gegevens die in digitale vorm worden geproduceerd en geleverd.</li>
          <li><strong>Herroepingsrecht:</strong> de mogelijkheid voor de consument om binnen de bedenktijd af te zien van de overeenkomst op afstand.</li>
          <li><strong>Ondernemer:</strong> de natuurlijke of rechtspersoon die producten, (toegang tot) digitale inhoud en/of diensten op afstand aan consumenten aanbiedt.</li>
          <li><strong>Overeenkomst op afstand:</strong> een overeenkomst die tussen de ondernemer en de consument wordt gesloten in het kader van een systeem voor verkoop op afstand van producten, digitale inhoud en/of diensten, waarbij tot en met het sluiten van de overeenkomst uitsluitend gebruik gemaakt wordt van communicatie op afstand.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Artikel 2 – Identiteit van de ondernemer">
        <p>Noctis<br />Amsterdam, Nederland<br />Telefoon: +31 6 87267125<br />E-mailadres: info@noctisessentials.nl<br />KvK-nummer: 95790004<br />BTW-nummer: NL867300875B01</p>
      </PolicySection>

      <PolicySection title="Artikel 3 – Toepasselijkheid">
        <p>Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.</p>
      </PolicySection>

      <PolicySection title="Artikel 4 – Het aanbod">
        <p>Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten, digitale inhoud en/of diensten. Kennelijke vergissingen of fouten in het aanbod binden de ondernemer niet. Aanbiedingen zijn geldig zolang de voorraad strekt.</p>
      </PolicySection>

      <PolicySection title="Artikel 5 – De overeenkomst">
        <p>De overeenkomst komt tot stand op het moment dat de consument het aanbod aanvaardt en daarbij de gestelde voorwaarden accepteert. De ondernemer bevestigt de ontvangst van de aanvaarding elektronisch.</p>
      </PolicySection>

      <PolicySection title="Artikel 6 – Herroepingsrecht">
        <p>De consument heeft minimaal 14 dagen de tijd om de overeenkomst zonder opgave van redenen te ontbinden. De bedenktijd gaat in op de dag nadat de consument het product heeft ontvangen.</p>
      </PolicySection>

      <PolicySection title="Artikel 7 – Verplichtingen van de consument tijdens de bedenktijd">
        <p>De consument moet zorgvuldig omgaan met het product en de verpakking. Hij zal het product slechts in die mate uitpakken of gebruiken voor zover dat nodig is om de aard, de kenmerken en de werking van het product vast te stellen. Beschadiging door onzorgvuldig gebruik komt voor rekening van de consument.</p>
      </PolicySection>

      <PolicySection title="Artikel 8 – Uitoefening van het herroepingsrecht">
        <p>De consument maakt gebruik van het herroepingsrecht door dit binnen de bedenktijd kenbaar te maken aan de ondernemer via info@noctisessentials.nl. Het product dient binnen 14 dagen na melding te worden teruggestuurd, volledig en in originele verpakking.</p>
      </PolicySection>

      <PolicySection title="Artikel 9 – Verplichtingen van de ondernemer bij herroeping">
        <p>Terugbetalingen (inclusief standaard verzendkosten) worden binnen 14 dagen na melding van de herroeping verricht, via dezelfde betaalmethode als de consument heeft gebruikt.</p>
      </PolicySection>

      <PolicySection title="Artikel 10 – Uitsluiting van het herroepingsrecht">
        <p>De ondernemer kan het herroepingsrecht uitsluiten voor producten waarvan de prijs gebonden is aan schommelingen op de financiële markt, producten die speciaal voor de consument zijn vervaardigd, bederfelijke producten, verzegelde producten die om hygiëneredenen niet geschikt zijn voor retourzending na opening, en digitale inhoud die na levering al ter beschikking is gesteld.</p>
      </PolicySection>

      <PolicySection title="Artikel 11 – De prijs">
        <p>Alle vermelde prijzen zijn inclusief btw. Tijdens de aanbiedingsperiode worden de prijzen van de aangeboden producten niet verhoogd, met uitzondering van wijzigingen in het btw-tarief.</p>
      </PolicySection>

      <PolicySection title="Artikel 12 – Nakoming en garantie">
        <p>De ondernemer zorgt ervoor dat de producten voldoen aan de overeenkomst, de in het aanbod vermelde specificaties, en aan de redelijke eisen van deugdelijkheid en/of bruikbaarheid.</p>
      </PolicySection>

      <PolicySection title="Artikel 13 – Levering en uitvoering">
        <p>Tenzij anders overeengekomen, worden bestellingen met bekwame spoed en uiterlijk binnen 30 dagen uitgevoerd. Het risico van beschadiging en/of vermissing van producten berust bij de ondernemer tot het moment van bezorging.</p>
      </PolicySection>

      <PolicySection title="Artikel 14 – Betaling">
        <p>Betaling dient te geschieden binnen 14 dagen na ontvangst van de goederen of totstandkoming van de overeenkomst. Bij niet-tijdige betaling is de consument van rechtswege in verzuim en is de wettelijke rente verschuldigd.</p>
      </PolicySection>

      <PolicySection title="Artikel 15 – Klachten">
        <p>Klachten dienen binnen bekwame tijd na constatering aan de ondernemer gemeld te worden via info@noctisessentials.nl. Klachten worden binnen 14 dagen beantwoord. Indien een klacht meer tijd vraagt, wordt dit uiterlijk binnen 14 dagen gemeld met een indicatie wanneer een inhoudelijk antwoord volgt.</p>
      </PolicySection>

      <PolicySection title="Artikel 16 – Geschillen">
        <p>Op overeenkomsten tussen de ondernemer en de consument is uitsluitend Nederlands recht van toepassing.</p>
      </PolicySection>

      <PolicySection title="Artikel 17 – Aanvullende of afwijkende bepalingen">
        <p>Deze mogen niet ten nadele van de consument zijn en moeten op een toegankelijke wijze op een duurzame gegevensdrager worden vastgelegd.</p>
      </PolicySection>
    </PolicyPage>
  )
}
