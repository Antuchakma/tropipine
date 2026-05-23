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
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        specialNote: formData.specialNote,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">Full Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="+880 1234-567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Special Notes</label>
                  <textarea
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="2"
                    placeholder="Any special instructions?"
                  />
                </div>

                <h2 className="text-lg font-bold mt-8 mb-4">Payment Method</h2>
                <div className="space-y-2">
                  {['bkash', 'nagad', 'rocket'].map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                      />
                      <span className="text-sm font-semibold uppercase">{method}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold mt-6"
                >
                  {loading ? 'Creating Order...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && orderCreated && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <p className="text-green-600 font-semibold">
                  ✓ Order #{orderCreated.id} created successfully!
                </p>

                <button
                  onClick={handleSubmitPayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Order Total</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded text-sm space-y-1">
              <p className="font-semibold">Order Items ({cart.length})</p>
              {cart.map((item) => (
                <p key={item.productId} className="text-gray-600">
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
