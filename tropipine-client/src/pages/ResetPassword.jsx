import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Auto-redirect to login after success
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/login'), 3000)
    return () => clearTimeout(timer)
  }, [success, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=900&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-grove/75" />
        <div className="relative flex flex-col h-full px-12 py-14">
          <Link to="/">
            <span className="font-display text-2xl font-medium italic text-white">TropiPine</span>
            <p className="label text-white/30 text-[10px] mt-0.5">Est. 2019</p>
          </Link>
          <div className="flex-1 flex flex-col justify-center">
            <p className="label text-white/30 mb-4">Almost there</p>
            <h2 className="font-display text-4xl font-semibold text-white mb-6 leading-tight">
              Create a new<br /><em>secure password.</em>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Choose a strong password with at least 6 characters. You'll use it the next time you sign in.
            </p>
          </div>
          <div className="flex-shrink-0 border-t border-white/15 pt-8">
            <p className="font-display text-lg font-normal italic text-white/60 leading-snug mb-3">
              "Security is the first layer of freshness."
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

          {success ? (
            /* ── Success state ── */
            <div>
              <div className="w-12 h-12 bg-grove flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-display text-3xl font-semibold text-bark mb-2">Password updated</h1>
              <p className="text-clay text-sm mb-8 leading-relaxed">
                Your password has been reset successfully. Redirecting you to the sign in page in a moment…
              </p>
              <Link
                to="/login"
                className="w-full block text-center py-3.5 bg-grove text-white text-sm font-semibold tracking-wide hover:bg-sage transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <div>
              <h1 className="font-display text-3xl font-semibold text-bark mb-1">Reset your password</h1>
              <p className="text-clay text-sm mb-8">Enter and confirm your new password below.</p>

              {error && (
                <div className="border-l-2 border-earth bg-white px-4 py-3 mb-6">
                  <p className="text-sm text-earth">{error}</p>
                  {error.includes('invalid or has expired') && (
                    <Link
                      to="/forgot-password"
                      className="text-xs text-grove underline underline-offset-2 hover:text-bark transition-colors mt-1 block"
                    >
                      Request a new reset link →
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label text-clay/70 block mb-2">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-grove transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label text-clay/70 block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-3 bg-white border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-grove transition-colors"
                  />
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <p className={`text-xs ${password === confirmPassword ? 'text-grove' : 'text-earth'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || (confirmPassword && password !== confirmPassword)}
                  className="w-full py-3.5 bg-grove text-white text-sm font-semibold tracking-wide hover:bg-sage transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </form>

              <p className="text-center text-clay text-sm mt-8">
                <Link to="/login" className="text-grove font-medium hover:text-bark transition-colors underline underline-offset-2">
                  ← Back to Sign In
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  )
}
