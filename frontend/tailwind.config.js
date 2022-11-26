/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.tsx',
    './index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'ng-check': '#48C774',
        'ng-green-main': '#01CA30',
        'ng-green-hover': '#3FD261',
        'ng-purple-main': '#7D2CFF',
        'ng-purple-hover': '#AC78FF',
        'ng-gray-main': '#6F6E77',
        'ng-gray-light': '#C2C2C2',
        'ng-black-main': '#181818',
        'ng-black-medium': '#383838',
      },
      gridTemplateColumns: {
        filter: '1fr 2fr 1fr',
      }
    },
  },
  plugins: [],
}
