// Global design tokens — single source of truth for all colors and styles.
// Tailwind classes are generated from src/styles/index.css @theme block using these same values.
// Use Tailwind classes for className-based styling; import from here for inline styles only.

export const colors = {
  brand: {
    50:  '#EAF0E8',
    100: '#D4E1D0',
    400: '#4A7A52',
    500: '#2A3B26',
    600: '#1E2C1B',
    700: '#141E12',
  },
  sidebar:      '#1A1410',
  surface:      '#F8F5F0',
  surfaceAlt:   '#F0EBE3',
  surfaceWhite: '#FFFFFF',
  edge:         '#E5DDD3',
  chartGrid:    '#EDE8DF',
  ink: {
    DEFAULT: '#1A1410',
    muted:   '#8C6F58',
    faint:   '#BDA88A',
    dim:     '#4A3728',
    light:   '#8C6F58',
    extra:   '#BDA88A',
  },
  white: '#FFFFFF',
  mfs: {
    bkash:  '#E2136E',
    nagad:  '#F7A21B',
    rocket: '#8332A4',
  },
  error: {
    DEFAULT: '#B91C1C',
    bg:      '#FEF2F2',
    border:  '#FEE2E2',
    text:    '#B91C1C',
    faded:   'rgba(185,28,28,0.12)',
    fadedBorder: 'rgba(185,28,28,0.25)',
    light:   '#FCA5A5',
  },
  success: '#166534',
  // Status badge colors — keyed by order status string
  status: {
    PENDING:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    CONFIRMED:  { bg: '#EAF0E8', text: '#2A3B26', border: '#D4E1D0' },
    PROCESSING: { bg: '#F0EBE3', text: '#4A3728', border: '#DDD0BA' },
    SHIPPED:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    DELIVERED:  { bg: '#EAF0E8', text: '#166534', border: '#D4E1D0' },
    CANCELLED:  { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    REFUNDED:   { bg: '#F8F5F0', text: '#8C6F58', border: '#E5DDD3' },
  },
  // Payment badge colors — keyed by payment status string
  payment: {
    UNPAID:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    PENDING_VERIFICATION: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    PAID:                 { bg: '#EAF0E8', text: '#166534', border: '#D4E1D0' },
    FAILED:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    REFUNDED:             { bg: '#F8F5F0', text: '#8C6F58', border: '#E5DDD3' },
  },
  // Stat card palette
  stat: {
    brand:   { bg: '#EAF0E8', color: '#2A3B26' },
    orders:  { bg: '#EFF6FF', color: '#1D4ED8' },
    error:   { bg: '#FEF2F2', color: '#B91C1C' },
    ok:      { bg: '#EAF0E8', color: '#166534' },
    warning: { bg: '#FFFBEB', color: '#92400E' },
    total:   { bg: '#F0EBE3', color: '#4A3728' },
    lowRow:  '#FFF9F0',
  },
  // Chart series colors
  chart: ['#2A3B26', '#4A7A52', '#4A3728', '#8C6F58', '#1D4ED8', '#92400E'],
}

export const shadows = {
  brand:   '0 2px 8px rgba(42,59,38,0.18)',
  tooltip: '0 4px 16px rgba(26,20,16,0.08)',
}

// Semi-transparent overlays used on the dark login screen
export const glass = {
  card:        'rgba(255,255,255,0.04)',
  inputBg:     'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.10)',
}

export const gradients = {
  brand: `${colors.brand[500]}`,
}

// Pre-composed inline style objects
export const brandGradStyle = {
  background: colors.brand[500],
  boxShadow:  shadows.brand,
}

export const inactiveTabStyle = {
  background:  colors.white,
  color:       colors.ink.muted,
  borderColor: colors.edge,
}

export const disabledBtnStyle = {
  background: colors.edge,
  color:      colors.ink.faint,
  boxShadow:  'none',
}

export const tableHeadStyle = { background: colors.surfaceAlt }

export const toastStyle = (type) =>
  type === 'error' ? { background: colors.error.DEFAULT } : brandGradStyle
