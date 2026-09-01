import { useState } from "react";
import { Globe } from "lucide-react";
import { useDemoState } from "@/state/DemoState";

/**
 * Real-app parity: ported from the real Navbar's own LanguageSwitcher.tsx
 * -- same trigger (globe icon + flag + uppercase code), same popover-of-
 * language-buttons shape, same full 16-language list (source: i18n/
 * translations.ts's own `languages` export, copied verbatim -- codes,
 * names, and flags, including Arabic even though the real app's own Stage
 * 1/3 rollout hasn't translated any Arabic strings yet either).
 *
 * Self-toggled open/close div instead of the real component's Radix
 * Popover -- matches this demo's own established pattern (Navbar.tsx's
 * Sign In dropdown uses the identical mechanic; no Popover primitive
 * exists anywhere else in this codebase, so introducing one for a single
 * component would be new dependency surface for no real gain).
 *
 * The one genuine, disclosed gap: this demo has zero i18n system anywhere
 * (confirmed -- every string in every screen is hardcoded English). So
 * selecting a language here is real, working UI -- it opens, lists all 16
 * real languages, updates the trigger, persists across navigation via
 * DemoState (see useDemoState's own uiLanguage comment) -- but page
 * content doesn't actually re-render in that language, because there's no
 * translation data behind it to render. Flagged honestly with a small note
 * in the panel itself rather than silently pretending to translate,
 * matching this codebase's own established honesty pattern for
 * illustrative-only UI (TranslationQA.tsx's "this demo is English-only",
 * Splash's "Illustrative sample" captions).
 */
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", name: "Yorùbá", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "am", name: "አማርኛ", flag: "🇪🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zu", name: "isiZulu", flag: "🇿🇦" },
  { code: "xh", name: "isiXhosa", flag: "🇿🇦" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "st", name: "Sesotho", flag: "🇿🇦" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "wo", name: "Wolof", flag: "🇸🇳" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "tw", name: "Twi", flag: "🇬🇭" },
  { code: "ar", name: "العربية", flag: "🇪🇬" },
] as const;

export function LanguageSwitcher() {
  const { uiLanguage, setUiLanguage } = useDemoState();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === uiLanguage) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded px-2 py-1 text-muted transition-colors hover:text-paper"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden text-xs tracking-[0.1em] uppercase sm:inline">
          {current.flag} {current.code.toUpperCase()}
        </span>
      </button>
      {open && (
        <div className="absolute end-0 top-[calc(100%+8px)] z-10 w-56 rounded border border-line bg-ink p-2 shadow-xl">
          <div className="grid gap-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setUiLanguage(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                  uiLanguage === l.code ? "bg-pulse text-ink" : "text-paper hover:bg-panel"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 border-t border-line px-3 pt-2 text-[11px] leading-relaxed text-muted">
            Illustrative — this demo is English-only, no translated copy behind this selector yet.
          </div>
        </div>
      )}
    </div>
  );
}
