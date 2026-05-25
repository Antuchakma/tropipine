import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/authSlice';
import api from '../utils/api';

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
    <div className="min-h-screen flex" style={{ background: '#0D0F1C' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'linear-gradient(135deg, #FF5C2E, #FF8557)' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 blur-[80px]"
          style={{ background: '#6366F1' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' }}>
            🍍
          </div>
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>TropiPine</p>
            <p className="text-white/30 text-xs">Admin Dashboard</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Manage your<br />
            <span style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              fruit empire.
            </span>
          </h1>
          <p className="text-white/45 text-base leading-relaxed max-w-sm">
            Track orders, manage inventory, verify payments, and grow your tropical fruit business — all in one place.
          </p>
        </div>

        <div className="relative flex gap-8">
          {[['10K+', 'Happy Customers'], ['99%', 'Uptime'], ['4.9★', 'App Rating']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{val}</p>
              <p className="text-white/35 text-xs mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' }}>
              🍍
            </div>
            <p className="text-white font-bold text-lg">TropiPine Admin</p>
          </div>

          <div className="rounded-2xl border border-white/10 p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Sign In</h2>
            <p className="text-white/40 text-sm mb-7">Access your admin dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-400 transition"
                  style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-400 transition"
                  style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' }}
                  required
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)', boxShadow: '0 4px 14px rgba(255,92,46,0.4)' }}
              >
                {loading ? 'Signing in…' : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="text-white/25 text-xs text-center mt-5">
              Demo: admin@tropipine.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
