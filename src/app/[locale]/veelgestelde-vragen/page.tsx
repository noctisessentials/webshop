import type { Metadata } from 'next'
import { PolicyPage } from '@/components/layout/PolicyPage'
import { FAQAccordion } from './FAQAccordion'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

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

const FAQ_GROUPS_NL = [
  {
    heading: 'Bestellen',
    items: [
      {
        q: 'Hoe plaats ik een bestelling?',
        a: 'Voeg de producten die je leuk vindt toe aan je winkelwagen en volg het bestelproces. Je ontvangt een bevestigingsmail zodra je bestelling is geplaatst.',
      },
      {
        q: 'Kan ik mijn bestelling annuleren of wijzigen?',
        a: 'Bestellingen kunnen alleen binnen 2 uur na aankoop worden gewijzigd of geannuleerd. Daarna wordt de bestelling al verwerkt. Neem direct contact op via info@noctisessentials.nl.',
      },
      {
        q: 'Ontvang ik een bevestiging van mijn bestelling?',
        a: 'Ja, direct na betaling ontvang je een bevestigingsmail. Controleer je spammap als je niets ontvangt.',
      },
    ],
  },
  {
    heading: 'Levering',
    items: [
      {
        q: 'Waar is mijn bestelling?',
        a: 'Je kunt jouw bestelling volgen met de track & trace-link die je ontvangt zodra je bestelling is verzonden.',
      },
      {
        q: 'Welke leveringsopties en levertijden zijn er?',
        a: 'Wij verzenden je bestelling altijd gratis via PostNL of DHL. Je ontvangt je pakket binnen 1 tot 2 werkdagen in Nederland en België.',
      },
      {
        q: 'Is verzending gratis?',
        a: 'Ja, verzending is gratis binnen Nederland en België. Voor internationale bestellingen worden de kosten berekend bij het afrekenen.',
      },
    ],
  },
  {
    heading: 'Retour en terugbetaling',
    items: [
      {
        q: 'Hoelang heb ik de tijd om te retourneren?',
        a: 'Je kunt producten binnen 14 dagen na ontvangst retourneren, mits ongebruikt en in originele staat. Neem contact op via info@noctisessentials.nl met je ordernummer om een retour te starten.',
      },
      {
        q: 'Moet ik de retourkosten betalen?',
        a: 'Nee, wij bieden gratis retourzending binnen Nederland en België.',
      },
      {
        q: 'Wanneer ontvang ik mijn geld terug?',
        a: 'Binnen 5 werkdagen na ontvangst en goedkeuring van het retour. De terugbetaling gaat naar de oorspronkelijke betaalmethode.',
      },
    ],
  },
  {
    heading: 'Betaling',
    items: [
      {
        q: 'Welke betaalmethoden kan ik gebruiken?',
        a: 'We ondersteunen iDEAL, creditcard (Visa, Mastercard), Klarna (Nu kopen, Later betalen), Apple Pay, Google Pay en PayPal.',
      },
      {
        q: 'Kan ik achteraf betalen?',
        a: 'Ja, via Klarna kun je nu kopen en later betalen, afhankelijk van de checkout-opties.',
      },
      {
        q: 'Is online betalen veilig?',
        a: 'Ja, alle betalingen verlopen via beveiligde, versleutelde verbindingen via onze betrouwbare betalingspartners.',
      },
    ],
  },
]

const FAQ_GROUPS_EN = [
  {
    heading: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Add the products you like to your cart and follow the checkout process. You will receive a confirmation email once your order has been placed.',
      },
      {
        q: 'Can I cancel or change my order?',
        a: 'Orders can only be changed or cancelled within 2 hours of purchase, before they are processed. Please contact us immediately at info@noctisessentials.nl.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Yes, you will receive a confirmation email directly after payment. Check your spam folder if you do not receive anything.',
      },
    ],
  },
  {
    heading: 'Delivery',
    items: [
      {
        q: 'Where is my order?',
        a: 'You can track your order using the track & trace link you receive once your order has been shipped.',
      },
      {
        q: 'What are the delivery options and times?',
        a: 'We always ship your order for free via PostNL or DHL. You will receive your package within 1 to 2 business days in the Netherlands and Belgium.',
      },
      {
        q: 'Is shipping free?',
        a: 'Yes, shipping is free within the Netherlands and Belgium. For international orders, costs are calculated at checkout.',
      },
    ],
  },
  {
    heading: 'Returns & refunds',
    items: [
      {
        q: 'How long do I have to return an item?',
        a: 'You can return products within 14 days of receipt, provided they are unused and in their original condition. Contact us at info@noctisessentials.nl with your order number to start a return.',
      },
      {
        q: 'Do I have to pay for return shipping?',
        a: 'No, we offer free return shipping within the Netherlands and Belgium.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Within 5 business days of receiving and approving the return. The refund will be issued to the original payment method.',
      },
    ],
  },
  {
    heading: 'Payment',
    items: [
      {
        q: 'Which payment methods can I use?',
        a: 'We support iDEAL, credit card (Visa, Mastercard), Klarna (Buy now, pay later), Apple Pay, Google Pay and PayPal.',
      },
      {
        q: 'Can I pay later?',
        a: 'Yes, with Klarna you can buy now and pay later, depending on the checkout options.',
      },
      {
        q: 'Is online payment secure?',
        a: 'Yes, all payments are processed via secured, encrypted connections through our trusted payment partners.',
      },
    ],
  },
]

export default async function VeelgesteldeVragenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('faqPage')
  const groups = locale === 'en' ? FAQ_GROUPS_EN : FAQ_GROUPS_NL

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
