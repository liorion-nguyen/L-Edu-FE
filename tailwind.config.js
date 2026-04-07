/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007fff",
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
        "accent-blue": "#3b82f6",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      keyframes: {
        "codelab-logo-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "codelab-logo-glow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.02)" },
        },
      },
      animation: {
        "codelab-logo-float": "codelab-logo-float 5s ease-in-out infinite",
        "codelab-logo-glow": "codelab-logo-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

