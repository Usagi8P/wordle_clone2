/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scaleOut: {
          '0%':{ transform: 'scaleY(1)'},
          '100%':{ transform: 'scaleY(0)'},
        },
        scaleIn: {
          '0%':{ transform: 'scaleY(0)'},
          '100%':{ transform: 'scaleY(1)'},
        },
      },
      animation: {
        scaleOut: 'scaleOut 0.5s linear forwards',
        scaleIn: 'scaleIn 0.5s linear forwards',
      },
    },
  },
  plugins: [],
}

