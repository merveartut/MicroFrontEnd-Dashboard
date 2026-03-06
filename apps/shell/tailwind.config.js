/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Burası kritik! Üst klasöre çıkıp packages ve diğer app'leri taramasını sağlıyoruz.
    "../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}",
    "../finance/src/**/*.{js,ts,jsx,tsx}",
    "../tech-trends/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
