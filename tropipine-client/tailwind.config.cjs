module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        cream:  '#F8F5F0',
        bone:   '#F0EBE3',
        // Text
        bark:   '#1A1410',
        earth:  '#4A3728',
        clay:   '#8C6F58',
        sand:   '#BDA88A',
        // Borders
        stone:  '#E5DDD3',
        smoke:  '#F0EBE3',
        // Brand accent
        grove:  '#2A3B26',
        sage:   '#5C7055',
        mist:   '#EAF0E8',
        // Legacy aliases (used in some components)
        surface: '#F8F5F0',
        ink: {
          DEFAULT: '#1A1410',
          muted:   '#8C6F58',
          faint:   '#BDA88A',
        },
        edge:   '#E5DDD3',
        brand: {
          50:    '#EAF0E8',
          100:   '#D4E1D0',
          300:   '#5C7055',
          400:   '#3D5439',
          500:   '#2A3B26',
          600:   '#1E2C1B',
          700:   '#141E12',
          light: '#5C7055',
        },
        auth: {
          bg:    '#120F0D',
          card:  '#1B1714',
          input: '#26211D',
        },
        gold:   '#C4923A',
        star:   '#C4923A',
        warm: {
          DEFAULT: '#4A3728',
          dark:    '#2A1E14',
          border:  '#E5DDD3',
          surface: '#F0EBE3',
          muted:   '#8C6F58',
        },
        dark: {
          DEFAULT: '#1A1410',
          deeper:  '#0D0A08',
          fade:    '#2A1E14',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        'none': '0',
        'sm':   '2px',
        DEFAULT: '3px',
        'md':   '4px',
        'lg':   '6px',
        'xl':   '8px',
        '2xl':  '10px',
        '3xl':  '14px',
        '4xl':  '20px',
        'full': '9999px',
      },
      boxShadow: {
        card:     '0 1px 4px rgba(26,20,16,0.06)',
        lift:     '0 4px 16px rgba(26,20,16,0.09)',
        'card-hover': '0 4px 16px rgba(26,20,16,0.09)',
        grove:    '0 4px 12px rgba(42,59,38,0.25)',
        brand:    '0 4px 12px rgba(42,59,38,0.25)',
        navbar:   '0 1px 0 #E5DDD3',
      },
      letterSpacing: {
        widest: '0.18em',
      },
    },
  },
  plugins: [],
}
