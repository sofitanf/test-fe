/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: '#6C63FF',
        purple10: '#534CC2',
        white: '#F7F7F7',
        black: '#252525',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '20rem',
        '2xl': '25rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
