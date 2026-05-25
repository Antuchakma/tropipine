import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow, orderStatusColors, paymentStatusColors } from '../utils/ui';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function Badge({ label, colorMap }) {
  const c = colorMap[label] || { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const r = await api.get(url);
      setOrders(r.data.data || []);
    } catch { showToast('Failed to fetch orders', 'error'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await api.patch(`/orders/${selectedOrder.id}/status`, { status: newStatus });
      showToast('Order status updated!');
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setNewStatus('');
      fetchOrders();
    } catch { showToast('Failed to update status', 'error'); }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1300px] space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl transition-all ${toast.type === 'error' ? 'bg-red-600' : ''}`}
            style={toast.type !== 'error' ? brandGrad : {}}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Orders</h2>
            <p className="text-sm text-ink-muted mt-0.5">{orders.length} orders found</p>
          </div>
          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={statusFilter === '' ? { ...brandGrad, color: '#fff', borderColor: 'transparent' } : { background: '#fff', color: '#6B7280', borderColor: '#E8E8F0' }}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={statusFilter === s ? { ...brandGrad, color: '#fff', borderColor: 'transparent' } : { background: '#fff', color: '#6B7280', borderColor: '#E8E8F0' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Order Detail Modal */}
        {showDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${card} p-7 max-w-xl w-full shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setShowDetail(false)} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-lg">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Customer', val: selectedOrder.user?.name },
                  { label: 'Total', val: `৳${selectedOrder.totalAmount}` },
                  { label: 'Payment', val: selectedOrder.paymentMethod },
                  { label: 'Status', val: <Badge label={selectedOrder.status} colorMap={orderStatusColors} /> },
                  { label: 'Payment Status', val: <Badge label={selectedOrder.paymentStatus} colorMap={paymentStatusColors} /> },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-surface rounded-xl p-3">
                    <p className="text-xs text-ink-muted mb-1">{label}</p>
                    <div className="text-sm font-semibold text-ink">{val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-surface rounded-xl p-3">
                      <span className="text-sm text-ink">{item.productName} <span className="text-ink-muted">× {item.quantity}</span></span>
                      <span className="text-sm font-semibold text-ink">৳{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-edge pt-5">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="">Select new status…</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus}
                    className={btn.primary}
                    style={newStatus ? brandGrad : { background: '#E8E8F0', color: '#9CA3AF', boxShadow: 'none' }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={{ background: '#FAFAF8' }}>
              <tr>
                {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className={tableHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-edge">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-edge rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-16 text-center text-sm text-ink-muted">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className={tableRow}>
                  <td className={`${tableCell} font-semibold text-ink`}>{order.orderNumber}</td>
                  <td className={tableCell}>{order.user?.name || '—'}</td>
                  <td className={`${tableCell} font-semibold`}>৳{order.totalAmount}</td>
                  <td className={tableCell}><Badge label={order.paymentStatus} colorMap={paymentStatusColors} /></td>
                  <td className={tableCell}><Badge label={order.status} colorMap={orderStatusColors} /></td>
                  <td className={`${tableCell} text-ink-muted`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className={tableCell}>
                    <button
                      onClick={() => { setSelectedOrder(order); setShowDetail(true); setNewStatus(''); }}
                      className={btn.ghost}
                    >
                      View →
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
