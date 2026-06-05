import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logout } from '../store/slices/authSlice'
import api from '../services/api'
import { usePageLoading } from '../context/LoadingContext'

const STATUS = {
  CONFIRMED:  { bg: '#EAF0E8', color: '#2A3B26' },
  DELIVERED:  { bg: '#EAF0E8', color: '#2A3B26' },
  PENDING:    { bg: '#F0EBE3', color: '#8C6F58' },
  PROCESSING: { bg: '#F0EBE3', color: '#4A3728' },
  SHIPPED:    { bg: '#F0EBE3', color: '#4A3728' },
  CANCELLED:  { bg: '#F5F0EB', color: '#B0A49C' },
  REFUNDED:   { bg: '#F5F0EB', color: '#B0A49C' },
}

const fmt      = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
const currency = (n) => `৳${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Profile() {
  const { user }  = useSelector((s) => s.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const setDataLoading = usePageLoading()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setDataLoading(true)
    api.get('/orders/my-orders')
      .then((r) => setOrders(r.data.orders || r.data.items || []))
      .catch(() => {})
      .finally(() => { setLoading(false); setDataLoading(false) })
  }, [user, navigate])

  if (!user) return null

  const firstName     = user.name?.split(' ')[0] || 'Member'
  const initials      = user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'M'
  const lastDelivered = orders.find((o) => o.status === 'DELIVERED')

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-stone">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 pt-28 pb-12">

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-clay/40" />
            <span className="text-clay text-[0.57rem] tracking-[0.24em] uppercase">Member profile</span>
          </div>

          <div className="flex items-end justify-between gap-8">
            <div className="flex items-end gap-6">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 mb-3 border-2 border-grove/25"
                style={{ background: 'rgba(74,107,60,0.07)' }}
              >
                <span className="font-display text-grove font-semibold text-xl leading-none">{initials}</span>
              </motion.div>
              <div>
                <p className="text-clay text-sm mb-1">{getGreeting()},</p>
                <h1
                  className="font-display text-bark font-semibold italic"
                  style={{ fontSize: 'clamp(3.8rem, 8vw, 7rem)', lineHeight: 0.85, letterSpacing: '-0.03em' }}
                >
                  {firstName}.
                </h1>
              </div>
            </div>
            <button
              onClick={() => { dispatch(logout()); navigate('/') }}
              className="text-clay text-xs tracking-[0.18em] uppercase hover:text-bark transition-colors mb-3 flex-shrink-0"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Fresh picks banner ─────────────────────────────────────────────── */}
      <div className="border-b border-stone" style={{ background: '#EEF2EA' }}>
        <div className="max-w-6xl mx-auto px-8 sm:px-12 py-7 flex items-center justify-between gap-6">
          <div>
            <p className="text-grove text-[0.57rem] tracking-[0.22em] uppercase mb-1.5">Fresh this season</p>
            <p className="font-display text-bark font-semibold text-xl leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {lastDelivered
                ? 'Loved your last order? Stock up again.'
                : 'Explore our freshest tropical picks.'}
            </p>
          </div>
          <Link
            to="/shop"
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-7 py-3 bg-bark text-cream text-xs tracking-[0.2em] uppercase hover:bg-grove transition-colors"
          >
            Shop now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 sm:px-12 py-12 grid lg:grid-cols-3 gap-12">

        {/* ── Orders ── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-bark font-semibold text-2xl">Order History</h2>
            {!loading && orders.length > 0 && (
              <span className="text-clay text-xs tracking-wide">{orders.length} orders</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-px bg-stone">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-cream animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-stone py-16 text-center">
              <p className="font-display text-2xl font-semibold text-bark mb-2">No orders yet</p>
              <p className="text-clay text-sm mb-8">Place your first order — fresh fruit delivered to your door.</p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-bark text-cream text-xs tracking-[0.2em] uppercase hover:bg-grove transition-colors"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="space-y-px bg-stone">
              {orders.map((order, i) => {
                const s = STATUS[order.status] || STATUS.PENDING
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-cream hover:bg-white transition-colors cursor-pointer group px-6 py-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-grove text-[0.58rem] tracking-[0.18em] uppercase font-medium">
                            {order.orderNumber || `#${order.id?.slice(0, 8).toUpperCase()}`}
                          </span>
                          <span className="text-stone">·</span>
                          <span className="text-clay text-xs">{fmt(order.createdAt)}</span>
                        </div>
                        <p
                          className="font-display text-bark font-semibold leading-none mb-1.5"
                          style={{ fontSize: '1.3rem', letterSpacing: '-0.01em' }}
                        >
                          {currency(order.totalAmount)}
                        </p>
                        {order.items?.length > 0 && (
                          <p className="text-clay text-xs truncate max-w-sm">
                            {order.items.slice(0, 3).map((it) => it.name).join(', ')}
                            {order.items.length > 3 ? ` +${order.items.length - 3} more` : ''}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className="text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1.5 font-medium"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {order.status}
                        </span>
                        <svg
                          className="text-stone group-hover:text-clay transition-colors flex-shrink-0"
                          width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.5"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Account card */}
          <div
            className="p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2C3E2D 0%, #1a271b 100%)' }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)' }}
              initial={{ x: '-100%' }}
              animate={{ x: '150%' }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
            />
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="absolute -right-4 top-12 w-20 h-20 rounded-full"   style={{ background: 'rgba(255,255,255,0.03)' }} />

            <div className="relative">
              <p className="text-cream/30 text-[0.55rem] tracking-[0.28em] uppercase mb-5">TropiPine Member</p>
              <p className="font-display text-cream font-semibold italic leading-none mb-1"
                style={{ fontSize: '1.7rem', letterSpacing: '-0.02em' }}>
                {user.name}
              </p>
              <p className="text-cream/40 text-xs mb-6">{user.email}</p>
              <div className="border-t border-white/10 pt-5 space-y-3">
                {user.phone && (
                  <div className="flex justify-between">
                    <span className="text-cream/30 text-[0.57rem] tracking-[0.18em] uppercase">Phone</span>
                    <span className="text-cream/70 text-xs">{user.phone}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-cream/30 text-[0.57rem] tracking-[0.18em] uppercase">Member since</span>
                    <span className="text-cream/70 text-xs">{fmt(user.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reorder nudge */}
          <div className="border border-grove/30 bg-mist px-6 py-5">
            <p className="text-grove text-[0.57rem] tracking-[0.2em] uppercase mb-2">
              {lastDelivered ? 'Order again' : 'Get started'}
            </p>
            <p className="font-display text-bark font-semibold text-lg leading-snug mb-4" style={{ letterSpacing: '-0.01em' }}>
              {lastDelivered
                ? `Running low on your favourites?`
                : 'Fresh fruit, zero hassle.'}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-grove text-xs tracking-[0.18em] uppercase hover:text-bark transition-colors"
            >
              Browse the shop
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Quick links */}
          <div className="border border-stone">
            {[
              { label: 'My wishlist',    to: '/wishlist',    icon: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' },
              { label: 'Track an order', to: '/track-order', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 110-2 1 1 0 010 2z' },
            ].map(({ label, to, icon }) => (
              <Link key={to} to={to}
                className="flex items-center justify-between px-5 py-4 border-b border-stone last:border-b-0 text-clay hover:text-bark hover:bg-bone transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                    {icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : 'M' + d} />)}
                  </svg>
                  <span className="text-sm">{label}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" className="text-stone group-hover:text-clay transition-colors">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Support note */}
          <div className="bg-mist border border-sage/20 px-5 py-4">
            <p className="text-grove text-xs leading-relaxed">
              To update your account details, contact us at{' '}
              <a href="mailto:support@tropipine.com"
                className="underline underline-offset-2 hover:text-bark transition-colors">
                support@tropipine.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
