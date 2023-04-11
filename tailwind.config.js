/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueberry: "#615ef8", // accent color

        snow: "#ffffff", // used for light card bg
        charcoal: "#282c37", // used for dark card bg

        night: "#191b22", // dark bg
        snowdrift: "#eff3f6", // light bg

        black: "#131419", // for lightmode text
        white: "#ffffff", // for darkmode text

        success: "#79bd9a",
        error: "#df405a",
      },
    },
    fontFamily: {
      inter: "var(--inter)",
    },
  },
  plugins: [],
};
