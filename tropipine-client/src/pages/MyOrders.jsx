import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import api from '../services/api'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Highest amount' },
  { value: 'amount_asc', label: 'Lowest amount' },
]

const MONTHS = [
  { value: '', label: 'All months' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
  })),
]

export default function MyOrders() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [productFilter, setProductFilter] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const params = new URLSearchParams({ sort })
    if (productFilter.trim()) params.set('product', productFilter.trim())
    if (month && year) {
      params.set('month', month)
      params.set('year', year)
    }

    setLoading(true)
    api
      .get(`/orders/my-orders?${params}`)
      .then((r) => setOrders(r.data.orders || r.data.items || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user, navigate, productFilter, month, year, sort])

  const years = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-20 flex items-center justify-center">
          <div className="max-w-2xl space-y-4 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">Account</p>
              <h1 className="font-display text-4xl font-black text-white">My Orders</h1>
              <p className="text-white/80 text-sm mt-2">View and track your order history</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-surface py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white border border-edge rounded-3xl p-6 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">Filter by product</label>
            <input
              type="text"
              placeholder="e.g. Mango"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm">
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm">
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-edge text-sm">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-ink-muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-edge rounded-3xl">
            <p className="text-ink-muted mb-4">No orders match your filters.</p>
            <Link to="/shop" className="text-brand-600 font-semibold hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-edge rounded-3xl p-6 hover:shadow-card-hover transition">
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-brand-600 font-semibold">{order.orderNumber || order.id}</p>
                    <p className="font-display text-2xl font-black text-ink">৳{order.totalAmount?.toFixed(2)}</p>
                    <p className="text-xs text-ink-muted mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-surface border border-edge text-ink">{order.status}</span>
                    <p className="text-xs text-ink-muted">{order.paymentStatus}</p>
                  </div>
                </div>

                <ul className="text-sm text-ink-muted mb-4 space-y-1">
                  {order.items?.map((item) => (
                    <li key={item.id}>{item.productName} × {item.quantity}</li>
                  ))}
                </ul>

                {order.address && (
                  <p className="text-sm text-ink-muted mb-4">
                    {order.address.street}, {order.address.city}
                  </p>
                )}

                <Link to={`/orders/${order.id}`} className="text-brand-600 font-semibold text-sm hover:underline">
                  Track this order →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
