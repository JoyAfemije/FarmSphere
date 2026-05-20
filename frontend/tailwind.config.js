/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Agrotech brand colors — agricultural green palette
        primary: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",  // Brand primary
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        earth: {
          50:  "#fdfaf4",
          100: "#faf1d9",
          200: "#f3e0ae",
          300: "#e9c97c",
          400: "#d9a94d",
          500: "#c98e31",
          600: "#a76f25",  // Earthy brown accent
          700: "#865420",
          800: "#6f4320",
          900: "#5c381c",
        },
        agro: {
          green:  "#16a34a",
          light:  "#22c55e",
          dark:   "#14532d",
          yellow: "#eab308",
          earth:  "#a76f25",
          bg:     "#f0fdf4",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:    "0 2px 16px 0 rgba(22, 163, 74, 0.08)",
        "card-hover": "0 8px 32px 0 rgba(22, 163, 74, 0.18)",
        green:   "0 4px 24px 0 rgba(22, 163, 74, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "hero-pattern":    "url('/hero-bg.webp')",
        "leaf-pattern":    "radial-gradient(circle at 20% 80%, rgba(22,163,74,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.1) 0%, transparent 50%)",
        "green-gradient":  "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      },
    },
  },
  plugins: [],
};
