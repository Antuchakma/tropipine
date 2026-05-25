import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',  icon: '◈',  emoji: '📊' },
  { to: '/products',  label: 'Products',   icon: '▦',  emoji: '🛍️' },
  { to: '/inventory', label: 'Inventory',  icon: '▤',  emoji: '📦' },
  { to: '/orders',    label: 'Orders',     icon: '▣',  emoji: '🧾' },
  { to: '/payments',  label: 'Payments',   icon: '◉',  emoji: '💳' },
  { to: '/coupons',   label: 'Coupons',    icon: '◌',  emoji: '🎟️' },
  { to: '/customers', label: 'Customers',  icon: '◎',  emoji: '👥' },
  { to: '/analytics', label: 'Analytics',  icon: '◐',  emoji: '📈' },
  { to: '/gallery',   label: 'Gallery',    icon: '◧',  emoji: '🖼️' },
  { to: '/settings',  label: 'Settings',   icon: '◩',  emoji: '⚙️' },
];

const sidebarGroups = [
  { label: 'Overview',   items: navItems.slice(0, 1) },
  { label: 'Catalogue',  items: navItems.slice(1, 3) },
  { label: 'Commerce',   items: navItems.slice(3, 6) },
  { label: 'Insights',   items: navItems.slice(6, 9) },
  { label: 'System',     items: navItems.slice(9) },
];

export default function AdminLayout({ children }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin-login');
  };

  const currentPage = navItems.find((n) => n.to === location.pathname);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-60 flex flex-col shrink-0"
        style={{ background: 'var(--color-sidebar)' }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg"
              style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' }}
            >
              🍍
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                TropiPine
              </p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
                    style={{
                      color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      background: active ? 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' : 'transparent',
                      boxShadow: active ? '0 4px 14px rgba(255,92,46,0.4)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span className="text-base leading-none">{item.emoji}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-5 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' }}
            >
              {user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-white/35 text-[10px] truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/90 transition-all duration-150"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-8 border-b shrink-0"
          style={{ background: '#FFFFFF', borderColor: 'var(--color-edge)' }}
        >
          <div>
            <h1
              className="text-lg font-bold text-ink leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {currentPage?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #FF5C2E 0%, #FF8557 100%)' }}
            >
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
