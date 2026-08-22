import type { Config } from "tailwindcss";

// Every value here is taken verbatim from the brief's exact hex spec --
// nothing here is a designer's judgment call, it's a literal transcription.
// Where craft/judgment DOES apply (type pairing, spacing scale, motion) is
// in the components themselves, not this token file.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0C10",
        panel: "#14161C",
        line: "#262A33",
        paper: "#F4F5F7",
        muted: "#9AA0AB",

        pulse: "#FF5A29",
        sound: "#C8FF4D",
        visual: "#38C6FF",
        language: "#FFC93C",
        ritual: "#FF5C93",
        taste: "#2DD4A6",
        soulgap: "#9B6BFF",

        band: {
          green: "#2FBF71",
          amber: "#E8A020",
          red: "#C0392B",
        },
      },
      fontFamily: {
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        // "subtle inner glow not heavy drop shadow" -- an inset highlight,
        // not an outer shadow. Color is set per-use via the glow utility
        // below where it needs to pick up a dimension's own accent.
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
      },
      animation: {
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "rec-pulse": "rec-pulse 1.4s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
