/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include all files that contain NativeWind / Tailwind classes
  content: [
    "./App.tsx",

    // Your main source folder
    "./src/**/*.{js,jsx,ts,tsx}",

    // Extra components folder (if you have one outside src)
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-secondary": "rgb(var(--card-secondary) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-tertiary": "rgb(var(--text-tertiary) / <alpha-value>)",

        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",

        trophy: "rgb(var(--trophy) / <alpha-value>)",
        "nature-green": "rgb(var(--nature-green) / <alpha-value>)",
        "sky-blue": "rgb(var(--sky-blue) / <alpha-value>)",
        "sunset-pink": "rgb(var(--sunset-pink) / <alpha-value>)",
        "mountain-purple": "rgb(var(--mountain-purple) / <alpha-value>)",

        border: "rgba(var(--border) / 0.05)",
        shadow: "rgba(var(--shadow) / 0.08)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        tertiary: "rgb(var(--tertiary) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        outline: "rgba(var(--outline) / 0.05)",
      },
    },
  },

  plugins: [],
};
