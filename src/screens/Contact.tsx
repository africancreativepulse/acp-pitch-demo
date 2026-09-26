import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { CheckCircle2 } from "lucide-react";

const SUBJECT_OPTIONS = [
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "agency_partnership", label: "Agency Partnership" },
  { value: "contributor_question", label: "Contributor Question" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
] as const;

const inputClass =
  "w-full rounded border border-line bg-panel px-3 py-2.5 text-sm text-paper placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-pulse";
const labelClass = "text-xs uppercase tracking-[0.1em] text-muted";

/**
 * Real-app parity: the live site added a real, permanent Contact Us page
 * (same commit that added About Us + the Navbar alignment fix -- see
 * About.tsx's own header comment). Confirmed missing entirely during a
 * full nav/cosmetic audit.
 *
 * Structure/layout is a straight port of the real pages/Contact.tsx (same
 * field set, same labels, same success-state swap) -- but the submission
 * itself is a demo-appropriate substitute, not a straight copy: the real
 * page calls a live Supabase edge function (contact-us) that writes to a
 * real contact_messages table. This demo has no backend at all, so
 * submitting here just simulates the round trip (a short delay, then the
 * same success state) rather than pretending to call a function that
 * doesn't exist -- an honest mock, same spirit as this demo's other
 * no-backend simulations elsewhere (e.g. Onboarding's privacyConsent).
 *
 * Shell: the real page uses MinimalHeader (a reduced, nav-link-free
 * header) -- but this demo's own Navbar is used on every single screen by
 * deliberate, confirmed design (see Navbar.tsx's own header comment,
 * "Change 2"), not just marketing pages. Following that existing
 * precedent here rather than introducing a second, page-specific header
 * component just for this one screen.
 */
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject || !message.trim()) return;

    setLoading(true);
    // No backend to call -- see this file's own header comment. The delay
    // is purely cosmetic, so the loading state (matching the real page's
    // own "Sending…" button copy) is actually visible rather than an
    // instant no-op swap.
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-pulse" />
              <h1 className="mb-4 font-display text-3xl font-bold text-paper">Message sent!</h1>
              <p className="mb-8 text-lg text-muted">
                Thanks for reaching out — we&rsquo;ll get back to you at {email || "your email"} as soon as we can.
              </p>
              <Button href="/">Return Home</Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-10 bg-pulse" />
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-pulse">
                    Get In Touch
                  </span>
                </div>
                <h1 className="mb-3 font-display text-3xl font-black tracking-tight text-paper sm:text-4xl">
                  Contact Us
                </h1>
                <p className="leading-relaxed text-muted">
                  Questions, partnership ideas, press inquiries — tell us what&rsquo;s on your mind and we&rsquo;ll
                  respond directly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="contact-name">Name *</label>
                  <input
                    id="contact-name"
                    required
                    maxLength={200}
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass} htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={255}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass} htmlFor="contact-subject">Subject *</label>
                  <select
                    id="contact-subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled>Choose a reason</option>
                    {SUBJECT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass} htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    maxLength={5000}
                    rows={5}
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full justify-center">
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
