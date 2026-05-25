import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaEye, FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const response = await api.get(url);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await api.patch(`/orders/${selectedOrder.id}/status`, { status: newStatus });
      setSuccess('Order status updated!');
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      fetchOrders();
      setNewStatus('');
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Order Detail Modal */}
        {showDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Order {selectedOrder.orderNumber}</h3>
                <button onClick={() => setShowDetail(false)} className="text-2xl">✕</button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Customer</p>
                  <p className="font-bold">{selectedOrder.user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className={`px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-bold">৳{selectedOrder.totalAmount}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className="font-bold">{selectedOrder.paymentStatus}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="font-bold mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>৳{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <div className="mb-6 border-t pt-6">
                <h4 className="font-bold mb-3">Update Status</h4>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded transition"
                  >
                    Update
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowDetail(false)}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Order #</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Customer</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Total</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Status</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Payment</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Date</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{order.user?.name}</td>
                    <td className="px-6 py-4 font-bold">৳{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.paymentStatus}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetail(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        <FaEye />
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
