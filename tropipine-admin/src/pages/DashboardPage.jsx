import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    pendingPayments: 0,
    lowStockProducts: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, revenueRes, statusRes, topRes] = await Promise.all([
        api.get('/admin/overview').catch(() => ({ data: { data: {} } })),
        api.get('/analytics/revenue?period=month').catch(() => ({ data: { data: [] } })),
        api.get('/analytics/order-statuses').catch(() => ({ data: { data: [] } })),
        api.get('/analytics/top-products').catch(() => ({ data: { data: [] } })),
      ]);

      setStats(statsRes.data.data || {});
      setRevenueData(revenueRes.data.data || []);
      setOrderStatusData(statusRes.data.data || []);
      setTopProducts(topRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Revenue Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">
                      ৳{stats.todayRevenue?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats.totalOrders || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Payments Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Payments</p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.pendingPayments || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Low Stock Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Low Stock Products</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.lowStockProducts || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend (Last 30 Days)</h3>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `৳${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No data available</p>
                )}
              </div>

              {/* Order Status Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Status Distribution</h3>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No data available</p>
                )}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Best Selling Products</h3>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No data available</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
