import { colors, gradients, shadows } from '../theme.js';

export const btn = {
  primary:
    'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:opacity-90 active:scale-95',
  secondary:
    'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-edge bg-white text-ink-muted hover:text-ink hover:border-ink-muted transition-colors duration-150',
  danger:
    'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors duration-150',
  ghost:
    'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors duration-150',
};

export const brandGrad = {
  background: colors.brand[500],
  boxShadow:  shadows.brand,
};

export const card = 'bg-white border border-edge';

export const orderStatusColors = colors.status;
export const paymentStatusColors = colors.payment;

export const toastStyle = (type) =>
  type === 'error' ? { background: colors.error.DEFAULT } : brandGrad;

export const activeTabStyle = {
  background:  colors.brand[500],
  boxShadow:   shadows.brand,
  color:       colors.white,
  borderColor: 'transparent',
};

export const inactiveTabStyle = {
  background:  colors.white,
  color:       colors.ink.muted,
  borderColor: colors.edge,
};

export const disabledBtnStyle = {
  background: colors.edge,
  color:      colors.ink.faint,
  boxShadow:  'none',
};

export const tableHeadStyle = { background: colors.surfaceAlt };

export function StatusBadge({ label, colors: c }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {label}
    </span>
  );
}

export const tableHead = 'text-[11px] font-semibold text-ink-muted uppercase tracking-widest px-5 py-3.5 text-left border-b border-edge';
export const tableCell = 'px-5 py-3.5 text-sm text-ink';
export const tableRow  = 'border-b border-edge hover:bg-surface transition-colors';
