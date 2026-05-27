import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow } from '../utils/ui';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await api.get('/products?limit=200');
      setProducts(r.data.items || []);
    } catch { showToast('Failed to fetch', 'error'); }
    finally { setLoading(false); }
  };

  const handleSaveStock = async (id) => {
    try {
      await api.patch(`/products/${id}/stock`, { stockQty: parseFloat(editStock) });
      showToast('Stock updated!');
      setEditingId(null);
      fetchProducts();
    } catch { showToast('Failed to update', 'error'); }
  };

  const filtered = products.filter((p) =>
    filter === 'out' ? p.stockQty <= 0 :
    filter === 'low' ? p.stockQty > 0 && p.stockQty <= p.lowStockThreshold :
    true
  );

  const lowCount = products.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockThreshold).length;
  const outCount = products.filter((p) => p.stockQty <= 0).length;

  const TABS = [
    { key: 'all', label: 'All Products', count: products.length },
    { key: 'low', label: 'Low Stock', count: lowCount },
    { key: 'out', label: 'Out of Stock', count: outCount },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1200px] space-y-6">

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toast.type !== 'error' ? brandGrad : { background: '#DC2626' }}>
            {toast.msg}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Inventory</h2>
          <p className="text-sm text-ink-muted mt-0.5">Manage stock levels across all products</p>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Products', val: products.length, icon: 'P', bg: '#F0F5FF', color: '#4F46E5' },
            { label: 'Low Stock', val: lowCount, icon: 'L', bg: '#FFFBEB', color: '#D97706' },
            { label: 'Out of Stock', val: outCount, icon: 'X', bg: '#FEF2F2', color: '#DC2626' },
          ].map((s) => (
            <div key={s.label} className={`${card} p-6 flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-ink-muted font-medium">{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
              style={filter === t.key ? { ...brandGrad, color: '#fff', borderColor: 'transparent' } : { background: '#fff', color: '#6B7280', borderColor: '#E8E8F0' }}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={{ background: '#FAFAF8' }}>
              <tr>
                {['Product', 'Category', 'Unit', 'Stock', 'Threshold', 'Status', 'Update'].map((h) => (
                  <th key={h} className={tableHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-edge">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-edge rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-16 text-center text-sm text-ink-muted">No products match this filter</td></tr>
              ) : filtered.map((p) => {
                const isOut = p.stockQty <= 0;
                const isLow = !isOut && p.stockQty <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className={tableRow} style={isOut ? { background: '#FEF2F2' } : isLow ? { background: '#FFFDF0' } : {}}>
                    <td className={`${tableCell} font-semibold text-ink`}>{p.name}</td>
                    <td className={`${tableCell} text-ink-muted`}>{p.category?.name || ''}</td>
                    <td className={tableCell}>{p.unit}</td>
                    <td className={tableCell}>
                      <span className={`font-bold ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-ink'}`}>
                        {p.stockQty}
                      </span>
                    </td>
                    <td className={`${tableCell} text-ink-muted`}>{p.lowStockThreshold}</td>
                    <td className={tableCell}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isOut ? 'bg-red-50 text-red-700 border-red-200' :
                        isLow ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className={tableCell}>
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-edge text-sm focus:outline-none focus:border-brand-400 text-center"
                            min="0"
                            step="0.5"
                            autoFocus
                          />
                          <button onClick={() => handleSaveStock(p.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={brandGrad}>Save</button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-edge text-ink-muted"></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(p.id); setEditStock(String(p.stockQty)); }}
                          className={btn.ghost}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
