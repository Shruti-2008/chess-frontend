/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        16: "16px",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
      },
      animation: {
        enter: "enter 0.4s ease-out",
        leave: "leave 0.4s ease-in forwards",
      },
      fontSize: {
        "10xl": "10rem",
        "12xl": "12rem",
      },
    },
  },
  plugins: [],
};
