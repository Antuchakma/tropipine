import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to fetch coupons');
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
        await api.patch(`/coupons/${editingId}`, formData);
        setSuccess('Coupon updated successfully!');
      } else {
        await api.post('/coupons', formData);
        setSuccess('Coupon created successfully!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        code: '',
        type: 'PERCENTAGE',
        value: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: '',
        perUserLimit: 1,
      });
      fetchCoupons();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving coupon');
    }
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/coupons/${id}`);
        setSuccess('Coupon deleted successfully!');
        fetchCoupons();
      } catch (error) {
        setError('Failed to delete coupon');
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      setSuccess(`Coupon ${currentStatus ? 'disabled' : 'enabled'}!`);
      fetchCoupons();
    } catch (error) {
      setError('Failed to toggle coupon');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Coupon Management</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                code: '',
                type: 'PERCENTAGE',
                value: '',
                minOrderAmount: '',
                maxDiscount: '',
                usageLimit: '',
                perUserLimit: 1,
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaPlus /> Add Coupon
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? 'Edit Coupon' : 'Add New Coupon'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="code"
                placeholder="Coupon Code (e.g., SUMMER20)"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2 uppercase"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
              <input
                type="number"
                name="value"
                placeholder={formData.type === 'PERCENTAGE' ? 'Discount % (e.g., 20)' : 'Discount Amount (e.g., 100)'}
                value={formData.value}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                name="minOrderAmount"
                placeholder="Minimum Order Amount"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                name="maxDiscount"
                placeholder="Max Discount (for percentage)"
                value={formData.maxDiscount}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                name="usageLimit"
                placeholder="Total Usage Limit"
                value={formData.usageLimit}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                name="perUserLimit"
                placeholder="Per User Limit"
                value={formData.perUserLimit}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingId ? 'Update' : 'Create'} Coupon
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

        {/* Coupons Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Code</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Type</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Value</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Usage</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Status</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">{coupon.code}</td>
                    <td className="px-6 py-4 text-gray-600">{coupon.type}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `৳${coupon.value}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{coupon.usedCount} / {coupon.usageLimit || '∞'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleToggle(coupon.id, coupon.isActive)}
                        className={`${coupon.isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded transition`}
                      >
                        {coupon.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
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
