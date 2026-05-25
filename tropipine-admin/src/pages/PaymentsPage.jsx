import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow, paymentStatusColors } from '../utils/ui';

const STATUS_TABS = [
  { value: 'PENDING_VERIFICATION', label: '⏳ Pending' },
  { value: 'PAID', label: '✅ Verified' },
  { value: 'FAILED', label: '❌ Rejected' },
  { value: '', label: 'All' },
];

function Badge({ label }) {
  const c = paymentStatusColors[label] || { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {label}
    </span>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_VERIFICATION');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
    try {
      await api.patch(`/payments/${id}/verify`);
      showToast('Payment verified!');
      fetchPayments();
      setSelectedPayment(null);
    } catch { showToast('Failed to verify', 'error'); }
  };

  const handleReject = async (id) => {
    if (!rejectionNote.trim()) { showToast('Please enter a rejection reason', 'error'); return; }
    try {
      await api.patch(`/payments/${id}/reject`, { note: rejectionNote });
      showToast('Payment rejected');
      fetchPayments();
      setSelectedPayment(null);
      setRejectionNote('');
    } catch { showToast('Failed to reject', 'error'); }
  };

  const pendingCount = payments.filter((p) => p.status === 'PENDING_VERIFICATION').length;

  return (
    <AdminLayout>
      <div className="max-w-[1300px] space-y-6">

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toast.type !== 'error' ? brandGrad : { background: '#DC2626' }}>
            {toast.msg}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Payment Verification</h2>
            {pendingCount > 0 && statusFilter === 'PENDING_VERIFICATION' && (
              <p className="text-sm text-red-500 font-medium mt-0.5">⚠️ {pendingCount} payment{pendingCount > 1 ? 's' : ''} need{pendingCount === 1 ? 's' : ''} review</p>
            )}
          </div>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatusFilter(t.value)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={statusFilter === t.value ? { ...brandGrad, color: '#fff', borderColor: 'transparent' } : { background: '#fff', color: '#6B7280', borderColor: '#E8E8F0' }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Detail Panel */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${card} p-7 max-w-lg w-full shadow-2xl rounded-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Payment Detail</h3>
                <button onClick={() => { setSelectedPayment(null); setRejectionNote(''); }} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-muted hover:text-ink text-lg">✕</button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: 'Order #', val: selectedPayment.order?.orderNumber },
                  { label: 'Customer', val: selectedPayment.order?.user?.name },
                  { label: 'Method', val: selectedPayment.method },
                  { label: 'Sender Number', val: selectedPayment.senderNumber },
                  { label: 'Transaction ID', val: <span className="font-mono font-bold text-ink text-base">{selectedPayment.transactionId}</span> },
                  { label: 'Amount', val: <span className="text-2xl font-bold text-ink">৳{selectedPayment.amount}</span> },
                  { label: 'Status', val: <Badge label={selectedPayment.status} /> },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-edge last:border-0">
                    <span className="text-xs text-ink-muted">{label}</span>
                    <span className="text-sm font-medium text-ink">{val}</span>
                  </div>
                ))}
              </div>

              {selectedPayment.status === 'PENDING_VERIFICATION' && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleVerify(selectedPayment.id)}
                    className={`${btn.primary} w-full justify-center`}
                    style={brandGrad}
                  >
                    ✅ Verify Payment — ৳{selectedPayment.amount}
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted mb-2">Rejection reason (required to reject):</p>
                    <textarea
                      rows={3}
                      placeholder="e.g. Transaction ID not found in our records"
                      value={rejectionNote}
                      onChange={(e) => setRejectionNote(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm focus:outline-none focus:border-red-400 resize-none"
                    />
                    <button
                      onClick={() => handleReject(selectedPayment.id)}
                      className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                    >
                      ❌ Reject Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={{ background: '#FAFAF8' }}>
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
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-edge rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr><td colSpan="8" className="px-5 py-16 text-center text-sm text-ink-muted">No payments found</td></tr>
              ) : payments.map((payment) => (
                <tr key={payment.id} className={tableRow}>
                  <td className={`${tableCell} font-semibold`}>{payment.order?.orderNumber || '—'}</td>
                  <td className={tableCell}>{payment.order?.user?.name || '—'}</td>
                  <td className={`${tableCell} font-medium`}>{payment.method}</td>
                  <td className={`${tableCell} font-bold`}>৳{payment.amount}</td>
                  <td className={`${tableCell} font-mono text-xs`}>{payment.transactionId}</td>
                  <td className={tableCell}><Badge label={payment.status} /></td>
                  <td className={`${tableCell} text-ink-muted`}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className={tableCell}>
                    <button onClick={() => setSelectedPayment(payment)} className={btn.ghost}>
                      Review →
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
