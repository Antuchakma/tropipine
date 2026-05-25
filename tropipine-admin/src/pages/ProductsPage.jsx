import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    basePrice: '',
    unit: 'kg',
    stockQty: '',
    isFeatured: false,
    isBestSeller: false,
    isExclusive: false,
    exclusiveLabel: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=100');
      setProducts(response.data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, formData);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        setSuccess('Product created successfully!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        basePrice: '',
        unit: 'kg',
        stockQty: '',
        isFeatured: false,
        isBestSeller: false,
        isExclusive: false,
        exclusiveLabel: '',
      });
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        setSuccess('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                categoryId: '',
                basePrice: '',
                unit: 'kg',
                stockQty: '',
                isFeatured: false,
                isBestSeller: false,
                isExclusive: false,
                exclusiveLabel: '',
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                name="basePrice"
                placeholder="Base Price"
                value={formData.basePrice}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
              ></textarea>
              <input
                type="number"
                name="stockQty"
                placeholder="Stock Quantity"
                value={formData.stockQty}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="kg">kg</option>
                <option value="piece">piece</option>
                <option value="dozen">dozen</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span>Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span>Best Seller</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isExclusive"
                  checked={formData.isExclusive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span>Exclusive</span>
              </label>
              {formData.isExclusive && (
                <input
                  type="text"
                  name="exclusiveLabel"
                  placeholder="Exclusive Label (e.g., Haribhanga)"
                  value={formData.exclusiveLabel}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              )}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingId ? 'Update' : 'Create'} Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Name</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Price</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Stock</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Flags</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">৳{product.basePrice}</td>
                    <td className="px-6 py-4 text-gray-600">{product.stockQty}</td>
                    <td className="px-6 py-4 text-sm">
                      {product.isFeatured && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">Featured</span>}
                      {product.isBestSeller && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-1">Best Seller</span>}
                      {product.isExclusive && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Exclusive</span>}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
