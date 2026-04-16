'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Plus, Minus } from 'lucide-react'
import { getFAQS } from '@/lib/data'
import { useTranslations, useLocale } from 'next-intl'

export function HomeFAQ() {
  const t = useTranslations('home.faq')
  const locale = useLocale()
  const faqs = getFAQS(locale)

  return (
    <section className="section-py">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-accent mb-4">
              {t('eyebrow')}
            </p>
            <h2
              className="font-sans font-bold text-dark tracking-tight leading-tight"
              style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}
            >
              {t('title1')}
              <br />
              {t('title2')}
            </h2>
            <p className="font-sans text-muted text-sm mt-4 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="lg:col-span-2">
            <Accordion.Root type="single" collapsible className="divide-y divide-border">
              {faqs.map((faq) => (
                <Accordion.Item key={faq.id} value={faq.id} className="group">
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left font-sans font-semibold text-sm text-dark hover:text-accent transition-colors duration-200 cursor-pointer">
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 text-muted group-data-[state=open]:text-accent transition-colors duration-200">
                      <Plus size={18} strokeWidth={2} className="group-data-[state=open]:hidden" />
                      <Minus size={18} strokeWidth={2} className="hidden group-data-[state=open]:block" />
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="accordion-content overflow-hidden">
                    <p className="font-sans text-muted text-sm leading-relaxed pb-5 max-w-2xl">
                      {faq.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  )
}
