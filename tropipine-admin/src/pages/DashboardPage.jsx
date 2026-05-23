import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    pendingPayments: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today's Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ৳{stats.todayRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            {/* Stat Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.totalOrders || 0}
                  </p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>

            {/* Stat Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Payments</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.pendingPayments || 0}
                  </p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>

            {/* Stat Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Low Stock Products</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.lowStockProducts || 0}
                  </p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition">
            ➕ Add New Product
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition">
            ✅ Verify Payments
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
