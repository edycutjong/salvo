'use client';

import * as React from 'react';
import { Crosshair, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { LINKS } from '@/lib/links';
import { accentCss, runSalvo, type DemoResult, type DemoVariant } from '@/lib/ranking';
import { cn } from '@/lib/utils';

/**
 * Element 6 — media section, playable instead of a screenshot.
 * This demo runs a line-for-line TypeScript port of salvo/ranking.py in your
 * browser: same signals, same weights, same reason strings, same tie-breaks.
 * Type any brief; the board you get is deterministic and reproducible.
 */

type Phase = 'idle' | 'firing' | 'landing' | 'scanning' | 'ranked';

const PRESETS = [
  'eco water bottle for hikers who count every gram',
  'sunrise alarm clock for heavy sleepers',
  'trail espresso kit for alpine climbers',
];

/** The OFFLINE PNGs are a dark field with an accent band at 62–80% height — recreated exactly. */
function Swatch({ v, ringed }: { v: DemoVariant; ringed: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/10] w-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #110F1C 0%, #110F1C 62%, ${accentCss(v.accent)} 62%, ${accentCss(v.accent)} 80%, #110F1C 80%)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06]" />
      {ringed && (
        <svg className="absolute right-2.5 top-2.5 h-7 w-7" viewBox="0 0 28 28" aria-hidden="true">
          <circle cx="14" cy="14" r="12" fill="rgba(8,7,15,0.75)" stroke="#EC4899" strokeWidth="2" />
          <path
            d="M 8.5 14.5 L 12.5 18.5 L 19.5 10.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function VariantCard({
  v,
  phase,
  order,
}: {
  v: DemoVariant;
  phase: Phase;
  order: number;
}) {
  const ranked = phase === 'ranked';
  const isTop = ranked && v.rank <= 3;
  return (
    <div
      className={cn(
        'animate-pop overflow-hidden rounded-xl border bg-panel-strong transition-all duration-300',
        isTop
          ? 'border-flare shadow-[0_0_0_1px_#EC4899,0_10px_30px_rgba(236,72,153,0.18)]'
          : 'border-line hover:border-line-strong',
      )}
      style={{ animationDelay: `${order * 110}ms` }}
    >
      <Swatch v={v} ringed={isTop && v.rank === 1} />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                'font-mono text-[10px] uppercase tracking-kicker',
                isTop ? 'text-flare-strong' : 'text-ink-faint',
              )}
            >
              {ranked ? (isTop ? `★ rank #${v.rank}` : `rank #${v.rank}`) : `variant ${v.index}`}
            </p>
            <p className="mt-1 text-[14.5px] font-semibold leading-snug text-ink">{v.headline}</p>
          </div>
          <p
            className={cn(
              'flex-none font-mono text-lg font-bold',
              isTop ? 'text-flare-strong' : 'text-violet-strong',
            )}
          >
            {ranked ? (
              v.score.toFixed(1)
            ) : (
              <span className="relative inline-block h-4 w-10 overflow-hidden rounded bg-white/5 align-middle">
                <span className="animate-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </span>
            )}
          </p>
        </div>
        {ranked && (
          <ul className="flex flex-col gap-1.5">
            {v.reasons.map((r, i) => (
              <li
                key={i}
                className="relative pl-4 text-[11.5px] leading-snug text-ink-muted before:absolute before:left-0 before:text-violet before:content-['→']"
              >
                {r}
              </li>
            ))}
          </ul>
        )}
        <p className="truncate font-mono text-[10px] text-ink-faint">sha256 {v.sha256.slice(0, 24)}…</p>
      </div>
    </div>
  );
}

export function LiveDemo() {
  const [brief, setBrief] = React.useState(PRESETS[0]);
  const [n, setN] = React.useState(6);
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [result, setResult] = React.useState<DemoResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const fire = async () => {
    const trimmed = brief.trim();
    if (!trimmed) {
      setError('Please enter a brief.');
      return;
    }
    setError(null);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setResult(null);
    setPhase('firing');

    const res = await runSalvo(trimmed, n);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setResult(res);
      setPhase('ranked');
      return;
    }

    schedule(() => {
      setResult(res);
      setPhase('landing');
    }, 620);
    const landingDone = 620 + n * 110 + 500;
    schedule(() => setPhase('scanning'), landingDone);
    schedule(() => setPhase('ranked'), landingDone + 950);
  };

  const busy = phase === 'firing' || phase === 'landing' || phase === 'scanning';

  // During landing/scanning show fired order; once ranked, best-first (the console's story).
  const cards: DemoVariant[] =
    result === null
      ? []
      : phase === 'ranked'
        ? result.variants
        : [...result.variants].sort((a, b) => a.index - b.index);

  return (
    <section id="demo" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge variant="accent">
            <Crosshair size={13} aria-hidden="true" /> live fire exercise
          </Badge>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Watch a salvo <span className="text-gradient-brand">land</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            This is not a video. It runs a line-for-line port of{' '}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-violet-strong">
              salvo/ranking.py
            </code>{' '}
            in your browser — same signals, same weights, same reason strings. Type any brief:
            the board is deterministic, so the same brief always lands the same way.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-panel-lift sm:p-8">
            {/* Brief input row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label
                  htmlFor="demo-brief"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-ink-muted"
                >
                  Creative brief
                </label>
                <input
                  id="demo-brief"
                  type="text"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="h-12 w-full rounded-xl border border-line bg-night-1 px-4 text-[15px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-violet/60"
                  placeholder="what are we selling, and to whom?"
                />
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <label
                    htmlFor="demo-n"
                    className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-ink-muted"
                  >
                    Variants
                  </label>
                  <select
                    id="demo-n"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="h-12 rounded-xl border border-line bg-night-1 px-4 font-mono text-sm text-ink outline-none focus:border-violet/60"
                  >
                    {[4, 6, 8].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <Button size="lg" onClick={fire} disabled={busy} className="min-w-[180px]">
                  {busy ? 'Firing…' : 'Fire the salvo'}
                </Button>
              </div>
            </div>

            {/* Preset chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-kicker text-ink-faint">
                try:
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setBrief(p)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition-all duration-200',
                    brief === p
                      ? 'border-violet/60 bg-violet/10 text-violet-strong'
                      : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-flare-strong">{error}</p>}

            {/* The board */}
            <div className="relative mt-8 min-h-[220px]" aria-live="polite">
              {/* Tracer fire on launch */}
              {phase === 'firing' && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="animate-shot absolute h-[2px] w-24 rounded-full"
                      style={{
                        top: `${12 + i * 15}%`,
                        background: `linear-gradient(90deg, transparent, ${i % 2 ? '#A78BFA' : '#F472B6'}, transparent)`,
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Scan beam */}
              {phase === 'scanning' && (
                <div
                  aria-hidden="true"
                  className="animate-scan absolute inset-x-0 z-10 h-10 bg-gradient-to-b from-transparent via-flare/25 to-transparent"
                />
              )}

              {phase === 'idle' && (
                <div className="grid place-items-center rounded-2xl border border-dashed border-line py-16 text-center">
                  <p className="max-w-sm text-sm text-ink-faint">
                    Enter a brief and fire — variants pop in, the scan ranks the board, and the
                    top three get the ring.
                  </p>
                </div>
              )}

              {result && phase !== 'idle' && phase !== 'firing' && (
                <>
                  {phase === 'ranked' && (
                    <h3 className="mb-4 font-mono text-[11px] uppercase tracking-kicker text-ink-muted">
                      <span className="text-flare-strong">top 3 — ship these</span> · then the rest
                      of the batch
                    </h3>
                  )}
                  <div
                    className={cn(
                      'grid gap-4 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3',
                      phase === 'scanning' && 'opacity-80',
                    )}
                  >
                    {cards.map((v, i) => (
                      <VariantCard key={v.index} v={v} phase={phase} order={i} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Run summary — mirrors the console's meta row */}
            {result && phase === 'ranked' && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-xs text-ink-muted">
                <span>
                  <b className="text-ink">{result.variants.length}</b> variants ·{' '}
                  <b className="text-ink">{n}</b> requested
                </span>
                <span>
                  cost <b className="text-ink">${result.costUsd.toFixed(4)}</b>
                </span>
                <span>
                  manifest{' '}
                  <span className="text-mint">{result.manifestHash.slice(0, 16)}…</span>{' '}
                  <span className="text-mint">verified ✓</span>
                </span>
                <span className="uppercase tracking-kicker text-violet-strong">offline</span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Honesty + escalation to the real thing */}
        <Reveal delay={200} className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="max-w-2xl text-[13px] leading-relaxed text-ink-faint">
            Honest scope: swatches stand in for the OFFLINE mock PNGs, and this demo seeds content
            hashes from each variant&rsquo;s descriptor instead of server-side image bytes — the
            scoring math, reason strings, and tie-breaks are the real thing. The live console runs
            the full pipeline: Genblaze fan-out, object storage, manifest verification.
          </p>
          <ButtonLink href={LINKS.console} target="_blank" rel="noreferrer" variant="outline" size="md">
            Fire one on the real API
            <ExternalLink size={15} />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
