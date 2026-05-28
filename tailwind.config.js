/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        climbe: {
          primary: {
            DEFAULT: '#5fc2ba',
            hover: '#4db3ab',
            light: 'rgba(95, 194, 186, 0.12)',
            glow: 'rgba(95, 194, 186, 0.35)',
          },
          secondary: {
            DEFAULT: '#1c2b29',
            hover: '#263c39',
            light: 'rgba(28, 43, 41, 0.1)',
          },
          success: {
            DEFAULT: '#4caf50',
            light: 'rgba(76, 175, 80, 0.12)',
          },
          warning: {
            DEFAULT: '#fca84b',
            light: 'rgba(252, 168, 75, 0.12)',
          },
          danger: {
            DEFAULT: '#e25c5c',
            light: 'rgba(226, 92, 92, 0.12)',
          },
          neutral: {
            bg: 'var(--climbe-neutral-bg)',
            card: 'var(--climbe-neutral-card)',
            mute: 'var(--climbe-neutral-mute)',
            border: 'var(--climbe-neutral-border)',
            'border-hover': 'var(--climbe-neutral-border-hover)',
          },
          text: {
            main: 'var(--climbe-text-main)',
            muted: 'var(--climbe-text-muted)',
            'on-primary': '#121312'
          }
        }
      },
      fontFamily: {
        avenir: ['Avenir', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        book: '400',
        medium: '500',
        heavy: '700',
        black: '900',
      },
      spacing: {
        '05': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.05)',
        'md': '0 4px 12px rgba(28, 43, 41, 0.05)',
        'lg': '0 12px 24px rgba(28, 43, 41, 0.08)',
        'glow': '0 0 16px rgba(95, 194, 186, 0.35)',
      }
    },
  },
  plugins: [],
}
