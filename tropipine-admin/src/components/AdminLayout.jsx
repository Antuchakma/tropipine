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
  { to: '/customers', label: 'Customers' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/settings', label: 'Settings' },
];

const sidebarGroups = [
  { label: 'Overview', items: navItems.slice(0, 1) },
  { label: 'Catalogue', items: navItems.slice(1, 3) },
  { label: 'Commerce', items: navItems.slice(3, 6) },
  { label: 'Insights', items: navItems.slice(6, 9) },
  { label: 'System', items: navItems.slice(9) },
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
    <div className="flex min-h-screen bg-[#F4F4F7]">
      <aside className="w-64 flex flex-col shrink-0 bg-[#121018] border-r border-white/5">
        <div className="px-6 pt-7 pb-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5C2E] flex items-center justify-center text-white text-sm font-bold">TP</div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">TropiPine</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/30 font-medium">{group.label}</p>
              {group.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                      active ? 'bg-[#FF5C2E] text-white' : 'text-white/55 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/8">
          <p className="text-white text-xs font-medium truncate">{user?.name || 'Admin'}</p>
          <p className="text-white/35 text-[10px] truncate mb-3">{user?.email}</p>
          <button type="button" onClick={handleLogout} className="w-full py-2 rounded-lg text-xs font-medium text-white/70 border border-white/12 hover:bg-white/8 transition">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-8 bg-white border-b border-[#E8E8F0] shrink-0">
          <h1 className="text-base font-semibold text-[#18181B]">{currentPage?.label || 'Admin'}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-lg border border-[#E8E8F0] hover:bg-[#F4F4F7] transition"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 text-[#52525B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5C2E] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E8E8F0] rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E8E8F0] font-semibold text-sm text-[#18181B]">New orders</div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-[#71717A]">No new orders</p>
                  ) : (
                    <ul className="max-h-64 overflow-y-auto">
                      {notifications.map((o) => (
                        <li key={o.id} className="px-4 py-3 border-b border-[#F4F4F7] text-sm hover:bg-[#FAFAFA]">
                          <p className="font-medium text-[#18181B]">{o.orderNumber}</p>
                          <p className="text-[#71717A] text-xs">{o.user?.name}  {o.totalAmount}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/orders" onClick={() => setShowNotif(false)} className="block px-4 py-3 text-center text-xs font-semibold text-[#FF5C2E] hover:bg-[#FFF3EE]">
                    View all orders
                  </Link>
                </div>
              )}
            </div>
            <span className="text-xs text-[#71717A] hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
