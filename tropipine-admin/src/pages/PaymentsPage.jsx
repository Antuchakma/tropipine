import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import {
  btn, brandGrad, card, tableHead, tableCell, tableRow,
  paymentStatusColors, toastStyle, activeTabStyle, inactiveTabStyle, tableHeadStyle,
} from '../utils/ui';

const STATUS_TABS = [
  { value: 'PENDING_VERIFICATION', label: 'Pending' },
  { value: 'PAID', label: 'Verified' },
  { value: 'FAILED', label: 'Rejected' },
  { value: '', label: 'All' },
];

function Badge({ label }) {
  const c = paymentStatusColors[label] || paymentStatusColors.REFUNDED;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {label}
    </span>
  );
}

function PaymentDetailModal({ payment, onClose, onVerify, onReject, showToast }) {
  const [rejectionNote, setRejectionNote] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await onVerify(payment.id);
    } finally { setVerifying(false); }
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) { showToast('Please enter a rejection reason', 'error'); return; }
    setRejecting(true);
    try {
      await onReject(payment.id, rejectionNote);
    } finally { setRejecting(false); }
  };

  const rows = [
    { label: 'Order #', val: payment.order?.orderNumber },
    { label: 'Customer', val: payment.order?.user?.name || payment.order?.guestName || 'Guest' },
    { label: 'Method', val: payment.method?.replace(/_/g, ' ') },
    { label: 'Sender Number', val: payment.senderNumber },
    {
      label: 'Transaction ID',
      val: <span className="font-mono font-bold text-ink text-sm break-all">{payment.transactionId}</span>,
    },
    {
      label: 'Amount',
      val: <span className="text-2xl font-bold text-ink">৳{payment.amount}</span>,
    },
    { label: 'Status', val: <Badge label={payment.status} /> },
    {
      label: 'Submitted',
      val: new Date(payment.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-edge rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-edge px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Payment Detail</h3>
            <p className="text-xs text-ink-muted mt-0.5">{payment.order?.orderNumber}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors text-lg">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Detail rows */}
          <div className="rounded-xl border border-edge overflow-hidden">
            {rows.map(({ label, val }, i) => (
              <div key={label}
                className={`flex justify-between items-center px-4 py-3 ${i < rows.length - 1 ? 'border-b border-edge' : ''}`}>
                <span className="text-xs font-semibold text-ink-muted w-32 shrink-0">{label}</span>
                <div className="text-sm font-medium text-ink text-right">{val}</div>
              </div>
            ))}
          </div>

          {/* Rejection note if exists */}
          {payment.rejectionNote && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-700">{payment.rejectionNote}</p>
            </div>
          )}

          {/* Actions for pending */}
          {payment.status === 'PENDING_VERIFICATION' && (
            <div className="space-y-3 pt-1">
              <button onClick={handleVerify} disabled={verifying}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={verifying ? { background: '#aaa' } : brandGrad}>
                {verifying ? 'Verifying…' : `✓  Verify Payment — ৳${payment.amount}`}
              </button>

              <div className="border border-edge rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-ink-muted">Rejection reason (required to reject)</p>
                <textarea
                  rows={3}
                  placeholder="e.g. Transaction ID not found in our records"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all"
                />
                <button onClick={handleReject} disabled={rejecting}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50">
                  {rejecting ? 'Rejecting…' : '✕  Reject Payment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_VERIFICATION');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/payments?status=${statusFilter}` : '/payments';
      const r = await api.get(url);
      setPayments(r.data.data || []);
    } catch { showToast('Failed to load payments', 'error'); }
    finally { setLoading(false); }
  };

  const handleVerify = async (id) => {
    await api.patch(`/payments/${id}/verify`);
    showToast('Payment verified!');
    fetchPayments();
    setSelectedPayment(null);
  };

  const handleReject = async (id, note) => {
    await api.patch(`/payments/${id}/reject`, { note });
    showToast('Payment rejected');
    fetchPayments();
    setSelectedPayment(null);
  };

  const pendingCount = payments.filter((p) => p.status === 'PENDING_VERIFICATION').length;

  // Client-side filter by search (transaction ID, customer name, order number)
  const filtered = search
    ? payments.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.transactionId?.toLowerCase().includes(q) ||
          p.order?.orderNumber?.toLowerCase().includes(q) ||
          p.order?.user?.name?.toLowerCase().includes(q) ||
          p.order?.guestName?.toLowerCase().includes(q) ||
          p.senderNumber?.includes(q)
        );
      })
    : payments;

  return (
    <AdminLayout>
      <div className="max-w-[1300px] space-y-6">

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toastStyle(toast.type)}>
            {toast.msg}
          </div>
        )}

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <PaymentDetailModal
            payment={selectedPayment}
            onClose={() => setSelectedPayment(null)}
            onVerify={handleVerify}
            onReject={handleReject}
            showToast={showToast}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              Payment Verification
            </h2>
            {pendingCount > 0 && statusFilter === 'PENDING_VERIFICATION' && (
              <p className="text-sm text-red-500 font-medium mt-0.5">
                {pendingCount} payment{pendingCount > 1 ? 's' : ''} need{pendingCount === 1 ? 's' : ''} review
              </p>
            )}
          </div>
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => (
              <button key={t.value} onClick={() => setStatusFilter(t.value)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={statusFilter === t.value ? activeTabStyle : inactiveTabStyle}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-base pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search by transaction ID, name, order #…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-edge rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[680px]">
            <thead style={tableHeadStyle}>
              <tr>
                {['Order #', 'Customer', 'Method', 'Amount', 'Transaction ID', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className={tableHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-edge">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-edge rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center text-sm text-ink-muted">
                    {search ? `No payments matching "${search}"` : 'No payments found'}
                  </td>
                </tr>
              ) : filtered.map((payment) => (
                <tr key={payment.id} className={tableRow}>
                  <td className={`${tableCell} font-semibold font-mono text-xs`}>{payment.order?.orderNumber || '—'}</td>
                  <td className={tableCell}>{payment.order?.user?.name || payment.order?.guestName || 'Guest'}</td>
                  <td className={`${tableCell} font-medium`}>{payment.method?.replace(/_/g, ' ')}</td>
                  <td className={`${tableCell} font-bold`}>৳{payment.amount}</td>
                  <td className={`${tableCell} font-mono text-xs text-ink-muted`}>{payment.transactionId}</td>
                  <td className={tableCell}><Badge label={payment.status} /></td>
                  <td className={`${tableCell} text-ink-muted`}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className={tableCell}>
                    <button onClick={() => setSelectedPayment(payment)} className={btn.ghost}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
