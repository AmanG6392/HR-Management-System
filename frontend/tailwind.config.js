/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
      },
      colors: {
        ink: {
          50: "#f4f6fb",
          100: "#e6eaf4",
          200: "#c4cce3",
          300: "#9aa6c8",
          400: "#69769f",
          500: "#475374",
          600: "#333d59",
          700: "#262e45",
          800: "#1a2036",
          900: "#101423",
          950: "#0b0e1a",
        },
        brand: {
          50: "#eef1ff",
          100: "#dce2ff",
          200: "#b9c5ff",
          300: "#8fa0ff",
          400: "#6478f5",
          500: "#4357e0",
          600: "#3340b8",
          700: "#283190",
          800: "#1f2670",
          900: "#1a2058",
        },
        gold: {
          50: "#fdf8ec",
          100: "#faedc9",
          200: "#f3d98c",
          300: "#eac158",
          400: "#dfa936",
          500: "#c8932b",
          600: "#a87421",
          700: "#86591d",
          800: "#6e481e",
          900: "#5c3d1d",
        },
      },
      fontFamily: {
        display: ["'Lexend'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 20, 35, 0.04), 0 8px 24px -8px rgba(16, 20, 35, 0.10)",
        card: "0 1px 1px rgba(16,20,35,0.03), 0 4px 14px -4px rgba(16,20,35,0.08)",
      },
      backgroundImage: {
        "seal-ring": "repeating-conic-gradient(from 0deg, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: 0, transform: "translateY(6px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: 0, transform: "scale(.96)" }, "100%": { opacity: 1, transform: "scale(1)" } },
      },
      animation: {
        "fade-in": "fade-in .35s ease-out both",
        "scale-in": "scale-in .2s ease-out both",
      },
    },
  },
  plugins: [],
};
