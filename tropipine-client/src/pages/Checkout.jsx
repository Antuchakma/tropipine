import { useState, useEffect } from 'react'
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
    senderNumber: '',
    transactionId: '',
  })
  const [paymentConfig, setPaymentConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderCreated, setOrderCreated] = useState(null)
  const [orderItemsSnapshot, setOrderItemsSnapshot] = useState([])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = (subtotal * couponDiscount) / 100
  const deliveryCharge = 50
  const total = subtotal - discount + deliveryCharge

  useEffect(() => {
    api.get('/payments/config').then((r) => setPaymentConfig(r.data.data || {})).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
        specialNote: formData.specialNote,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
      })

      const order = response.data.order
      setOrderCreated(order)
      setOrderItemsSnapshot([...cart])
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

    if (!formData.senderNumber || !formData.transactionId) {
      setError('Please enter your mobile wallet number and transaction ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.post('/payments/submit', {
        orderId: orderCreated.id,
        method: formData.paymentMethod,
        senderNumber: formData.senderNumber,
        transactionId: formData.transactionId,
        amount: orderCreated.totalAmount ?? total,
      })

      navigate(`/orders/${orderCreated.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment submission failed')
    } finally {
      setLoading(false)
    }
  }

  const displayItems = orderCreated ? orderItemsSnapshot : cart
  const merchantNumber =
    paymentConfig[`${formData.paymentMethod}_number`] ||
    paymentConfig.bkash_number ||
    '01XXXXXXXXX'

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-black mb-4 text-ink">Your cart is empty</h1>
          <button onClick={() => navigate('/shop')} className="gradient-brand text-white px-8 py-3 rounded-2xl font-semibold shadow-brand">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-4xl font-black mb-10 text-ink">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {step === 1 && (
              <div className="bg-white border border-edge rounded-3xl shadow-card p-8 space-y-5">
                <h2 className="text-2xl font-black text-ink">Delivery Address</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Full Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400" rows="3" placeholder="Enter your full address" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Dhaka" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="1000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="+880 1234-567890" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Special Notes</label>
                  <textarea name="specialNote" value={formData.specialNote} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand-400" rows="2" />
                </div>

                <h2 className="text-lg font-bold text-ink mt-4">Payment Method</h2>
                <div className="space-y-3 bg-surface border border-edge rounded-2xl p-4">
                  {['bkash', 'nagad', 'rocket'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
                      <span className="text-sm font-medium text-ink-muted uppercase">{method}</span>
                    </label>
                  ))}
                </div>

                <button onClick={handleCreateOrder} disabled={loading} className="w-full gradient-brand text-white py-4 rounded-2xl font-semibold mt-4 disabled:opacity-50 shadow-brand">
                  {loading ? 'Creating Order...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 2 && orderCreated && (
              <div className="bg-white border border-edge rounded-3xl shadow-card p-8 space-y-5">
                <h2 className="text-2xl font-black text-ink">Complete Payment</h2>
                <p className="text-brand-600 font-semibold">Order {orderCreated.orderNumber} created — pay ৳{(orderCreated.totalAmount ?? total).toFixed(2)}</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">{error}</div>
                )}

                <div className="bg-surface border border-edge rounded-2xl p-5 text-sm space-y-2">
                  <p className="font-bold text-ink">Send payment to ({formData.paymentMethod})</p>
                  <p className="text-ink-muted">Merchant number: <span className="font-mono font-bold text-ink">{merchantNumber}</span></p>
                  <p className="text-ink-muted">Amount: <span className="font-bold text-ink">৳{(orderCreated.totalAmount ?? total).toFixed(2)}</span></p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Your {formData.paymentMethod} number *</label>
                  <input type="tel" name="senderNumber" value={formData.senderNumber} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="01XXXXXXXXX" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Transaction ID *</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="w-full px-4 py-3 border border-edge rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="From your payment app" />
                </div>

                <button onClick={handleSubmitPayment} disabled={loading} className="w-full gradient-brand text-white py-4 rounded-2xl font-semibold disabled:opacity-50 shadow-brand">
                  {loading ? 'Submitting...' : 'Complete Payment'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-edge rounded-3xl shadow-card p-8 h-fit">
            <h2 className="text-2xl font-black mb-6 text-ink">Order Total</h2>
            <div className="space-y-3 mb-6 text-ink-muted">
              <div className="flex justify-between"><span>Subtotal:</span><span>৳{subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-brand-600"><span>Discount:</span><span>-৳{discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Delivery:</span><span>৳{deliveryCharge}</span></div>
              <div className="flex justify-between text-lg font-black border-t border-edge pt-3 text-ink">
                <span>Total:</span><span>৳{(orderCreated?.totalAmount ?? total).toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-surface border border-edge p-5 rounded-2xl text-sm space-y-2">
              <p className="font-bold text-ink">Order Items ({displayItems.length})</p>
              {displayItems.map((item) => (
                <p key={item.productId} className="text-ink-muted">{item.name} x {item.quantity}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
