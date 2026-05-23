import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function AdminLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">🍍 TropiPine</h1>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/products"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            🛍️ Products
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            📦 Orders
          </Link>
          <Link
            to="/payments"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            💳 Payments
          </Link>
          <Link
            to="/coupons"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            🎟️ Coupons
          </Link>
          <Link
            to="/gallery"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            🖼️ Gallery
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            ⚙️ Settings
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="mb-4 text-sm">
            <p className="text-gray-400">Logged in as:</p>
            <p className="font-semibold">{user?.name || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
