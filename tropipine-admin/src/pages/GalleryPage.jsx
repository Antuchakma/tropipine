import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('FARM');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['FARM', 'PACKAGING', 'DELIVERY', 'STORAGE', 'TEAM'];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery');
      setImages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);
    formData.append('category', category);

    try {
      setUploading(true);
      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Image uploaded successfully!');
      setSelectedFile(null);
      setCaption('');
      setCategory('FARM');
      fetchGallery();
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/gallery/${id}`);
        setSuccess('Image deleted successfully!');
        fetchGallery();
      } catch (error) {
        setError('Failed to delete image');
      }
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Gallery Management</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Upload New Image</h3>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-gray-600">
                  {selectedFile ? (
                    <>
                      <p className="font-bold">{selectedFile.name}</p>
                      <p className="text-sm">Click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl mb-2">📸</p>
                      <p>Click to select image or drag and drop</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <input
              type="text"
              placeholder="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="md:col-span-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <FaPlus /> {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Gallery Images</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No images in gallery</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold text-gray-800 truncate">{image.caption || 'Untitled'}</p>
                    <p className="text-sm text-gray-600 mb-3">{image.category}</p>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
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
