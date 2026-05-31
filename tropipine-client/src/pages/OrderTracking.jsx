import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/my-orders/${orderId}`)
      .then((r) => setOrder(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border border-bark border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl font-normal text-bark">Order not found</p>
        <button onClick={() => navigate('/orders')} className="label text-clay border-b border-stone hover:text-bark hover:border-bark transition-colors pb-0.5">
          Back to Orders
        </button>
      </div>
    )
  }

  const currentIndex = STATUSES.indexOf(order.status)

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-4xl mx-auto px-8 sm:px-10 py-14 space-y-6">

        <div>
          <button onClick={() => navigate('/orders')} className="label text-clay/60 hover:text-bark transition-colors mb-4 flex items-center gap-2">
            ← Orders
          </button>
          <p className="label text-clay/60 mb-1">{order.orderNumber}</p>
          <h1 className="font-display text-4xl font-normal text-bark">Order Details</h1>
          <p className="text-clay text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Status tracker */}
        <div className="bg-white border border-stone p-8">
          <h2 className="font-display text-xl font-normal text-bark mb-6">Delivery Status</h2>
          <div className="flex items-center gap-0">
            {STATUSES.map((status, index) => {
              const active = index <= currentIndex
              const current = index === currentIndex
              return (
                <div key={status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-medium border transition-colors ${
                      active ? 'bg-grove text-white border-grove' : 'bg-cream text-clay/40 border-stone'
                    }`}>
                      {index < currentIndex ? '✓' : index + 1}
                    </div>
                    <p className={`text-[9px] mt-1.5 tracking-wide text-center leading-tight ${
                      current ? 'text-bark font-medium' : active ? 'text-grove' : 'text-clay/40'
                    }`}>
                      {status}
                    </p>
                  </div>
                  {index < STATUSES.length - 1 && (
                    <div className={`flex-1 h-px mx-2 -mt-4 ${index < currentIndex ? 'bg-grove' : 'bg-stone'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Items */}
          <div className="bg-white border border-stone p-6">
            <h2 className="font-display text-lg font-normal text-bark mb-4">Items Ordered</h2>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-clay">{item.productName} × {item.quantity}</span>
                  <span className="text-bark font-medium">৳{item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-stone p-6 space-y-4">
            {order.address && (
              <div>
                <p className="label text-clay/60 mb-2">Delivery Address</p>
                <p className="text-sm text-clay">{order.address.street}, {order.address.city}</p>
                {order.address.phone && <p className="text-sm text-clay mt-0.5">{order.address.phone}</p>}
              </div>
            )}
            <div className="border-t border-stone pt-4">
              <div className="flex justify-between items-baseline">
                <span className="label text-clay/60">Total</span>
                <span className="font-display text-xl text-bark">৳{order.totalAmount?.toFixed(2)}</span>
              </div>
              <p className="text-xs text-clay/60 mt-1">Payment: {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
