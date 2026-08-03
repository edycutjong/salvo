import type { Config } from 'tailwindcss';

/**
 * Salvo landing — design system mapped from the brand tokens
 * (build/docs/assets/_tokens.css): Linear-minimal glass · dark · violet/magenta.
 * 60% background · 30% structure · 10% accent.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          0: '#08070F',
          1: '#0B0A12',
          2: '#110F1C',
        },
        panel: {
          DEFAULT: 'rgba(22, 19, 36, 0.72)',
          strong: 'rgba(28, 24, 46, 0.92)',
        },
        line: {
          DEFAULT: 'rgba(167, 158, 203, 0.14)',
          strong: 'rgba(167, 158, 203, 0.28)',
        },
        ink: {
          DEFAULT: '#EDEBF6',
          muted: '#A29DB8',
          // Kept in sync with --ink-faint in globals.css (AA-contrast tuned).
          faint: '#87829C',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          strong: '#A78BFA',
          deep: '#6D28D9',
        },
        flare: {
          DEFAULT: '#EC4899',
          strong: '#F472B6',
        },
        mint: '#34D399',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.22em',
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.35)',
        'glow-flare': '0 0 40px rgba(236, 72, 153, 0.30)',
        'panel-lift': '0 24px 64px rgba(0, 0, 0, 0.55)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
