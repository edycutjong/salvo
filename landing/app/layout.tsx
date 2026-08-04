import type { Metadata, Viewport } from 'next';
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
  metadataBase: new URL('https://salvo.edycu.dev'),
  title: 'Salvo — Scored Ad Variants from One Brief',
  description:
    'Brief in → N scored ad variants out, best three ship. A batch creative factory on Genblaze + Backblaze B2 with verified provenance and explainable ranking.',
  applicationName: 'Salvo',
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
  authors: [{ name: 'Edy Cu' }],
  manifest: '/site.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://salvo.edycu.dev',
    siteName: 'Salvo',
    title: 'Salvo — one ad is a guess, a salvo is a decision',
    description:
      'Brief in → N scored ad variants out, best three ship. Explainable, reproducible ranking on Genblaze + Backblaze B2.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Salvo — scored ad variants from one brief' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salvo — one ad is a guess, a salvo is a decision',
    description:
      'Brief in → N scored ad variants out — best three ship. Explainable, reproducible ad ranking on Genblaze + Backblaze B2.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08070f',
  width: 'device-width',
  initialScale: 1,
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
