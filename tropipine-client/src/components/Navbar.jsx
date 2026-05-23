import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const cart = useSelector((state) => state.cart.items)
  const wishlist = useSelector((state) => state.wishlist.items)

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

  return (
    <header className="sticky top-0 z-50 bg-[#F6F1E8]/95 backdrop-blur-md border-b border-[#E7DBCF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <span className="text-2xl">🍍</span>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1E1E1E]">
                TropiPine
              </h1>

              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8B5E3C]">
                Tropical Fruits
              </p>
            </div>
          </Link>

          {/* ================= NAV LINKS ================= */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="
                  text-[#5A5149]
                  hover:text-[#1E1E1E]
                  transition-colors duration-300
                  text-sm
                  font-medium
                "
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden md:flex items-center gap-5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-[#5A5149] hover:text-[#8B5E3C] transition-colors duration-300"
            >
              <FaHeart size={18} />

              {wishlist.length > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2
                    w-4 h-4 rounded-full
                    bg-[#8B5E3C]
                    text-white text-[9px]
                    flex items-center justify-center
                  "
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-[#5A5149] hover:text-[#8B5E3C] transition-colors duration-300"
            >
              <FaShoppingCart size={18} />

              {cart.length > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2
                    w-4 h-4 rounded-full
                    bg-[#8B5E3C]
                    text-white text-[9px]
                    flex items-center justify-center
                  "
                >
                  {cart.length}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-[#5A5149] hover:text-[#1E1E1E] transition-colors duration-300"
                >
                  <FaUser size={16} />

                  <span className="text-sm font-medium">
                    {user.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    text-sm
                    font-medium
                    text-[#8B5E3C]
                    hover:text-black
                    transition-colors duration-300
                  "
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="
                    text-sm
                    font-medium
                    text-[#5A5149]
                    hover:text-black
                    transition-colors duration-300
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    bg-[#1F1F1F]
                    hover:bg-black
                    text-white
                    px-5 py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all duration-300
                  "
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#1E1E1E]"
          >
            {mobileOpen ? (
              <FaTimes size={22} />
            ) : (
              <FaBars size={22} />
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-6"
            >
              <div className="border-t border-[#E7DBCF] pt-5 space-y-4">
                {/* NAV LINKS */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="
                      block
                      text-[#5A5149]
                      hover:text-black
                      transition-colors duration-300
                      font-medium
                    "
                  >
                    {link.name}
                  </Link>
                ))}

                {/* ICON LINKS */}
                <div className="flex gap-6 pt-2">
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2 text-[#5A5149]"
                  >
                    <FaHeart />
                    Wishlist
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-[#5A5149]"
                  >
                    <FaShoppingCart />
                    Cart
                  </Link>
                </div>

                {/* AUTH */}
                {user ? (
                  <div className="pt-3 space-y-4">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-[#5A5149]"
                    >
                      <FaUser />
                      {user.name}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="text-[#8B5E3C] font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-3">
                    <Link
                      to="/login"
                      className="
                        flex-1
                        text-center
                        border border-[#D6C6B8]
                        py-3 rounded-xl
                        font-medium
                      "
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="
                        flex-1
                        text-center
                        bg-[#1F1F1F]
                        text-white
                        py-3 rounded-xl
                        font-medium
                      "
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}