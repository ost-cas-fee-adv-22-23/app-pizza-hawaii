/** @type {import('tailwindcss').Config} */
module.exports = {
  //presets: [require("@smartive-education/pizza-hawaii/tailwind")],
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
