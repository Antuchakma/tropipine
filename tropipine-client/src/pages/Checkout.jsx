import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/slices/cartSlice'
import api from '../services/api'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)
  const { couponCode, couponDiscount } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: user?.phone || '',
    specialNote: '',
    paymentMethod: 'bkash',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderCreated, setOrderCreated] = useState(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = (subtotal * couponDiscount) / 100
  const deliveryCharge = 50
  const total = subtotal - discount + deliveryCharge

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateOrder = async () => {
    if (!formData.address || !formData.city) {
      setError('Please fill in all address fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/orders', {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        couponCode,
        deliveryCharge,
        paymentMethod: formData.paymentMethod,
      })

      setOrderCreated(response.data)
      setStep(2)
      dispatch(clearCart())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPayment = async () => {
    if (!orderCreated) return

    setLoading(true)
    setError('')

    try {
      await api.post('/payments/submit', {
        orderId: orderCreated.id,
        paymentMethod: formData.paymentMethod,
        transactionId: 'TRX' + Date.now(),
      })

      navigate(`/orders/${orderCreated.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-[#1E1E1E]">Your cart is empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#8B5E3C] text-white px-8 py-3 rounded-2xl hover:bg-[#7a4e2f] font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-10 text-[#1E1E1E]">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm p-8 space-y-5">
                <h2 className="text-2xl font-black mb-6 text-[#1E1E1E]">Delivery Address</h2>

                {error && (
                  <div className="bg-[#F6F1E8] border border-[#E7DBCF] text-[#8B5E3C] p-4 rounded-2xl text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#5A5149] mb-2">Full Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]/40 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    rows="3"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5149] mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]/40 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5149] mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]/40 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A5149] mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]/40 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    placeholder="+880 1234-567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A5149] mb-2">Special Notes</label>
                  <textarea
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]/40 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    rows="2"
                    placeholder="Any special instructions?"
                  />
                </div>

                <h2 className="text-lg font-bold mt-8 mb-4 text-[#1E1E1E]">Payment Method</h2>
                <div className="space-y-3 bg-[#F6F1E8] border border-[#E7DBCF] rounded-2xl p-4">
                  {['bkash', 'nagad', 'rocket'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#8B5E3C]"
                      />
                      <span className="text-sm font-medium text-[#5A5149] uppercase">{method}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className="w-full bg-[#8B5E3C] text-white py-4 rounded-2xl hover:bg-[#7a4e2f] disabled:opacity-50 font-semibold mt-8 transition"
                >
                  {loading ? 'Creating Order...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && orderCreated && (
              <div className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-2xl font-black text-[#1E1E1E]">Order Summary</h2>
                <p className="text-[#8B5E3C] font-bold text-lg">
                  ✓ Order #{orderCreated.id} created successfully!
                </p>

                <button
                  onClick={handleSubmitPayment}
                  disabled={loading}
                  className="w-full bg-[#8B5E3C] text-white py-4 rounded-2xl hover:bg-[#7a4e2f] disabled:opacity-50 font-semibold mt-6 transition"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm p-8 h-fit">
            <h2 className="text-2xl font-black mb-6 text-[#1E1E1E]">Order Total</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#5A5149]">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8B5E3C] font-medium">
                  <span>Discount:</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5A5149]">
                <span>Delivery:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-lg font-black border-t border-[#E7DBCF] pt-3 text-[#1E1E1E]">
                <span>Total:</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#F6F1E8] border border-[#E7DBCF] p-5 rounded-2xl text-sm space-y-2">
              <p className="font-bold text-[#1E1E1E]">Order Items ({cart.length})</p>
              {cart.map((item) => (
                <p key={item.productId} className="text-[#6A625B]">
                  {item.name} x {item.quantity}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
