/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.pug', './public/js/**/*.js'], // Adjust the paths to your files

  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--primary))',
        'primary-text-colorS': 'rgba(var(--primary-text-colorS))',
        secondary: 'rgba(var(--secondary)) ',
        'primary-text-color': 'rgba(var(--primary-text-color))',
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
        'background-secondary': 'rgba(var(--background-secondary))',
        'background-third': 'rgba(var(--background-third))',
        'background-fourth': 'rgba(var(--background-fourth))',
        'background-fifth': 'rgba(var(--background-fifth))',
        'background-sixth': 'rgba(var(--background-sixth))',
        'background-seventh': 'rgba(var(--background-seventh))',
      },
      divideColor: {
        'divider-color': 'rgba(var(--divider-color))', // Ensures opacity is applied
      },
    },
  },
  plugins: [],
};
