/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          700: "#6b4226",
          800: "#4e2d1a",
          600: "#7b4d2a"
        }
      }
    },
  },
  plugins: [],
}
