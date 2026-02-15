/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C1319',
        secondary: '#1a2332',
        accent: '#00C087',
        danger: '#F6465D',
      },
    },
  },
  plugins: [],
}
