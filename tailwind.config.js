/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#4b72a6',
          90: '#5e84b0',
          white: '#ffffff',
          'dark-blue': '#4f6273',
          'light-blue': '#dfe9f2',
          black: '#111827',
          'dark-gray': '#6d6d6d',
          'light-gray': '#e5e7eb',
          green: '#4fa373',
          gold: '#a68a56',
          shadow: '#4b72a659',
          error: '#c24a4a',
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
