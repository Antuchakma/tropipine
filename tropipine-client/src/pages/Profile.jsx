import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import api from '../services/api'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders')
        setOrders(response.data.orders || response.data.items || [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-warm py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white border border-warm-border rounded-3xl shadow-sm p-8 h-fit">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-black text-ink">{user.name}</h2>
              <p className="text-ink-muted text-sm mt-1">{user.email}</p>
              {user.phone && <p className="text-ink-muted text-sm">{user.phone}</p>}
            </div>

            <nav className="space-y-2 border-t border-warm-border pt-6">
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left px-4 py-3 rounded-2xl transition font-medium text-ink-muted hover:bg-warm"
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-2xl transition font-medium ${
                  activeTab === 'account'
                    ? 'bg-accent text-white'
                    : 'text-ink-muted hover:bg-warm'
                }`}
              >
                Account Settings
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-8 bg-accent text-white py-3 rounded-2xl hover:bg-accent-dark font-semibold transition"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="text-4xl font-black mb-8 text-ink">My Orders</h1>

                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-warm-border rounded-3xl shadow-sm p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-accent font-medium">{order.orderNumber || `Order #${order.id.slice(0, 8)}`}</p>
                            <p className="font-black text-2xl text-ink">
                              {order.totalAmount?.toFixed(2)}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                              order.status === 'CONFIRMED'
                                ? 'bg-accent text-white'
                                : order.status === 'PENDING'
                                ? 'bg-warm text-accent border border-warm-border'
                                : 'bg-warm text-accent border border-warm-border'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                            <p className="text-sm text-ink-muted mb-2">
                           {order.address?.street || order.address}{order.address?.city ? `, ${order.address.city}` : ''}
                        </p>
                        <p className="text-sm text-ink-muted mb-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-accent hover:text-accent-dark font-bold text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border border-warm-border rounded-3xl">
                    <p className="text-ink-muted">No orders yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div>
                <h1 className="text-4xl font-black mb-8 text-ink">Account Settings</h1>

                <div className="bg-white rounded-3xl border border-edge shadow-card p-5 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-muted mb-1">
                      Name
                    </label>
                    <p className="text-ink">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-muted mb-1">
                      Email
                    </label>
                    <p className="text-ink">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-muted mb-1">
                      Phone
                    </label>
                    <p className="text-ink">{user.phone || 'Not set'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-muted mb-1">
                      Role
                    </label>
                    <p className="text-ink">{user.role}</p>
                  </div>

                  <div className="bg-brand-50 p-4 rounded mt-6">
                    <p className="text-sm text-brand-700">
                       Contact support to update your profile information
                    </p>
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
