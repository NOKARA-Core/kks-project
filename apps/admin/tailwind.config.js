/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#FEF3C7",
          DEFAULT: "#D97706",
          dark: "#B45309",
        },
        sky: {
          light: "#E0F2FE",
          DEFAULT: "#38BDF8",
          dark: "#0284C7",
        },
        siri: {
          light: "#FEE2E2",
          DEFAULT: "#DC2626",
          dark: "#B91C1C",
        },
        berkah: {
          light: "#DCFCE7",
          DEFAULT: "#16A34A",
          dark: "#15803D",
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          card: "#FFFFFF",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        card: "0 4px 6px -1px rgb(0 0 0 / 0.04), 0 2px 4px -2px rgb(0 0 0 / 0.03)",
        elevated: "0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
