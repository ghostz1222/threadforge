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
          600: "#343C48",
        },
        ember: {
          600: "#C62D39",
          500: "#E63946",
          400: "#FF4D5B",
          300: "#FF6B6B",
          200: "#FF9999",
        },
        brass: "#F4A261",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 14px 40px rgba(0,0,0,.35)",
        "glow-ember": "0 0 20px rgba(230, 57, 70, 0.15), 0 0 60px rgba(230, 57, 70, 0.05)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: 0, transform: "translateY(16px) scale(0.97)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(230, 57, 70, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(230, 57, 70, 0.4)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "rise-in": "rise-in .45s cubic-bezier(.16,1,.3,1) forwards",
        "fade-in": "fade-in .3s ease forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
