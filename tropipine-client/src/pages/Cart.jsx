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
  const discount = couponDiscount
  const total = subtotal - discount

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) { setError('Please enter a coupon code'); return }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/coupons/validate', { code: couponInput, cartTotal: subtotal })
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
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-white border border-edge shadow-card flex items-center justify-center text-4xl mx-auto mb-6">🛒</div>
          <h1 className="font-display text-3xl font-black text-ink mb-3">Your Cart is Empty</h1>
          <p className="text-ink-muted mb-8">Add some delicious fruits to get started.</p>
          <Link to="/shop" className="inline-block gradient-brand text-white px-8 py-3.5 rounded-2xl font-semibold shadow-brand hover:opacity-90 transition">
            Browse Products
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-10">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-[11px] uppercase tracking-widest text-brand-500 font-semibold mb-1">Order</p>
        <h1 className="font-display text-4xl font-black text-ink">Shopping Cart</h1>
        <p className="text-ink-muted text-sm mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white border border-edge rounded-3xl shadow-card overflow-hidden">
              {cart.map((item, idx) => (
                <div
                  key={item.productId}
                  className={`p-5 flex items-center gap-4 transition hover:bg-surface/60 ${idx < cart.length - 1 ? 'border-b border-edge' : ''}`}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-2xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink text-sm truncate">{item.name}</h3>
                    <p className="text-accent font-bold text-sm mt-0.5">৳{item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-1 bg-surface rounded-xl border border-edge">
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}
                      className="px-3 py-2 hover:bg-warm text-ink-muted rounded-l-xl transition"
                    >
                      <FaMinus size={11} />
                    </button>
                    <span className="px-3 font-semibold text-ink text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="px-3 py-2 hover:bg-warm text-ink-muted rounded-r-xl transition"
                    >
                      <FaPlus size={11} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="w-20 text-right flex-shrink-0">
                    <p className="font-bold text-ink text-sm">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="text-ink-faint hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition flex-shrink-0"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              ))}
            </div>

            <Link to="/shop" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-edge rounded-3xl shadow-card p-6 h-fit">
            <h2 className="font-display text-xl font-black text-ink mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  className="flex-1 px-3 py-2 border border-edge rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm text-ink placeholder-ink-faint"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="px-4 py-2 gradient-brand text-white rounded-xl disabled:opacity-50 transition font-semibold text-sm shadow-brand"
                >
                  {loading ? '...' : 'Apply'}
                </button>
              </div>
              {couponCode && discount > 0 && (
                <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <p className="text-green-700 text-xs font-semibold">✓ {couponCode} — saving ৳{discount.toFixed(2)}</p>
                  <button onClick={() => dispatch(clearCoupon())} className="text-green-500 hover:text-green-800 text-xs ml-2 font-bold">✕</button>
                </div>
              )}
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-edge pt-4 mb-5">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Subtotal</span>
                <span className="text-ink font-medium">৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Coupon ({couponCode})</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-black text-lg border-t border-edge pt-3 text-ink">
                <span>Total</span>
                <span className="text-brand-500">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full gradient-brand text-white py-3.5 rounded-2xl font-bold text-sm shadow-brand hover:opacity-90 transition"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
