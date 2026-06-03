import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-track if orderNumber was passed in URL (from guest order confirmation)
  useEffect(() => {
    const prefilledNumber = searchParams.get('orderNumber')
    if (prefilledNumber) {
      handleTrackByNumber(prefilledNumber)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTrackByNumber = async (num) => {
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const params = new URLSearchParams({ orderNumber: num.trim() })
      const res = await api.get(`/orders/track?${params}`)
      setOrder(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim() })
      if (phone.trim()) params.set('phone', phone.trim())
      const res = await api.get(`/orders/track?${params}`)
      setOrder(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = order ? STATUSES.indexOf(order.status) : -1

  const inputClass = "w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
  const labelClass = "label text-clay/70 block mb-2"

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-2xl mx-auto px-8 sm:px-10 py-14">

        <div className="mb-10">
          <p className="label text-grove mb-3">TropiPine</p>
          <h1 className="font-display text-4xl font-semibold text-bark mb-2">Track Your Order</h1>
          <p className="text-clay text-sm">Enter your order number. Add your phone to verify a guest order.</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white border border-stone p-8 space-y-4 mb-8">
          <div>
            <label className={labelClass}>Order Number</label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="TP-20250526-1234"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Phone <span className="text-clay/40 font-sans normal-case">(for guest orders)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1234-567890"
              className={inputClass}
            />
          </div>
          {error && <p className="text-earth text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-50"
          >
            {loading ? 'Looking up…' : 'Track Order'}
          </button>
        </form>

        {order && (
          <div className="space-y-4">
            <div className="bg-white border border-stone p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="label text-grove mb-1">{order.orderNumber}</p>
                  {order.guestName && <p className="text-xs text-clay mb-0.5">{order.guestName}</p>}
                  <p className="text-xs text-clay">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className="label text-grove bg-mist border border-sage/20 px-3 py-1">{order.status}</span>
              </div>

              <div className="flex items-center gap-0">
                {STATUSES.map((status, index) => {
                  const active = index <= currentIndex
                  return (
                    <div key={status} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 flex items-center justify-center text-xs font-medium border ${
                          active ? 'bg-grove text-white border-grove' : 'bg-cream text-clay/40 border-stone'
                        }`}>
                          {index < currentIndex ? '✓' : index + 1}
                        </div>
                        <p className={`text-[9px] mt-1 tracking-wide text-center leading-tight ${
                          index === currentIndex ? 'text-bark' : active ? 'text-grove' : 'text-clay/40'
                        }`}>
                          {status}
                        </p>
                      </div>
                      {index < STATUSES.length - 1 && (
                        <div className={`flex-1 h-px mx-1.5 -mt-4 ${index < currentIndex ? 'bg-grove' : 'bg-stone'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-stone p-6">
              <p className="label text-grove mb-3">Items</p>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-clay">{item.productName} × {item.quantity}</span>
                    <span className="text-bark font-medium">৳{item.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-stone mt-3 pt-3 flex justify-between items-baseline">
                  <span className="label text-clay/60">Total</span>
                  <span className="font-display text-lg text-bark">৳{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-clay">
              Have an account?{' '}
              <Link to="/orders" className="text-bark underline underline-offset-2 hover:text-grove transition-colors">
                View full order history
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
