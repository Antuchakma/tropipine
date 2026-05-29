import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user } = useSelector((s) => s.auth)
  const cart = useSelector((s) => s.cart.items)
  const wishlist = useSelector((s) => s.wishlist.items)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
  ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-nav'
          : 'bg-white border-b border-edge'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="h-[68px] flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <div className="leading-none">
              <span className="block text-[17px] font-bold font-display text-ink tracking-tight">
                TropiPine
              </span>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-brand-500 font-medium mt-0.5">
                Tropical Fruits
              </span>
            </div>
          </Link>

          {/* NAV LINKS  desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT  desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
            >
              <FaHeart size={16} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold shadow-brand">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
            >
              <FaShoppingCart size={16} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold shadow-brand">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                    <FaUser size={11} className="text-brand-600" />
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <FaChevronDown size={10} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-edge py-1.5 overflow-hidden"
                    >
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors">
                        <FaUser size={12} /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors">
                         My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors">
                        <FaHeart size={12} /> Wishlist
                      </Link>
                      <div className="mx-3 my-1 border-t border-edge" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                         Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 ml-1">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white gradient-brand rounded-xl shadow-brand hover:shadow-lg hover:opacity-90 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile trigger */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative text-ink-muted">
              <FaShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center text-ink"
            >
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-edge overflow-hidden bg-white"
          >
            <div className="max-w-7xl mx-auto px-5 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive(link.path)
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-ink-muted hover:text-ink hover:bg-surface'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-edge mt-2">
                {user ? (
                  <div className="space-y-1">
                    <Link to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:bg-surface"> {user.name}</Link>
                    <Link to="/wishlist" className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:bg-surface"> Wishlist ({wishlist.length})</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"> Sign Out</button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-1">
                    <Link to="/login" className="flex-1 text-center py-3 rounded-xl border border-edge text-sm font-medium text-ink-muted hover:bg-surface">Sign in</Link>
                    <Link to="/register" className="flex-1 text-center py-3 rounded-xl text-sm font-semibold text-white gradient-brand shadow-brand">Get Started</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
