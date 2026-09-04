/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D97706",
          dark: "#B45309",
        },
        sky: {
          light: "#E0F2FE",
          DEFAULT: "#38BDF8",
          dark: "#0284C7",
        },
        siri: {
          DEFAULT: "#DC2626",
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
        },
        slate: {
          200: "#E2E8F0",
          600: "#475569",
          900: "#0F172A",
        },
      },
    },
  },
  plugins: [],
}
