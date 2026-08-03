import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';

/**
 * Salvo landing — design system
 * Aesthetic: "mission-control creative foundry" — Linear-minimal glass, dark,
 * violet/magenta (the product's own brand tokens), tracer-fire motion, and the
 * signature move: the pick gets ringed in magenta.
 * Type: Space Grotesk (display) · Manrope (body) · JetBrains Mono (data).
 */

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://edycutjong.github.io/salvo/'),
  title: 'Salvo — Scored Ad Variants from One Brief | Batch Creative Factory on Genblaze + Backblaze B2',
  description:
    'Brief in → N scored ad variants out — the best three ship. Salvo is a batch creative factory on Genblaze + Backblaze B2: real pipeline fan-out, verified provenance, explainable deterministic ad ranking. Zero credentials to demo.',
  keywords: [
    'ad variants',
    'creative brief',
    'batch generation',
    'ad ranking',
    'explainable scoring',
    'Genblaze',
    'Backblaze B2',
    'generative media',
    'creative factory',
    'provenance manifest',
  ],
  openGraph: {
    title: 'Salvo — one ad is a guess, a salvo is a decision',
    description:
      'Brief in → N scored ad variants out — best three ship. Batch creative factory on Genblaze + Backblaze B2 with explainable, reproducible ranking.',
    type: 'website',
    images: ['icon-512.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Salvo — one ad is a guess, a salvo is a decision',
    description:
      'Brief in → N scored ad variants out — best three ship. Explainable, reproducible ad ranking on Genblaze + Backblaze B2.',
    images: ['icon-512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">
        <noscript>
          {/* Without JS, scroll-reveals must not hide content. */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
