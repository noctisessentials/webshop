export type ChatLocale = 'nl' | 'en'

export type ChatFAQItem = {
  id: string
  q: string
  a: string
}

export type ChatFAQGroup = {
  heading: string
  items: ChatFAQItem[]
}

export const CHATBOT_POLICIES = {
  brandName: 'Noctis Essentials',
  supportEmail: 'info@noctisessentials.com',
  escalationSlaHours: 24,
} as const

const FAQ_GROUPS_NL: ChatFAQGroup[] = [
  {
    heading: 'Bestellen',
    items: [
      {
        id: 'nl-order-place',
        q: 'Hoe plaats ik een bestelling?',
        a: 'Voeg de producten die je leuk vindt toe aan je winkelwagen en volg het bestelproces. Je ontvangt een bevestigingsmail zodra je bestelling is geplaatst.',
      },
      {
        id: 'nl-order-change',
        q: 'Kan ik mijn bestelling annuleren of wijzigen?',
        a: 'Bestellingen kunnen alleen binnen 2 uur na aankoop worden gewijzigd of geannuleerd. Daarna wordt de bestelling al verwerkt. Neem direct contact op via info@noctisessentials.com.',
      },
      {
        id: 'nl-order-confirmation',
        q: 'Ontvang ik een bevestiging van mijn bestelling?',
        a: 'Ja, direct na betaling ontvang je een bevestigingsmail. Controleer je spammap als je niets ontvangt.',
      },
    ],
  },
  {
    heading: 'Levering',
    items: [
      {
        id: 'nl-shipping-track',
        q: 'Waar is mijn bestelling?',
        a: 'Je kunt jouw bestelling volgen met de track & trace-link die je ontvangt zodra je bestelling is verzonden.',
      },
      {
        id: 'nl-shipping-speed',
        q: 'Welke leveringsopties en levertijden zijn er?',
        a: 'Wij verzenden je bestelling altijd gratis via PostNL of DHL. Je ontvangt je pakket binnen 1 tot 2 werkdagen in Nederland en Belgie.',
      },
      {
        id: 'nl-shipping-cost',
        q: 'Is verzending gratis?',
        a: 'Ja, verzending is gratis binnen Nederland en Belgie. Voor internationale bestellingen worden de kosten berekend bij het afrekenen.',
      },
    ],
  },
  {
    heading: 'Retour en terugbetaling',
    items: [
      {
        id: 'nl-return-window',
        q: 'Hoelang heb ik de tijd om te retourneren?',
        a: 'Je kunt producten binnen 14 dagen na ontvangst retourneren, mits ongebruikt en in originele staat. Neem contact op via info@noctisessentials.com met je ordernummer om een retour te starten.',
      },
      {
        id: 'nl-return-cost',
        q: 'Moet ik de retourkosten betalen?',
        a: 'Nee, wij bieden gratis retourzending binnen Nederland en Belgie.',
      },
      {
        id: 'nl-return-refund-time',
        q: 'Wanneer ontvang ik mijn geld terug?',
        a: 'Binnen 5 werkdagen na ontvangst en goedkeuring van het retour. De terugbetaling gaat naar de oorspronkelijke betaalmethode.',
      },
    ],
  },
  {
    heading: 'Betaling',
    items: [
      {
        id: 'nl-payment-methods',
        q: 'Welke betaalmethoden kan ik gebruiken?',
        a: 'We ondersteunen iDEAL, creditcard (Visa, Mastercard), Klarna (Nu kopen, Later betalen), Apple Pay, Google Pay en PayPal.',
      },
      {
        id: 'nl-payment-later',
        q: 'Kan ik achteraf betalen?',
        a: 'Ja, via Klarna kun je nu kopen en later betalen, afhankelijk van de checkout-opties.',
      },
      {
        id: 'nl-payment-safe',
        q: 'Is online betalen veilig?',
        a: 'Ja, alle betalingen verlopen via beveiligde, versleutelde verbindingen via onze betrouwbare betalingspartners.',
      },
    ],
  },
]

const FAQ_GROUPS_EN: ChatFAQGroup[] = [
  {
    heading: 'Ordering',
    items: [
      {
        id: 'en-order-place',
        q: 'How do I place an order?',
        a: 'Add the products you like to your cart and follow the checkout process. You will receive a confirmation email once your order has been placed.',
      },
      {
        id: 'en-order-change',
        q: 'Can I cancel or change my order?',
        a: 'Orders can only be changed or cancelled within 2 hours of purchase, before they are processed. Please contact us immediately at info@noctisessentials.com.',
      },
      {
        id: 'en-order-confirmation',
        q: 'Will I receive an order confirmation?',
        a: 'Yes, you will receive a confirmation email directly after payment. Check your spam folder if you do not receive anything.',
      },
    ],
  },
  {
    heading: 'Delivery',
    items: [
      {
        id: 'en-shipping-track',
        q: 'Where is my order?',
        a: 'You can track your order using the track & trace link you receive once your order has been shipped.',
      },
      {
        id: 'en-shipping-speed',
        q: 'What are the delivery options and times?',
        a: 'We always ship your order for free via PostNL or DHL. You will receive your package within 1 to 2 business days in the Netherlands and Belgium.',
      },
      {
        id: 'en-shipping-cost',
        q: 'Is shipping free?',
        a: 'Yes, shipping is free within the Netherlands and Belgium. For international orders, costs are calculated at checkout.',
      },
    ],
  },
  {
    heading: 'Returns & refunds',
    items: [
      {
        id: 'en-return-window',
        q: 'How long do I have to return an item?',
        a: 'You can return products within 14 days of receipt, provided they are unused and in their original condition. Contact us at info@noctisessentials.com with your order number to start a return.',
      },
      {
        id: 'en-return-cost',
        q: 'Do I have to pay for return shipping?',
        a: 'No, we offer free return shipping within the Netherlands and Belgium.',
      },
      {
        id: 'en-return-refund-time',
        q: 'When will I receive my refund?',
        a: 'Within 5 business days of receiving and approving the return. The refund will be issued to the original payment method.',
      },
    ],
  },
  {
    heading: 'Payment',
    items: [
      {
        id: 'en-payment-methods',
        q: 'Which payment methods can I use?',
        a: 'We support iDEAL, credit card (Visa, Mastercard), Klarna (Buy now, pay later), Apple Pay, Google Pay and PayPal.',
      },
      {
        id: 'en-payment-later',
        q: 'Can I pay later?',
        a: 'Yes, with Klarna you can buy now and pay later, depending on the checkout options.',
      },
      {
        id: 'en-payment-safe',
        q: 'Is online payment secure?',
        a: 'Yes, all payments are processed via secured, encrypted connections through our trusted payment partners.',
      },
    ],
  },
]

export function getChatbotFAQGroups(locale: string): ChatFAQGroup[] {
  return locale === 'en' ? FAQ_GROUPS_EN : FAQ_GROUPS_NL
}

export function getChatbotFAQItems(locale: string): ChatFAQItem[] {
  return getChatbotFAQGroups(locale).flatMap((group) => group.items)
}

export function buildChatKnowledge(locale: string): string {
  const groups = getChatbotFAQGroups(locale)

  return groups
    .map((group) => {
      const lines = group.items.map((item) => `- [${item.id}] ${item.q} => ${item.a}`)
      return `${group.heading}\n${lines.join('\n')}`
    })
    .join('\n\n')
}
