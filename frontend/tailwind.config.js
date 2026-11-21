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
      },
    },
  },
  plugins: [],
}
