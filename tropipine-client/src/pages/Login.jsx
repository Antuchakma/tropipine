import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { loginSuccess, loginError } from '../store/slices/authSlice'
import api from '../services/api'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      dispatch(loginSuccess({ user: data.data.user, token: data.data.token }))
      navigate('/profile')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg); dispatch(loginError(msg))
    } finally { setLoading(false) }
  }

  const handleGoogle = async (credential) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/google', { credential })
      dispatch(loginSuccess({ user: data.data.user, token: data.data.token }))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-28">
      <motion.div
        className="w-full"
        style={{ maxWidth: 420 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-7">
          <div className="h-px w-8 bg-clay flex-shrink-0" />
          <span className="text-clay text-[0.57rem] tracking-[0.28em] uppercase">
            Member Sign-in
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-bark font-semibold mb-12"
          style={{ fontSize: 'clamp(3.2rem, 6vw, 4.8rem)', lineHeight: 0.87, letterSpacing: '-0.025em' }}>
          Welcome<br /><em>back.</em>
        </h1>

        {error && (
          <p className="text-sm mb-7" style={{ color: '#B85450' }}>{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs tracking-[0.12em] uppercase text-bark font-medium mb-1.5">
              Email address
            </label>
            <input
              type="email" value={email} required              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white border border-stone text-bark text-sm px-4 py-3 outline-none placeholder-clay focus:border-bark transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs tracking-[0.12em] uppercase text-bark font-medium">
                Password
              </label>
              <Link to="/forgot-password"
                className="text-[0.62rem] text-clay hover:text-bark transition-colors tracking-wide">
                Forgot password?
              </Link>
            </div>
            <input
              type="password" value={password} required
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white border border-stone text-bark text-sm px-4 py-3 outline-none focus:border-bark transition-colors"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-bark text-cream py-[1.1rem] text-[0.6rem] tracking-[0.3em] uppercase font-semibold hover:bg-grove transition-colors disabled:opacity-40"
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-stone" />
          <span className="text-xs tracking-[0.12em] uppercase text-bark font-medium">or</span>
          <div className="flex-1 h-px bg-stone" />
        </div>

        <GoogleSignIn onSuccess={handleGoogle} disabled={loading} />

        <p className="text-center text-clay text-sm mt-10">
          No account?{' '}
          <Link to="/register"
            className="text-bark font-medium hover:text-grove transition-colors underline underline-offset-4">
            Create one free
          </Link>
        </p>

      </motion.div>
    </div>
  )
}
