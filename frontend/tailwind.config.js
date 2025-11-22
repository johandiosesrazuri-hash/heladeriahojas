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
          light: '#FFC1CC', // Pastel Pink
          DEFAULT: '#FF8FA3', // Strawberry
          dark: '#FF6B81', // Deep Strawberry
        },
        secondary: {
          light: '#C7F9CC', // Mint Light
          DEFAULT: '#80ED99', // Mint
          dark: '#57CC99', // Deep Mint
        },
        accent: {
          blue: '#A2D2FF', // Pastel Blue
          yellow: '#FEE440', // Soft Yellow
          purple: '#CDB4DB', // Soft Purple
          rose: '#FF8FA3',   // Alias for compatibility
        },
        neutral: {
          50: '#F9F7F2', // Cream White (Background)
          100: '#F0EFEB',
          200: '#E2E2DF',
          800: '#4A4E69', // Dark Text
          900: '#22223B', // Darker Text
        },
        // Alias para compatibilidad con componentes existentes (mapeados a la nueva paleta)
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
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
