/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.pug', './public/js/**/*.js'], // Adjust the paths to your files

  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--primary))',
        secondary: 'rgba(var(--secondary)) ',
        'primary-text-color':
          'rgba(var(--primary-text-color)  /  var(--tw-divide-opacity))',
        'secondary-text-color': 'rgba(var(--secondary-text-color)) ',
        'third-text-color': 'rgba(var(--third-text-color))',
        'hover-btn-color': 'rgba(var(--hover-btn-color))',
        'star-color': 'rgba(var(--star-color) /  var(--tw-divide-opacity))',
        'main-blue-text-color': 'rgba(var(--main-blue-text-color))',
      },
      backgroundColor: {
        background: 'rgba(var(--background))',
        'hover-soft-bg-text-color': 'rgba(var(--hover-soft-bg-text-color))',
      },
      divideColor: {
        'third-text-color-gray':
          'rgba(var(--third-text-color-gray) /  var(--tw-divide-opacity))', // Ensures opacity is applied
      },
    },
  },
  plugins: [],
};
