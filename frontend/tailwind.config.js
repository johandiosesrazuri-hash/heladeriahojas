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
    // Fuente base para utilidades Tailwind
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      serif: ['Comfortaa', 'sans-serif'],
    },
    extend: {
      // Paleta de colores personalizada para ChoccoDelight
      colors: {
        gray: colors.gray,
        primary: {
          dark: '#904939',   // Profundo
          brown: '#C1583B',  // Tono medio
          accent: '#E19D7E', // Claro
        },
        secondary: {
          warm: '#E19D7E',   // Intermedio suave
          cream: '#DDD4CE',  // Fondo claro Linen
        },
        accent: {
          gold: '#E19D7E',   // Acento suave
          rose: '#C1583B',   // Acento medio
          punch: '#904939',  // Contraste oscuro
        },
        chocolate: {
          dark: '#904939',
          medium: '#C1583B',
        },
        pastel: {
          brown: '#E19D7E',
          pink: '#DDD4CE',
          cream: '#E19D7E',
        },
      },
      
      // Fuentes personalizadas adicionales
      fontFamily: {
        title: ['Comfortaa', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        accent: ['Open Sans', 'sans-serif'],
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
