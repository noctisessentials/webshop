'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type FAQItem = { q: string; a: string }
type FAQGroup = { heading: string; items: FAQItem[] }

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className={cn(
          'font-sans font-semibold text-sm leading-snug transition-colors duration-200',
          isOpen ? 'text-dark' : 'text-dark/75 group-hover:text-dark'
        )}>
          {item.q}
        </span>
        <span className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-250',
          isOpen
            ? 'bg-dark border-dark text-white'
            : 'border-border text-muted group-hover:border-dark/30'
        )}>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={cn('transition-transform duration-250', isOpen ? 'rotate-45' : 'rotate-0')}
          >
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
        )}
      >
        <p className="text-sm font-sans text-dark/65 leading-relaxed">{item.a}</p>
      </div>
    </div>
  )
}

export function FAQAccordion({ groups }: { groups: FAQGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key)

  return (
    <div className="space-y-10 mt-4">
      {groups.map((group) => (
        <div key={group.heading}>
          <h2 className="font-sans font-semibold text-dark text-base uppercase tracking-widest mb-1 text-muted">
            {group.heading}
          </h2>
          <div className="mt-3 bg-surface rounded-[18px] border border-border px-6 divide-y-0">
            {group.items.map((item, idx) => {
              const key = `${group.heading}-${idx}`
              return (
                <AccordionItem
                  key={key}
                  item={item}
                  isOpen={openKey === key}
                  onToggle={() => toggle(key)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
