/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f8ff",
          100: "#dcedff",
          600: "#0d5eb7",
          700: "#0a4a90",
          800: "#083a71",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        'marquee-vertical': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'marquee-horizontal': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.1)' },
        },
      },
      animation: {
        'marquee-vertical': 'marquee-vertical 35s linear infinite',
        'marquee-horizontal': 'marquee-horizontal 45s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

