/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        funnel: ["Funnel Display", "sans-serif"],
      },
    },
  },
  plugins: [],
};
