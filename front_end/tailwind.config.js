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
      textColor:{
        'off-white': '#B0B0B0',
      },
      backgroundColor:{
        'card':'  rgb(16,20,24)',
        'page':' rgb(11,13,16)',
        '1' : "#F8F9FA",
        '2' : "#E9ECEF",
        '3' : "#DEE2E6",
        '4' : "#CED4DA",
        '5' : "#ADB5BD",
        '6' : "#6C757D",
        '7' : "#495057",
        '8' : "#343A40",
        '9' : "#212529",
        'blue': "#00A3E0",
        'red': "#EF3340",
        'slate-gray': "#41748D",
        'slate-gray-hover': '#2E5A6E',
      }
    },
  },
  plugins: [],
}

