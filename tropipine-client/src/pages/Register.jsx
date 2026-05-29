import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      const { user, token } = response.data.data || response.data

      dispatch(
        loginSuccess({
          user,
          token,
        })
      )
      navigate('/profile')
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
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
      setError(err.response?.data?.message || 'Google sign-up failed')
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
                Start Your <span className="text-white">Fresh Journey</span>
              </h1>
              <p className="text-lg text-white/70">Create your account and discover the finest tropical fruits delivered fresh to your door.</p>
            </div>

            {/* Benefits list */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
               
                <div>
                  <h3 className="font-semibold text-white">Free first order</h3>
                  <p className="text-sm text-white/60">Use code WELCOME for 20% off</p>
                </div>
              </div>
              <div className="flex gap-3">
                
                <div>
                  <h3 className="font-semibold text-white">Loyalty rewards</h3>
                  <p className="text-sm text-white/60">Earn points on every purchase</p>
                </div>
              </div>
              <div className="flex gap-3">
                
                <div>
                  <h3 className="font-semibold text-white">Premium support</h3>
                  <p className="text-sm text-white/60">24/7 customer service team</p>
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
            <div className="bg-[#1b1714] rounded-2xl shadow-2xl p-8 space-y-5 border border-white/10">

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Create Account</h2>
                <p className="text-sm text-white/65">Join TropiPine and start shopping</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded"
                >
                  <p className="text-red-300 font-medium text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={formData.name.split(' ')[0] || ''}
                      onChange={(e) => {
                        const nameParts = formData.name.split(' ')
                        setFormData({...formData, name: e.target.value + (nameParts[1] ? ' ' + nameParts[1] : '')})
                      }}
                      placeholder="John"
                      className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={formData.name.split(' ')[1] || ''}
                      onChange={(e) => {
                        const nameParts = formData.name.split(' ')
                        setFormData({...formData, name: (nameParts[0] || '') + ' ' + e.target.value})
                      }}
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+880 1234567890"
                    className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1.5">Confirm</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-[#26211d] text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer group pt-2">
                  <div className="w-5 h-5 rounded border border-white/20 group-hover:border-brand-500 transition-colors bg-[#26211d] mt-0.5 flex-shrink-0"></div>
                  <span className="text-xs text-white/65 leading-tight">I agree to TropiPine's terms and privacy policy</span>
                </label>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg font-bold text-white text-lg transition-all duration-300 disabled:opacity-50 relative overflow-hidden group pt-4 gradient-btn"
                >
                  <span className="relative">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </span>
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/15"></div>
                <span className="text-xs text-white/50 font-semibold">OR</span>
                <div className="flex-1 h-px bg-white/15"></div>
              </div>

              {/* Google Sign Up */}
              <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

              {/* Sign In */}
              <p className="text-center text-white/70 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-brand-400 hover:text-brand-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
