import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/authSlice';
import api from '../utils/api';
import { colors, glass } from '../theme.js';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@tropipine.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r = await api.post('/auth/login', { email, password });
      const { user, token } = r.data.data;
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        setError('Only admin users can access this dashboard.');
        return;
      }
      localStorage.setItem('adminToken', token);
      dispatch(setUser(user));
      dispatch(setToken(token));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: colors.sidebar }}>

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        {/* Subtle green glow */}
        <div className="absolute -top-32 -left-16 w-[480px] h-[480px] rounded-full opacity-20 blur-[140px]"
          style={{ background: colors.brand[500] }} />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] rounded-full opacity-10 blur-[100px]"
          style={{ background: colors.brand[400] }} />

        <div className="relative">
          <p
            className="text-white text-xl font-semibold leading-none"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            TropiPine
          </p>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mt-1.5">Admin Dashboard</p>
        </div>

        <div className="relative">
          <p className="label text-white/30 mb-5" style={{ letterSpacing: '0.2em' }}>
            Chittagong Hill Tracts
          </p>
          <h1
            className="text-white leading-none mb-6"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', fontWeight: 600 }}
          >
            Manage your<br />
            <em>hill harvest.</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Track orders, manage inventory, verify payments, and grow your fruit business — all in one place.
          </p>
        </div>

        <div className="relative flex gap-10">
          {[['2019', 'Est.'], ['CHT', 'Sourced'], ['3', 'Districts']].map(([val, lbl]) => (
            <div key={lbl}>
              <p
                className="text-white font-semibold text-2xl leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {val}
              </p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest mt-1.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          <div className="mb-8 lg:hidden">
            <p
              className="text-white text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TropiPine Admin
            </p>
          </div>

          <div
            className="border border-white/10 p-8"
            style={{ background: glass.card }}
          >
            <h2
              className="text-white font-semibold text-2xl mb-1 leading-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              Sign In
            </h2>
            <p className="text-white/35 text-sm mb-7">Access your admin dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-white/45 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                  style={{ background: glass.inputBg, borderColor: glass.inputBorder }}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-white/45 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                  style={{ background: glass.inputBg, borderColor: glass.inputBorder }}
                  required
                />
              </div>

              {error && (
                <div
                  className="px-4 py-3 text-sm"
                  style={{ background: colors.error.faded, color: colors.error.light, border: `1px solid ${colors.error.fadedBorder}` }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: colors.brand[500] }}
              >
                {loading ? 'Signing in…' : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="text-white/20 text-xs text-center mt-5">
              admin@tropipine.com · admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
