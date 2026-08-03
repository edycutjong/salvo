/** Mono ops-room ticker — the claims, all backed elsewhere on the page. */

const ITEMS = [
  'batch fan-out',
  'explainable ranking',
  'verified provenance',
  'top 3 ship',
  'offline-first',
  '19 tests green',
  'zero credentials',
  'deterministic scores',
];

export function Ticker() {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex flex-none items-center gap-8 pr-8"
    >
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex items-center gap-8 font-mono text-[11px] font-medium uppercase tracking-kicker text-ink-faint"
        >
          {item}
          <span className="h-1 w-1 rotate-45 bg-flare/60" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="group/ticker relative border-y border-line bg-night-1/60 py-4">
      <div className="ticker-mask overflow-hidden">
        <div className="animate-ticker flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
