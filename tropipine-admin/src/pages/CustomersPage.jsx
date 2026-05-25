import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow } from '../utils/ui';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `/admin/users?search=${encodeURIComponent(q)}` : '/admin/users';
      const r = await api.get(url);
      setCustomers(r.data.data || []);
      setTotal(r.data.total || 0);
    } catch { showToast('Failed to load customers', 'error'); }
    finally { setLoading(false); }
  };

  const handleViewDetail = async (id) => {
    try {
      const r = await api.get(`/admin/users/${id}`);
      setSelectedCustomer(r.data.data);
    } catch { showToast('Failed to load details', 'error'); }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      showToast(`Customer ${current ? 'deactivated' : 'activated'}`);
      fetchCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer((p) => ({ ...p, isActive: !p.isActive }));
    } catch { showToast('Failed', 'error'); }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1200px] space-y-6">

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toast.type !== 'error' ? brandGrad : { background: '#DC2626' }}>
            {toast.msg}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Customers</h2>
            <p className="text-sm text-ink-muted mt-0.5">{total} registered customers</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); fetchCustomers(search); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 w-64 transition"
            />
            <button type="submit" className={btn.primary} style={brandGrad}>Search</button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); fetchCustomers(''); }} className={btn.secondary}>Clear</button>
            )}
          </form>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${card} p-7 max-w-lg w-full shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={brandGrad}>
                    {selectedCustomer.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{selectedCustomer.name}</p>
                    <p className="text-xs text-ink-muted">{selectedCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 rounded-lg bg-surface text-ink-muted flex items-center justify-center text-lg">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Phone', val: selectedCustomer.phone || '—' },
                  { label: 'Joined', val: new Date(selectedCustomer.createdAt).toLocaleDateString() },
                  { label: 'Total Orders', val: selectedCustomer.orders?.length || 0 },
                  { label: 'Status', val: (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${selectedCustomer.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {selectedCustomer.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  )},
                ].map(({ label, val }) => (
                  <div key={label} className="bg-surface rounded-xl p-3">
                    <p className="text-xs text-ink-muted mb-1">{label}</p>
                    <div className="text-sm font-semibold text-ink">{val}</div>
                  </div>
                ))}
              </div>

              {selectedCustomer.orders?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Recent Orders</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedCustomer.orders.map((o) => (
                      <div key={o.id} className="flex justify-between items-center bg-surface rounded-xl px-3 py-2.5">
                        <span className="text-sm font-medium text-ink">{o.orderNumber}</span>
                        <span className="text-sm font-semibold text-ink">৳{o.totalAmount}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                          o.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                          'bg-amber-50 text-amber-700'
                        }`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleToggleActive(selectedCustomer.id, selectedCustomer.isActive)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all"
                style={selectedCustomer.isActive ? { background: '#FEF2F2', color: '#DC2626', borderColor: '#FEE2E2' } : { ...brandGrad, borderColor: 'transparent', color: '#fff' }}
              >
                {selectedCustomer.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        )}

        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={{ background: '#FAFAF8' }}>
              <tr>
                {['Customer', 'Email', 'Orders', 'Status', 'Joined', ''].map((h) => (
                  <th key={h} className={tableHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-edge">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-edge rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-16 text-center text-sm text-ink-muted">No customers found</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className={tableRow}>
                  <td className={`${tableCell} font-semibold text-ink`}>{c.name}</td>
                  <td className={`${tableCell} text-ink-muted text-sm`}>{c.email}</td>
                  <td className={tableCell}>{c._count?.orders || 0}</td>
                  <td className={tableCell}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={`${tableCell} text-ink-muted`}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className={tableCell}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewDetail(c.id)} className={btn.ghost}>View</button>
                      <button
                        onClick={() => handleToggleActive(c.id, c.isActive)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-edge bg-white text-ink-muted hover:text-ink hover:border-gray-300 transition-colors"
                      >
                        {c.isActive ? 'Disable' : 'Enable'}
                      </button>
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
