import * as React from 'react';
import { cn } from '@/lib/utils';

/** ShadCN-style badge, customized: mono kicker pills with brand tints. */
type Variant = 'default' | 'accent' | 'success' | 'outline';

const variants: Record<Variant, string> = {
  default: 'border-violet/40 bg-violet/10 text-violet-strong',
  accent: 'border-flare/40 bg-flare/10 text-flare-strong',
  success: 'border-mint/40 bg-mint/10 text-mint',
  outline: 'border-line-strong bg-transparent text-ink-muted',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5',
        'font-mono text-[11px] font-medium uppercase tracking-kicker',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
