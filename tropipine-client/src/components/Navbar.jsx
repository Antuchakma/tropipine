import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { AnimatePresence, motion } from 'framer-motion'

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

  const isTransparentPage = ['/', '/gallery'].includes(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { name: 'Shop',        path: '/shop' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Gallery',     path: '/gallery' },
    { name: 'About',       path: '/about' },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  const isGallery = location.pathname === '/gallery'
  const transparent = isGallery
    ? !mobileOpen
    : (isTransparentPage && !scrolled && !mobileOpen)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-gradient-to-b from-bark/50 to-transparent border-transparent'
            : 'bg-cream border-b border-stone'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="h-16 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className={`font-display text-2xl font-medium italic tracking-tight transition-colors duration-300 ${
                transparent ? 'text-white' : 'text-bark'
              }`}>
                TropiPine
              </span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`label font-semibold transition-colors duration-200 ${
                    isActive(link.path)
                      ? transparent ? 'text-white' : 'text-grove'
                      : transparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-grove hover:text-bark'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right actions — desktop */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                to="/wishlist"
                className={`relative transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-grove hover:text-bark'
                }`}
                aria-label="Wishlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-grove text-white text-[8px] flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className={`relative transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-grove hover:text-bark'
                }`}
                aria-label="Cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-grove text-white text-[8px] flex items-center justify-center font-medium">
                    {cart.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`label flex items-center gap-1.5 transition-colors duration-200 ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-grove hover:text-bark'
                    }`}
                  >
                    {user.name.split(' ')[0]}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-44 bg-white border border-stone shadow-lift"
                      >
                        <Link to="/profile" className="block px-5 py-3 text-xs text-grove hover:text-bark hover:bg-cream transition-colors tracking-wide">My Profile</Link>
                        <Link to="/orders"  className="block px-5 py-3 text-xs text-grove hover:text-bark hover:bg-cream transition-colors tracking-wide">My Orders</Link>
                        <Link to="/wishlist" className="block px-5 py-3 text-xs text-grove hover:text-bark hover:bg-cream transition-colors tracking-wide">Wishlist</Link>
                        <div className="border-t border-stone" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-5 py-3 text-xs text-grove hover:text-bark hover:bg-cream transition-colors tracking-wide"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <Link
                    to="/login"
                    className={`label transition-colors duration-200 ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-grove hover:text-bark'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={`label font-semibold px-4 py-2 border transition-all duration-200 ${
                      transparent
                        ? 'border-white/70 text-white hover:bg-white hover:text-bark'
                        : 'border-grove text-grove hover:bg-grove hover:text-white'
                    }`}
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile trigger */}
            <div className="md:hidden flex items-center gap-4">
              <Link to="/cart" className={`relative ${transparent ? 'text-white/70' : 'text-grove'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-grove text-white text-[8px] flex items-center justify-center font-medium">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`w-7 h-7 flex flex-col justify-center gap-1.5 ${transparent ? 'text-white' : 'text-bark'}`}
                aria-label="Toggle menu"
              >
                <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-bark/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-cream shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-7 h-16 border-b border-stone flex-shrink-0">
                <span className="font-display text-xl font-medium italic text-bark">TropiPine</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-clay hover:text-bark transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-7 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.06 + i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between py-4 border-b border-stone/60 group ${
                        isActive(link.path) ? 'text-bark' : 'text-grove hover:text-bark'
                      } transition-colors`}
                    >
                      <span className="label font-semibold">
                        {link.name}
                      </span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5"
                        className="text-stone group-hover:text-clay transition-colors">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Auth footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.22 }}
                className="px-7 py-6 border-t border-stone flex-shrink-0"
              >
                {user ? (
                  <div>
                    <p className="text-clay text-[0.55rem] tracking-[0.22em] uppercase mb-3">Account</p>
                    <Link to="/profile"
                      className="flex items-center justify-between py-3 border-b border-stone/60 text-grove hover:text-bark transition-colors group">
                      <span className="text-sm">{user.name}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="text-stone group-hover:text-clay">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                    <Link to="/wishlist"
                      className="flex items-center justify-between py-3 border-b border-stone/60 text-grove hover:text-bark transition-colors group">
                      <span className="text-sm">Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="text-stone group-hover:text-clay">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-3 text-sm text-clay hover:text-bark transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login"
                      className="w-full text-center py-3 border border-grove text-sm text-grove hover:bg-grove hover:text-white transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register"
                      className="w-full text-center py-3 bg-bark text-white text-sm hover:bg-grove transition-colors">
                      Join Now
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
