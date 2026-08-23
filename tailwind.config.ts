import type { Config } from "tailwindcss";

// Re-skin pass: color/type/motion tokens now mirror the REAL ACP app's
// design system (../acp-handoff/src/design-system/tokens.css +
// tailwind.config.ts) exactly, copied as one-time static values -- not a
// live reference back to that project. Every hex below is transcribed
// verbatim from tokens.css's `:root` block. Where the two files disagree
// (ink/panel/paper/muted/line all previously used demo-invented
// approximations), the real values win; the six CEI dimension colors were
// already an exact match before this pass and are unchanged.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        panel: "var(--panel)",
        line: "var(--line)",
        paper: "var(--paper)",
        muted: "var(--muted)",

        pulse: "var(--pulse)",
        sound: "var(--sound)",
        visual: "var(--visual)",
        language: "var(--language)",
        ritual: "var(--ritual)",
        taste: "var(--taste)",
        soulgap: "var(--soulgap)",

        // Risk-band colors (CDI/Decay green-amber-red) -- a demo-only
        // vocabulary with no real-app equivalent (see ScorePill.tsx's own
        // header comment), deliberately left untouched by this re-skin.
        band: {
          green: "#2FBF71",
          amber: "#E8A020",
          red: "#C0392B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.82)" },
        },
        "rec-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,90,41,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(255,90,41,0)" },
        },
        // Push-notification toast entrance (CampaignDetail's "Mark
        // Urgent" moment) -- demo-only, no real-app equivalent, same as
        // pulse-dot/rec-pulse above.
        "toast-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Below this line: the real design system's motion vocabulary
        // (var names `ds-*`), copied verbatim from ../acp-handoff's
        // tailwind.config.ts -- only the subset actually used by the
        // components this pass ports in (SignalRing, DepthGauge,
        // GlitchText, DotGrid). The rest of that file's ds-* set
        // (ds-ping, ds-net-*, ds-scan-down, ds-fade-*, ds-line-draw)
        // belongs to landing-page/dashboard chrome not being ported here,
        // so it's left out rather than copied unused. DataNodes and its
        // own animations were removed in the header/reference-correction
        // pass -- Splash's real hero background is DotGrid, not DataNodes
        // (that belongs to BrandsSplash/ContributorSplash, the wrong page
        // this demo's Splash was originally built from).
        "ds-sweep-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "ds-ripple-out": {
          "0%": { r: "6", opacity: "0.85", strokeWidth: "2.5" },
          "100%": { r: "158", opacity: "0", strokeWidth: "0.5" },
        },
        "ds-node-pulse": {
          "0%, 100%": { r: "5" },
          "50%": { r: "8.5" },
        },
        "ds-breathe": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "ds-glitch-flicker": {
          "0%, 91%, 100%": { textShadow: "none", transform: "translate(0)" },
          "92%": { textShadow: "-3px 0 var(--sound), 3px 0 var(--ritual)", transform: "translate(-2px,1px)" },
          "93%": { textShadow: "3px 0 var(--visual), -3px 0 var(--pulse)", transform: "translate(2px,-1px)" },
          "94%": { textShadow: "none", transform: "translate(0)" },
          "95%": { textShadow: "-2px 0 var(--soulgap), 2px 0 var(--language)", transform: "translate(-1px,0)" },
          "96%, 100%": { textShadow: "none", transform: "translate(0)" },
        },
        "ds-drift": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-24px,26px) scale(1.08)" },
        },
        // DotGrid's slow pan -- real value, copied verbatim from
        // ../acp-handoff's tailwind.config.ts (this is the one entry from
        // that file's own "left out, not ported" list the header comment
        // above used to name; now actually needed, since Splash's hero was
        // rebuilt to reference the real Index.tsx/Hero.tsx, which uses
        // DotGrid, not DataNodes).
        "ds-pan-grid": {
          from: { transform: "translate(0,0)" },
          to: { transform: "translate(46px,46px)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "rec-pulse": "rec-pulse 1.4s ease-out infinite",
        "toast-in": "toast-in 0.35s cubic-bezier(.16,.84,.44,1) forwards",
        "ds-sweep-rotate": "ds-sweep-rotate 2.2s linear infinite",
        "ds-ripple-out": "ds-ripple-out 1.9s cubic-bezier(.2,.7,.3,1) infinite",
        "ds-node-pulse": "ds-node-pulse 1.6s ease-in-out infinite",
        "ds-breathe": "ds-breathe 3.2s ease-in-out infinite",
        "ds-glitch-flicker": "ds-glitch-flicker 5.5s infinite",
        "ds-drift-1": "ds-drift 13s ease-in-out infinite",
        "ds-drift-2": "ds-drift 16s ease-in-out infinite -4s",
        "ds-pan-grid": "ds-pan-grid 34s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
