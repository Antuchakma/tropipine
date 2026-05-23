import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, setCoupon, clearCart } from '../store/slices/cartSlice'
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
  const discount = (subtotal * couponDiscount) / 100
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
        subtotal,
      })

      if (response.data.valid) {
        dispatch(setCoupon({
          code: couponInput,
          discount: response.data.discountPercentage || 0,
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some delicious fruits to your cart!</p>
        <Link
          to="/shop"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 border-b flex items-center gap-4 hover:bg-gray-50 transition"
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-green-600 font-bold">৳{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.productId,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        )
                      }
                      className="px-3 py-2 hover:bg-gray-200"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="px-3 py-2 hover:bg-gray-200"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-24 text-right">
                    <p className="font-bold">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Apply
                </button>
              </div>
              {couponCode && (
                <p className="text-green-600 text-sm mt-2">✓ {couponCode} applied</p>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponDiscount}%):</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold mb-2"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="block w-full text-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
