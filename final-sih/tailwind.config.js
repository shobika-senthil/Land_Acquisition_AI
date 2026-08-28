/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F3EA',
          light: '#FAF8F4',
          dark: '#EFE5D3',
        },
        sandal: {
          50: '#FAF8F5',
          100: '#F7F3EA',
          200: '#EFE5D3',
          300: '#D8C4A8',
          400: '#C7A17A',
          500: '#B98962',
          600: '#A1724D',
          700: '#8C5A3C',
          800: '#5A3424',
          900: '#3A2016',
        },
        ivory: {
          DEFAULT: '#F7F3EA',
          50: '#FFFFFF',
          100: '#FCFAF7',
          200: '#F7F3EA',
          300: '#EFE5D3',
          400: '#D8C4A8',
        },
        earth: {
          50: '#FAF8F5',
          100: '#F7F3EA',
          200: '#EFE5D3',
          300: '#D8C4A8',
          400: '#C7A17A',
          500: '#8C5A3C',
          600: '#73462E',
          700: '#5A3424',
          800: '#43261A',
          900: '#2B1D14',
          950: '#1C130D',
        },
        terracotta: {
          50: '#FDF7F5',
          100: '#F9ECE7',
          200: '#F1D4CA',
          300: '#E4B4A4',
          400: '#D28B75',
          500: '#B65A3C',
          600: '#9F462A',
          700: '#833720',
          800: '#6B2F1C',
          900: '#582819',
        },
        olive: {
          50: '#F6F8F3',
          100: '#EBEEE4',
          200: '#D7DEC9',
          300: '#BCC9A7',
          400: '#9CAF80',
          500: '#70784D',
          600: '#586339',
          700: '#434C2C',
          800: '#343B23',
          900: '#272C1B',
        },
        risk: {
          low: '#70784D',
          'low-bg': '#F1F4EB',
          'low-border': '#D0DBC0',
          moderate: '#C7A17A',
          'moderate-bg': '#FAF4EE',
          'moderate-border': '#E8DEC8',
          high: '#B65A3C',
          'high-bg': '#FAF0EC',
          'high-border': '#F1D4CA',
          critical: '#A94A3F',
          'critical-bg': '#FAECEC',
          'critical-border': '#F3BEBF',
        }
      },
      fontFamily: {
        sans: [
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        display: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        serif: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3.5rem, 7vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'page-heading': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'section-heading': ['clamp(1.75rem, 3.2vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'card-heading': ['clamp(1.1rem, 1.5vw, 1.4rem)', { lineHeight: '1.3' }],
      },
      boxShadow: {
        'sandal-sm': '0 2px 8px -2px rgba(90, 52, 36, 0.05)',
        'sandal': '0 8px 24px -6px rgba(90, 52, 36, 0.08)',
        'sandal-lg': '0 16px 36px -8px rgba(90, 52, 36, 0.12)',
        'sandal-xl': '0 24px 48px -12px rgba(43, 29, 20, 0.16)',
        'floating': '0 12px 32px -4px rgba(43, 29, 20, 0.10), 0 0 0 1px rgba(216, 196, 168, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
