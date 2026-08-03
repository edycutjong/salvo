import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/reveal';
import { CountUp } from '@/components/count-up';

/**
 * The differentiator: explainable, deterministic ranking — weights straight
 * from salvo/ranking.py, and the honesty note quoted verbatim from the README.
 */

const SIGNALS = [
  {
    weight: 0.45,
    name: 'Brief coverage',
    what: 'How many of the brief’s keywords the headline actually uses. An ad that ignores the brief is a bad ad, no matter how pretty — so coverage dominates.',
    bar: 'from-violet to-violet-strong',
  },
  {
    weight: 0.25,
    name: 'Headline length',
    what: 'Closeness to a 22–42 character scannable sweet spot: long enough to say something, short enough to scan.',
    bar: 'from-violet-strong to-flare-strong',
  },
  {
    weight: 0.3,
    name: 'Engagement index',
    what: 'A deterministic pseudo-signal seeded from the content hash, so the ranking is reproducible offline. Explicitly not real click data — and labeled as such in every reason string.',
    bar: 'from-flare to-flare-strong',
  },
];

const SAMPLE_REASONS = [
  'Brief coverage 2/4 keywords (eco, water) → +22.5 pts',
  'Headline length 25 chars, inside the 22-42 sweet spot → +25.0 pts',
  'Engagement index 0.91 (seeded from content hash, not real click data) → +27.3 pts',
];

export function Scoring() {
  return (
    <section id="scoring" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge>explainable by construction</Badge>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Every score <span className="text-gradient-brand">shows its work</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Three transparent signals with fixed weights. Nothing is random: the same brief and
            variant always yield the same score and the same reasons — which is what makes the
            ranking testable and the demo honest.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SIGNALS.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <div className="glass group h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong">
                <p className="font-mono text-5xl font-bold text-ink">
                  <CountUp value={s.weight} decimals={2} />
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`animate-bar h-full rounded-full bg-gradient-to-r ${s.bar}`}
                    style={{ ['--bar-w' as string]: `${s.weight * 100}%`, animationDelay: `${300 + i * 150}ms` }}
                  />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.name}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">{s.what}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {/* A reason breakdown, exactly as the API returns it */}
          <Reveal delay={80} className="min-w-0">
            <div className="glass-strong h-full rounded-2xl p-7">
              <p className="font-mono text-[11px] uppercase tracking-kicker text-ink-muted">
                what one variant&rsquo;s <span className="text-violet-strong">reasons[]</span> looks
                like
              </p>
              <div className="mt-5 overflow-x-auto">
                <ul className="flex min-w-[420px] flex-col gap-3">
                  {SAMPLE_REASONS.map((r) => (
                    <li
                      key={r}
                      className="relative rounded-lg border border-line bg-night-0/70 py-3 pl-9 pr-4 font-mono text-[12.5px] leading-relaxed text-ink-muted"
                    >
                      <span aria-hidden="true" className="absolute left-3.5 text-violet">
                        →
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 font-mono text-xs text-ink-faint">
                = <span className="font-bold text-flare-strong">74.8</span> / 100 · same input,
                same output, every run — ties break on sha256 so ordering never wobbles
              </p>
            </div>
          </Reveal>

          {/* The honesty note — a brand asset, not fine print */}
          <Reveal delay={160} className="min-w-0">
            <div className="relative h-full rounded-2xl border-2 border-dashed border-flare/40 bg-flare/[0.04] p-7">
              <p className="font-mono text-[11px] uppercase tracking-kicker text-flare-strong">
                ⚠ honesty note — quoted from the README
              </p>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                &ldquo;The engagement index is{' '}
                <strong className="text-ink">not real click/CTR data</strong> — it is a
                deterministic stand-in seeded from the content hash so the ranking is reproducible
                offline, and every reason string says so.{' '}
                <strong className="text-ink">
                  No fabricated metrics are presented as real.
                </strong>
                &rdquo;
              </blockquote>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
