import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/reveal';
import { accentCss } from '@/lib/ranking';

/**
 * Element 8 — the testimonial slot, Salvo-style: no invented customers, no
 * stock avatars. The "reviews" are the ranking engine's own reason strings
 * from a representative OFFLINE run (brief: "eco water bottle for hikers"),
 * plus two receipts pulled straight from the repo.
 */

interface Receipt {
  swatch: readonly [number, number, number];
  name: string;
  role: string;
  score: number;
  quote: string;
}

const RECEIPTS: Receipt[] = [
  {
    swatch: [139, 92, 246],
    name: 'Variant #0 — “Eco, reimagined for water”',
    role: 'Rank #1 · shipped',
    score: 74.8,
    quote: 'Brief coverage 2/4 keywords (eco, water) → +22.5 pts',
  },
  {
    swatch: [244, 114, 182],
    name: 'Variant #4 — “Your water, upgraded with eco”',
    role: 'Rank #2 · shipped',
    score: 70.6,
    quote: 'Headline length 29 chars, inside the 22-42 sweet spot → +25.0 pts',
  },
  {
    swatch: [236, 72, 153],
    name: 'Variant #1 — “The water built for bottle”',
    role: 'Rank #3 · shipped',
    score: 67.3,
    quote: 'Engagement index 0.66 (seeded from content hash, not real click data) → +19.8 pts',
  },
  {
    swatch: [52, 211, 153],
    name: 'Variant #2 — “Bottle: hikers without compromise”',
    role: 'Rank #4 · benched',
    score: 63.1,
    quote: 'Brief coverage 2/4 keywords (bottle, hikers) → +22.5 pts',
  },
];

function SwatchAvatar({ accent }: { accent: readonly [number, number, number] }) {
  return (
    <span
      aria-hidden="true"
      className="block h-11 w-11 flex-none rounded-xl border border-line-strong"
      style={{
        background: `linear-gradient(180deg, #110F1C 0%, #110F1C 58%, ${accentCss(accent)} 58%, ${accentCss(accent)} 80%, #110F1C 80%)`,
      }}
    />
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3" aria-label={`score ${score} out of 100`}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="animate-bar h-full rounded-full bg-gradient-to-r from-violet to-flare"
          style={{ ['--bar-w' as string]: `${score}%` }}
        />
      </div>
      <span className="font-mono text-sm font-bold text-flare-strong">{score.toFixed(1)}</span>
    </div>
  );
}

export function Receipts() {
  return (
    <section id="receipts" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute right-[10%] top-16 h-64 w-64 rounded-full bg-flare/10 blur-[110px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge variant="accent">receipts, not reviews</Badge>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The variants <span className="text-gradient-brand">speak for themselves</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            No invented praise, no stock-photo customers. These cards quote the ranking
            engine&rsquo;s own reason strings from a representative run — fire the demo above and
            generate your own.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured receipt — the module docstring, verbatim */}
          <Reveal className="min-w-0 lg:col-span-2">
            <figure className="glass-strong relative h-full overflow-hidden rounded-2xl p-8">
              <span
                aria-hidden="true"
                className="absolute -top-5 right-6 font-display text-[120px] font-bold leading-none text-violet/15"
              >
                &rdquo;
              </span>
              <blockquote className="relative max-w-xl font-display text-xl font-medium leading-relaxed text-ink sm:text-2xl">
                Nothing here is random: the same brief + variant always yields the same score —
                which is what makes the ranking testable and the demo honest.
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-violet/40 bg-violet/10 font-mono text-sm font-bold text-violet-strong"
                >
                  py
                </span>
                <div>
                  <p className="font-mono text-sm text-ink">salvo/ranking.py</p>
                  <p className="text-xs text-ink-faint">module docstring, in the public repo</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {RECEIPTS.slice(0, 1).map((r) => (
            <ReceiptCard key={r.name} r={r} delay={100} />
          ))}
          {RECEIPTS.slice(1).map((r, i) => (
            <ReceiptCard key={r.name} r={r} delay={i * 90} />
          ))}

          {/* The suite's word — full-width terminal strip */}
          <Reveal delay={120} className="min-w-0 md:col-span-2 lg:col-span-3">
            <div className="glass flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="min-w-0 overflow-x-auto">
                <code className="font-mono text-[13px] text-ink-muted sm:whitespace-nowrap">
                  <span className="text-flare-strong">$</span> OFFLINE=1 .venv/bin/python -m pytest{' '}
                  <span className="text-mint">→ 19 passed</span>
                </code>
                <p className="mt-2 text-xs text-ink-faint">
                  end-to-end offline run · deterministic ranking · top-3 selection · manifest
                  provenance · valid PNGs · the whole FastAPI surface
                </p>
              </div>
              <span className="inline-flex flex-none items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-2 font-mono text-xs uppercase tracking-kicker text-mint">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint" />
                all green
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ReceiptCard({ r, delay }: { r: Receipt; delay: number }) {
  return (
    <Reveal delay={delay} className="min-w-0">
      <figure className="glass group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-flare/40">
        <ScoreBar score={r.score} />
        <blockquote className="mt-5 flex-1 font-mono text-[13px] leading-relaxed text-ink-muted">
          <span aria-hidden="true" className="mr-1 text-violet">
            →
          </span>
          {r.quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3.5 border-t border-line pt-5">
          <SwatchAvatar accent={r.swatch} />
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold leading-snug text-ink">{r.name}</p>
            <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-kicker text-ink-faint">
              {r.role}
            </p>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
