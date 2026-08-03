import { ArrowRight, Github } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { CopyCommand } from '@/components/copy-command';
import { Reveal } from '@/components/reveal';
import { LINKS } from '@/lib/links';

/** Element 10 — final CTA as a hero moment: target rings, tracer fire, one ask. */
export function FinalCTA() {
  return (
    <section className="noise relative overflow-hidden border-t border-line py-28 sm:py-36">
      {/* Target rings — the brand's crosshair, faint and huge */}
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="0 0 800 800"
          className="h-[1100px] w-[1100px] max-w-none opacity-[0.16]"
        >
          <defs>
            <radialGradient id="ring-fade" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.4" stopColor="#EC4899" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {[110, 200, 290, 385].map((r) => (
            <circle
              key={r}
              cx="400"
              cy="400"
              r={r}
              fill="none"
              stroke="url(#ring-fade)"
              strokeWidth="1.4"
            />
          ))}
          <line x1="400" y1="0" x2="400" y2="800" stroke="url(#ring-fade)" strokeWidth="0.8" />
          <line x1="0" y1="400" x2="800" y2="400" stroke="url(#ring-fade)" strokeWidth="0.8" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[130px]"
      />
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <span
          className="animate-tracer absolute left-0 top-[24%] h-px w-48 bg-gradient-to-r from-transparent via-flare/60 to-transparent"
          style={{ animationDelay: '1.2s' }}
        />
        <span
          className="animate-tracer absolute left-0 top-[74%] h-px w-36 bg-gradient-to-r from-transparent via-violet-strong/50 to-transparent"
          style={{ animationDelay: '4.4s' }}
        />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-kicker text-flare-strong">
            zero credentials · zero signup · offline demo is live right now
          </p>
          <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            Fire your first
            <br />
            <span className="text-gradient-brand">salvo.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
            Type a brief. Get a ranked batch with the reasoning shown. Ship the top three — with a
            verified manifest behind every variant.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink
            href={LINKS.console}
            target="_blank"
            rel="noreferrer"
            size="xl"
            className="group shadow-[0_12px_48px_rgba(139,92,246,0.45)]"
          >
            Open the live console
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </ButtonLink>
          <ButtonLink href={LINKS.github} target="_blank" rel="noreferrer" variant="ghost" size="xl">
            <Github size={20} />
            Star the repo
          </ButtonLink>
        </Reveal>

        <Reveal delay={260} className="mt-12 w-full">
          <div className="flex justify-center">
            <CopyCommand />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
