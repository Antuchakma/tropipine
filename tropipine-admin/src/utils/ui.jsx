export const btn = {
  primary:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95',
  secondary:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-edge bg-white text-ink-muted hover:text-ink hover:border-gray-300 transition-all duration-150',
  danger:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all duration-150',
  ghost:
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface transition-all duration-150',
};

export const brandGrad = {
  background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)',
  boxShadow: '0 4px 14px rgba(255,92,46,0.35)',
};

export const card = 'bg-white rounded-2xl border border-edge';

export const orderStatusColors = {
  PENDING:    { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  CONFIRMED:  { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  PROCESSING: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  SHIPPED:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  DELIVERED:  { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  CANCELLED:  { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
  REFUNDED:   { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
};

export const paymentStatusColors = {
  UNPAID:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
  PENDING_VERIFICATION: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  PAID:                 { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  FAILED:               { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2' },
  REFUNDED:             { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
};

export function StatusBadge({ label, colors }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {label}
    </span>
  );
}

export const tableHead = 'text-xs font-semibold text-ink-muted uppercase tracking-wider px-5 py-3.5 text-left border-b border-edge';
export const tableCell = 'px-5 py-3.5 text-sm text-ink';
export const tableRow  = 'border-b border-edge hover:bg-surface transition-colors';
