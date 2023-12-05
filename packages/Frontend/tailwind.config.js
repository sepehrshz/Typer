/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts,vue}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "electric-violet": {
          50: "#fdf2ff",
          100: "#f9e3ff",
          200: "#f4c6ff",
          300: "#f099ff",
          400: "#e85dff",
          500: "#d721ff",
          600: "#b600ef",
          700: "#a200cf",
          800: "#8600a9",
          900: "#710689",
          950: "#4c005e",
        },
      },
    },
  },
  plugins: [
    
  ],
};
