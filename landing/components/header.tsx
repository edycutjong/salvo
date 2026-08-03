'use client';

import * as React from 'react';
import { Github, Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { LINKS } from '@/lib/links';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '#demo', label: 'Live fire' },
  { href: '#how-it-works', label: 'Pipeline' },
  { href: '#scoring', label: 'Scoring' },
  { href: '#receipts', label: 'Receipts' },
  { href: '#faq', label: 'FAQ' },
];

/** Element 2 — logo top-left, sticky header, transparent → glass on scroll. */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out-expo',
        scrolled
          ? 'border-b border-line bg-night-0/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo — animated brand mark (SMIL SVG plays inside <img>) */}
        <a href="#top" className="group flex items-center gap-3" aria-label="Salvo — back to top">
          {/* Relative src keeps assets working under any GitHub Pages basePath */}
          <img
            src="./icon-animated.svg"
            alt=""
            width={34}
            height={34}
            className="rounded-lg transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110"
          />
          <span className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient-brand">Salvo</span>
          </span>
          <span className="mt-0.5 hidden font-mono text-[10px] uppercase tracking-kicker text-ink-faint md:inline">
            creative factory
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group/nav relative py-2 font-mono text-[11.5px] uppercase tracking-kicker text-ink-muted transition-colors duration-200 hover:text-flare-strong"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-strong to-flare-strong transition-transform duration-300 ease-out-expo group-hover/nav:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Salvo on GitHub"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 hover:scale-110 hover:border-line-strong hover:text-ink"
          >
            <Github size={18} />
          </a>
          <ButtonLink href={LINKS.console} target="_blank" rel="noreferrer" size="md">
            Open the live console
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile panel — always mounted, animated open/close via max-height + opacity */}
      <div
        aria-hidden={!open}
        className={cn(
          'overflow-hidden border-t bg-night-0/95 backdrop-blur-xl transition-all duration-300 ease-out-expo lg:hidden',
          open
            ? 'max-h-[28rem] border-line opacity-100'
            : 'pointer-events-none max-h-0 border-transparent opacity-0',
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg px-3 py-3 font-mono text-xs uppercase tracking-kicker text-ink-muted transition-all duration-300 ease-out-expo hover:bg-white/5 hover:text-ink',
                open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
              )}
              style={{ transitionDelay: open ? `${60 + i * 35}ms` : '0ms' }}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex items-center gap-3">
            <ButtonLink
              href={LINKS.console}
              target="_blank"
              rel="noreferrer"
              size="md"
              tabIndex={open ? 0 : -1}
              className="flex-1"
            >
              Open the live console
            </ButtonLink>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Salvo on GitHub"
              tabIndex={open ? 0 : -1}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 hover:border-line-strong hover:text-ink"
            >
              <Github size={18} />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
