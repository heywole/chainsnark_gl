/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        red:    '#ff3c00',
        green:  '#00ff94',
        yellow: '#ffe44d',
        dark:   '#0a0a0a',
        card:   '#111111',
        border: '#1e1e1e',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flicker':    'flicker 4s linear infinite',
        'slide-up':   'slideUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '93%':     { opacity: '0.4' },
          '96%':     { opacity: '0.7' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
