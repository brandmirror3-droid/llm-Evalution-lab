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
          canvas: "#f8f9fa",
          surface: "#ffffff",
          surfaceHover: "#f8fafc",
          surfaceActive: "#f1f5f9",
          card: "#ffffff",
          cardHover: "#fbfcfd",
          inset: "#f1f5f9",
          border: "#e2e8f0",
          borderSubtle: "#f1f5f9",
          borderStrong: "#cbd5e1",
          text: {
            primary: "#0f172a",
            secondary: "#334155",
            muted: "#64748b",
            faint: "#94a3b8",
          },
          accent: {
            primary: "#0284c7",
            primaryHover: "#0369a1",
            primarySubtle: "#f0f9ff",
            emerald: "#059669",
            emeraldSubtle: "#ecfdf5",
            amber: "#d97706",
            amberSubtle: "#fffbeb",
            rose: "#e11d48",
            roseSubtle: "#fff1f2",
            slate: "#475569",
            slateSubtle: "#f8fafc",
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
