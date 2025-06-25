/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#BEFA4F',
          teal: '#5AA7B9',
          pink: '#E83399',
          purple: '#513A6B',
        },
        primary: {
          50: '#f3f1f5',
          100: '#e7e3eb',
          200: '#d0c8d8',
          300: '#b8adc4',
          400: '#9f92b1',
          500: '#87779d',
          600: '#6c5d7e',
          700: '#513A6B',
          800: '#3d2c50',
          900: '#291d35',
        }
      }
    },
  },
  plugins: [],
} 