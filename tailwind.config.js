/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        alaska: {
          forest: '#1a472a',
          pine: '#2d5a27',
          sky: '#87CEEB',
          ocean: '#4a90d9',
          glacier: '#f7fbff',
          rock: '#5f6b72',
          ember: '#e58f4d',
          aurora: '#8be9b2',
          night: '#0d1f12',
        },
      },
      boxShadow: {
        glacier: '0 18px 45px -24px rgba(26, 71, 42, 0.35)',
      },
      backgroundImage: {
        aurora: 'radial-gradient(circle at top, rgba(135, 206, 235, 0.4), transparent 50%), linear-gradient(135deg, rgba(26, 71, 42, 0.95), rgba(74, 144, 217, 0.9))',
      },
    },
  },
  plugins: [],
}
