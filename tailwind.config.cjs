/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,hbs}'],
  safelist: [
    {
      pattern: /ember-power-select/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-ember-power-select').plugin()],
};
