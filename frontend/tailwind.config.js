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
          canvas: "#111315",          // Application background
          workspace: "#17191B",       // Workspace background
          surface: "#1C1F22",         // Panel background
          surfaceElevated: "#232629", // Elevated panel
          plot: "#101214",            // Plot background
          border: "#35393D",          // Subtle technical border
          borderSubtle: "#2A2D31",
          borderStrong: "#454A50",
          text: {
            primary: "#D9DEE2",       // Primary text
            secondary: "#929BA3",     // Secondary text
            muted: "#687179",         // Muted text
            faint: "#4D545B",
          },
          accent: {
            amber: "#f59e0b",         // Experiment activity / selected instrument
            amberSubtle: "rgba(245, 158, 11, 0.12)",
            cyan: "#06b6d4",          // Model / inference trace
            cyanSubtle: "rgba(6, 182, 212, 0.12)",
            green: "#10b981",         // Verified / healthy / successful
            greenSubtle: "rgba(16, 185, 129, 0.12)",
            red: "#ef4444",           // Failure / error / risk
            redSubtle: "rgba(239, 68, 68, 0.12)",
            violet: "#8b5cf6",        // Evaluator / statistical analysis
            violetSubtle: "rgba(139, 92, 246, 0.12)",
            yellow: "#eab308",        // Warning / uncertainty
            yellowSubtle: "rgba(234, 179, 8, 0.12)",
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
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.35)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
        plot: "inset 0 0 12px rgba(0, 0, 0, 0.6)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
        linearEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
}