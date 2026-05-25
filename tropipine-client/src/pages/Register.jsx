import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/slices/authSlice'
import api from '../services/api'

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

      const { user, token } = response.data.data

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

  return (
    <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm p-10">
          <h1 className="text-3xl font-black text-center mb-2">Join TropiPine</h1>
          <p className="text-center text-[#6A625B] text-sm mb-8">Create your account to start shopping</p>

          {error && (
            <div className="mb-6 bg-[#F6F1E8] border border-[#E7DBCF] text-[#8B5E3C] px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DBCF] bg-[#F6F1E8]/40 outline-none focus:border-[#8B5E3C] transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DBCF] bg-[#F6F1E8]/40 outline-none focus:border-[#8B5E3C] transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DBCF] bg-[#F6F1E8]/40 outline-none focus:border-[#8B5E3C] transition"
                placeholder="+880 1234-567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DBCF] bg-[#F6F1E8]/40 outline-none focus:border-[#8B5E3C] transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5149] mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DBCF] bg-[#F6F1E8]/40 outline-none focus:border-[#8B5E3C] transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5E3C] hover:bg-[#7a4e2f] text-white py-3 rounded-2xl font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#6A625B] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8B5E3C] hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
