import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import api from '../services/api'
import { usePageLoading } from '../context/LoadingContext'

const STATUS_STYLE = {
  CONFIRMED:  'bg-mist text-grove border-sage/30',
  DELIVERED:  'bg-mist text-grove border-sage/30',
  PENDING:    'bg-bone text-clay border-stone',
  PROCESSING: 'bg-bone text-earth border-stone',
  SHIPPED:    'bg-bone text-earth border-stone',
  CANCELLED:  'bg-white text-clay/60 border-stone',
  REFUNDED:   'bg-white text-clay/60 border-stone',
}

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const setDataLoading = usePageLoading()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setDataLoading(true)
    api.get('/orders/my-orders')
      .then((r) => setOrders(r.data.orders || r.data.items || []))
      .catch(() => {})
      .finally(() => { setLoading(false); setDataLoading(false) })
  }, [user, navigate])

  const handleLogout = () => { dispatch(logout()); navigate('/') }

  if (!user) return null

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-6xl mx-auto px-8 sm:px-10 py-14">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-stone p-8">
              {/* Avatar */}
              <div className="w-12 h-12 bg-bark flex items-center justify-center text-white font-display text-2xl font-semibold mb-5">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-2xl font-semibold text-bark leading-none">{user.name}</h2>
              <p className="text-clay text-xs mt-1">{user.email}</p>
              {user.phone && <p className="text-clay/60 text-xs mt-0.5">{user.phone}</p>}

              <nav className="space-y-0 border-t border-stone pt-5 mt-6">
                {[
                  { key: 'orders', label: 'My Orders' },
                  { key: 'account', label: 'Account Settings' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full text-left py-3 border-b border-stone last:border-b-0 text-sm transition-colors flex items-center justify-between ${
                      activeTab === tab.key ? 'text-bark font-medium' : 'text-clay hover:text-bark'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && <span className="w-1 h-1 rounded-full bg-grove" />}
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 border border-stone text-clay text-sm hover:border-bark hover:text-bark transition-colors"
            >
              Sign Out
            </button>
          </aside>

          {/* Main */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h1 className="font-display text-3xl font-semibold text-bark mb-8">My Orders</h1>

                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-white border border-stone animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-stone p-6 hover:border-clay transition-colors cursor-pointer group"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="label text-grove mb-1">
                              {order.orderNumber || `#${order.id.slice(0, 8)}`}
                            </p>
                            <p className="font-display text-xl font-semibold text-bark">
                              ৳{order.totalAmount?.toFixed(2)}
                            </p>
                            <p className="text-xs text-clay mt-1">
                              {order.address?.street || order.address}
                              {order.address?.city ? `, ${order.address.city}` : ''}
                            </p>
                            <p className="text-xs text-clay/60 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`label px-3 py-1 border text-[10px] ${STATUS_STYLE[order.status] || STATUS_STYLE.PENDING}`}>
                              {order.status}
                            </span>
                            <svg className="text-clay/30 group-hover:text-clay transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-stone p-12 text-center">
                    <p className="font-display text-2xl font-semibold text-bark mb-2">No orders yet</p>
                    <p className="text-clay text-sm mb-6">Your order history will appear here.</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="px-8 py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h1 className="font-display text-3xl font-semibold text-bark mb-8">Account Details</h1>
                <div className="bg-white border border-stone p-8 space-y-5">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone || 'Not set' },
                    { label: 'Role', value: user.role },
                  ].map(({ label, value }) => (
                    <div key={label} className="grid sm:grid-cols-3 gap-2 py-3 border-b border-stone last:border-b-0">
                      <p className="label text-clay/60">{label}</p>
                      <p className="sm:col-span-2 text-sm text-bark">{value}</p>
                    </div>
                  ))}
                  <div className="bg-mist border border-sage/20 px-5 py-4 mt-4">
                    <p className="text-sm text-grove">To update your profile information, please contact our support team.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
