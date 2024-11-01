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
        'hover-background-color': 'rgba(var(--hover-background-color))',
        'hover-text-color': 'rgba(var(--hover-text-color))',
        'star-color': 'rgba(var(--star-color))',
        'fourth-text-color': 'rgba(var(--fourth-text-color))',
      },
      backgroundColor: {
        background: 'rgba(var(--background))',
        'divider-color': 'rgba(var(--divider-color))',
      },
      divideColor: {
        'divider-color': 'rgba(var(--divider-color))', // Ensures opacity is applied
      },
    },
  },
  plugins: [],
};
