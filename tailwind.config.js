/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-ring-delay': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) 0.4s infinite',
        'pulse-ring-delay-2': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) 0.8s infinite',
        'slide-in-up': 'slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'toast-in': 'toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toast-out 0.3s ease-in forwards',
        'highlight': 'highlight 1.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'waveform-1': 'waveform 0.5s ease-in-out infinite alternate',
        'waveform-2': 'waveform 0.5s ease-in-out 0.1s infinite alternate',
        'waveform-3': 'waveform 0.5s ease-in-out 0.2s infinite alternate',
        'waveform-4': 'waveform 0.5s ease-in-out 0.3s infinite alternate',
        'waveform-5': 'waveform 0.5s ease-in-out 0.15s infinite alternate',
        'spin-slow': 'spin 2s linear infinite',
        'chip-in': 'chip-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-in': {
          '0%': { transform: 'translateY(100%) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'toast-out': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(100%) scale(0.95)', opacity: '0' },
        },
        'highlight': {
          '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4), inset 0 0 0 1px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 20px 0 rgba(16, 185, 129, 0.1), inset 0 0 0 1px rgba(16, 185, 129, 0.1)' },
          '100%': { boxShadow: '0 0 0 0 transparent, inset 0 0 0 0 transparent' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'waveform': {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        },
        'chip-in': {
          '0%': { transform: 'scale(0.8) translateX(-8px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
