import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`)
        setOrder(response.data)
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
      <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#E7DBCF] border-t-[#8B5E3C] animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center">
        <p className="text-[#6A625B]">Order not found</p>
      </div>
    )
  }

  const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
  const currentIndex = statuses.indexOf(order.status)

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1E1E1E]">

      {/* ================= HEADER ================= */}
      <div className="border-b border-[#E7DBCF] bg-white/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-8">

          <button
            onClick={() => navigate('/profile')}
            className="text-[#8B5E3C] text-sm font-medium hover:underline mb-4"
          >
            ← Back to Orders
          </button>

          <h1 className="text-3xl font-black">
            Order <span className="text-[#8B5E3C]">#{order.id}</span>
          </h1>

          <p className="text-[#6A625B] text-sm mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* ================= STATUS ================= */}
        <div className="bg-white border border-[#E7DBCF] rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Delivery Status</h2>

          <div className="space-y-6">
            {statuses.map((status, index) => {
              const active = index <= currentIndex

              return (
                <div key={status} className="flex items-center gap-4">

                  {/* DOT */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      border
                      transition-all duration-300
                      ${
                        active
                          ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                          : 'bg-[#F6F1E8] border-[#E7DBCF] text-[#B8B0A8]'
                      }
                    `}
                  >
                    ●
                  </div>

                  {/* LABEL */}
                  <p
                    className={`
                      font-medium text-sm tracking-wide
                      ${
                        active
                          ? 'text-[#1E1E1E]'
                          : 'text-[#B8B0A8]'
                      }
                    `}
                  >
                    {status}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="bg-white border border-[#E7DBCF] rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-5">Items</h2>

          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-[#5A5149]"
              >
                <span>
                  {item.product?.name || 'Product'} × {item.quantity}
                </span>

                <span className="font-medium text-[#1E1E1E]">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= DELIVERY INFO ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-6">
            <h3 className="font-semibold mb-2 text-[#1E1E1E]">
              Delivery Address
            </h3>

            <p className="text-sm text-[#6A625B] leading-relaxed">
              {order.address}
              <br />
              {order.city}
            </p>
          </div>

          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-6">
            <h3 className="font-semibold mb-2 text-[#1E1E1E]">
              Contact
            </h3>

            <p className="text-sm text-[#6A625B]">
              {order.phone}
            </p>
          </div>

        </div>

        {/* ================= TOTAL ================= */}
        <div className="bg-white border border-[#E7DBCF] rounded-3xl p-8">

          <div className="space-y-3 text-sm">

            <div className="flex justify-between text-[#5A5149]">
              <span>Subtotal</span>
              <span className="text-[#1E1E1E] font-medium">
                ৳{order.subtotal?.toFixed(2)}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#8B5E3C]">
                <span>Discount</span>
                <span>
                  -৳{order.discountAmount?.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-[#E7DBCF] pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#1E1E1E]">
                ৳{order.totalAmount?.toFixed(2)}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}