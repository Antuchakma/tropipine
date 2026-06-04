import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name, email: formData.email,
        phone: formData.phone, password: formData.password,
      })
      const { user, token } = data.data || data
      dispatch(loginSuccess({ user, token }))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleGoogle = async (credential) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/google', { credential })
      dispatch(loginSuccess({ user: data.data.user, token: data.data.token }))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-up failed')
    } finally { setLoading(false) }
  }

  const fieldCls = "w-full bg-white border border-stone text-bark text-sm px-4 py-3 outline-none placeholder-clay focus:border-bark transition-colors"
  const labelCls = "block text-xs tracking-[0.12em] uppercase text-bark font-medium mb-1.5"

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-28">
      <motion.div
        className="w-full"
        style={{ maxWidth: 440 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-7">
          <div className="h-px w-8 bg-clay flex-shrink-0" />
          <span className="text-clay text-[0.57rem] tracking-[0.28em] uppercase">
            New Member
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-bark font-semibold mb-3"
          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4rem)', lineHeight: 0.87, letterSpacing: '-0.025em' }}>
          Your harvest<br /><em>awaits.</em>
        </h1>
        <p className="text-clay text-sm mb-10">Join and get 20% off your first order</p>

        {error && (
          <p className="text-sm mb-6" style={{ color: '#B85450' }}>{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className={labelCls}>Full name</label>
            <input className={fieldCls} type="text" name="name" value={formData.name}
              onChange={handleChange} required />
          </div>

          <div>
            <label className={labelCls}>Email address</label>
            <input className={fieldCls} type="email" name="email" value={formData.email}
              onChange={handleChange} required />
          </div>

          <div>
            <label className={labelCls}>Phone number</label>
            <input className={fieldCls} type="tel" name="phone" value={formData.phone}
              onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Password</label>
              <input className={fieldCls} type="password" name="password"
                value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelCls}>Confirm</label>
              <input className={fieldCls} type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-bark text-cream py-[1.1rem] text-[0.6rem] tracking-[0.3em] uppercase font-semibold hover:bg-grove transition-colors disabled:opacity-40"
            style={{ marginTop: '0.25rem' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-stone" />
          <span className="text-[0.57rem] tracking-[0.22em] uppercase text-clay">or</span>
          <div className="flex-1 h-px bg-stone" />
        </div>

        <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

        <p className="text-center text-clay text-sm mt-10">
          Already a member?{' '}
          <Link to="/login"
            className="text-bark font-medium hover:text-grove transition-colors underline underline-offset-4">
            Sign in
          </Link>
        </p>

      </motion.div>
    </div>
  )
}
