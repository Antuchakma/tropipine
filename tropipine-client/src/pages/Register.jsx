import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

const perks = [
  { label: 'Welcome Offer', desc: 'Get 20% off your very first order with code WELCOME20' },
  { label: 'Order Tracking', desc: 'Real-time updates from harvest to your doorstep' },
  { label: 'Loyalty Points', desc: 'Earn points on every purchase, redeemable on future orders' },
]

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

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
        name: formData.name, email: formData.email,
        phone: formData.phone, password: formData.password,
      })
      const { user, token } = response.data.data || response.data
      dispatch(loginSuccess({ user, token }))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
    <div className="min-h-screen flex">

      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=900&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-grove/80" />

        <div className="relative flex flex-col h-full px-12 py-14">

          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-2xl font-normal italic text-white">TropiPine</span>
            <p className="label text-white/30 text-[10px] mt-0.5">Est. 2019</p>
          </Link>

          <div className="flex-1 flex flex-col justify-center py-16">
            <p className="label text-white/30 mb-4">Member perks</p>
            <h2 className="font-display text-4xl font-normal text-white mb-10 leading-tight">
              Join 12,000+<br /><em>satisfied families.</em>
            </h2>
            <div className="space-y-0 border-t border-white/15">
              {perks.map((p) => (
                <div key={p.label} className="border-b border-white/15 py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white/90">{p.label}</p>
                      <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-white/15 pt-8">
            <p className="font-display text-lg font-normal italic text-white/70 leading-snug mb-3">
              "Fresh is not a feature. It is the only standard."
            </p>
            <p className="label text-white/25 text-[10px]">— Our sourcing commitment</p>
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
          <Link to="/" className="block lg:hidden font-display text-xl font-normal italic text-bark mb-10">
            TropiPine
          </Link>

          <h1 className="font-display text-3xl font-normal text-bark mb-1">Create account</h1>
          <p className="text-clay text-sm mb-8">Join and taste the difference</p>

          {error && (
            <div className="border-l-2 border-earth bg-white px-4 py-3 mb-6">
              <p className="text-sm text-earth">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-clay/70 block mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
              />
            </div>

            <div>
              <label className="label text-clay/70 block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
              />
            </div>

            <div>
              <label className="label text-clay/70 block mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1234567890"
                required
                className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-clay/70 block mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm focus:outline-none focus:border-bark transition-colors"
                />
              </div>
              <div>
                <label className="label text-clay/70 block mb-2">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm focus:outline-none focus:border-bark transition-colors"
                />
              </div>
            </div>

            <p className="text-xs text-clay/50 leading-relaxed">
              By creating an account you agree to TropiPine's <a href="#" className="underline hover:text-bark">terms</a> and <a href="#" className="underline hover:text-bark">privacy policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone" />
            <span className="text-xs text-clay/40 tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-stone" />
          </div>

          <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

          <p className="text-center text-clay text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-bark font-medium hover:text-grove transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}
