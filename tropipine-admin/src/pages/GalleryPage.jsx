import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card } from '../utils/ui';

const CATEGORIES = ['FARM', 'PACKAGING', 'DELIVERY', 'STORAGE', 'TEAM'];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('FARM');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const r = await api.get('/gallery');
      setImages(r.data.data || []);
    } catch { showToast('Failed to load gallery', 'error'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { showToast('Please select a file', 'error'); return; }
    const fd = new FormData();
    fd.append('image', selectedFile);
    fd.append('caption', caption);
    fd.append('category', category);
    try {
      setUploading(true);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Image uploaded!');
      setSelectedFile(null);
      setCaption('');
      fetchGallery();
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      showToast('Image deleted');
      fetchGallery();
    } catch { showToast('Failed to delete', 'error'); }
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

        <div>
          <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h2>
          <p className="text-sm text-ink-muted mt-0.5">{images.length} images · Farm, packaging and delivery photos</p>
        </div>

        {/* Upload form */}
        <div className={`${card} p-7`}>
          <h3 className="font-bold text-ink mb-5" style={{ fontFamily: 'var(--font-display)' }}>Upload New Image</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-edge rounded-2xl p-10 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all group">
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-2xl mb-2">📎</p>
                  <p className="font-semibold text-ink text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-ink-muted mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</p>
                  <p className="font-semibold text-ink text-sm">Click to select image</p>
                  <p className="text-xs text-ink-muted mt-1">PNG, JPG, WebP · Max 5MB</p>
                </div>
              )}
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Caption</label>
                <input
                  type="text"
                  placeholder="Optional caption…"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className={`${btn.primary} disabled:opacity-50`}
              style={!uploading && selectedFile ? brandGrad : { background: '#E8E8F0', color: '#9CA3AF', boxShadow: 'none' }}
            >
              {uploading ? '⏳ Uploading…' : '⬆ Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery grid */}
        <div className={card}>
          <div className="p-6 border-b border-edge">
            <h3 className="font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Gallery Images</h3>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-edge animate-pulse">
                  <div className="h-44 bg-edge" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-edge rounded w-2/3" />
                    <div className="h-3 bg-edge rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-ink-muted text-sm">No images yet</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
              {images.map((img) => (
                <div key={img.id} className="rounded-2xl overflow-hidden border border-edge group bg-white hover:shadow-lg transition-shadow">
                  <div className="relative h-44 overflow-hidden bg-surface">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-ink truncate">{img.caption || 'Untitled'}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
