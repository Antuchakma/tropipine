import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess, loginError } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { user, token } = response.data.data

      dispatch(
        loginSuccess({
          user,
          token,
        })
      )

      navigate('/profile')
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed'

      setError(message)
      dispatch(loginError(message))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (credential) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/google', { credential })
      const { user, token } = response.data.data
      dispatch(loginSuccess({ user, token }))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden gradient-brand">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT SIDE - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white space-y-6 hidden lg:block"
          >
            <div className="space-y-4">
         
              <h1 className="text-5xl font-black leading-tight">
                Sign In to <span className="text-white">TropiPine</span>
              </h1>
              <p className="text-lg text-white/70">Continue your fresh fruit journey. Access your orders, wishlist, and exclusive deals.</p>
            </div>

            {/* Benefits list */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                
                <div>
                  <h3 className="font-semibold text-white">Quick checkout</h3>
                  <p className="text-sm text-white/60">Save your favorite fruits for faster ordering</p>
                </div>
              </div>
              <div className="flex gap-3">
                
                <div>
                  <h3 className="font-semibold text-white">Track orders</h3>
                  <p className="text-sm text-white/60">Real-time delivery updates to your door</p>
                </div>
              </div>
              <div className="flex gap-3">
                
                <div>
                  <h3 className="font-semibold text-white">Exclusive rewards</h3>
                  <p className="text-sm text-white/60">Earn points on every purchase</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                >
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-edge bg-white text-ink placeholder-ink-faint outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-ink">Password</label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=""
                    className="w-full px-4 py-3 rounded-lg border-2 border-edge bg-white text-ink placeholder-ink-faint outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg font-bold text-white text-lg transition-all duration-300 disabled:opacity-50 relative overflow-hidden group gradient-btn"
                >
                  <span className="relative">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </span>
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-edge"></div>
                <span className="text-xs text-ink-muted font-semibold">OR</span>
                <div className="flex-1 h-px bg-edge"></div>
              </div>

              {/* Google Sign In */}
              <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

              {/* Sign Up */}
              <p className="text-center text-ink-muted text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-brand-600 hover:text-brand-700"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
