import { ArrowRight, Crosshair, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { CountUp } from '@/components/count-up';
import { TerminalCard } from '@/components/terminal-card';
import { LINKS } from '@/lib/links';

/**
 * Elements 3–5: SEO headline + subtitle, primary CTA, social proof.
 * Signature move: the word "decision" gets the magenta pick-ring —
 * the same ring the product draws around the winning variant.
 */

const STATS: Array<{
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  live?: boolean;
}> = [
  { value: 19, suffix: '/19', label: 'pytest tests green, OFFLINE' },
  { value: 3, suffix: '', label: 'transparent scoring signals' },
  { value: 0, suffix: '', label: 'credentials needed to demo' },
  { value: 12, suffix: '', label: 'variants per salvo, top 3 ship' },
];

function RingedWord({ children }: { children: string }) {
  return (
    <span className="relative inline-block px-2">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-1 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+8px)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pick-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F472B6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="4"
          width="96"
          height="92"
          rx="16"
          ry="42"
          fill="none"
          stroke="url(#pick-ring)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          pathLength={100}
          className="animate-ring-draw"
          style={{ animationDelay: '900ms' }}
        />
      </svg>
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="bg-mesh noise relative overflow-hidden pb-20 pt-32 sm:pt-40">
      {/* Atmosphere */}
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden="true"
        className="animate-aurora-a absolute -top-24 left-[8%] h-80 w-80 rounded-full bg-violet/25 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="animate-aurora-b absolute bottom-0 right-[6%] h-72 w-72 rounded-full bg-flare/15 blur-[110px]"
      />
      {/* Tracer fire */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <span className="animate-tracer absolute left-0 top-[30%] h-px w-40 bg-gradient-to-r from-transparent via-flare/70 to-transparent" />
        <span
          className="animate-tracer absolute left-0 top-[62%] h-px w-56 bg-gradient-to-r from-transparent via-violet-strong/60 to-transparent"
          style={{ animationDelay: '2.8s' }}
        />
        <span
          className="animate-tracer absolute left-0 top-[14%] h-px w-32 bg-gradient-to-r from-transparent via-flare-strong/50 to-transparent"
          style={{ animationDelay: '5.2s' }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — copy */}
        <div className="min-w-0">
          <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
            <Badge>
              <Crosshair className="inline h-3.5 w-3.5 -mt-0.5 text-violet-strong" aria-hidden="true" /> Backblaze Generative Media Hackathon · Genblaze + B2
            </Badge>
          </div>

          {/* Element 3 — massive display headline */}
          <h1 className="mt-7 font-display text-[2.85rem] font-bold leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
            <span className="animate-fade-up inline-block" style={{ animationDelay: '120ms' }}>
              One ad is a guess.
            </span>
            <br />
            <span className="animate-fade-up inline-block" style={{ animationDelay: '260ms' }}>
              A <span className="text-gradient-brand">salvo</span> is a{' '}
              <RingedWord>decision</RingedWord>.
            </span>
          </h1>

          <p
            className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl"
            style={{ animationDelay: '400ms' }}
          >
            Brief in → <span className="font-semibold text-ink">N scored ad variants</span> out —
            the <span className="font-semibold text-flare-strong">best three ship</span>. Salvo is a
            batch creative factory on Genblaze + Backblaze B2: one real pipeline fan-out, every
            variant stored with verified provenance, ranked by explainable, deterministic scores.
          </p>

          {/* Element 4 — primary CTA */}
          <div
            className="animate-fade-up mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: '540ms' }}
          >
            <ButtonLink href={LINKS.console} target="_blank" rel="noreferrer" size="lg" className="group">
              Open the live console
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={LINKS.github} target="_blank" rel="noreferrer" variant="ghost" size="lg">
              <Github size={18} />
              Read the source
            </ButtonLink>
          </div>

          <p
            className="animate-fade-up mt-4 font-mono text-xs text-ink-faint"
            style={{ animationDelay: '620ms' }}
          >
            Zero credentials, zero signup — the OFFLINE demo is always green.
          </p>

          {/* Element 5 — social proof: the numbers that are actually true */}
          <dl
            className="animate-fade-up mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-4"
            style={{ animationDelay: '700ms' }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-3xl font-bold text-ink sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dd className="mt-1.5 text-[13px] leading-snug text-ink-faint">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — Element 6 preview: real API call, real response shape */}
        <div className="animate-fade-up min-w-0" style={{ animationDelay: '480ms' }}>
          <TerminalCard />
          <p className="mt-3 text-center font-mono text-[11px] text-ink-faint">
            The response shape is verbatim from{' '}
            <a
              href={LINKS.apiDocs}
              target="_blank"
              rel="noreferrer"
              className="text-violet-strong underline-offset-4 hover:underline"
            >
              the live API
            </a>
            {' '}— try it yourself.
          </p>
        </div>
      </div>
    </section>
  );
}
