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
          bg: '#0E0C0B',
          nav: '#0B0A09',
          card: '#131110',
          'card-hover': '#1A1612',
        },
        accent: {
          cyan: '#00B4D8',
          green: '#06D6A0',
          yellow: '#FACC15',
          orange: '#F97316',
          purple: '#B24BF3',
        },
        text: {
          primary: '#F5ECD8',
          secondary: '#A09080',
          muted: '#6A5A48',
          faint: '#3A3028',
        },
        border: {
          DEFAULT: '#1E1A16',
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