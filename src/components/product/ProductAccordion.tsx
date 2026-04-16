'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Plus, Minus } from 'lucide-react'
import type { Product } from '@/lib/data'

type ProductAccordionProps = {
  product: Product
}

const SECTIONS = [
  {
    id: 'description',
    title: 'Product Description',
  },
  {
    id: 'features',
    title: 'Features & Benefits',
  },
  {
    id: 'specs',
    title: 'Specifications',
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    content:
      'Free shipping on every order — no minimum required. Orders are dispatched within 1 business day and delivered within 1–2 business days in the Netherlands. EU-wide delivery in 3–5 days. 14-day hassle-free returns. Simply contact us and we arrange free pickup.',
  },
]

export function ProductAccordion({ product }: ProductAccordionProps) {
  return (
    <div className="border-t border-border">
      <Accordion.Root type="single" collapsible defaultValue="description">
        {SECTIONS.map((section) => {
          let content: React.ReactNode = null

          if (section.id === 'description') {
            content = (
              <p className="font-sans text-dark/70 text-sm leading-relaxed">
                {product.description}
              </p>
            )
          } else if (section.id === 'features') {
            content = (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {product.features.map((f) => (
                  <div key={f.title} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-medium">✦</span>
                    </div>
                    <div>
                      <p className="text-xs font-sans font-medium text-dark uppercase tracking-wider mb-1">
                        {f.title}
                      </p>
                      <p className="text-sm font-sans text-muted leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          } else if (section.id === 'specs') {
            content = (
              <dl className="divide-y divide-border">
                {product.specs.map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 gap-4">
                    <dt className="text-xs font-sans text-muted uppercase tracking-wider flex-shrink-0">
                      {label}
                    </dt>
                    <dd className="text-sm font-sans text-dark text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            )
          } else {
            content = (
              <p className="font-sans text-dark/70 text-sm leading-relaxed">
                {section.content}
              </p>
            )
          }

          return (
            <Accordion.Item
              key={section.id}
              value={section.id}
              className="group border-b border-border"
            >
              <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer hover:text-accent transition-colors duration-200">
                <span className="font-sans text-sm font-medium text-dark group-hover:text-accent uppercase tracking-wider transition-colors duration-200">
                  {section.title}
                </span>
                <span className="flex-shrink-0 text-muted group-hover:text-accent transition-colors duration-200">
                  <Plus size={18} strokeWidth={1.5} className="group-data-[state=open]:hidden" />
                  <Minus size={18} strokeWidth={1.5} className="hidden group-data-[state=open]:block" />
                </span>
              </Accordion.Trigger>
              <Accordion.Content className="accordion-content overflow-hidden">
                <div className="pb-6">{content}</div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}
