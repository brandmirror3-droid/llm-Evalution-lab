/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#090a0c",
          surface: "#0f1216",
          card: "#15191f",
          cardHover: "#1b2028",
          border: "#242a35",
          borderSubtle: "#1a1f27",
          text: {
            primary: "#f4f5f7",
            secondary: "#9ba1ad",
            muted: "#646b79",
            faint: "#454b57",
          },
          accent: {
            lime: "#a3e635",
            limeMuted: "#4d7c0f",
            emerald: "#10b981",
            amber: "#f59e0b",
            rose: "#f43f5e",
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
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        cardHover: "0 10px 30px -5px rgba(0, 0, 0, 0.7)",
        glowLime: "0 0 20px -5px rgba(163, 230, 53, 0.18)",
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
          "50%": { opacity: "0.55" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
}
