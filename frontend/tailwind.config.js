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
      // Paleta de colores personalizada para ChoccoDelight
      colors: {
        gray: colors.gray,
        primary: {
          dark: '#3e2723',
          brown: '#6d4c41',
          accent: '#a1887f',
        },
        secondary: {
          warm: '#d7ccc8',
          cream: '#faf7f2',
        },
        accent: {
          gold: '#d4af37',
          rose: '#e8b4b8',
          punch: '#ff6b6b',
        },
        chocolate: {
          dark: '#5d4037',
          medium: '#8b5a3c',
        },
        pastel: {
          brown: '#d4a373',
          pink: '#f8c4b4',
          cream: '#f8f7f2',
        },
      },
      
      // Fuentes personalizadas
      fontFamily: {
        title: ['Pacifico', 'cursive'],
        body: ['Montserrat', 'sans-serif'],
        accent: ['Quicksand', 'sans-serif'],
      },
      
      // Sombras personalizadas
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 5px 15px rgba(0, 0, 0, 0.1)',
        'large': '0 10px 25px rgba(0, 0, 0, 0.12)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      
      // Animaciones personalizadas
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        slideInLeft: {
          'from': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          'from': {
            opacity: '0',
            transform: 'translateX(50px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      
      // Transiciones suaves
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-custom': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [
    // Plugin para formularios (opcional pero recomendado)
    forms,
    // Plugin para aspectos ratio
    aspectRatio,
  ],
};

export default config;
