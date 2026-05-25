module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF3EE',
          100: '#FFE4D8',
          200: '#FFC5A8',
          300: '#FF9C72',
          400: '#FF7148',
          500: '#FF5C2E',
          600: '#E8421A',
          700: '#C43010',
          800: '#9C260E',
          900: '#7A1F0D',
        },
        surface: '#FAFAF8',
        ink: {
          DEFAULT: '#18100A',
          muted: '#6B5E57',
          faint: '#A89890',
        },
        edge: '#EDE8E3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card:    '0 2px 12px rgba(24,16,10,0.06)',
        'card-hover': '0 16px 40px rgba(24,16,10,0.12)',
        brand:   '0 8px 24px rgba(255,92,46,0.30)',
      },
    },
  },
  plugins: [],
}
