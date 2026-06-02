import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/slices/cartSlice'
import api from '../services/api'

const steps = ['Delivery', 'Payment']

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)
  const { couponCode, couponDiscount } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    address: '', city: '', postalCode: '',
    phone: user?.phone || '',
    specialNote: '',
    paymentMethod: 'bkash',
    senderNumber: '',
    transactionId: '',
    deliveryZoneId: '',
  })
  const [paymentConfig, setPaymentConfig] = useState({})
  const [deliveryZones, setDeliveryZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderCreated, setOrderCreated] = useState(null)
  const [orderItemsSnapshot, setOrderItemsSnapshot] = useState([])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponDiscount
  const selectedZone = deliveryZones.find((z) => z.id === formData.deliveryZoneId)
  const deliveryCharge = selectedZone ? parseFloat(selectedZone.charge) : 0
  const total = subtotal - discount + deliveryCharge

  useEffect(() => {
    Promise.all([
      api.get('/payments/config').catch(() => ({ data: { data: {} } })),
      api.get('/delivery').catch(() => ({ data: { data: [] } })),
    ]).then(([paymentRes, deliveryRes]) => {
      setPaymentConfig(paymentRes.data.data || {})
      const zones = deliveryRes.data.data || []
      setDeliveryZones(zones)
      if (zones.length > 0) setFormData((p) => ({ ...p, deliveryZoneId: zones[0].id }))
    })
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleCreateOrder = async () => {
    if (!formData.address || !formData.city) { setError('Please fill in all address fields'); return }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/orders', {
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        couponCode, deliveryZoneId: formData.deliveryZoneId, deliveryCharge,
        paymentMethod: formData.paymentMethod,
        specialNote: formData.specialNote,
        address: formData.address, city: formData.city,
        postalCode: formData.postalCode, phone: formData.phone,
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
  const merchantNumber = paymentConfig[`${formData.paymentMethod}_number`] || paymentConfig.bkash_number || '01XXXXXXXXX'

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-bark mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors">
            Browse Shop
          </button>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
  const labelClass = "label text-clay/70 block mb-2"

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14">

        {/* Header + Step indicator */}
        <div className="mb-10">
          <p className="label text-grove mb-2">Checkout</p>
          <h1 className="font-display text-4xl font-semibold text-bark mb-6">Complete Your Order</h1>
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-medium transition-colors ${
                  i + 1 === step ? 'bg-bark text-white' : i + 1 < step ? 'bg-grove text-white' : 'bg-stone text-clay'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs tracking-wide ${i + 1 === step ? 'text-bark' : 'text-clay/60'}`}>{s}</span>
                {i < steps.length - 1 && <div className="w-12 h-px bg-stone" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {error && (
              <div className="border border-stone bg-white px-4 py-3 mb-5">
                <p className="text-sm text-earth">{error}</p>
              </div>
            )}

            {step === 1 && (
              <div className="bg-white border border-stone p-8 space-y-5">
                <h2 className="font-display text-2xl font-semibold text-bark mb-1">Delivery Details</h2>

                <div>
                  <label className={labelClass}>Full Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className={inputClass} rows="3" placeholder="House, road, area" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Dhaka" />
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputClass} placeholder="1000" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+880 1234-567890" />
                </div>

                <div>
                  <label className={labelClass}>Delivery Zone</label>
                  <select name="deliveryZoneId" value={formData.deliveryZoneId} onChange={handleChange} className={inputClass}>
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.name} — ৳{zone.charge} · {zone.estimatedDays}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Special Notes</label>
                  <textarea name="specialNote" value={formData.specialNote} onChange={handleChange} className={inputClass} rows="2" placeholder="Optional" />
                </div>

                <div>
                  <label className={labelClass}>Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bkash', 'nagad', 'rocket'].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center justify-center py-3 border cursor-pointer transition-colors ${
                          formData.paymentMethod === method ? 'border-bark bg-cream' : 'border-stone hover:border-clay'
                        }`}
                      >
                        <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="sr-only" />
                        <span className="text-xs font-medium text-bark uppercase tracking-widest">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className="w-full py-3.5 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Order…' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 2 && orderCreated && (
              <div className="bg-white border border-stone p-8 space-y-5">
                <h2 className="font-display text-2xl font-semibold text-bark">Complete Payment</h2>
                <div className="bg-mist border border-sage/20 px-5 py-4 text-sm">
                  <p className="font-medium text-grove mb-1">Order {orderCreated.orderNumber} confirmed</p>
                  <p className="text-clay">Send <span className="font-medium text-bark font-display">৳{(orderCreated.totalAmount ?? total).toFixed(2)}</span> via {formData.paymentMethod}</p>
                  <p className="text-clay mt-1">Merchant number: <span className="font-mono font-medium text-bark tracking-widest">{merchantNumber}</span></p>
                </div>

                <div>
                  <label className={labelClass}>Your {formData.paymentMethod} Number</label>
                  <input type="tel" name="senderNumber" value={formData.senderNumber} onChange={handleChange} className={inputClass} placeholder="01XXXXXXXXX" />
                </div>

                <div>
                  <label className={labelClass}>Transaction ID</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className={inputClass} placeholder="From your payment app" />
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={loading}
                  className="w-full py-3.5 bg-grove text-white text-sm font-medium tracking-wide hover:bg-sage transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting…' : 'Confirm Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border border-stone p-8 h-fit">
            <h2 className="font-display text-xl font-semibold text-bark mb-6">Order Summary</h2>
            <div className="space-y-2 mb-5">
              {displayItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-clay">{item.name} × {item.quantity}</span>
                  <span className="text-bark">৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone pt-4 space-y-2">
              <div className="flex justify-between text-sm text-clay">
                <span>Subtotal</span><span>৳{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-grove">
                  <span>Coupon ({couponCode})</span><span>−৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-clay">
                <span>Delivery</span><span>৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-stone pt-3">
                <span className="text-sm font-medium text-bark">Total</span>
                <span className="font-display text-xl text-bark">৳{(orderCreated?.totalAmount ?? total).toFixed(2)}</span>
              </div>
            </div>

            {/* Trust */}
            <div className="border-t border-stone pt-5 mt-4 space-y-2.5">
              {[
                'Your order is placed only after payment verification',
                'Freshness guaranteed on all produce',
                'Need help? Contact us at info@tropipine.com',
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-grove mt-1.5 flex-shrink-0" />
                  <p className="text-[11px] text-clay/60 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
