import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./apps/mobile_3/app/**/*.{js,jsx,ts,tsx}",
		"./apps/mobile_3/src/**/*.{js,jsx,ts,tsx}",

		// add other apps if needed
		"./apps/mobile/app/**/*.{js,jsx,ts,tsx}",
		"./apps/mobile/src/**/*.{js,jsx,ts,tsx}",
	],

	presets: [require("nativewind/preset")],

	darkMode: "class",

	theme: {
		extend: {
			colors: {
				background: "#ffffff",
				foreground: "#000000",

				card: "#f2f2f2",
				muted: "#666666",

				darkBackground: "#000000",
				darkCard: "#1a1a1a",
				darkMuted: "#999999",

				primary: "#00D9FF",
				secondary: "#00FF88",
				danger: "#FF006E",
			},
		},
	},

	plugins: [],
};

export default config;
