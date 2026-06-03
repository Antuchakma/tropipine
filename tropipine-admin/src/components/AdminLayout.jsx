import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../utils/api';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/orders', label: 'Orders' },
  { to: '/payments', label: 'Payments' },
  { to: '/coupons', label: 'Coupons' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/customers', label: 'Customers' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/settings', label: 'Settings' },
];

const sidebarGroups = [
  { label: 'Overview',  items: navItems.slice(0, 1) },
  { label: 'Catalogue', items: navItems.slice(1, 3) },
  { label: 'Commerce',  items: navItems.slice(3, 7) },
  { label: 'Insights',  items: navItems.slice(7, 10) },
  { label: 'System',    items: navItems.slice(10) },
];

export default function AdminLayout({ children }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const lastCheck = useRef(new Date().toISOString());

  useEffect(() => {
    const poll = () => {
      api
        .get(`/orders/notifications?since=${encodeURIComponent(lastCheck.current)}`)
        .then((r) => {
          const latest = r.data.data?.latest || [];
          const newOnes = latest.filter((o) => new Date(o.createdAt) > new Date(lastCheck.current));
          if (newOnes.length > 0) {
            setNotifications((prev) => [...newOnes, ...prev].slice(0, 8));
          }
          lastCheck.current = new Date().toISOString();
        })
        .catch(() => {});
    };
    poll();
    const id = setInterval(poll, 30000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin-login');
  };

  const currentPage = navItems.find((n) => n.to === location.pathname);
  const unreadCount = notifications.length;

  return (
    <div className="flex min-h-screen bg-surface-alt">

      {/* ─── SIDEBAR ─── */}
      <aside className="w-60 flex flex-col shrink-0 bg-sidebar border-r border-white/6">

        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 flex items-center justify-center text-white text-xs font-bold tracking-widest shrink-0">
              TP
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                TropiPine
              </p>
              <p className="text-white/35 text-[9px] uppercase tracking-[0.18em] mt-1">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.18em] text-white/28 font-medium">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-3 py-2 text-sm font-medium mb-px transition-colors ${
                      active
                        ? 'bg-brand-500 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-5 border-t border-white/6">
          <p className="text-white text-xs font-medium truncate mb-0.5">{user?.name || 'Admin'}</p>
          <p className="text-white/30 text-[10px] truncate mb-3">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium text-white/60 border border-white/10 hover:bg-white/6 hover:text-white/80 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 flex items-center justify-between px-8 bg-white border-b border-edge shrink-0">
          <h1
            className="text-lg font-semibold text-ink"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            {currentPage?.label || 'Admin'}
          </h1>

          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-1.5 border border-edge hover:bg-surface-alt transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-edge shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-edge text-xs font-semibold text-ink uppercase tracking-widest">
                    New Orders
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-5 text-sm text-ink-muted">No new orders</p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto">
                      {notifications.map((o) => (
                        <li key={o.id} className="px-4 py-3 border-b border-edge text-sm hover:bg-surface-alt transition-colors">
                          <p className="font-medium text-ink">{o.orderNumber}</p>
                          <p className="text-ink-muted text-xs mt-0.5">{o.user?.name} · ৳{o.totalAmount}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setShowNotif(false)}
                    className="block px-4 py-3 text-center text-xs font-medium text-brand-500 hover:bg-surface-alt border-t border-edge transition-colors"
                  >
                    View all orders →
                  </Link>
                </div>
              )}
            </div>

            <span className="text-xs text-ink-muted hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
