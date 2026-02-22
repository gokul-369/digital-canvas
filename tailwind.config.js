/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // light mode colors
        bgPrimaryAccent: colors.indigo[500],
        bgSecondaryAccent: colors.indigo[400],
        bgprimary: colors.neutral[950],
        bgSecondary: colors.neutral[900],
        bgTertiary: colors.neutral[800],
        textprimary: colors.white,
        textSecondary: colors.gray[400],
        textMainAccent1: colors.indigo[500],
        textMainAccent2: colors.blue[500],
        textMainAccent3: colors.amber[500],

        //dark mode colors
        darkBgPrimary: "#ffffff",
        darkBgPrimaryAccent: colors.indigo[500],
        darkBgSecondaryAccent: colors.indigo[400],
        darkBackgroundSecondary: colors.neutral[900],
        darkBgSecondary: colors.neutral[200],
        darkBgTertiary: colors.neutral[300],
        darkTextPrimary: colors.black,
        darkTextSecondary: colors.gray[600],
        textMainAccent1: colors.indigo[500],
        textMainAccent2: colors.blue[500],
        textMainAccent3: colors.amber[500],
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
  },
  plugins: [],
};
