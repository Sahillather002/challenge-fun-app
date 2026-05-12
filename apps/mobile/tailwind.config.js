/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        card: "#f2f2f2",
        text: "#000000",
        muted: "#666666",

        darkBackground: "#000000",
        darkCard: "#1a1a1a",
        darkText: "#ffffff",
        darkMuted: "#999999",

        primary: "#00D9FF",
        secondary: "#00FF88",
        danger: "#FF006E",
      },
    },
  },

  plugins: [],
};
