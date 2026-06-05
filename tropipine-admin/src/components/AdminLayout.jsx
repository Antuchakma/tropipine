import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../utils/api';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products',  label: 'Products' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/orders',    label: 'Orders' },
  { to: '/payments',  label: 'Payments' },
  { to: '/coupons',   label: 'Coupons' },
  { to: '/reviews',   label: 'Reviews' },
  { to: '/customers', label: 'Customers' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/settings',  label: 'Settings' },
];

const sidebarGroups = [
  { label: 'Overview',  items: navItems.slice(0, 1) },
  { label: 'Catalogue', items: navItems.slice(1, 3) },
  { label: 'Commerce',  items: navItems.slice(3, 7) },
  { label: 'Insights',  items: navItems.slice(7, 10) },
  { label: 'System',    items: navItems.slice(10) },
];

function NotifIcon({ type }) {
  if (type === 'payment') {
    return (
      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  }
  if (type === 'stock_alert') {
    return (
      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function AdminLayout({ children }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [badges, setBadges]               = useState({ orders: 0, payments: 0 });
  const [showNotif, setShowNotif]         = useState(false);
  const notifRef = useRef(null);
  const lastCheck = useRef(new Date(Date.now() - 30000).toISOString());

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close sidebar on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Notification polling
  useEffect(() => {
    const poll = async () => {
      try {
        const r = await api.get(`/orders/notifications?since=${encodeURIComponent(lastCheck.current)}`);
        const data = r.data.data;
        setBadges({
          orders:   data.orders?.pendingCount   ?? 0,
          payments: data.payments?.pendingCount ?? 0,
        });
        const cutoff  = new Date(lastCheck.current);
        const newOrds   = (data.orders?.latest       || []).filter((o) => new Date(o.createdAt) > cutoff);
        const newPays   = (data.payments?.latest     || []).filter((p) => new Date(p.createdAt) > cutoff);
        const newAlerts = (data.stockAlerts?.latest  || []).filter((a) => new Date(a.createdAt) > cutoff);
        const incoming = [
          ...newOrds.map((o) => ({ ...o, type: 'order' })),
          ...newPays.map((p) => ({ ...p, type: 'payment' })),
          ...newAlerts.map((a) => ({ ...a, type: 'stock_alert' })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (incoming.length > 0) {
          setNotifications((prev) => [...incoming, ...prev].slice(0, 12));
          setUnreadCount((c) => c + incoming.length);
        }
        lastCheck.current = new Date().toISOString();
      } catch { /* silent */ }
    };
    poll();
    const id = setInterval(poll, 30000);
    return () => clearInterval(id);
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpenNotif = () => {
    setShowNotif((v) => !v);
    setUnreadCount(0);
  };
  const handleLogout = () => { dispatch(logout()); navigate('/admin-login'); };
  const currentPage = navItems.find((n) => n.to === location.pathname);

  return (
    <div className="flex min-h-screen bg-surface-alt">

      {/* ─── MOBILE OVERLAY ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-white/6
        transition-transform duration-300 ease-in-out
        md:relative md:z-auto md:translate-x-0 md:w-60
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Logo + mobile close */}
        <div className="px-5 pt-6 pb-5 border-b border-white/6 flex items-center justify-between">
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
          {/* Close button — mobile only */}
          <button
            className="md:hidden text-white/50 hover:text-white transition-colors p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                const badge  =
                  item.to === '/orders'   ? badges.orders :
                  item.to === '/payments' ? badges.payments : 0;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium mb-px rounded-lg transition-colors ${
                      active
                        ? 'bg-brand-500 text-white'
                        : 'text-white/55 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <span>{item.label}</span>
                    {badge > 0 && (
                      <span
                        className={`px-1.5 rounded-full text-[9px] font-bold flex items-center justify-center leading-none ${
                          active ? 'bg-white/30 text-white' :
                          item.to === '/payments' ? 'bg-orange-400 text-white' : 'bg-brand-400 text-white'
                        }`}
                        style={{ minWidth: '18px', height: '18px' }}
                      >
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/6">
          <p className="text-white text-xs font-medium truncate mb-0.5">{user?.name || 'Admin'}</p>
          <p className="text-white/30 text-[10px] truncate mb-3">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium text-white/60 border border-white/10 rounded-lg hover:bg-white/8 hover:text-white/80 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 md:px-8 bg-white border-b border-edge shrink-0 gap-3">

          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden p-1.5 text-ink-muted hover:text-ink hover:bg-surface-alt rounded-lg transition-colors shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <HamburgerIcon />
            </button>
            <h1
              className="text-base md:text-lg font-semibold text-ink truncate"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              {currentPage?.label || 'Admin'}
            </h1>
          </div>

          {/* Right: bell + date */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={handleOpenNotif}
                className="relative p-1.5 border border-edge rounded-lg hover:bg-surface-alt transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification panel */}
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-edge shadow-xl z-50 overflow-hidden rounded-xl"
                  style={{ width: 'min(20rem, calc(100vw - 1rem))' }}>

                  {/* Panel header */}
                  <div className="px-4 py-3 border-b border-edge flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-ink uppercase tracking-widest">Activity</span>
                    <div className="flex items-center gap-3 text-[10px] font-semibold flex-wrap">
                      {badges.orders > 0 && (
                        <Link to="/orders" onClick={() => setShowNotif(false)}
                          className="flex items-center gap-1 text-brand-500 hover:text-brand-600">
                          <span className="bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full">{badges.orders}</span>
                          pending orders
                        </Link>
                      )}
                      {badges.payments > 0 && (
                        <Link to="/payments" onClick={() => setShowNotif(false)}
                          className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
                          <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">{badges.payments}</span>
                          pending payments
                        </Link>
                      )}
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-ink-muted">No recent activity</p>
                      <p className="text-xs text-ink-faint mt-1">New orders and payments will appear here</p>
                    </div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-edge">
                      {notifications.map((n) => (
                        <li key={`${n.type}-${n.id}`}>
                          <Link
                            to="/orders"
                            onClick={() => setShowNotif(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-surface-alt transition-colors"
                          >
                            <NotifIcon type={n.type} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-ink truncate">
                                {n.type === 'payment'     ? 'Payment submitted' :
                                 n.type === 'stock_alert' ? '⚠ Stock insufficient' : 'New order'}
                                {' · '}
                                <span className="font-mono">{n.orderNumber}</span>
                              </p>
                              <p className="text-[11px] text-ink-muted mt-0.5 truncate">
                                {n.type === 'stock_alert'
                                  ? n.detail
                                  : `${n.customerName} · ৳${n.type === 'payment' ? n.amount : n.totalAmount}`}
                              </p>
                            </div>
                            <span className="text-[10px] text-ink-faint shrink-0 mt-0.5">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="border-t border-edge grid grid-cols-2 divide-x divide-edge">
                    <Link to="/orders" onClick={() => setShowNotif(false)}
                      className="py-2.5 text-center text-[11px] font-medium text-brand-500 hover:bg-surface-alt transition-colors">
                      All orders →
                    </Link>
                    <Link to="/payments" onClick={() => setShowNotif(false)}
                      className="py-2.5 text-center text-[11px] font-medium text-orange-500 hover:bg-surface-alt transition-colors">
                      All payments →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <span className="text-xs text-ink-muted hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
