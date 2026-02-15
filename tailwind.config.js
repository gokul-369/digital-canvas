/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // light mode colors
        bgprimary: colors.neutral[950],
        bgSecondary: colors.neutral[900],
        bgTertiary: colors.neutral[800],
        textprimary: colors.white,
        textSecondary: colors.gray[400],

        //dark mode colors
        darkBgPrimary: colors.neutral[100],
        darkBgSecondary: colors.neutral[200],
        darkBgTertiary: colors.neutral[300],
        darkTextPrimary: colors.black,
        darkTextSecondary: colors.gray[600],
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
  },
  plugins: [],
};
