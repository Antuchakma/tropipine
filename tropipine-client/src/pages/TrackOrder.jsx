import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim() })
      if (email.trim()) params.set('email', email.trim())
      const res = await api.get(`/orders/track?${params}`)
      setOrder(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = order ? STATUSES.indexOf(order.status) : -1

  return (
    <div className="min-h-screen bg-surface">
      <section className="bg-white border-b border-edge">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-3">Track Order</p>
          <h1 className="font-display text-4xl font-black text-ink mb-3">Where Is My Order?</h1>
          <p className="text-ink-muted text-sm">Enter your order number from the confirmation email or checkout screen.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleTrack} className="bg-white border border-edge rounded-3xl p-8 space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Order number *</label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="TP-20250526-1234"
              required
              className="w-full px-4 py-3 rounded-2xl border border-edge focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Email (optional, for verification)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-2xl border border-edge focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl gradient-brand text-white font-semibold disabled:opacity-50">
            {loading ? 'Looking up...' : 'Track Order'}
          </button>
        </form>

        {order && (
          <div className="space-y-6">
            <div className="bg-white border border-edge rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">{order.orderNumber}</h2>
                  <p className="text-sm text-ink-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-brand-50 text-brand-700 border border-brand-200">{order.status}</span>
              </div>

              <div className="space-y-4">
                {STATUSES.map((status, index) => {
                  const active = index <= currentIndex
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'gradient-brand text-white' : 'bg-surface border border-edge text-ink-faint'}`}>
                        {index + 1}
                      </div>
                      <p className={`text-sm font-medium ${active ? 'text-ink' : 'text-ink-faint'}`}>{status}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-edge rounded-3xl p-8">
              <h3 className="font-bold text-ink mb-4">Items</h3>
              <ul className="space-y-2 text-sm text-ink-muted">
                {order.items?.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.productName}  {item.quantity}</span>
                    <span className="text-ink font-medium">{item.subtotal?.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-edge mt-4 pt-4 flex justify-between font-bold text-ink">
                <span>Total</span>
                <span>{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-center text-sm text-ink-muted">
              Logged in? <Link to="/orders" className="text-brand-600 font-semibold hover:underline">View full order history</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
