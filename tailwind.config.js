/** @type {import('tailwindcss').Config} */
/** צבעי מותג מ-Logo.png: #a0df50 | #000000 | #ffffff | #013024 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#a0df50',
          light: '#a0df50',
          dark: '#013024',
          'dark-hover': '#012a20',
          black: '#000000',
          white: '#ffffff',
          'bg-light': '#fafafa',
          'accent-secondary': '#d45d4a',
          surface: 'var(--surface-dark)',
          'surface-elevated': 'var(--surface-dark-elevated)',
          'surface-card': 'var(--surface-dark-card)',
        },
        'on-brand': {
          DEFAULT: 'var(--text-on-dark)',
          muted: 'var(--text-on-dark-muted)',
        },
      },
      backgroundColor: {
        'brand-page': 'var(--brand-page)',
      },
      boxShadow: {
        'brand-glow': '0 0 12px var(--brand-glow)',
        'brand-glow-soft': '0 0 20px var(--brand-glow-soft)',
        'ring-brand': '0 0 0 4px var(--brand-glow-soft)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(1rem)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'in': 'fade-in 0.5s ease-out, slide-in-from-bottom-4 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-from-bottom-4': 'slide-in-from-bottom 0.5s ease-out',
        'slide-in-from-right-4': 'slide-in-from-right 0.5s ease-out',
        'slide-in-from-bottom-8': 'slide-in-from-bottom 0.7s ease-out',
      },
    },
  },
  plugins: [],
};
