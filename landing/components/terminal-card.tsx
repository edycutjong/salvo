'use client';

import * as React from 'react';

/**
 * Hero terminal: types the real `POST /campaigns` call from the README, then
 * prints a response in the API's actual shape (manifest_verified and all).
 * cost_usd = 6 × $0.002 — the real per-variant unit cost.
 */

const CMD_LINES = [
  'curl -X POST https://api.salvo.edycu.dev/campaigns \\',
  "  -H 'content-type: application/json' \\",
  '  -d \'{"brief":"eco water bottle for hikers","n":6}\'',
];

type Tok = { t: string; c?: string };
const RESPONSE: Tok[][] = [
  [{ t: '{' }],
  [{ t: '  "id": ' }, { t: '"9f3c2a71d0b4"', c: 'text-violet-strong' }, { t: ',' }],
  [{ t: '  "mode": ' }, { t: '"OFFLINE"', c: 'text-violet-strong' }, { t: ',' }],
  [{ t: '  "cost_usd": ' }, { t: '0.012', c: 'text-violet-strong' }, { t: ',' }],
  [{ t: '  "manifest_verified": ' }, { t: 'true', c: 'text-mint' }, { t: ',' }],
  [{ t: '  "top3": [' }],
  [
    { t: '    { "rank": ' },
    { t: '1', c: 'text-flare-strong' },
    { t: ', "headline": ' },
    { t: '"Eco, reimagined for water"', c: 'text-flare-strong' },
    { t: ' },' },
  ],
  [{ t: '    { "rank": ' }, { t: '2', c: 'text-ink' }, { t: ', … },' }],
  [{ t: '    { "rank": ' }, { t: '3', c: 'text-ink' }, { t: ', … }' }],
  [{ t: '  ],' }],
  [{ t: '  "variants": [ ' }, { t: '/* all 6, each with score + reasons */', c: 'text-ink-faint' }, { t: ' ]' }],
  [{ t: '}' }],
];

export function TerminalCard() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [typed, setTyped] = React.useState(0); // chars of command typed
  const [shownLines, setShownLines] = React.useState(0); // response lines shown
  const startedRef = React.useRef(false);

  const fullCmd = CMD_LINES.join('\n');

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let typeTimer: ReturnType<typeof setInterval> | undefined;
    let lineTimer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduced) {
        setTyped(fullCmd.length);
        setShownLines(RESPONSE.length);
        return;
      }
      let i = 0;
      typeTimer = setInterval(() => {
        i += 2;
        setTyped(Math.min(i, fullCmd.length));
        if (i >= fullCmd.length) {
          clearInterval(typeTimer);
          let line = 0;
          lineTimer = setInterval(() => {
            line += 1;
            setShownLines(Math.min(line, RESPONSE.length));
            if (line >= RESPONSE.length) clearInterval(lineTimer);
          }, 90);
        }
      }, 14);
    };

    const rect = el.getBoundingClientRect();
    if (
      typeof IntersectionObserver === 'undefined' ||
      (rect.top < window.innerHeight && rect.bottom > 0)
    ) {
      start();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (typeTimer) clearInterval(typeTimer);
      if (lineTimer) clearInterval(lineTimer);
    };
  }, [fullCmd]);

  const done = typed >= fullCmd.length;

  return (
    <div
      ref={ref}
      className="glass-strong relative overflow-hidden rounded-2xl shadow-panel-lift"
      aria-label="Example API call: POST /campaigns returns a ranked batch with a verified manifest"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3d3752]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3d3752]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3d3752]" />
        <span className="ml-3 font-mono text-[11px] uppercase tracking-kicker text-ink-faint">
          salvo — one API call, whole batch
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-kicker text-mint">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint" />
          live
        </span>
      </div>

      <div className="max-h-[420px] overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
        <pre className="whitespace-pre text-ink-muted">
          <span className="select-none text-flare-strong">$ </span>
          <span className="text-ink">{fullCmd.slice(0, typed)}</span>
          {!done && <span className="animate-caret inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-flare-strong" />}
        </pre>

        {done && (
          <div className="mt-3 border-t border-line pt-3">
            {RESPONSE.slice(0, shownLines).map((line, i) => (
              <pre key={i} className="whitespace-pre text-ink-muted">
                {line.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
              </pre>
            ))}
            {shownLines >= RESPONSE.length && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-mint">
                <span aria-hidden="true">✓</span> provenance manifest read back with verify=True
              </p>
            )}
          </div>
        )}
      </div>

      {/* Corner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/20 blur-3xl"
      />
    </div>
  );
}
