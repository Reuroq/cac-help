/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mil: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#cddccd',
          400: '#7a9b7a',
          600: '#446844',
          700: '#365436',
          800: '#2b432b',
          900: '#223622',
        },
        gold: {
          400: '#d4af37',
          500: '#bfa130',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
