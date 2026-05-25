import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_VERIFICATION');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/payments?status=${statusFilter}` : '/payments';
      const response = await api.get(url);
      setPayments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId) => {
    try {
      await api.patch(`/payments/${paymentId}/verify`);
      setSuccess('Payment verified successfully!');
      fetchPayments();
      setShowDetail(false);
    } catch (error) {
      setError('Failed to verify payment');
    }
  };

  const handleReject = async (paymentId) => {
    if (!rejectionNote.trim()) {
      setError('Rejection note is required');
      return;
    }
    try {
      await api.patch(`/payments/${paymentId}/reject`, { note: rejectionNote });
      setSuccess('Payment rejected!');
      fetchPayments();
      setShowDetail(false);
      setRejectionNote('');
    } catch (error) {
      setError('Failed to reject payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      UNPAID: 'bg-red-100 text-red-800',
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Payment Verification</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="PAID">Verified</option>
            <option value="FAILED">Failed</option>
            <option value="">All</option>
          </select>
        </div>

        {/* Payment Detail Modal */}
        {showDetail && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Payment Details</h3>
                <button onClick={() => setShowDetail(false)} className="text-2xl">✕</button>
              </div>

              {/* Payment Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Order Number</p>
                  <p className="font-bold">{selectedPayment.order?.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p className="font-bold">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sender Number</p>
                  <p className="font-bold">{selectedPayment.senderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Transaction ID</p>
                  <p className="font-bold">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="font-bold text-lg">৳{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className={`px-3 py-1 rounded ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedPayment.status === 'PENDING_VERIFICATION' && (
                <div className="mb-6 border-t pt-6">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleVerify(selectedPayment.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition"
                    >
                      <FaCheck /> Verify Payment
                    </button>
                  </div>

                  <div>
                    <p className="font-bold mb-2">Reject Payment:</p>
                    <textarea
                      placeholder="Enter rejection reason..."
                      value={rejectionNote}
                      onChange={(e) => setRejectionNote(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2 h-24"
                    ></textarea>
                    <button
                      onClick={() => handleReject(selectedPayment.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition"
                    >
                      <FaTimes /> Reject Payment
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowDetail(false);
                  setRejectionNote('');
                }}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Order #</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Method</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Amount</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Transaction ID</th>
                <th className="px-6 py-3 text-left text-gray-700 font-bold">Status</th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-800">{payment.order?.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4 font-bold">৳{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.transactionId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
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
