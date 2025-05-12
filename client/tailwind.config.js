// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          750: "#2D3748", // Custom shade between gray-700 and gray-800
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#E2E8F0",
            a: {
              color: "#90CDF4",
              "&:hover": {
                color: "#63B3ED",
              },
            },
            h1: {
              color: "#F7FAFC",
            },
            h2: {
              color: "#F7FAFC",
            },
            h3: {
              color: "#F7FAFC",
            },
            h4: {
              color: "#F7FAFC",
            },
            strong: {
              color: "#F7FAFC",
            },
            code: {
              color: "#E2E8F0",
            },
            pre: {
              backgroundColor: "#1A202C",
              color: "#E2E8F0",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
