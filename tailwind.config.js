/** @type {import('tailwindcss').Config} */
const toRem = (px) => `${px / 16}rem /* ${px}px */`;

const toRemArr = (arr) => {
  return arr.reduce((acc, curr) => {
    acc[curr] = toRem(curr);
    acc[curr * -1] = toRem(curr * -1);
    return acc;
  }, {});
};
const values = [];
for (let i = 0; i <= 300; i++) {
  if (i <= 100) {
    values.push(i);
  } else if (i % 5 === 0) {
    values.push(i);
  }
}
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    spacing: {
      ...toRemArr([...values, 112, 302, 650]),
    },
    minWidth: {
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      ...toRemArr([...values]),
    },
    minHeight: {
      full: "100%",
      screen: "100vh",
      svh: "100svh",
      lvh: "100lvh",
      dvh: "100dvh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      ...toRemArr([...values]),
    },
    maxHeight: {
      none: "none",
      full: "100%",
      screen: "100vh",
      svh: "100svh",
      lvh: "100lvh",
      dvh: "100dvh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      ...toRemArr([...values]),
      unset: "unset",
    },
    margin: {
      auto: "auto",
      ...toRemArr([...values]),
    },
    padding: {
      auto: "auto",
      ...toRemArr([...values, 112]),
    },
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "2000px",
      },
      listStyleType: {
        square: "square",
      },
    },
    container: false,
  },
  plugins: [],
};
