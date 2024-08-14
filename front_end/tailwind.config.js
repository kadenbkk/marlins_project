/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      width: {
        'custom-xl': '640px', // Example custom width
      },
      height: {
        'custom-xl': '640px', // Example custom width
        '70': '17rem',
      },
    },
  },
  plugins: [],
}

