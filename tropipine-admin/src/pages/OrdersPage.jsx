import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import {
  btn, brandGrad, card, tableHead, tableCell, tableRow,
  orderStatusColors, paymentStatusColors, toastStyle,
  activeTabStyle, inactiveTabStyle, disabledBtnStyle, tableHeadStyle,
} from '../utils/ui';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_METHODS = ['CASH_ON_DELIVERY', 'BKASH', 'NAGAD', 'ROCKET', 'BANK_TRANSFER'];

function Badge({ label, colorMap }) {
  const c = colorMap[label] || colorMap.REFUNDED;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {label}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="bg-surface rounded-xl p-3">
      <p className="text-xs text-ink-muted mb-1">{label}</p>
      <div className="text-sm font-semibold text-ink">{children}</div>
    </div>
  );
}

function CreateOrderModal({ onClose, onCreated, showToast }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [form, setForm] = useState({
    guestName: '', guestPhone: '', guestEmail: '',
    address: '', city: '', postalCode: '',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: '',
    deliveryCharge: 0,
    specialNote: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/products?limit=200').then((r) => {
      setProducts(r.data.items || r.data.data || []);
    }).catch(() => {}).finally(() => setLoadingProducts(false));
  }, []);

  const updateForm = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const addItem = () => setItems((p) => [...p, { productId: '', quantity: 1 }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => {
    const next = [...p];
    next[i] = { ...next[i], [field]: val };
    return next;
  });

  const getProduct = (id) => products.find((p) => p.id === id);

  const subtotal = items.reduce((acc, it) => {
    const prod = getProduct(it.productId);
    return acc + (prod ? prod.finalPrice * (parseFloat(it.quantity) || 0) : 0);
  }, 0);
  const total = subtotal + (parseFloat(form.deliveryCharge) || 0);

  const handleSubmit = async () => {
    if (!form.guestName.trim() || !form.guestPhone.trim()) {
      showToast('Customer name and phone are required', 'error'); return;
    }
    const validItems = items.filter((i) => i.productId && parseFloat(i.quantity) > 0);
    if (validItems.length === 0) {
      showToast('Add at least one product', 'error'); return;
    }
    setSubmitting(true);
    try {
      await api.post('/orders/admin-create', {
        ...form,
        deliveryCharge: parseFloat(form.deliveryCharge) || 0,
        items: validItems.map((i) => ({ productId: i.productId, quantity: parseFloat(i.quantity) })),
      });
      showToast('Order created successfully!');
      onCreated();
      onClose();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all';
  const labelCls = 'text-xs font-semibold text-ink-muted mb-1.5 block';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-edge rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-edge px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Create Manual Order</h3>
            <p className="text-xs text-ink-muted mt-0.5">For phone/call-in orders from customers</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors text-lg">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Customer Info */}
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Customer Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Name <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="Customer name" value={form.guestName}
                  onChange={(e) => updateForm('guestName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="01XXXXXXXXX" value={form.guestPhone}
                  onChange={(e) => updateForm('guestPhone', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Email (optional)</label>
                <input className={inputCls} placeholder="customer@email.com" value={form.guestEmail}
                  onChange={(e) => updateForm('guestEmail', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Delivery Address</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Street / Area</label>
                <input className={inputCls} placeholder="House, Road, Area" value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>City / District</label>
                <input className={inputCls} placeholder="Dhaka" value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Postal Code</label>
                <input className={inputCls} placeholder="1207" value={form.postalCode}
                  onChange={(e) => updateForm('postalCode', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Order Items</p>
            {loadingProducts ? (
              <div className="text-sm text-ink-muted py-2">Loading products…</div>
            ) : (
              <div className="space-y-2">
                {items.map((item, i) => {
                  const prod = getProduct(item.productId);
                  return (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(i, 'productId', e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                      >
                        <option value="">— Select product —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ৳{p.finalPrice}/{p.unit}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={item.quantity}
                        onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                        className="w-20 px-3 py-2.5 rounded-xl border border-edge bg-white text-sm text-center focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                      />
                      {prod && (
                        <span className="text-sm font-semibold text-ink w-24 text-right shrink-0">
                          ৳{(prod.finalPrice * (parseFloat(item.quantity) || 0)).toFixed(2)}
                        </span>
                      )}
                      {items.length > 1 && (
                        <button onClick={() => removeItem(i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-lg shrink-0">
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
                <button onClick={addItem}
                  className="mt-1 flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  <span className="text-lg leading-none">+</span> Add another item
                </button>
              </div>
            )}
          </div>

          {/* Payment & Delivery */}
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Payment & Delivery</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Payment Method</label>
                <select className={inputCls} value={form.paymentMethod}
                  onChange={(e) => updateForm('paymentMethod', e.target.value)}>
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Payment Status</label>
                <select className={inputCls} value={form.paymentStatus}
                  onChange={(e) => updateForm('paymentStatus', e.target.value)}>
                  <option value="">Auto (based on method)</option>
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Delivery Charge (৳)</label>
                <input type="number" min="0" className={inputCls} value={form.deliveryCharge}
                  onChange={(e) => updateForm('deliveryCharge', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className={labelCls}>Special Note</label>
            <textarea rows={2} className={inputCls} placeholder="Any special instructions…"
              value={form.specialNote} onChange={(e) => updateForm('specialNote', e.target.value)} />
          </div>

          {/* Order Total Summary */}
          <div className="bg-surface rounded-xl p-4 space-y-1.5">
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Subtotal</span><span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Delivery</span><span>৳{(parseFloat(form.deliveryCharge) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink border-t border-edge pt-1.5 mt-1.5">
              <span>Total</span><span>৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-edge px-6 py-4 flex gap-3 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-edge text-ink-muted hover:bg-surface transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={submitting ? disabledBtnStyle : brandGrad}>
            {submitting ? 'Creating…' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdated, showToast }) {
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus });
      showToast('Order status updated!');
      onUpdated({ ...order, status: newStatus });
      setNewStatus('');
    } catch { showToast('Failed to update status', 'error'); }
    finally { setUpdating(false); }
  };

  const addr = order.address;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-edge rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-edge px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {order.orderNumber}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors text-lg">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer">{order.user?.name || order.guestName || 'Guest'}</Field>
            <Field label="Phone">{order.address?.phone || order.guestPhone || '—'}</Field>
            <Field label="Total">৳{order.totalAmount}</Field>
            <Field label="Payment Method">{order.paymentMethod?.replace(/_/g, ' ')}</Field>
            <Field label="Order Status"><Badge label={order.status} colorMap={orderStatusColors} /></Field>
            <Field label="Payment Status"><Badge label={order.paymentStatus} colorMap={paymentStatusColors} /></Field>
          </div>

          {/* Delivery Address */}
          {addr && (
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Delivery Address</p>
              <div className="bg-surface rounded-xl p-3 text-sm text-ink leading-relaxed">
                {addr.street}, {addr.city}{addr.postalCode ? ` — ${addr.postalCode}` : ''}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-surface rounded-xl p-3">
                  <span className="text-sm text-ink">
                    {item.productName}
                    <span className="text-ink-muted ml-1">× {item.quantity}</span>
                  </span>
                  <span className="text-sm font-semibold text-ink">৳{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm font-bold text-ink px-3 py-2 bg-surface rounded-xl">
              <span>Total</span><span>৳{order.totalAmount}</span>
            </div>
          </div>

          {/* Stock Alert */}
          {order.hasStockAlert && order.stockAlertNote && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-red-700 mb-0.5">Stock Insufficient at Order Time</p>
                <p className="text-xs text-red-600">{order.stockAlertNote}</p>
              </div>
            </div>
          )}

          {/* Special Note */}
          {order.specialNote && (
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Special Note</p>
              <div className="bg-surface rounded-xl p-3 text-sm text-ink">{order.specialNote}</div>
            </div>
          )}

          {/* Update Status */}
          <div className="border-t border-edge pt-4">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Update Status</p>
            {order.status === 'DELIVERED' ? (
              <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-700 font-medium">Order delivered — status is final</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all">
                  <option value="">Select new status</option>
                  {STATUSES.filter((s) => s !== 'DELIVERED' || order.status !== 'SHIPPED'
                    ? true : true).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={handleStatusUpdate} disabled={!newStatus || updating}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={!newStatus || updating ? disabledBtnStyle : brandGrad}>
                  {updating ? '…' : 'Update'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const r = await api.get(`/orders?${params}`);
      setOrders(r.data.data || []);
    } catch { showToast('Failed to fetch orders', 'error'); }
    finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

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

        {/* Modals */}
        {showCreate && (
          <CreateOrderModal
            onClose={() => setShowCreate(false)}
            onCreated={fetchOrders}
            showToast={showToast}
          />
        )}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdated={(updated) => {
              setSelectedOrder(updated);
              fetchOrders();
            }}
            showToast={showToast}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Orders</h2>
            <p className="text-sm text-ink-muted mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={brandGrad}>
            + New Order
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-base pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search by order #, name, phone, transaction ID…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter('')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={statusFilter === '' ? activeTabStyle : inactiveTabStyle}>
              All
            </button>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={statusFilter === s ? activeTabStyle : inactiveTabStyle}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-edge rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead style={tableHeadStyle}>
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
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-edge rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="text-ink-muted text-sm">
                      {search ? `No orders matching "${search}"` : 'No orders found'}
                    </div>
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className={`${tableRow} ${order.hasStockAlert ? 'bg-red-50/40' : ''}`}>
                  <td className={`${tableCell} font-mono text-xs`}>
                    <div className="flex items-center gap-1.5">
                      {order.hasStockAlert && (
                        <span title={order.stockAlertNote} className="text-red-500 text-base leading-none shrink-0">⚠</span>
                      )}
                      <span className="font-semibold text-ink">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className={tableCell}>{order.user?.name || order.guestName || 'Guest'}</td>
                  <td className={`${tableCell} font-semibold`}>৳{order.totalAmount}</td>
                  <td className={tableCell}><Badge label={order.paymentStatus} colorMap={paymentStatusColors} /></td>
                  <td className={tableCell}><Badge label={order.status} colorMap={orderStatusColors} /></td>
                  <td className={`${tableCell} text-ink-muted`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className={tableCell}>
                    <button onClick={() => setSelectedOrder(order)} className={btn.ghost}>
                      View
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
