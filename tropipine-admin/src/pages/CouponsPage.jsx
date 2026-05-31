import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow, toastStyle, tableHeadStyle } from '../utils/ui';

const emptyForm = {
  code: '', type: 'PERCENTAGE', value: '',
  minOrderAmount: '', maxDiscount: '', usageLimit: '', perUserLimit: 1,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const r = await api.get('/coupons');
      setCoupons(r.data.data || []);
    } catch { showToast('Failed to load coupons', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/coupons/${editingId}`, formData);
        showToast('Coupon updated!');
      } else {
        await api.post('/coupons', formData);
        showToast('Coupon created!');
      }
      setShowForm(false);
      setEditingId(null);
      fetchCoupons();
    } catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      showToast(`Coupon ${current ? 'disabled' : 'enabled'}`);
      fetchCoupons();
    } catch { showToast('Toggle failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      showToast('Coupon deleted');
      fetchCoupons();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const openEdit = (coupon) => {
    setFormData({ ...emptyForm, ...coupon });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-[1100px] space-y-6">

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toastStyle(toast.type)}>
            {toast.msg}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Coupons</h2>
            <p className="text-sm text-ink-muted mt-0.5">{coupons.length} coupons total</p>
          </div>
          <button onClick={() => { setFormData(emptyForm); setEditingId(null); setShowForm(true); }} className={btn.primary} style={brandGrad}>
            + New Coupon
          </button>
        </div>

        {showForm && (
          <div className={`${card} p-7`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                {editingId ? 'Edit Coupon' : 'New Coupon'}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-surface text-ink-muted flex items-center justify-center text-lg"></button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  placeholder="SUMMER20"
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm font-mono uppercase focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Discount Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ()</option>
                </select>
              </div>
              {[
                { name: 'value', label: formData.type === 'PERCENTAGE' ? 'Discount % *' : 'Discount Amount  *', placeholder: formData.type === 'PERCENTAGE' ? '20' : '100', required: true },
                { name: 'minOrderAmount', label: 'Min Order Amount', placeholder: '500' },
                { name: 'maxDiscount', label: 'Max Discount Cap ()', placeholder: 'No cap' },
                { name: 'usageLimit', label: 'Total Usage Limit', placeholder: 'Unlimited' },
                { name: 'perUserLimit', label: 'Per-User Limit', placeholder: '1' },
              ].map(({ name, label, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-ink-muted mb-1.5">{label}</label>
                  <input
                    type="number"
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                    required={required}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                  />
                </div>
              ))}
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" className={btn.primary} style={brandGrad}>
                  {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={btn.secondary}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={tableHeadStyle}>
              <tr>
                {['Code', 'Type', 'Discount', 'Min Order', 'Used / Limit', 'Status', ''].map((h) => (
                  <th key={h} className={tableHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-edge">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-edge rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-16 text-center text-sm text-ink-muted">No coupons yet</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className={tableRow}>
                  <td className={`${tableCell} font-mono font-bold text-ink`}>{c.code}</td>
                  <td className={`${tableCell} text-ink-muted`}>{c.type}</td>
                  <td className={`${tableCell} font-semibold`}>{c.type === 'PERCENTAGE' ? `${c.value}%` : `${c.value}`}</td>
                  <td className={tableCell}>{c.minOrderAmount > 0 ? `${c.minOrderAmount}` : ''}</td>
                  <td className={tableCell}>
                    <span className="font-semibold text-ink">{c.usedCount}</span>
                    <span className="text-ink-muted"> / {c.usageLimit || ''}</span>
                  </td>
                  <td className={tableCell}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-surface text-ink-faint border-edge'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={tableCell}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(c.id, c.isActive)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-edge bg-white text-ink-muted hover:text-ink hover:border-gray-300 transition-colors"
                      >
                        {c.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => openEdit(c)} className={btn.ghost}>Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">Del</button>
                    </div>
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
