'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hand-authored ShadCN-style accordion (no Radix dependency — this page is a
 * static export and stays lean). Accessible: real buttons, aria-expanded,
 * aria-controls, keyboard-native. Smooth height animation via grid-rows.
 */

interface AccordionContextValue {
  openItem: string | null;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  className,
  defaultValue = null,
  children,
}: {
  className?: string;
  defaultValue?: string | null;
  children: React.ReactNode;
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(defaultValue);
  const toggle = React.useCallback(
    (value: string) => setOpenItem((cur) => (cur === value ? null : value)),
    [],
  );
  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className={cn('flex flex-col gap-3', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>');
  const open = ctx.openItem === value;
  const panelId = `faq-panel-${value}`;
  const buttonId = `faq-button-${value}`;

  return (
    <div
      className={cn(
        'glass rounded-2xl transition-all duration-300 ease-out-expo',
        open ? 'border-flare/40 shadow-[0_0_28px_rgba(236,72,153,0.12)]' : 'hover:border-line-strong',
      )}
    >
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => ctx.toggle(value)}
        className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold text-ink md:text-lg">
          {question}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'grid h-8 w-8 flex-none place-items-center rounded-full border transition-all duration-300 ease-out-expo',
            open
              ? 'rotate-45 border-flare/60 bg-flare/15 text-flare-strong'
              : 'border-line-strong text-ink-muted',
          )}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out-expo',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-[15px] leading-relaxed text-ink-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}
