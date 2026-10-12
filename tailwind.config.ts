import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#f5f5f5",
        ig: {
          bg: "#000000",
          surface: "#121212",
          elevated: "#1c1c1c",
          border: "#262626",
          muted: "#737373",
          hover: "#181818",
          primary: "#0095f6",
          primaryHover: "#1877f2",
          red: "#ed4956",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      aspectRatio: {
        "4/5": "4 / 5",
        "9/16": "9 / 16",
      },
    },
  },
  plugins: [],
};
export default config;
