/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        "cream-dark": "#F5EBDD",
        brown: {
          DEFAULT: "#6F4E37",
          light: "#8A6952",
          dark: "#4E3524",
        },
        accent: {
          DEFAULT: "#E67E22",
          light: "#F0A75A",
          dark: "#C4670F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(111, 78, 55, 0.25)",
        card: "0 4px 14px -4px rgba(111, 78, 55, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
