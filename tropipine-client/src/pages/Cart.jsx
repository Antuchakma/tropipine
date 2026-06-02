import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { removeFromCart, updateQuantity, setCoupon, clearCoupon } from '../store/slices/cartSlice'
import api from '../services/api'

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
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <svg className="w-12 h-12 text-clay/30 mx-auto mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h1 className="font-display text-3xl font-semibold text-bark mb-3">Your cart is empty</h1>
          <p className="text-clay text-sm mb-8">Add some exceptional fruits to get started.</p>
          <Link to="/shop" className="px-8 py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors">
            Browse Shop
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="label text-grove mb-2">Your</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-bark">Shopping Cart</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="border border-stone bg-white">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-stone">
                <p className="col-span-6 label text-clay/60">Product</p>
                <p className="col-span-3 label text-clay/60 text-center">Qty</p>
                <p className="col-span-3 label text-clay/60 text-right">Total</p>
              </div>
              {cart.map((item, idx) => (
                <div
                  key={item.productId}
                  className={`grid grid-cols-12 gap-4 items-center px-6 py-5 ${idx < cart.length - 1 ? 'border-b border-stone' : ''}`}
                >
                  {/* Product */}
                  <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-bone">
                      <img
                        src={item.image || 'https://via.placeholder.com/64'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-bark">{item.name}</p>
                      <p className="text-xs text-clay mt-0.5">৳{item.price} / {item.unit || 'kg'}</p>
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="col-span-8 sm:col-span-3 flex items-center justify-start sm:justify-center gap-0">
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}
                      className="w-8 h-8 border border-stone text-clay hover:border-bark hover:text-bark transition-colors text-sm flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm text-bark border-y border-stone h-8 flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 border border-stone text-clay hover:border-bark hover:text-bark transition-colors text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Total + remove */}
                  <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-4">
                    <span className="font-display text-base text-bark">৳{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      className="text-clay/40 hover:text-bark transition-colors"
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link to="/shop" className="label text-clay hover:text-bark transition-colors border-b border-stone hover:border-bark pb-0.5">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="border border-stone bg-white p-8 h-fit">
            <h2 className="font-display text-2xl font-semibold text-bark mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="label text-clay/60 block mb-2">Promo Code</label>
              <div className="flex gap-0">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  className="flex-1 px-3 py-2 bg-cream border border-stone text-sm text-bark placeholder-sand focus:outline-none focus:border-bark transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="px-4 py-2 bg-bark text-white text-xs font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponCode && discount > 0 && (
                <div className="mt-2 flex items-center justify-between bg-mist border border-sage/20 px-3 py-2">
                  <p className="text-grove text-xs font-medium">{couponCode} — saving ৳{discount.toFixed(2)}</p>
                  <button onClick={() => dispatch(clearCoupon())} className="text-grove/60 hover:text-grove text-xs">✕</button>
                </div>
              )}
              {error && <p className="text-earth text-xs mt-2">{error}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-stone pt-5 mb-6">
              <div className="flex justify-between text-sm text-clay">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-grove">
                  <span>Discount ({couponCode})</span>
                  <span>−৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-stone pt-3">
                <span className="text-sm font-medium text-bark">Total</span>
                <span className="font-display text-xl text-bark">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors mb-3"
            >
              Proceed to Checkout
            </button>

            {/* Trust signals */}
            <div className="border-t border-stone pt-5 mt-2 space-y-3">
              {[
                'Free delivery on orders over ৳2000',
                'Freshness guaranteed — or your money back',
                'Secure checkout via bKash, Nagad & Rocket',
              ].map((note) => (
                <div key={note} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-grove mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-clay/60 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
