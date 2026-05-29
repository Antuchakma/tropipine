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
          500: '#F97316',  // warm orange — primary CTA
          600: '#EA6A0A',
          700: '#C45608',
          800: '#9C4406',
          900: '#7A3505',
        },

        // ── Page & surface backgrounds ──────────────────
        surface: '#ECEADF',   // warm sand/paper — the page background
        warm:    '#E3DBCA',   // deeper warm — hover, inner sections
        dark:    '#100C08',   // near-black — footer, hero overlays

        // ── Typography ──────────────────────────────────
        ink: {
          DEFAULT: '#18120C',  // near-black primary text
          muted:   '#6B6055',  // secondary / muted text
          faint:   '#A09588',  // placeholder / very muted
        },

        // ── Borders ─────────────────────────────────────
        edge:          '#D4CCC0',  // standard border on warm bg
        'warm-border': '#C4B8A8',  // card borders on warm bg

        // ── Accent (warm brown — secondary actions) ─────
        accent: {
          DEFAULT: '#8B5E3C',
          dark:    '#7A4E2F',
        },

        // ── Dark form surfaces (used on gradient-bg pages) ─
        'dark-card':  '#1B1714',  // dark card on gradient background (login/register)
        'dark-input': '#26211D',  // dark input fields on dark card

        // ── Special ─────────────────────────────────────
        gold: '#D4A017',  // exclusive/premium badge
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card:        '0 1px 4px rgba(24,18,12,0.06), 0 4px 16px rgba(24,18,12,0.04)',
        'card-hover':'0 8px 32px rgba(24,18,12,0.12)',
        brand:       '0 4px 20px rgba(249,115,22,0.35)',
        nav:         '0 1px 16px rgba(24,18,12,0.08)',
      },
    },
  },
  plugins: [],
}
