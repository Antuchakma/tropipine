import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1629739868151-d29aab8b4dd1?q=80&w=900&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bark/70" />
        <div className="relative flex flex-col h-full px-12 py-14">
          <Link to="/">
            <span className="font-display text-2xl font-medium italic text-white">TropiPine</span>
            <p className="label text-white/30 text-[10px] mt-0.5">Est. 2019</p>
          </Link>
          <div className="flex-1 flex flex-col justify-center">
            <p className="label text-white/30 mb-4">Account Recovery</p>
            <h2 className="font-display text-4xl font-semibold text-white mb-6 leading-tight">
              Happens to<br /><em>everyone.</em>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Enter your email address and we'll send you a link to reset your password. The link expires in 1 hour.
            </p>
          </div>
          <div className="flex-shrink-0 border-t border-white/12 pt-8">
            <p className="font-display text-lg font-normal italic text-white/60 leading-snug mb-3">
              "Every fresh start begins with one small step."
            </p>
            <p className="label text-white/25 text-[10px]">— TropiPine</p>
          </div>
        </div>
      </div>

      {/* ─── Right panel ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="block lg:hidden font-display text-xl font-medium italic text-bark mb-10">
            TropiPine
          </Link>

          {submitted ? (
            /* ── Success state ── */
            <div>
              <div className="w-12 h-12 bg-grove flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-bark mb-2">Check your inbox</h1>
              <p className="text-clay text-sm mb-6 leading-relaxed">
                If <strong className="text-bark">{email}</strong> is registered, a password reset link has been sent. It expires in 1 hour.
              </p>
              <p className="text-clay text-xs leading-relaxed mb-8">
                Can't find it? Check your spam folder, or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-grove underline underline-offset-2 hover:text-bark transition-colors"
                >
                  try again with a different email
                </button>
                .
              </p>
              <Link
                to="/login"
                className="label text-grove border-b border-grove pb-0.5 hover:text-bark hover:border-bark transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <div>
              <h1 className="font-display text-3xl font-semibold text-bark mb-1">Forgot password?</h1>
              <p className="text-clay text-sm mb-8">
                Enter your account email and we'll send a reset link.
              </p>

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
                    className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-grove transition-colors"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-grove text-white text-sm font-semibold tracking-wide hover:bg-sage transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-clay text-sm mt-8">
                Remembered it?{' '}
                <Link to="/login" className="text-grove font-medium hover:text-bark transition-colors underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  )
}
