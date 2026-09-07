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
        primary: {
          light: "#FFF1F2",     // Rose 50 subtle surface
          border: "#FECDD3",    // Rose 200 chip border
          DEFAULT: "#E11D48",   // Rose 600 soft crimson
          hover: "#BE123C",     // Rose 700 hover
          vibrant: "#F43F5E",   // Rose 500 gentle siri red
        },
        // Alias gold ke palet merah terang lembut untuk konsistensi brand KKS Siri' Na Pacce
        gold: {
          light: "#FFF1F2",
          DEFAULT: "#E11D48",
          hover: "#BE123C",
          dark: "#BE123C",
        },
        sky: {
          light: "#E0F2FE",
          DEFAULT: "#38BDF8",
          dark: "#0284C7",
        },
        siri: {
          DEFAULT: "#E11D48",
          dark: "#BE123C",
          light: "#FFF1F2",
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
