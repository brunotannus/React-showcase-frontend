/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tn: {
          yellow: "#FFCE04",
          brown: "#240E0B",
          gray: "#615A5A",
        },
      },
    },
  },
  plugins: [],
  safelist: ["tn-yellow", "tn-brown", "tn-gray"],
};
