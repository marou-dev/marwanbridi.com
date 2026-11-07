// Cablage PostCSS explicite. @astrojs/tailwind le faisait implicitement ; il
// declarait astro ^3 || ^4 || ^5 en pair et bloquait donc la montee d'Astro.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
