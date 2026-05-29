import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { FaArrowRight, FaStar, FaLeaf } from 'react-icons/fa'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
})

const features = [
  { icon: '🌿', title: 'Farm to Door', desc: 'Harvested daily from trusted farms across Bangladesh.' },
  { icon: '⚡', title: 'Fast Delivery', desc: 'Same-day delivery within Dhaka. Next-day nationwide.' },
  { icon: '🔒', title: 'Secure Payment', desc: 'Pay via bKash, Nagad, Rocket or Cash on Delivery.' },
  { icon: '📦', title: 'Safe Packaging', desc: 'Temperature-controlled packaging keeps every fruit perfect.' },
]

const testimonials = [
  { name: 'Ayesha Rahman', loc: 'Dhaka', rating: 5, text: 'The Haribhanga mangoes were absolutely divine — perfectly ripe and fragrant. Will reorder!' },
  { name: 'Rahim Chowdhury', loc: 'Chittagong', rating: 5, text: 'Super fresh quality. The packaging was excellent and delivery was right on time.' },
  { name: 'Nadia Islam', loc: 'Sylhet', rating: 5, text: "Best online fruit shop I've used. The exclusive collection is genuinely premium." },
]

const stats = [
  { value: '5,000+', label: 'Happy Customers' },
  { value: '50+', label: 'Fruit Varieties' },
  { value: '98%', label: 'On-time Delivery' },
  { value: '4.9★', label: 'Average Rating' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [exclusive, setExclusive] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products?isFeatured=true&limit=6').catch(() => ({ data: { items: [] } })),
      api.get('/products?isExclusive=true&limit=4').catch(() => ({ data: { items: [] } })),
    ]).then(([featRes, excRes]) => {
      setFeatured(featRes.data.items || [])
      setExclusive(excRes.data.items || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-surface overflow-x-hidden">

      {/* ── ANNOUNCEMENT STRIP ─────────────────────────── */}
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-2.5 flex items-center justify-between gap-4">
          <p className="text-xs text-white/60 hidden sm:block">Mango Season 2026 — Rajshahi &amp; Chapainawabganj</p>
          <p className="text-xs text-white/90 font-medium text-center flex-1 sm:flex-none sm:text-left">
            🎉 Use code <span className="font-bold text-brand-400">WELCOME20</span> for 20% off your first order
          </p>
          <Link to="/shop" className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 whitespace-nowrap flex items-center gap-1 transition-colors">
            Shop Now <FaArrowRight size={9} />
          </Link>
        </div>
      </div>

      {/* ── HERO  ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left — Editorial text */}
          <div className="space-y-8 order-2 lg:order-1">
            <motion.div {...fade(0.05)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold">
              <FaLeaf size={10} />
              Season Harvest 2026
            </motion.div>

            <motion.h1 {...fade(0.1)} className="font-display text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-ink text-balance">
              From The&nbsp;Farm,<br />
              <span className="text-brand-500">Straight&nbsp;to</span><br />
              Your&nbsp;Door.
            </motion.h1>

            <motion.p {...fade(0.18)} className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-md">
              Handpicked premium mangoes, lychees, and seasonal fruits — delivered with care from the farms of Rajshahi and Chapainawabganj.
            </motion.p>

            <motion.div {...fade(0.26)} className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl gradient-brand text-white font-bold shadow-brand hover:shadow-lg hover:opacity-90 transition-all duration-200"
              >
                Shop Now
                <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop?isExclusive=true"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white border border-edge text-ink font-semibold hover:bg-warm hover:border-warm-border transition-all duration-200"
              >
                ✦ Exclusive Picks
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fade(0.34)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-edge">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-xl font-black text-ink">{s.value}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero image */}
          <motion.div
            {...fade(0.08)}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-4xl overflow-hidden aspect-[4/5] bg-warm">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=90&w=900&auto=format&fit=crop"
                alt="Fresh premium mangoes"
                className="w-full h-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/60 shadow-card">
                  <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-lg shadow-brand flex-shrink-0">🥭</div>
                  <div>
                    <p className="text-xs font-bold text-ink">Haribhanga Mangoes</p>
                    <p className="text-[11px] text-ink-muted">Now in season · Premium grade</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <FaStar key={i} size={10} className="text-amber-400" />)}
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative warm blob behind image */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-3/4 h-3/4 rounded-4xl bg-warm-border/40" />
          </motion.div>

        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section className="bg-white border-y border-edge py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-edge">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-6 sm:px-8 py-8 sm:py-6 first:pl-0 last:pr-0"
              >
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3 className="font-display text-sm font-bold text-ink mb-1.5">{f.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE SECTION ──────────────────────────── */}
      {exclusive.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <div className="bg-ink rounded-4xl px-8 py-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[11px] font-semibold mb-4">
                    ✦ Premium Collection
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-black text-white">Exclusive Varieties</h2>
                  <p className="text-white/40 mt-2 text-sm">Handpicked superior-grade — limited quantities.</p>
                </div>
                <Link to="/shop?isExclusive=true" className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors">
                  View all <FaArrowRight size={11} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {exclusive.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-brand-500 font-semibold mb-2">Our Collection</p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">Best Selling Fruits</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors">
            View all <FaArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-edge overflow-hidden animate-pulse">
                <div className="h-52 bg-warm" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-warm rounded-full w-1/3" />
                  <div className="h-5 bg-warm rounded-full w-3/4" />
                  <div className="h-10 bg-warm rounded-2xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-edge">
            <p className="text-4xl mb-3">🍊</p>
            <p className="text-ink-muted">No featured products right now.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-brand-500 hover:underline">Browse all products</Link>
          </div>
        )}
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="bg-white border-y border-edge py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-brand-500 font-semibold mb-2">Reviews</p>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">What Customers Say</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <FaStar key={i} size={13} className="text-amber-400" />)}
              </div>
              <span className="text-sm font-bold text-ink">4.9</span>
              <span className="text-sm text-ink-muted">· 500+ reviews</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-3xl border border-edge p-7 space-y-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} size={12} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-edge">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-brand flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-faint">{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-4xl gradient-brand px-8 sm:px-16 py-16 sm:py-20 text-white text-center shadow-brand"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/8 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />
          <div className="relative space-y-6">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-white/60">Limited Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl font-black">
              Get 20% Off<br />Your First Order
            </h2>
            <p className="text-white/70 max-w-sm mx-auto text-sm leading-relaxed">
              Sign up today and use code <strong className="text-white">WELCOME20</strong> at checkout.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-2xl bg-white text-ink font-bold hover:bg-warm transition-all duration-200"
              >
                Create Account
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white font-semibold hover:bg-white/22 transition-all duration-200"
              >
                Browse First
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
