/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          navy: '#1E293B',
          deep: '#0F172A',
          muted: '#475569',
          light: '#E2E8F0',
          dark: '#1E293B',
        },
        risk: {
          low: '#16A34A',
          medium: '#D97706',
          high: '#DC2626',
        },
        surface: '#FFFFFF',
        background: '#F8FAFC',
        text: {
          primary: '#1E293B',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'btn': '6px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};
