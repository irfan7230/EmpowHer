/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f7',
          100: '#feeaea',
          200: '#fdd8d8',
          300: '#fbb9b9',
          400: '#f78d8d',
          500: '#ef5a5a',
          600: '#dc3d3d',
          700: '#b92f2f',
          800: '#9a2a2a',
          900: '#7f2727',
        },
        pink: {
          50: '#fef7f7',
          100: '#feeaea',
          200: '#fdd8d8',
          300: '#ffc0cb',
          400: '#ff9db0',
          500: '#ff7a95',
          600: '#ff577a',
          700: '#ff345f',
          800: '#e02d55',
          900: '#c1264b',
        },
        panic: '#FF6347',
        safe: '#10B981',
      },
      fontFamily: {
        'inter': ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
        'inter-bold': ['Inter-Bold'],
      },
    },
  },
  plugins: [],
}