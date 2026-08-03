import {
  BadgeCheck,
  Database,
  FileCheck2,
  ListOrdered,
  Network,
  PlugZap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/reveal';

/** Element 7 — core benefits in an asymmetric bento (not a cookie-cutter 3-col grid). */

const FEATURES = [
  {
    icon: Network,
    title: 'A real fan-out, not a loop of fakes',
    body: 'All N variants run in parallel through one genuine Genblaze Pipeline.astream(max_concurrency=N) — the “batch factory” claim is backed by real SDK code paths, provenance-verified.',
    span: 'lg:col-span-3',
    tint: 'text-violet-strong',
    tintBg: 'bg-violet/10 border-violet/30',
  },
  {
    icon: PlugZap,
    title: 'Green even when your provider dies',
    body: 'OFFLINE=1 is the default: a mock provider emits real PNG bytes through a dependency-free raw-PNG encoder — no Pillow, no ffmpeg, no network — while fan-out, storage, verification and ranking stay 100% real. The demo path is always green.',
    span: 'lg:col-span-3',
    tint: 'text-flare-strong',
    tintBg: 'bg-flare/10 border-flare/30',
  },
  {
    icon: FileCheck2,
    title: 'Provenance you can verify',
    body: 'Every variant is stored with a manifest that gets read back via read_manifest(verify=True). manifest_verified: true, or the run says otherwise.',
    span: 'lg:col-span-2',
    tint: 'text-mint',
    tintBg: 'bg-mint/10 border-mint/30',
  },
  {
    icon: ListOrdered,
    title: 'Ranking that shows its work',
    body: 'Three transparent signals, fixed weights, plain-English reasons on every score — deterministic end to end.',
    span: 'lg:col-span-2',
    tint: 'text-violet-strong',
    tintBg: 'bg-violet/10 border-violet/30',
  },
  {
    icon: Database,
    title: 'B2 is one env-var away',
    body: 'Set B2_KEY_ID / B2_APP_KEY and storage flips from the local backend to a real Backblaze B2 bucket via Genblaze’s S3StorageBackend — auto-detected at startup.',
    span: 'lg:col-span-2',
    tint: 'text-flare-strong',
    tintBg: 'bg-flare/10 border-flare/30',
  },
  {
    icon: BadgeCheck,
    title: 'Proof lives in the repo',
    body: '19 pytest tests green with zero credentials, Dockerized with a /healthz healthcheck, live on Railway behind api.salvo.edycu.dev.',
    span: 'lg:col-span-6',
    tint: 'text-mint',
    tintBg: 'bg-mint/10 border-mint/30',
    wide: true,
  },
];

export function Features() {
  return (
    <section className="relative border-t border-line bg-night-1/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Badge>why it holds up</Badge>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Built narrow. <span className="text-gradient-brand">Built deep.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            One flow — brief to shipped top three — done devastatingly well, on real sponsor SDK
            code paths instead of decoration.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90} className={f.span}>
              <div
                className={`glass group h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong ${
                  f.wide ? 'flex flex-col items-start gap-5 sm:flex-row sm:items-center' : ''
                }`}
              >
                <div
                  className={`grid h-12 w-12 flex-none place-items-center rounded-xl border ${f.tintBg} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                >
                  <f.icon className={`h-5 w-5 ${f.tint}`} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={`font-display text-xl font-semibold text-ink ${f.wide ? '' : 'mt-5'}`}>
                    {f.title}
                  </h3>
                  <p className="mt-2.5 max-w-3xl text-[14.5px] leading-relaxed text-ink-muted">
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
