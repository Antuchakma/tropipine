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
        setOrders(response.data.items || [])
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
              {user.phone && <p className="text-gray-600 text-sm">{user.phone}</p>}
            </div>

            <nav className="space-y-2 border-t pt-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'orders'
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'account'
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Account Settings
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>

                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                            <p className="font-semibold text-lg">
                              ৳{order.totalAmount?.toFixed(2)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              order.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          📍 {order.address}, {order.city}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-green-600 hover:text-green-700 font-semibold text-sm"
                        >
                          View Details →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{user.phone || 'Not set'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Role
                    </label>
                    <p className="text-gray-900">{user.role}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded mt-6">
                    <p className="text-sm text-blue-700">
                      💡 Contact support to update your profile information
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
