import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess, loginError } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

const benefits = [
  { label: 'Farm Direct', desc: 'Sourced from partner farms in Rajshahi and Sylhet' },
  { label: 'Same-Day Delivery', desc: 'Order before noon, receive before evening in Dhaka' },
  { label: 'Quality Guaranteed', desc: 'Hand-selected and graded — or your money back' },
]

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
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data.data
      dispatch(loginSuccess({ user, token }))
      navigate('/profile')
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
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
    <div className="min-h-screen flex">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1618897996318-5a901fa0b74a?q=80&w=900&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bark/75" />

        {/* Content over image */}
        <div className="relative flex flex-col h-full px-12 py-14">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-2xl font-semibold italic text-white">TropiPine</span>
            <p className="label text-white/30 text-[10px] mt-0.5">Est. 2019</p>
          </Link>

          {/* Center: brand promise + benefits */}
          <div className="flex-1 flex flex-col justify-center py-16">
            <p className="label text-white/30 mb-4">Why our customers love us</p>
            <h2 className="font-display text-4xl font-semibold text-white mb-10 leading-tight">
              Premium fruit.<br /><em>Honest price.</em><br />Direct to you.
            </h2>
            <div className="space-y-0 border-t border-white/12">
              {benefits.map((b) => (
                <div key={b.label} className="border-b border-white/12 py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-grove mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white/85">{b.label}</p>
                      <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="flex-shrink-0 border-t border-white/12 pt-8">
            <p className="font-display text-lg font-semibold italic text-white/70 leading-snug mb-3">
              "Every bite tells the story of the farm it came from."
            </p>
            <p className="label text-white/25 text-[10px]">— TropiPine, Est. 2019</p>
          </div>

        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-cream overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="block lg:hidden font-display text-xl font-semibold italic text-bark mb-10">
            TropiPine
          </Link>

          <h1 className="font-display text-3xl font-semibold text-bark mb-1">Welcome back</h1>
          <p className="text-clay text-sm mb-8">Sign in to continue your fresh journey</p>

          {error && (
            <div className="border-l-2 border-earth bg-white px-4 py-3 mb-6">
              <p className="text-sm text-earth">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label text-clay/70 block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label text-clay/70">Password</label>
                <Link to="/forgot-password" className="text-xs text-clay hover:text-bark transition-colors underline underline-offset-2">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm focus:outline-none focus:border-bark transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone" />
            <span className="text-xs text-clay/40 tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-stone" />
          </div>

          <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

          <p className="text-center text-clay text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-bark font-medium hover:text-grove transition-colors underline underline-offset-2">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}
