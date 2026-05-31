import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-24">
      {/* Top strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-2">Stay fresh with TropiPine</h3>
            <p className="text-white/50 text-sm">Seasonal deals and harvest updates, straight to your inbox.</p>
          </div>
          <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm placeholder-white/40 focus:outline-none focus:border-brand-400 transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-brand hover:opacity-90 transition flex items-center gap-1.5"
            >
              Subscribe <FaArrowRight size={11} />
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-5">
            <span className="font-display text-lg font-bold">TropiPine</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Premium tropical fruits delivered farm-fresh to your door. Handpicked. Always fresh.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <FaFacebook size={15} />, href: '#' },
              { icon: <FaTwitter size={15} />, href: '#' },
              { icon: <FaInstagram size={15} />, href: '#' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-brand-400 hover:bg-brand-500/20 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-5">Explore</h4>
          <ul className="space-y-3">
            {[
              { name: 'Home', to: '/' },
              { name: 'Shop All Fruits', to: '/shop' },
              { name: 'Gallery', to: '/gallery' },
              { name: 'About Us', to: '/about' },
              { name: 'Contact', to: '/contact' },
              { name: 'Track Order', to: '/track-order' },
            ].map((l) => (
              <li key={l.name}>
                <Link to={l.to} className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-5">Account</h4>
          <ul className="space-y-3">
            {[
              { name: 'My Profile', to: '/profile' },
              { name: 'My Orders', to: '/orders' },
              { name: 'Wishlist', to: '/wishlist' },
              { name: 'Cart', to: '/cart' },
            ].map((l) => (
              <li key={l.name}>
                <Link to={l.to} className="text-sm text-white/55 hover:text-white transition-colors duration-200">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-5">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-white/55">
              <FaPhone className="mt-0.5 shrink-0 text-brand-400" size={13} />
              <span>+880 1234-567890</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/55">
              <FaEnvelope className="mt-0.5 shrink-0 text-brand-400" size={13} />
              <span>info@tropipine.com</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/55">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-brand-400" size={13} />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <span> {new Date().getFullYear()} TropiPine. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
