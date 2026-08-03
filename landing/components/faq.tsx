import type * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Reveal } from '@/components/reveal';
import { LINKS } from '@/lib/links';

/** Element 9 — the questions a judge (or a skeptic) actually asks. */

const FAQS: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: 'Is the engagement score real click data?',
    a: (
      <>
        No — and Salvo says so everywhere. The engagement index is a deterministic pseudo-signal
        seeded from the content hash so the ranking is reproducible offline. Every reason string
        carries the label &ldquo;seeded from content hash, not real click data&rdquo;. No
        fabricated metrics are presented as real.
      </>
    ),
  },
  {
    q: 'Do I need Backblaze credentials to try it?',
    a: (
      <>
        No. <code className="font-mono text-violet-strong">OFFLINE=1</code> is the default: a mock
        image provider emits real PNG bytes and an on-disk backend implements Genblaze&rsquo;s
        documented StorageBackend interface, so the full pipeline runs with zero credentials and
        zero network. Setting <code className="font-mono text-violet-strong">B2_KEY_ID</code> /{' '}
        <code className="font-mono text-violet-strong">B2_APP_KEY</code> switches storage to a real
        Backblaze B2 bucket via Genblaze&rsquo;s S3StorageBackend — auto-detected at startup.
      </>
    ),
  },
  {
    q: 'Is the batch a real pipeline, or a for-loop with extra steps?',
    a: (
      <>
        One real Genblaze <code className="font-mono text-violet-strong">Pipeline</code> fans out
        all N variant steps in parallel via{' '}
        <code className="font-mono text-violet-strong">astream(max_concurrency=N)</code>, stores
        them through an ObjectStorageSink with hierarchical keys, and reads the provenance manifest
        back with <code className="font-mono text-violet-strong">verify=True</code>. The batch
        claim is backed by real SDK code paths.
      </>
    ),
  },
  {
    q: 'How is the ranking explainable?',
    a: (
      <>
        Three transparent signals with fixed weights — brief coverage (0.45), headline length
        (0.25), engagement index (0.30) — and every score ships with a plain-English breakdown of
        exactly how it was reached. It is also deterministic: same brief + variant, same score,
        same reasons, every run; ties break on sha256 so ordering never wobbles.
      </>
    ),
  },
  {
    q: 'Are the demo images real AI generations?',
    a: (
      <>
        In OFFLINE mode they are honest placeholders: deterministic PNG swatches from a
        dependency-free raw-PNG encoder (no Pillow, no ffmpeg). Real generation (GMI FLUX /
        DALL&middot;E) is a provider-key swap behind the same Pipeline surface — the seam already
        exists, and the console labels the placeholder variants as such.
      </>
    ),
  },
  {
    q: 'What does the API surface look like?',
    a: (
      <>
        Five endpoints: <code className="font-mono text-violet-strong">GET /healthz</code>{' '}
        (liveness + mode + genblaze version),{' '}
        <code className="font-mono text-violet-strong">POST /campaigns</code> (brief in → variants
        + ranking + top-3), <code className="font-mono text-violet-strong">GET /campaigns/{'{id}'}</code>,{' '}
        <code className="font-mono text-violet-strong">
          GET /campaigns/{'{id}'}/variants/{'{i}'}.png
        </code>
        , and <code className="font-mono text-violet-strong">GET /console</code> — the operator
        console.{' '}
        <a
          className="text-violet-strong underline-offset-4 hover:underline"
          href={LINKS.apiDocs}
          target="_blank"
          rel="noreferrer"
        >
          Interactive docs are live
        </a>
        .
      </>
    ),
  },
  {
    q: 'How do I run it locally?',
    a: (
      <>
        <code className="font-mono text-violet-strong">uv sync --extra dev</code>, then{' '}
        <code className="font-mono text-violet-strong">OFFLINE=1 .venv/bin/python -m pytest</code>{' '}
        (19 tests, all green), then{' '}
        <code className="font-mono text-violet-strong">
          OFFLINE=1 .venv/bin/python -m uvicorn app.main:app --port 8000
        </code>{' '}
        and open <code className="font-mono text-violet-strong">localhost:8000/console</code> —
        type a brief, hit Generate, watch the scored grid render with the top 3 highlighted.
      </>
    ),
  },
  {
    q: 'Where does it run in production?',
    a: (
      <>
        Dockerized and deployed on Railway with a{' '}
        <code className="font-mono text-violet-strong">/healthz</code> healthcheck, behind the
        custom domain{' '}
        <a
          className="text-violet-strong underline-offset-4 hover:underline"
          href={LINKS.api}
          target="_blank"
          rel="noreferrer"
        >
          api.salvo.edycu.dev
        </a>
        . MIT licensed, source on GitHub.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-line bg-night-1/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Badge>no hand-waving</Badge>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Asked by
                <br />
                <span className="text-gradient-brand">skeptics</span>
              </h2>
              <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-muted">
                The questions that decide whether a &ldquo;generate N variants&rdquo; tool is real.
                Salvo answers all of them in code.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="min-w-0">
            <Accordion defaultValue="0">
              {FAQS.map((item, i) => (
                <AccordionItem key={i} value={String(i)} question={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
