import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import api from '../services/api'
import { usePageLoading } from '../context/LoadingContext'

const STATUS_STYLE = {
  CONFIRMED:  'text-grove',
  DELIVERED:  'text-grove',
  PENDING:    'text-clay',
  PROCESSING: 'text-earth',
  SHIPPED:    'text-earth',
  CANCELLED:  'text-clay/50',
  REFUNDED:   'text-clay/50',
}

export default function MyOrders() {
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [filterMonth, setFilterMonth] = useState('')
  const setDataLoading = usePageLoading()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setDataLoading(true)
    api.get('/orders/my-orders')
      .then((r) => setOrders(r.data.orders || r.data.items || []))
      .catch(() => {})
      .finally(() => { setLoading(false); setDataLoading(false) })
  }, [user, navigate])

  const sorted = [...orders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'amount_desc') return (b.totalAmount || 0) - (a.totalAmount || 0)
    if (sortBy === 'amount_asc') return (a.totalAmount || 0) - (b.totalAmount || 0)
    return 0
  }).filter((o) => {
    if (!filterMonth) return true
    return new Date(o.createdAt).getMonth() + 1 === parseInt(filterMonth)
  })

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-5xl mx-auto px-8 sm:px-10 py-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="label text-grove mb-2">Account</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-bark">Order History</h1>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-stone text-sm text-clay focus:outline-none focus:border-bark transition-colors cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount_desc">Highest amount</option>
            <option value="amount_asc">Lowest amount</option>
          </select>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-stone text-sm text-clay focus:outline-none focus:border-bark transition-colors cursor-pointer"
          >
            <option value="">All months</option>
            {Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
            })).map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white border border-stone animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white border border-stone p-12 text-center">
            <p className="font-display text-2xl font-semibold text-bark mb-2">No orders found</p>
            <p className="text-clay text-sm mb-6">Your order history will appear here.</p>
            <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white border border-stone p-6 cursor-pointer hover:border-clay transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="label text-clay/60">{order.orderNumber || `#${order.id?.slice(0, 8)}`}</p>
                    <p className="font-display text-xl font-semibold text-bark">৳{order.totalAmount?.toFixed(2)}</p>
                    <p className="text-xs text-clay/60">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`label text-[10px] ${STATUS_STYLE[order.status] || 'text-clay'}`}>
                      {order.status}
                    </span>
                    <svg className="text-clay/30 group-hover:text-clay transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
