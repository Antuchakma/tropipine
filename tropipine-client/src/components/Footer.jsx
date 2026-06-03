import { Link } from 'react-router-dom'

const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/45 hover:text-white hover:border-white/50 transition-all duration-200"
  >
    {children}
  </a>
)

export default function Footer() {
  return (
    <footer className="bg-bark text-white">

      {/* Top promise strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Farm to Door', sub: 'Grown on our own CHT farms.' },
            { label: 'Same-Day Dhaka', sub: 'Order before noon for today.' },
            { label: 'Hillside Graded', sub: 'Every batch hand-selected at source.' },
            { label: 'Secure Checkout', sub: 'bKash · Nagad · Rocket · COD' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-px h-8 bg-grove mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-white/80">{item.label}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="label text-white/35 mb-2">Newsletter</p>
            <p className="font-display text-xl font-semibold text-white">Harvest updates, seasonal drops & hill stories</p>
          </div>
          <form className="flex w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 bg-white/6 border border-white/12 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/35 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-bark text-xs font-medium tracking-widest uppercase hover:bg-cream transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <p className="font-display text-2xl font-semibold italic text-white mb-1">TropiPine</p>
          <p className="text-[10px] text-white/30 tracking-widest uppercase mb-5">Chittagong Hill Tracts · Est. 2019</p>
          <p className="text-sm leading-relaxed text-white/40 mb-7">
            Premium fruits grown on our own farms in Bandarban, Rangamati, and Khagrachhari — delivered fresh to your door.
          </p>
          <div className="flex gap-2">
            <SocialIcon href="#" label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="Twitter / X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </SocialIcon>
          </div>
        </div>

        {/* Explore */}
        <div>
          <p className="label text-white/30 mb-6">Explore</p>
          <ul className="space-y-3.5">
            {[
              { name: 'All Fruits', to: '/shop' },
              { name: 'Hill Exclusives', to: '/shop?isExclusive=true' },
              { name: 'Best Sellers', to: '/shop?isBestSeller=true' },
              { name: 'Gallery', to: '/gallery' },
              { name: 'Our Story', to: '/about' },
              { name: 'Contact', to: '/contact' },
            ].map((l) => (
              <li key={l.name}>
                <Link to={l.to} className="text-sm text-white/40 hover:text-white/80 transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="label text-white/30 mb-6">Account</p>
          <ul className="space-y-3.5">
            {[
              { name: 'My Profile', to: '/profile' },
              { name: 'My Orders', to: '/orders' },
              { name: 'Track Order', to: '/track-order' },
              { name: 'Wishlist', to: '/wishlist' },
              { name: 'Cart', to: '/cart' },
            ].map((l) => (
              <li key={l.name}>
                <Link to={l.to} className="text-sm text-white/40 hover:text-white/80 transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="label text-white/30 mb-6">Contact</p>
          <ul className="space-y-5 text-sm">
            <li>
              <p className="label text-white/20 text-[10px] mb-1">Phone</p>
              <p className="text-white/45">+880 1234-567890</p>
            </li>
            <li>
              <p className="label text-white/20 text-[10px] mb-1">Email</p>
              <p className="text-white/45">hello@tropipine.com</p>
            </li>
            <li>
              <p className="label text-white/20 text-[10px] mb-1">Sourced From</p>
              <p className="text-white/45">Bandarban · Rangamati · Khagrachhari</p>
            </li>
            <li className="pt-2">
              <Link
                to="/contact"
                className="label text-[10px] text-white/40 border-b border-white/20 hover:text-white/70 hover:border-white/50 transition-colors pb-0.5"
              >
                Send a message →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/22">
          <span>© {new Date().getFullYear()} TropiPine. Proudly from the Chittagong Hill Tracts.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/45 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/45 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/45 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>

    </footer>
  )
}
