import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      colors: {
        gray: colors.gray,
        // Paleta "Heladería Moderna"
        primary: {
          light: '#FFC1CC',
          DEFAULT: '#FF8FA3',
          dark: '#FF6B81',
        },
        secondary: {
          light: '#C7F9CC',
          DEFAULT: '#80ED99',
          dark: '#57CC99',
        },
        accent: {
          blue: '#A2D2FF',
          yellow: '#FEE440',
          purple: '#CDB4DB',
          rose: '#FF8FA3',
        },
        neutral: {
          50: '#F9F7F2',
          100: '#F0EFEB',
          200: '#E2E2DF',
          800: '#4A4E69',
          900: '#22223B',
        },
        chocolate: {
          dark: '#22223B',
          medium: '#4A4E69',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'medium': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'large': '0 20px 40px -5px rgba(0, 0, 0, 0.1)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'hover': '0 10px 30px -5px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [
    forms,
    aspectRatio,
  ],
};

export default config;
