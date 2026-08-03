import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Ticker } from '@/components/ticker';
import { LiveDemo } from '@/components/live-demo';
import { HowItWorks } from '@/components/how-it-works';
import { Scoring } from '@/components/scoring';
import { Features } from '@/components/features';
import { Receipts } from '@/components/receipts';
import { FAQ } from '@/components/faq';
import { FinalCTA } from '@/components/final-cta';
import { Footer } from '@/components/footer';

/**
 * Salvo landing page — the 11 essential elements, in order:
 *  1. keyworded URL + metadata (layout.tsx)         2. logo header (Header)
 *  3. massive title + subtitle (Hero)               4. primary CTA (Hero)
 *  5. social proof — real numbers (Hero)            6. media — playable demo (LiveDemo)
 *  7. core benefits bento (Features)                8. receipts, not reviews (Receipts)
 *  9. FAQ accordion (FAQ)                          10. final CTA hero moment (FinalCTA)
 * 11. footer with contact + legal (Footer)
 */
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <LiveDemo />
        <HowItWorks />
        <Scoring />
        <Features />
        <Receipts />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
