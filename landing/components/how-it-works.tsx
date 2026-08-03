import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/reveal';

/** The real pipeline, step by step — each with the actual code path it names. */

const STEPS = [
  {
    num: '01',
    title: 'Fan out',
    body: 'Your brief becomes N variant steps — one PNG + headline each — fired in parallel through one genuine Genblaze pipeline. Not a for-loop of fakes.',
    code: 'Pipeline.astream(max_concurrency=N)',
  },
  {
    num: '02',
    title: 'Store',
    body: 'Every variant lands in object storage with hierarchical keys — campaigns/{date}/{run}/… — through Genblaze’s documented StorageBackend interface.',
    code: 'ObjectStorageSink(backend, HIERARCHICAL)',
  },
  {
    num: '03',
    title: 'Verify',
    body: 'The provenance manifest is read back and checked, content hashes and all. If it doesn’t verify, the run says so.',
    code: 'read_manifest(verify=True)',
  },
  {
    num: '04',
    title: 'Rank & ship',
    body: 'Explainable, deterministic scores order the board. The three highest scorers are the three that ship — with the reasoning shown, not hidden.',
    code: 'rank_variants(brief, variants)',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 border-t border-line bg-night-1/50 py-24 sm:py-32">
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky intro column — asymmetric layout */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Badge>the pipeline</Badge>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Brief in.
                <br />
                <span className="text-gradient-brand">Decision out.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
                Four moves, all real SDK code paths. The sponsor stack is the engine here, not a
                sticker: Genblaze owns the fan-out and the manifest, Backblaze B2 owns the bytes.
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
                OFFLINE=1 (default) runs everything on a local StorageBackend.
                <br />
                B2_KEY_ID + B2_APP_KEY flips storage to a real Backblaze B2 bucket.
              </p>
            </Reveal>
          </div>

          {/* Steps rail */}
          <ol className="relative flex min-w-0 flex-col gap-5">
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-violet/50 via-flare/40 to-mint/40 sm:left-[35px]"
            />
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.num} delay={i * 90}>
                <div className="glass group relative flex gap-5 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong sm:gap-7 sm:p-7">
                  <div className="relative z-10 grid h-14 w-14 flex-none place-items-center rounded-xl border border-violet/40 bg-night-1 font-mono text-sm font-bold text-violet-strong transition-colors duration-300 group-hover:border-flare/50 group-hover:text-flare-strong sm:h-[72px] sm:w-[72px] sm:text-base">
                    {step.num}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{step.body}</p>
                    <div className="mt-4 overflow-x-auto">
                      <code className="inline-block whitespace-nowrap rounded-lg border border-line bg-night-0 px-3.5 py-2 font-mono text-[12.5px] text-flare-strong">
                        {step.code}
                      </code>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* The same story as shipped in the repo README — animated brand media */}
        <Reveal delay={140} className="mt-16">
          <figure className="overflow-hidden rounded-2xl border border-line shadow-panel-lift">
            {/* Animated SMIL/CSS SVG plays inside a plain <img>; relative src survives any basePath */}
            <img
              src="./readme-hero-animated.svg"
              alt="Animated pipeline diagram: one brief fans out into scored variants, the board is ranked, and the top three are ringed and stored on Backblaze B2 with a verified manifest"
              width={1280}
              height={320}
              className="h-auto w-full"
              loading="lazy"
            />
            <figcaption className="border-t border-line bg-night-1/80 px-5 py-3 text-center font-mono text-[11px] text-ink-faint">
              the same eight seconds that open the repo README — one brief, one salvo, top 3 sealed
              into B2
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
