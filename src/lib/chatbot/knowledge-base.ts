export type ChatKnowledgeItem = {
  id: string
  q: string
  a: string
}

export const NOCTIS_KNOWLEDGE_BASE = String.raw`NOCTIS KNOWLEDGE BASE

---

BRAND OVERVIEW

Noctis is a modern kitchenware brand focused on creating elegant, functional, and visually calm kitchens.

The goal is not just to provide tools, but to create a kitchen that feels:
- organized
- aesthetic
- complete

Core idea:
A small upgrade in your kitchen can create a big emotional difference in how your space feels.

---

MAIN PRODUCT: 19-PIECE KITCHEN SET

Product name:
Noctis 19-piece kitchen set

Available colors:
- Nude
- Black
- Mint green
- Light grey
- Pink

What's included:
A complete set of 19 essential kitchen tools including utensils, knives, scissors, holder, and cutting board.

Core concept:
One complete set. Everything matches. No clutter, no mismatch.

---

MATERIALS & QUALITY

- BPA-free silicone (heat resistant, safe for non-stick pans)
- Stainless steel core (for strength and durability)
- Wooden handles (premium look and feel)

The combination ensures:
- durability
- safe use on cookware
- aesthetic finish

---

IMPORTANT CARE INSTRUCTIONS (CRITICAL)

The 19-piece kitchen set is NOT dishwasher safe.

Dishwasher use can:
- damage the silicone coating
- cause peeling or wear
- damage the wooden handles

Recommended care:
- hand wash only
- dry after washing

If a customer reports damage:
Always ask if the product has been used in the dishwasher.

---

SHIPPING & SERVICE

- Fast shipping from the Netherlands
- 14-day return policy
- Customer support via email

---

CUSTOMER RESPONSE GUIDELINES

IMPORTANT:
The product is both functional AND emotional.
Customers are not only buying tools - they are buying a feeling.

---

WHY CUSTOMERS BUY THIS PRODUCT (CORE REASONING)

1. VISUAL CALM & ORDER

Customers want a kitchen that feels calm and organized.

Reason:
Mismatched tools create visual noise and subtle stress.
Matching tools create a feeling of control and clarity.

Use in responses:
Emphasize that the set removes clutter and creates one consistent look.

---

2. "COMPLETE" FEELING

Customers don't want to search for separate tools.

Reason:
Buying items separately creates friction, inconsistency, and decision fatigue.

Use in responses:
Position the set as a one-time upgrade that solves everything at once.

---

3. IDENTITY & PRIDE

Customers want a kitchen they feel proud of.

Reason:
People use their home and kitchen as a reflection of their taste and lifestyle.

Use in responses:
Frame the product as something that upgrades how their space feels and looks.

---

4. AESTHETIC PLEASURE

Customers enjoy beautiful, matching products.

Reason:
Well-designed products create positive emotional responses and satisfaction during daily use.

Use in responses:
Highlight how the set looks as much as how it works.

---

5. SOCIAL & GIFT VALUE

Customers often buy this as a gift.

Reason:
People want to give something that is both useful and visually impressive.

Use in responses:
Position it as a practical AND stylish gift.

---

OBJECTION HANDLING

If customer doubts quality:
- Explain stainless steel core for strength
- Emphasize durability and solid feel

If customer says "I already have tools":
- Explain this is about upgrading to a matching, cohesive kitchen

If customer questions value:
- Emphasize replacing multiple separate purchases
- Emphasize visual upgrade + convenience

If customer worries about practicality:
- Confirm it is designed for daily use
- Highlight safe use on non-stick pans

---

CUSTOMER SUPPORT BEHAVIOR

Tone:
- calm
- helpful
- understanding
- never pushy

If issues arise:
1. Understand the situation
2. Ask relevant questions (especially dishwasher use)
3. Explain clearly
4. Offer a solution

---

POSITIONING SUMMARY

Noctis does not just sell kitchen tools.

It sells:
- visual calm
- simplicity
- a complete kitchen feeling
- pride in your space

Key idea:
"Everything finally matches."

---

END OF FILE`

export const CHATBOT_KNOWLEDGE_ITEMS: ChatKnowledgeItem[] = [
  {
    id: 'kb-brand-overview',
    q: 'What is Noctis? / Wat is Noctis?',
    a: 'Noctis is a modern kitchenware brand focused on elegant, functional, visually calm kitchens. The goal is organized, aesthetic, complete kitchens.',
  },
  {
    id: 'kb-main-product',
    q: 'What is the main product? / Wat is het hoofdproduct?',
    a: 'The main product is the Noctis 19-piece kitchen set.',
  },
  {
    id: 'kb-colors',
    q: 'Which colors are available for the 19-piece set? / Welke kleuren zijn er?',
    a: 'Available colors: Nude, Black, Mint green, Light grey, Pink.',
  },
  {
    id: 'kb-included',
    q: 'What is included in the 19-piece set? / Wat zit er in de 19-delige set?',
    a: 'A complete set of 19 essential kitchen tools including utensils, knives, scissors, holder, and cutting board.',
  },
  {
    id: 'kb-materials',
    q: 'What materials are used? / Van welk materiaal is de set?',
    a: 'The set uses BPA-free silicone, a stainless steel core, and wooden handles for durability, cookware safety, and a premium finish.',
  },
  {
    id: 'kb-dishwasher-safe',
    q: 'Is the 19-piece set dishwasher safe? / Is de 19-delige set vaatwasserbestendig?',
    a: 'No. The 19-piece kitchen set is NOT dishwasher safe. Recommended care is hand wash only and dry after washing.',
  },
  {
    id: 'kb-dishwasher-damage',
    q: 'What can happen if used in dishwasher? / Wat gebeurt er in de vaatwasser?',
    a: 'Dishwasher use can damage the silicone coating, cause peeling or wear, and damage wooden handles.',
  },
  {
    id: 'kb-damage-support-flow',
    q: 'How to handle damage reports? / Wat vraag je bij schade?',
    a: 'If a customer reports damage, always ask whether the product has been used in the dishwasher.',
  },
  {
    id: 'kb-shipping-service',
    q: 'Shipping and service details / Verzend- en servicedetails',
    a: 'Fast shipping from the Netherlands, a 14-day return policy, and customer support via email.',
  },
  {
    id: 'kb-core-benefit-calm',
    q: 'Why do people buy this set? / Waarom kopen klanten deze set?',
    a: 'Customers buy it for visual calm and order: one matching set removes clutter, mismatch, and visual noise.',
  },
  {
    id: 'kb-complete-feeling',
    q: 'I already have tools, why this set? / Ik heb al tools, waarom deze set?',
    a: 'It is a one-time upgrade to a cohesive, matching kitchen, instead of collecting separate mismatched tools.',
  },
  {
    id: 'kb-pride-identity',
    q: 'What emotional value does it give? / Welke emotionele waarde geeft het?',
    a: 'It upgrades how the kitchen feels and looks, creating pride, identity, and daily aesthetic satisfaction.',
  },
  {
    id: 'kb-gift-value',
    q: 'Is it a good gift? / Is het een goed cadeau?',
    a: 'Yes. It is positioned as both practical and stylish, making it strong for gifting.',
  },
  {
    id: 'kb-quality-objection',
    q: 'How to answer quality concerns? / Hoe antwoord je op kwaliteitsvragen?',
    a: 'Explain the stainless steel core for strength and emphasize durability and solid feel.',
  },
  {
    id: 'kb-value-objection',
    q: 'How to answer value concerns? / Hoe antwoord je op prijs-kwaliteit?',
    a: 'Emphasize that it replaces many separate purchases and adds both convenience and a visual upgrade.',
  },
  {
    id: 'kb-practical-objection',
    q: 'How practical is it for daily cooking? / Is het praktisch voor dagelijks gebruik?',
    a: 'It is designed for daily use and is safe for non-stick pans.',
  },
  {
    id: 'kb-tone',
    q: 'What tone should support use? / Welke tone of voice moet support gebruiken?',
    a: 'Use a calm, helpful, understanding tone and never be pushy.',
  },
]

export function getChatbotKnowledgeItems() {
  return CHATBOT_KNOWLEDGE_ITEMS
}
