module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        spin: {
          '0%, 100%': { transform: 'rotateY(360deg)' },
          '50%': { transform: 'rotateY(0deg)' }
        }
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      }
    },
  },
  plugins: [],
}
