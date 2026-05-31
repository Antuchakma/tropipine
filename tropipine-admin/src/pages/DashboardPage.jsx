import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { colors, gradients, shadows } from '../theme.js';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const statCards = (s) => [
  {
    label: "Today's Revenue",
    value: `৳${(s.todayRevenue || 0).toLocaleString()}`,
    sub: 'Paid orders today',
    icon: '$',
    ...colors.stat.brand,
  },
  {
    label: 'Total Orders',
    value: s.totalOrders || 0,
    sub: 'All time',
    icon: '#',
    ...colors.stat.orders,
  },
  {
    label: 'Pending Payments',
    value: s.pendingPayments || 0,
    sub: 'Need verification',
    icon: 'C',
    color: s.pendingPayments > 0 ? colors.stat.error.color : colors.stat.ok.color,
    bg:    s.pendingPayments > 0 ? colors.stat.error.bg    : colors.stat.ok.bg,
    urgent: s.pendingPayments > 0,
    link: '/payments',
  },
  {
    label: 'Low Stock Alerts',
    value: s.lowStockProducts || 0,
    sub: 'Below threshold',
    icon: 'S',
    ...colors.stat.warning,
    link: '/inventory',
  },
];

const tooltipStyle = { borderRadius: '12px', border: `1px solid ${colors.edge}`, boxShadow: shadows.tooltip };

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/overview').catch(() => ({ data: { data: {} } })),
      api.get('/analytics/revenue?period=month').catch(() => ({ data: { data: [] } })),
      api.get('/analytics/order-statuses').catch(() => ({ data: { data: [] } })),
      api.get('/analytics/top-products').catch(() => ({ data: { data: [] } })),
    ]).then(([s, r, os, tp]) => {
      setStats(s.data.data || s.data || {});
      setRevenueData(r.data.data || []);
      setOrderStatusData(os.data.data || []);
      setTopProducts(tp.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const cards = statCards(stats);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1400px]">

        {/* Greeting */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
            </h2>
            <p className="text-sm text-ink-muted mt-1">Here's what's happening with TropiPine today.</p>
          </div>
          <Link
            to="/orders"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: gradients.brand, boxShadow: shadows.brand }}
          >
            View All Orders
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-edge p-6 animate-pulse">
                <div className="h-4 bg-edge rounded w-2/3 mb-4" />
                <div className="h-8 bg-edge rounded w-1/2 mb-2" />
                <div className="h-3 bg-edge rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl border border-edge p-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200"
                >
                  {card.urgent && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-transform group-hover:scale-105 duration-200"
                    style={{ background: card.bg }}
                  >
                    {card.icon}
                  </div>
                  <p className="text-xs text-ink-muted font-medium mb-1">{card.label}</p>
                  <p
                    className="text-3xl font-bold leading-none mb-1"
                    style={{ color: card.color, fontFamily: 'var(--font-display)' }}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs text-ink-faint">{card.sub}</p>
                  {card.link && (
                    <Link to={card.link} className="absolute inset-0" aria-label={card.label} />
                  )}
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3 bg-white rounded-2xl border border-edge p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
                    <p className="text-xs text-ink-muted mt-0.5">This month's paid orders</p>
                  </div>
                  <span className="text-xs text-ink-faint">Last 30 days</span>
                </div>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={colors.brand[500]} />
                          <stop offset="100%" stopColor={colors.brand[400]} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="url(#revenueGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: colors.brand[500] }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-ink-faint text-sm">No revenue data yet</div>
                )}
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-edge p-6">
                <h3 className="font-bold text-ink mb-1" style={{ fontFamily: 'var(--font-display)' }}>Order Status</h3>
                <p className="text-xs text-ink-muted mb-4">Distribution of all orders</p>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="45%" outerRadius={75} innerRadius={45} dataKey="count" nameKey="name" paddingAngle={3}>
                        {orderStatusData.map((_, i) => (
                          <Cell key={i} fill={colors.chart[i % colors.chart.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-ink-faint text-sm">No order data</div>
                )}
              </div>
            </div>

            {/* Top Products Bar */}
            <div className="bg-white rounded-2xl border border-edge p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Top Selling Products</h3>
                  <p className="text-xs text-ink-muted mt-0.5">By units sold (all time)</p>
                </div>
              </div>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topProducts} barSize={36}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.brand[500]} />
                        <stop offset="100%" stopColor={colors.brand[400]} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} horizontal={true} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Units Sold']} />
                    <Bar dataKey="sales" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-ink-faint text-sm">No sales data</div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { to: '/products', icon: '+', label: 'Add New Product',   desc: 'Create a product listing',             ...colors.stat.brand  },
                { to: '/payments', icon: 'V', label: 'Verify Payments',   desc: `${stats.pendingPayments || 0} pending`, ...colors.stat.orders },
                { to: '/inventory', icon: 'I', label: 'Manage Inventory', desc: `${stats.lowStockProducts || 0} low stock`, bg: colors.stat.ok.bg, color: colors.stat.ok.color },
              ].map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="bg-white rounded-2xl border border-edge p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform" style={{ background: a.bg }}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.label}</p>
                    <p className="text-xs text-ink-muted">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
