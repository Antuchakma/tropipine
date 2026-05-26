import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, tableHead, tableCell, tableRow } from '../utils/ui';

const FRUIT_TYPES = ['Mango', 'Pineapple', 'Lychee', 'Jackfruit', 'Papaya', 'Banana', 'Seasonal', 'Other'];

const emptyForm = {
  name: '', description: '', categoryId: '', basePrice: '',
  unit: 'kg', stockQty: '', fruitType: '', variant: '',
  isFeatured: false, isBestSeller: false,
  isExclusive: false, exclusiveLabel: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await api.get('/products?limit=100');
      setProducts(r.data.items || []);
    } catch { showToast('Failed to fetch products', 'error'); }
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setFormData({ ...emptyForm, ...product });
    setEditingId(product.id);
    setImageFile(null);
    setImagePreview(product.images?.[0]?.url || null);
    setShowForm(true);
  };

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (typeof val === 'boolean') fd.append(key, String(val));
      else if (val !== '' && val != null) fd.append(key, val);
    });
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, formData);
        if (imageFile) {
          const fd = new FormData();
          fd.append('image', imageFile);
          await api.post(`/products/${editingId}/images`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        showToast('Product updated!');
      } else {
        await api.post('/products', buildFormData(), {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) { showToast(err.response?.data?.message || 'Error saving product', 'error'); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted');
      fetchProducts();
    } catch { showToast('Failed to delete', 'error'); }
  };

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
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Products</h2>
            <p className="text-sm text-ink-muted mt-0.5">{products.length} products in catalogue</p>
          </div>
          <button onClick={openAdd} className={btn.primary} style={brandGrad}>
            + Add Product
          </button>
        </div>

        {/* Form Panel */}
        {showForm && (
          <div className={`${card} p-7`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                {editingId ? 'Edit Product' : 'New Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-surface text-ink-muted hover:text-ink flex items-center justify-center text-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Product Name *', placeholder: 'e.g. Haribhanga Mango', required: true },
                { name: 'basePrice', label: 'Base Price (৳) *', placeholder: '0.00', type: 'number', required: true },
                { name: 'stockQty', label: 'Stock Quantity *', placeholder: '0', type: 'number', required: true },
              ].map(({ name, label, placeholder, type = 'text', required }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-ink-muted mb-1.5">{label}</label>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required={required}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Fruit Type</label>
                <select name="fruitType" value={formData.fruitType} onChange={handleInputChange} className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition">
                  <option value="">Select type</option>
                  {FRUIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Variant</label>
                <input type="text" name="variant" placeholder="e.g. Haribhanga, Gopalbhog" value={formData.variant} onChange={handleInputChange} className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-ink-muted" />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-32 object-cover rounded-xl border border-edge" />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                >
                  <option value="">No category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                >
                  <option value="kg">kg</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="Product description…"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 resize-none transition"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-6">
                {[
                  { name: 'isFeatured', label: 'Featured' },
                  { name: 'isBestSeller', label: 'Best Seller' },
                  { name: 'isExclusive', label: 'Exclusive' },
                ].map(({ name, label }) => (
                  <label key={name} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded accent-brand-500"
                    />
                    <span className="text-sm font-medium text-ink">{label}</span>
                  </label>
                ))}
              </div>

              {formData.isExclusive && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-muted mb-1.5">Exclusive Label</label>
                  <input
                    type="text"
                    name="exclusiveLabel"
                    placeholder="e.g. Haribhanga, Gopalbhog"
                    value={formData.exclusiveLabel}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                  />
                </div>
              )}

              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" className={btn.primary} style={brandGrad}>
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={btn.secondary}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className={`${card} overflow-hidden`}>
          <table className="w-full">
            <thead style={{ background: '#FAFAF8' }}>
              <tr>
                {['Product', 'Type / Variant', 'Price', 'Stock', 'Flags', ''].map((h) => (
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
              ) : products.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-16 text-center text-sm text-ink-muted">No products yet</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className={tableRow}>
                  <td className={`${tableCell} font-semibold text-ink max-w-[200px] truncate`}>{p.name}</td>
                  <td className={`${tableCell} text-ink-muted text-xs`}>
                    {p.fruitType || '—'}{p.variant ? ` · ${p.variant}` : ''}
                  </td>
                  <td className={tableCell}>
                    <span className="font-semibold text-ink">৳{p.finalPrice || p.basePrice}</span>
                    {p.discountPercent > 0 && (
                      <span className="ml-2 text-xs text-ink-faint line-through">৳{p.basePrice}</span>
                    )}
                  </td>
                  <td className={tableCell}>
                    <span className={`font-semibold ${p.stockQty <= 0 ? 'text-red-500' : p.stockQty <= p.lowStockThreshold ? 'text-orange-500' : 'text-ink'}`}>
                      {p.stockQty} {p.unit}
                    </span>
                  </td>
                  <td className={tableCell}>
                    <div className="flex flex-wrap gap-1.5">
                      {p.isFeatured && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">Featured</span>}
                      {p.isBestSeller && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Best Seller</span>}
                      {p.isExclusive && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">✦ Exclusive</span>}
                    </div>
                  </td>
                  <td className={`${tableCell} text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className={btn.ghost}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">Delete</button>
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
