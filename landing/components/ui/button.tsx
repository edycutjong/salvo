import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * ShadCN-style button, hand-authored and customized for the Salvo brand:
 * pill silhouette, violet→magenta gradient primary, glass ghost variant.
 */
type Variant = 'primary' | 'ghost' | 'outline' | 'link';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-violet-deep via-violet to-flare text-white font-semibold ' +
    'shadow-[0_8px_28px_rgba(139,92,246,0.35)] hover:shadow-[0_10px_40px_rgba(236,72,153,0.4)] ' +
    'hover:scale-[1.03] active:scale-[0.98]',
  ghost:
    'glass text-ink hover:border-line-strong hover:bg-white/[0.05] hover:scale-[1.02] active:scale-[0.98]',
  outline:
    'border border-line-strong text-ink hover:border-flare/60 hover:text-flare-strong hover:scale-[1.02] active:scale-[0.98]',
  link: 'text-violet-strong underline-offset-4 hover:underline hover:text-flare-strong',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-full',
  md: 'h-11 px-6 text-sm rounded-full',
  lg: 'h-12 px-8 text-base rounded-full',
  xl: 'px-10 py-5 text-lg rounded-full',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-body ' +
  'transition-all duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50 ' +
  'select-none cursor-pointer';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

/** Anchor styled identically to Button — for external CTAs. */
export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <a
      ref={ref}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  ),
);
ButtonLink.displayName = 'ButtonLink';
