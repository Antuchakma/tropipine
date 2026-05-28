import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { removeFromCart, updateQuantity, setCoupon, clearCoupon } from '../store/slices/cartSlice'
import api from '../services/api'
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart.items)
  const { couponCode, couponDiscount } = useSelector((state) => state.cart)
  const [couponInput, setCouponInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponDiscount  // absolute dollar amount from backend
  const total = subtotal - discount

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/coupons/validate', {
        code: couponInput,
        cartTotal: subtotal,
      })

      if (response.data.valid) {
        dispatch(setCoupon({
          code: couponInput.trim().toUpperCase(),
          discountAmount: response.data.discountAmount || 0,
          couponType: response.data.coupon?.type,
          couponValue: response.data.coupon?.value,
        }))
        setCouponInput('')
      } else {
        setError('Invalid or expired coupon')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate coupon')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <section
          className="relative text-white overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-28 flex items-center justify-center min-h-screen">
            <div className="max-w-2xl space-y-8 text-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-4xl font-black text-white mb-4">Your Cart is Empty</h1>
                <p className="text-white/80 mb-8 text-lg">Add some delicious fruits to your cart!</p>
                <Link
                  to="/shop"
                  className="inline-block bg-brand-600 text-white px-8 py-4 rounded-2xl hover:bg-brand-700 font-semibold transition"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-20 flex items-center justify-center">
          <div className="max-w-2xl space-y-4 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">Shopping</p>
              <h1 className="font-display text-4xl font-black text-white">Shopping Cart</h1>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-surface py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white border border-edge rounded-3xl shadow-card overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 sm:p-6 border-b border-edge hover:bg-surface/70 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-2xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-ink">{item.name}</h3>
                        <p className="text-brand-600 font-bold">{item.price}</p>
                        <p className="text-xs text-ink-faint mt-1">Subtotal: {(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-surface border border-edge rounded-2xl">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              )
                            }
                            className="px-3 py-2 hover:bg-brand-50 text-brand-600 rounded-l-2xl"
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="px-3 sm:px-4 font-medium text-ink">{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="px-3 py-2 hover:bg-brand-50 text-brand-600 rounded-r-2xl"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => dispatch(removeFromCart(item.productId))}
                          className="text-brand-600 hover:bg-brand-50 p-3 rounded-full transition"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-edge rounded-3xl shadow-card p-5 sm:p-8 h-fit">
            <h2 className="text-2xl font-black mb-6 text-ink">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink-muted mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-edge rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="px-4 py-2 gradient-brand text-white rounded-2xl hover:opacity-90 disabled:opacity-50 transition font-medium"
                >
                  Apply
                </button>
              </div>
              {couponCode && discount > 0 && (
                <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <p className="text-green-700 text-sm font-medium">✓ {couponCode} — saving {discount.toFixed(2)}</p>
                  <button onClick={() => dispatch(clearCoupon())} className="text-green-600 hover:text-green-800 text-xs ml-2">✕</button>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-edge pt-4 mb-6">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon ({couponCode}):</span>
                  <span>-{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black border-t border-edge pt-3 text-ink">
                <span>Total:</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full gradient-brand text-white py-3 rounded-2xl hover:opacity-90 font-semibold mb-3 transition"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="block w-full text-center bg-surface border border-edge text-brand-600 py-3 rounded-2xl hover:bg-brand-50 font-semibold transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

