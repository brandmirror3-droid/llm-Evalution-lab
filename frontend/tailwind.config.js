/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          canvas: "#090d14",
          surface: "#0e141f",
          surfaceElevated: "#141c2b",
          surfaceHover: "#1b2538",
          surfaceActive: "#223048",
          card: "#0e141f",
          cardHover: "#141c2b",
          inset: "#06090e",
          border: "#1e293b",
          borderSubtle: "#141d2b",
          borderStrong: "#334155",
          text: {
            primary: "#f8fafc",
            secondary: "#cbd5e1",
            muted: "#94a3b8",
            faint: "#64748b",
          },
          accent: {
            primary: "#38bdf8",
            primaryHover: "#0ea5e9",
            primarySubtle: "rgba(56, 189, 248, 0.12)",
            emerald: "#10b981",
            emeraldSubtle: "rgba(16, 185, 129, 0.12)",
            amber: "#f59e0b",
            amberSubtle: "rgba(245, 158, 11, 0.12)",
            rose: "#f43f5e",
            roseSubtle: "rgba(244, 63, 94, 0.12)",
            purple: "#a855f7",
            purpleSubtle: "rgba(168, 85, 247, 0.12)",
            slate: "#94a3b8",
            slateSubtle: "rgba(148, 163, 184, 0.1)",
          },
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        cardHover: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
        inset: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
        linearEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        pulseSubtle: "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        breathe: "breathe 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
}
