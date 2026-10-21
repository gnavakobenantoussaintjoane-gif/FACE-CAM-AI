/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05070f",
        surface: "#0b0e1a",
        card: "#111426",
        border: "#1e2240",
        primary: {
          50: "#eef2ff",
          500: "#6366f1",
          600: "#5b5bf6",
          700: "#4f46e5",
        },
        accent: {
          violet: "#7c3aed",
          blue: "#2563eb",
          cyan: "#06b6d4"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(99,102,241,0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(124,58,237,0.35)" }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      }
    }
  },
  plugins: []
}
