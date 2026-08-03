'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { CURL_SNIPPET } from '@/lib/links';

/** Copyable curl block for the final CTA — zero-friction path to the real API. */
export function CopyCommand() {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CURL_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (permissions / http) — leave the text selectable.
    }
  };

  return (
    <div className="glass-strong relative w-full min-w-0 max-w-2xl overflow-hidden rounded-2xl text-left">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[10.5px] uppercase tracking-kicker text-ink-faint">
          or fire from your terminal — no signup, no keys
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-ink-muted transition-all duration-200 hover:border-line-strong hover:text-ink"
          aria-label="Copy curl command"
        >
          {copied ? <Check size={13} className="text-mint" /> : <Copy size={13} />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <div className="overflow-x-auto p-5">
        <pre className="whitespace-pre font-mono text-[12.5px] leading-relaxed text-ink-muted">
          <span className="select-none text-flare-strong">$ </span>
          {CURL_SNIPPET}
        </pre>
      </div>
    </div>
  );
}
