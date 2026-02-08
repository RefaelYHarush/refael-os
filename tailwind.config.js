/** @type {import('tailwindcss').Config} */
/** צבעי נגישות מ-Logo: #a0df50 | #013024 | #000000 | #ffffff */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#a0df50',
          light: '#a0df50',
          dark: '#013024',
          black: '#000000',
          white: '#ffffff',
          /** משטחים בכהה – עומק ונגישות */
          surface: '#0a2e26',
          'surface-elevated': '#0d3a30',
        },
        /** טקסט נגיש על רקע כהה (WCAG AA) */
        'on-brand': {
          DEFAULT: '#ffffff',
          muted: '#b8d4ce',
        },
      },
      backgroundColor: {
        'brand-page': 'rgba(1, 48, 36, 0.04)',
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
