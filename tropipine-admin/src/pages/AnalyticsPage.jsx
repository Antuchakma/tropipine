import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { card, brandGrad, activeTabStyle, inactiveTabStyle } from '../utils/ui';
import { colors } from '../theme.js';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const PERIODS = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: 'This Month' },
];

const tooltipStyle = { borderRadius: '12px', border: `1px solid ${colors.edge}` };

const overviewCards = (totalRevenue, overview) => [
  { label: 'Period Revenue',    value: `৳${totalRevenue.toLocaleString()}`,    icon: '$', ...colors.stat.brand   },
  { label: 'Total Orders',      value: overview.totalOrders || 0,              icon: '#', ...colors.stat.orders  },
  { label: 'Pending Payments',  value: overview.pendingPayments || 0,          icon: 'C', ...colors.stat.error   },
  { label: 'Low Stock Items',   value: overview.lowStockProducts || 0,         icon: 'S', ...colors.stat.warning },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/admin/overview').catch(() => ({ data: { data: {} } })),
      api.get(`/analytics/revenue?period=${period}`).catch(() => ({ data: { data: [] } })),
      api.get('/analytics/order-statuses').catch(() => ({ data: { data: [] } })),
      api.get('/analytics/top-products').catch(() => ({ data: { data: [] } })),
      api.get('/analytics/low-stock').catch(() => ({ data: { data: [] } })),
    ]).then(([o, r, s, t, l]) => {
      setOverview(o.data.data || o.data || {});
      setRevenueData(r.data.data || []);
      setOrderStatusData(s.data.data || []);
      setTopProducts(t.data.data || []);
      setLowStockProducts(l.data.data || []);
    }).finally(() => setLoading(false));
  }, [period]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const cards = overviewCards(totalRevenue, overview);

  return (
    <AdminLayout>
      <div className="max-w-[1300px] space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Analytics</h2>
            <p className="text-sm text-ink-muted mt-0.5">Business performance overview</p>
          </div>
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={period === p.value ? activeTabStyle : inactiveTabStyle}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-ink-muted">Loading analytics</div>
        ) : (
          <>
            {/* Overview cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((s) => (
                <div key={s.label} className={`${card} p-6`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: s.bg }}>{s.icon}</div>
                  <p className="text-xs text-ink-muted mb-1">{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue + Status */}
            <div className="grid lg:grid-cols-5 gap-5">
              <div className={`${card} p-6 lg:col-span-3`}>
                <h3 className="font-bold text-ink mb-1" style={{ fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
                <p className="text-xs text-ink-muted mb-5">Paid orders — {period === 'day' ? 'today' : period === 'week' ? 'last 7 days' : 'this month'}</p>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={revenueData}>
                      <defs>
                        <linearGradient id="aRevGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={colors.brand[500]} />
                          <stop offset="100%" stopColor={colors.brand[400]} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="url(#aRevGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: colors.brand[500] }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-44 text-ink-faint text-sm">No revenue data</div>
                )}
              </div>

              <div className={`${card} p-6 lg:col-span-2`}>
                <h3 className="font-bold text-ink mb-1" style={{ fontFamily: 'var(--font-display)' }}>Order Breakdown</h3>
                <p className="text-xs text-ink-muted mb-4">All orders by status</p>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="45%" outerRadius={80} innerRadius={48} dataKey="count" nameKey="name" paddingAngle={2}>
                        {orderStatusData.map((_, i) => (
                          <Cell key={i} fill={colors.chart[i % colors.chart.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-44 text-ink-faint text-sm">No data</div>
                )}
              </div>
            </div>

            {/* Top Products + Low Stock */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div className={`${card} p-6`}>
                <h3 className="font-bold text-ink mb-1" style={{ fontFamily: 'var(--font-display)' }}>Top Products</h3>
                <p className="text-xs text-ink-muted mb-5">Best-selling by units</p>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topProducts} layout="vertical" barSize={20}>
                      <defs>
                        <linearGradient id="aBarGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={colors.brand[500]} />
                          <stop offset="100%" stopColor={colors.brand[400]} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={true} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: colors.ink.faint }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: colors.ink.faint }} width={90} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Units']} />
                      <Bar dataKey="sales" fill="url(#aBarGrad)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-44 text-ink-faint text-sm">No sales data</div>
                )}
              </div>

              <div className={`${card} p-6`}>
                <h3 className="font-bold text-ink mb-1" style={{ fontFamily: 'var(--font-display)' }}>Low Stock Alerts</h3>
                <p className="text-xs text-ink-muted mb-4">Products below their threshold</p>
                {lowStockProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-44 gap-2">
                    <span className="text-4xl">✅</span>
                    <p className="text-sm font-medium text-emerald-600">All products are well stocked!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background: colors.status.PENDING.bg, border: `1px solid ${colors.status.PENDING.border}` }}>
                        <div>
                          <p className="text-sm font-semibold text-ink">{p.name}</p>
                          <p className="text-xs text-ink-muted">Threshold: {p.lowStockThreshold}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">{p.stockQty}</p>
                          <p className="text-xs text-ink-muted">{p.unit} left</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
