import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/my-orders/${orderId}`)
        setOrder(response.data.data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-edge border-t-brand-500 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <p className="text-ink-muted">Order not found</p>
        <Link to="/orders" className="text-brand-600 font-semibold">Back to orders</Link>
      </div>
    )
  }

  const currentIndex = STATUSES.indexOf(order.status)

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-edge">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button type="button" onClick={() => navigate('/orders')} className="text-brand-600 text-sm font-medium hover:underline mb-4">
             Back to Orders
          </button>
          <h1 className="font-display text-3xl font-black text-ink">
            Order <span className="text-brand-600">{order.orderNumber || order.id}</span>
          </h1>
          <p className="text-ink-muted text-sm mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white border border-edge rounded-3xl p-8">
          <h2 className="text-xl font-bold text-ink mb-6">Delivery Status</h2>
          <div className="space-y-5">
            {STATUSES.map((status, index) => {
              const active = index <= currentIndex
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active ? 'gradient-brand text-white' : 'bg-surface border border-edge text-ink-faint'}`}>
                    {index + 1}
                  </div>
                  <p className={`font-medium text-sm ${active ? 'text-ink' : 'text-ink-faint'}`}>{status}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white border border-edge rounded-3xl p-8">
          <h2 className="text-xl font-bold text-ink mb-5">Items</h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-ink-muted">
                <span>{item.productName}  {item.quantity}</span>
                <span className="font-medium text-ink">{item.subtotal?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {order.address && (
          <div className="bg-white border border-edge rounded-3xl p-6">
            <h3 className="font-semibold text-ink mb-2">Delivery Address</h3>
            <p className="text-sm text-ink-muted">{order.address.street}, {order.address.city}</p>
            <p className="text-sm text-ink-muted mt-1">{order.address.phone}</p>
          </div>
        )}

        <div className="bg-white border border-edge rounded-3xl p-8">
          <div className="flex justify-between text-lg font-bold text-ink border-t border-edge pt-4">
            <span>Total</span>
            <span>{order.totalAmount?.toFixed(2)}</span>
          </div>
          <p className="text-sm text-ink-muted mt-2">Payment: {order.paymentStatus}</p>
        </div>
      </div>
    </div>
  )
}
