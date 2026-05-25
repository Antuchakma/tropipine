import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess, loginError } from '../store/slices/authSlice'
import api from '../services/api'

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

  return (
    <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center px-6">

      {/* ================= CARD ================= */}
      <div className="w-full max-w-md">

        <div className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm p-10">

          {/* TITLE */}
          <h1 className="text-3xl font-black text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-[#6A625B] text-sm mb-8">
            Sign in to continue your fresh journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-[#F6F1E8] border border-[#E7DBCF] text-[#8B5E3C] px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="
                  w-full px-4 py-3
                  rounded-2xl
                  border border-[#E7DBCF]
                  bg-[#F6F1E8]/40
                  outline-none
                  focus:border-[#8B5E3C]
                  transition
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="
                  w-full px-4 py-3
                  rounded-2xl
                  border border-[#E7DBCF]
                  bg-[#F6F1E8]/40
                  outline-none
                  focus:border-[#8B5E3C]
                  transition
                "
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#8B5E3C]
                hover:bg-[#7a4e2f]
                text-white
                py-3
                rounded-2xl
                font-medium
                transition-all duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* LINKS */}
          <div className="text-center mt-6 space-y-3">

            <p className="text-sm text-[#6A625B]">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-[#8B5E3C] font-medium hover:underline"
              >
                Register
              </Link>
            </p>

            <Link
              to="/forgot-password"
              className="text-xs text-[#8A817A] hover:text-[#8B5E3C]"
            >
              Forgot password?
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}