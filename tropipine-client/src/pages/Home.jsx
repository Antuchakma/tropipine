import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { FaArrowRight, FaStar } from 'react-icons/fa'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

const features = [
  { icon: '', title: 'Farm Fresh', desc: 'Harvested daily from trusted farms across Bangladesh.' },
  { icon: '', title: 'Fast Delivery', desc: 'Same-day delivery within Dhaka. Next-day nationwide.' },
  { icon: '', title: 'Secure Payment', desc: 'Pay via bKash, Nagad, Rocket or Cash on Delivery.' },
  { icon: '', title: 'Safe Packaging', desc: 'Temperature-controlled packaging keeps every fruit perfect.' },
]

const testimonials = [
  { name: 'Ayesha Rahman', loc: 'Dhaka', rating: 5, text: 'The Haribhanga mangoes were absolutely divine  perfectly ripe and fragrant. Will reorder!' },
  { name: 'Rahim Chowdhury', loc: 'Chittagong', rating: 5, text: 'Super fresh quality. The packaging was excellent and delivery was right on time.' },
  { name: 'Nadia Islam', loc: 'Sylhet', rating: 5, text: 'Best online fruit shop I\'ve used. The exclusive collection is genuinely premium.' },
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

      {/*  HERO  */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-800/15 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-28 flex items-center justify-center min-h-screen">
          {/* Content */}
          <div className="max-w-2xl space-y-8 text-center">
            <motion.div {...fade(0.05)}>

            </motion.div>

            <motion.h1 {...fade(0.12)} className="font-display text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.04] tracking-tight text-balance">
              Farm Fresh,<br />
              <span className="text-orange-500 bg-clip-text ">Straight to</span><br />
              Your Door.
            </motion.h1>

            <motion.p {...fade(0.2)} className="text-lg text-white/80 max-w-md leading-relaxed">
              Handpicked premium mangoes, lychees, and seasonal fruits  delivered with care from the farms of Rajshahi and Chapainawabganj.
            </motion.p>

            <motion.div {...fade(0.28)} className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl gradient-brand text-white font-bold shadow-brand hover:shadow-lg hover:opacity-90 transition-all duration-200"
              >
                Shop Now
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop?isExclusive=true"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all duration-200"
              >
                 Exclusive Picks
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/*  FEATURES  */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl p-7 border border-edge shadow-card hover:shadow-card-hover transition-shadow group"
            >
              
              <h3 className="font-display text-base font-bold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  EXCLUSIVE  */}
      {exclusive.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
          <div className="bg-dark rounded-[40px] px-8 py-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/15 blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold mb-3">
                     Premium Collection
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-black text-white">Exclusive Varieties</h2>
                  <p className="text-white/50 mt-2 text-sm">Handpicked superior-grade mangoes  limited quantities.</p>
                </div>
                <Link to="/shop?isExclusive=true" className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors">
                  View all <FaArrowRight size={11} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {exclusive.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
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

      {/*  FEATURED PRODUCTS  */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-3">Featured Collection</p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">Best Selling Fruits</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors">
            View all <FaArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-edge overflow-hidden animate-pulse">
                <div className="h-56 bg-edge" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-edge rounded-full w-1/3" />
                  <div className="h-5 bg-edge rounded-full w-3/4" />
                  <div className="h-3 bg-edge rounded-full w-1/2" />
                  <div className="h-10 bg-edge rounded-2xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-4xl mb-3"></p>
            <p className="text-ink-muted">No featured products right now.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">Browse all products</Link>
          </div>
        )}
      </section>

      {/*  TESTIMONIALS  */}
      <section className="bg-white border-y border-edge py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-3">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">What Our Customers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-3xl border border-edge p-7 space-y-4"
              >
                <div className="flex">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} size={13} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-edge">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-brand">
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

      {/*  CTA  */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] gradient-brand px-8 py-20 text-white text-center shadow-brand"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-black/15 blur-2xl" />
          <div className="relative">
            <p className="text-sm uppercase tracking-widest font-semibold text-white/70 mb-4">Limited Time Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl font-black mb-5">
              Get 20% Off<br />Your First Order
            </h2>
            <p className="text-white/75 max-w-md mx-auto text-base mb-10">
              Sign up now and use code <strong className="text-white font-bold">WELCOME20</strong> at checkout.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-white text-ink font-bold hover:bg-surface transition-all duration-200 shadow-lg"
              >
                Create Account
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 rounded-2xl bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-200"
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
