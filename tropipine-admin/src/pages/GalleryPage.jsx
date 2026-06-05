import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, toastStyle, disabledBtnStyle } from '../utils/ui';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
    try {
      setUploading(true);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Image uploaded!');
      setSelectedFile(null);
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
            style={toastStyle(toast.type)}>
            {toast.msg}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h2>
          <p className="text-sm text-ink-muted mt-0.5">{images.length} images</p>
        </div>

        {/* Upload form */}
        <div className={`${card} p-7`}>
          <h3 className="font-bold text-ink mb-5" style={{ fontFamily: 'var(--font-display)' }}>Upload New Image</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-edge rounded-2xl p-10 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all group">
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-2xl mb-2">✓</p>
                  <p className="font-semibold text-ink text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-ink-muted mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-10 h-10 text-ink-faint mx-auto mb-3 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-ink text-sm">Click to select image</p>
                  <p className="text-xs text-ink-muted mt-1">PNG, JPG, WebP · Max 5MB</p>
                </div>
              )}
            </label>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className={`${btn.primary} disabled:opacity-50`}
              style={!uploading && selectedFile ? brandGrad : disabledBtnStyle}
            >
              {uploading ? 'Uploading…' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery grid */}
        <div className={card}>
          <div className="p-6 border-b border-edge">
            <h3 className="font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Gallery Images</h3>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-edge animate-pulse aspect-[4/3] bg-edge" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-ink-muted text-sm">No images yet</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {images.map((img) => (
                <div key={img.id} className="rounded-2xl overflow-hidden border border-edge group bg-white hover:shadow-lg transition-shadow aspect-[4/3] relative">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-lg"
                    >
                      Delete
                    </button>
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
