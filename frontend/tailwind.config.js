/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F1B2D',
          light: '#1A2B3D',
        },
        accent: {
          DEFAULT: '#F4A535',
          light: '#FFB84D',
        },
      },
    },
  },
  plugins: [],
}
