/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2F3136',
          accent: '#0056F2',
          'text-primary': '#FFFFFF',
          'secondary-bg': '#1E1F22',
          'border-color': '#3A3B3E',
          'subtle-text': '#A0A0A0',
          success: '#22C55E',
          error: '#EF4444',
          warning: '#FACC15',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        spacing: {
          'xs': '0.25rem',
          'sm': '0.5rem',
          'md': '1rem',
          'lg': '1.5rem',
          'xl': '2rem',
        },
      },
    },
    plugins: [
      typography,
    ],
  }
  