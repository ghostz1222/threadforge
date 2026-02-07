/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        coal: {
          950: "#0D1013",
          900: "#13171C",
          800: "#1B2026",
          700: "#262C35",
        },
        ember: {
          500: "#E63946",
          400: "#FF4D5B",
          300: "#FF6B6B",
        },
        brass: "#F4A261",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 14px 40px rgba(0,0,0,.35)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in .4s ease forwards",
      },
    },
  },
  plugins: [],
};
