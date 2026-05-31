// Global design tokens — single source of truth for all colors and styles.
// Tailwind classes are generated from src/styles/index.css @theme block using these same values.
// Use Tailwind classes for className-based styling; import from here for inline styles only.

export const colors = {
  brand: {
    50:  '#FFF3EE',
    100: '#FFE4D8',
    400: '#FF8557',
    500: '#FF5C2E',
    600: '#E8421A',
    700: '#C43010',
  },
  sidebar:      '#121018',
  surface:      '#F4F5FA',
  surfaceAlt:   '#F4F4F7',
  surfaceWhite: '#FAFAFA',
  edge:         '#E8E8F0',
  chartGrid:    '#F0F0F5',
  ink: {
    DEFAULT: '#18181B',
    muted:   '#6B7280',
    faint:   '#9CA3AF',
    dim:     '#52525B',
    light:   '#71717A',
    extra:   '#A0A0A8',
  },
  white: '#FFFFFF',
  mfs: {
    bkash:  '#E2136E',
    nagad:  '#F7A21B',
    rocket: '#8332A4',
  },
  error: {
    DEFAULT: '#DC2626',
    bg:      '#FEF2F2',
    border:  '#FEE2E2',
    text:    '#B91C1C',
    faded:   'rgba(220,38,38,0.15)',
    fadedBorder: 'rgba(220,38,38,0.3)',
    light:   '#FCA5A5',
  },
  success: '#22C55E',
  // Status badge colors — keyed by order status string
  status: {
    PENDING:    { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
    CONFIRMED:  { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
    PROCESSING: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    SHIPPED:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    DELIVERED:  { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    CANCELLED:  { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    REFUNDED:   { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  },
  // Payment badge colors — keyed by payment status string
  payment: {
    UNPAID:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    PENDING_VERIFICATION: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
    PAID:                 { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    FAILED:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
    REFUNDED:             { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  },
  // Stat card palette — used for dashboard/analytics/inventory summary cards
  stat: {
    brand:   { bg: '#FFF3EE', color: '#FF5C2E' },
    orders:  { bg: '#EEF2FF', color: '#6366F1' },
    error:   { bg: '#FEF2F2', color: '#DC2626' },
    ok:      { bg: '#F0FDF4', color: '#10B981' },
    warning: { bg: '#FFFBEB', color: '#D97706' },
    total:   { bg: '#F0F5FF', color: '#4F46E5' },
    lowRow:  '#FFFDF0',
  },
  // Chart series colors for recharts
  chart: ['#FF5C2E', '#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
}

export const shadows = {
  brand:   '0 4px 14px rgba(255,92,46,0.35)',
  tooltip: '0 8px 24px rgba(0,0,0,0.08)',
}

// Semi-transparent overlays used on the dark login screen
export const glass = {
  card:        'rgba(255,255,255,0.05)',
  inputBg:     'rgba(255,255,255,0.07)',
  inputBorder: 'rgba(255,255,255,0.12)',
}

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.brand[500]} 0%, ${colors.brand[400]} 100%)`,
}

// Pre-composed inline style objects — import these instead of writing raw hex in components
export const brandGradStyle = {
  background: gradients.brand,
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
