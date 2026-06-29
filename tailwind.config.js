/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        brand: {
          orange: '#D4823A',
          'orange-dark': '#C06830',
        },
        surface: {
          bg: '#FDF8F4',
          nav: '#FFFFFF',
          card: '#FFF5EC',
          'card-hover': '#FFE8D6',
        },
        accent: {
          cyan: '#00B4D8',
          green: '#06D6A0',
          yellow: '#FACC15',
          orange: '#F97316',
          purple: '#B24BF3',
        },
        text: {
          primary: '#1A1008',
          secondary: '#6B4E35',
          muted: '#A07850',
          faint: '#C4A882',
        },
        border: {
          DEFAULT: '#E8D5C0',
          cyan: '#1E3A4A',
          green: '#0E2A1E',
          yellow: '#2A2210',
          orange: '#3A1A0E',
          purple: '#2A1A3A',
        }
      },
    },
  },
  plugins: [],
}