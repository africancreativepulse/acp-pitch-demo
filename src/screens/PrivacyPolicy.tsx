import { Link } from "react-router-dom";
import { DemoHeader } from "@/components/DemoHeader";

/**
 * Real-app sync: the live platform just shipped a Privacy Policy consent
 * checkbox at signup (both Agency and Contributor's final onboarding step),
 * linking to a real placeholder page at this same route -- honest "Coming
 * Soon" copy, not fabricated legal content, not a dead link. This demo has
 * no real backend to record consent against, so the checkbox here is purely
 * illustrative (see Onboarding.tsx's own privacyConsent state comment) --
 * but the page it links to is real, reachable, and says exactly what the
 * live one does.
 *
 * Opened in a new tab from Onboarding (target="_blank") rather than an
 * in-app <Link> navigation -- this demo's wizard state is local useState
 * with no persistence, so navigating away in the same tab would silently
 * lose whatever step the visitor was on.
 */
export function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <DemoHeader showWrapUp={false} />

      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
        <div className="mb-2 label-caps">Privacy Policy</div>
        <h1 className="mb-5 font-display text-3xl font-bold text-paper">Coming Soon</h1>
        <p className="mb-8 text-[15px] leading-relaxed text-muted">
          We&rsquo;re finalizing our Privacy Policy. This page will hold the real, complete text
          once it&rsquo;s ready — nothing here yet is legal content.
        </p>
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] text-paper underline decoration-line underline-offset-4 transition-colors hover:text-pulse hover:decoration-pulse"
        >
          Return to Home
        </Link>
      </main>
    </div>
  );
}
