/**
 * In-browser port of Salvo's ranking engine (salvo/ranking.py) plus the
 * deterministic headline templates and swatch palette from salvo/pipeline.py.
 *
 * Same three signals, same weights, same reason-string formats, same
 * tie-breaking. The one difference is honest and labeled: the backend seeds
 * the engagement index from each variant PNG's sha256; this demo seeds it from
 * a deterministic content descriptor (index + accent + headline) because the
 * PNG bytes live on the server. Everything is still fully reproducible: the
 * same brief always produces the same board.
 */

// ---- weights & constants (verbatim from salvo/ranking.py) ------------------
export const W_COVERAGE = 0.45;
export const W_LENGTH = 0.25;
export const W_ENGAGEMENT = 0.3;

const LEN_LOW = 22;
const LEN_HIGH = 42;
const LEN_FALLOFF = 30.0;
const COVERAGE_CAP = 6;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'your',
  'you', 'our', 'that', 'this', 'is', 'are', 'be', 'it', 'at', 'by', 'as', 'from',
  'into', 'who', 'new', 'get', 'meet', 'make', 'made', 'built', 'build',
]);

// ---- deterministic ad-copy templates (verbatim from salvo/pipeline.py) -----
const TEMPLATES = [
  '{A}, reimagined for {b}',
  'The {a} built for {b}',
  '{A}: {b} without compromise',
  'Finally, {a} that fits your {b}',
  'Your {b}, upgraded with {a}',
  'Less {b}, more {a}',
  '{A} for every kind of {b}',
  'Say hello to smarter {a}',
  '{A} that puts {b} first',
  'Where {a} meets {b}',
];

// Accent swatch palette — rotated per variant, exactly like the OFFLINE PNGs.
export const ACCENTS: ReadonlyArray<readonly [number, number, number]> = [
  [139, 92, 246],
  [236, 72, 153],
  [52, 211, 153],
  [167, 139, 250],
  [244, 114, 182],
  [96, 165, 250],
  [129, 140, 248],
  [251, 146, 60],
];

export const UNIT_COST_USD = 0.002; // per variant; mirrors MockAdProvider
export const MAX_VARIANTS = 12;

export interface DemoVariant {
  index: number;
  headline: string;
  accent: readonly [number, number, number];
  sha256: string;
  score: number;
  reasons: string[];
  rank: number;
}

export interface DemoResult {
  variants: DemoVariant[]; // ranked best-first
  top3: DemoVariant[];
  manifestHash: string;
  costUsd: number;
}

// ---- keyword extraction (port of ranking.keywords) --------------------------
export function keywords(text: string): string[] {
  const seen: string[] = [];
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const tok of tokens) {
    if (tok.length >= 3 && !STOPWORDS.has(tok) && !seen.includes(tok)) {
      seen.push(tok);
    }
  }
  return seen;
}

function headlineFor(briefKw: string[], i: number): string {
  const kw = briefKw.length > 0 ? briefKw : ['it'];
  const a = kw[i % kw.length];
  const b = kw[(i + 1) % kw.length];
  const A = a.charAt(0).toUpperCase() + a.slice(1);
  return TEMPLATES[i % TEMPLATES.length]
    .replace('{A}', A)
    .replace('{a}', a)
    .replace('{b}', b);
}

function lengthScore(length: number): number {
  if (length >= LEN_LOW && length <= LEN_HIGH) return 1.0;
  const dist = length < LEN_LOW ? LEN_LOW - length : length - LEN_HIGH;
  return Math.max(0, 1 - dist / LEN_FALLOFF);
}

// ---- hashing ----------------------------------------------------------------
async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // FNV-1a fallback for non-secure contexts — still deterministic.
  let h1 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h1 ^= input.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  return h1.toString(16).padStart(8, '0').repeat(8);
}

/** Deterministic 0..1 pseudo-engagement seeded from content (NOT real data). */
async function engagementIndex(headline: string, sha256: string): Promise<number> {
  const seed = await sha256Hex(`${headline}\x00${sha256}`);
  return parseInt(seed.slice(0, 8), 16) / 0xffffffff;
}

// ---- scoring (port of ranking.score_variant) ---------------------------------
export async function scoreVariant(
  brief: string,
  headline: string,
  sha256: string,
): Promise<{ score: number; reasons: string[] }> {
  const briefKw = keywords(brief);
  const headKw = new Set(keywords(headline));

  const core = briefKw.slice(0, COVERAGE_CAP);
  const matched = core.filter((k) => headKw.has(k));
  const cov = core.length === 0 ? 0 : matched.length / core.length;

  const length = headline.length;
  const lengthS = lengthScore(length);
  const eng = await engagementIndex(headline, sha256);

  const covPts = W_COVERAGE * cov * 100;
  const lenPts = W_LENGTH * lengthS * 100;
  const engPts = W_ENGAGEMENT * eng * 100;
  const score = Math.round((covPts + lenPts + engPts) * 10) / 10;

  const matchedTxt = matched.length > 0 ? matched.join(', ') : 'none';
  const lenTxt =
    length >= LEN_LOW && length <= LEN_HIGH
      ? `${length} chars, inside the ${LEN_LOW}-${LEN_HIGH} sweet spot`
      : `${length} chars, outside the ${LEN_LOW}-${LEN_HIGH} sweet spot`;

  const reasons = [
    `Brief coverage ${matched.length}/${core.length} keywords (${matchedTxt}) → +${covPts.toFixed(1)} pts`,
    `Headline length ${lenTxt} → +${lenPts.toFixed(1)} pts`,
    `Engagement index ${eng.toFixed(2)} (seeded from content hash, not real click data) → +${engPts.toFixed(1)} pts`,
  ];
  return { score, reasons };
}

// ---- the full salvo: fan out → hash → score → rank ---------------------------
export async function runSalvo(brief: string, n: number): Promise<DemoResult> {
  const count = Math.max(1, Math.min(Math.floor(n), MAX_VARIANTS));
  const briefKw = keywords(brief);

  const variants: DemoVariant[] = [];
  for (let i = 0; i < count; i++) {
    const headline = headlineFor(briefKw, i);
    const accent = ACCENTS[i % ACCENTS.length];
    const sha256 = await sha256Hex(`salvo-swatch:${i}:${accent.join('.')}:${headline}`);
    const { score, reasons } = await scoreVariant(brief, headline, sha256);
    variants.push({ index: i, headline, accent, sha256, score, reasons, rank: 0 });
  }

  // Ties break deterministically on sha256 so ordering never wobbles — same as
  // rank_variants() in salvo/ranking.py.
  const ranked = [...variants].sort(
    (a, b) => b.score - a.score || (a.sha256 < b.sha256 ? -1 : 1),
  );
  ranked.forEach((v, i) => {
    v.rank = i + 1;
  });

  const manifestHash = await sha256Hex(ranked.map((v) => v.sha256).join('\n'));

  return {
    variants: ranked,
    top3: ranked.slice(0, 3),
    manifestHash,
    costUsd: count * UNIT_COST_USD,
  };
}

export function accentCss(accent: readonly [number, number, number], alpha = 1): string {
  return `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${alpha})`;
}
