import type { Config } from "tailwindcss";

// Toutes les couleurs viennent de variables CSS (canaux RGB) définies dans globals.css.
// Changer de thème = changer les variables, aucun `dark:` nécessaire dans les composants.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        border: token("border"),
        "border-strong": token("border-strong"),
        fg: token("fg"),
        muted: token("muted"),
        accent: token("accent"),
        "accent-fg": token("accent-fg"),
        "accent-2": token("accent-2"),
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
      },
      borderColor: { DEFAULT: token("border") },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: { sm: "8px", md: "12px", lg: "16px", xl: "24px" },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.2), 0 12px 32px -16px rgb(0 0 0 / 0.45)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.4), 0 8px 32px -8px rgb(var(--accent) / 0.5)",
        "glow-lg": "0 0 0 1px rgb(var(--accent) / 0.5), 0 12px 48px -8px rgb(var(--accent) / 0.65)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        halo: {
          "0%, 100%": { opacity: "0.75", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.04)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "sheet-in": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "sheet-out": { from: { transform: "translateX(0)" }, to: { transform: "translateX(100%)" } },
        "modal-in": {
          from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.97)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "modal-out": {
          from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          to: { opacity: "0", transform: "translate(-50%, -48%) scale(0.97)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.18s ease-out",
        "fade-out": "fade-out 0.15s ease-in",
        "sheet-in": "sheet-in 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        "sheet-out": "sheet-out 0.2s ease-in",
        "modal-in": "modal-in 0.2s ease-out",
        "modal-out": "modal-out 0.15s ease-in",
        shimmer: "shimmer 2.2s linear infinite",
        halo: "halo 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
