import { Github } from 'lucide-react';
import { LINKS } from '@/lib/links';

/** Element 11 — multi-column footer: product, stack, hackathon, legal. */

const COLUMNS: Array<{
  heading: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    heading: 'Product',
    links: [
      { label: 'Live console', href: LINKS.console, external: true },
      { label: 'Demo video (2 min)', href: LINKS.video, external: true },
      { label: 'Pitch deck', href: LINKS.pitch, external: true },
      { label: 'API docs (OpenAPI)', href: LINKS.apiDocs, external: true },
      { label: 'Health check', href: LINKS.health, external: true },
      { label: 'Source on GitHub', href: LINKS.github, external: true },
    ],
  },
  {
    heading: 'The stack',
    links: [
      { label: 'Genblaze on PyPI', href: LINKS.genblaze, external: true },
      { label: 'Backblaze B2', href: LINKS.backblaze, external: true },
      { label: 'FastAPI + Python 3.11', href: LINKS.github, external: true },
      { label: 'Docker on Railway', href: LINKS.github, external: true },
    ],
  },
  {
    heading: 'Hackathon',
    links: [
      { label: 'Backblaze Generative Media', href: LINKS.devpost, external: true },
      { label: 'Devpost listing', href: LINKS.devpost, external: true },
      { label: 'Project README', href: LINKS.github, external: true },
    ],
  },
  {
    heading: 'Legal & contact',
    links: [
      { label: 'MIT License', href: LINKS.license, external: true },
      { label: 'Open an issue', href: LINKS.issues, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-night-1">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand block */}
          <div>
            <a href="#top" className="flex items-center gap-3">
              <img src="./icon.svg" alt="" width={40} height={40} className="rounded-xl" />
              <span className="font-display text-2xl font-bold">
                <span className="text-gradient-brand">Salvo</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Brief in → N scored ad variants out — best three ship. A batch creative factory on
              Genblaze + Backblaze B2 with explainable, reproducible ranking.
            </p>
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-faint">
              No cookies. No tracking. No analytics.
              <br />
              This page is a static export — the product does the talking.
            </p>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Salvo on GitHub"
              className="mt-6 inline-grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 hover:scale-110 hover:border-line-strong hover:text-ink"
            >
              <Github size={17} />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="font-mono text-[10.5px] font-semibold uppercase tracking-kicker text-ink-faint">
                  {col.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noreferrer' : undefined}
                        className="text-sm text-ink-muted transition-colors duration-200 hover:text-flare-strong"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <div className="mt-14 flex flex-col items-center gap-5 border-t border-line pt-10">
          <span className="font-mono text-[10.5px] uppercase tracking-kicker text-ink-faint">Sponsored by</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={LINKS.backblaze} target="_blank" rel="noreferrer" aria-label="Backblaze" className="rounded-xl bg-white px-5 py-3 shadow-sm transition-transform duration-200 hover:scale-105">
              <img src="./sponsors/backblaze.png" alt="Backblaze" className="h-7 w-auto" />
            </a>
            <a href="https://www.gmicloud.ai" target="_blank" rel="noreferrer" aria-label="GMI Cloud" className="rounded-xl bg-white px-5 py-3 shadow-sm transition-transform duration-200 hover:scale-105">
              <img src="./sponsors/gmi.png" alt="GMI Cloud" className="h-7 w-auto" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="font-mono text-[11px] text-ink-faint">
            © 2026 Salvo · MIT licensed · built for the Backblaze Generative Media Hackathon
          </p>
          <p className="font-mono text-[11px] text-ink-faint">
            one ad is a guess — <span className="text-flare-strong">a salvo is a decision</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
