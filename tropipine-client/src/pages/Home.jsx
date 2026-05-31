import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
})

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
})

const values = [
  { label: 'Origin', title: 'Farm Sourced', desc: 'Direct from growers in Rajshahi, Chapainawabganj, and Sylhet.' },
  { label: 'Quality', title: 'Hand Selected', desc: 'Every fruit is graded before packing. No exceptions.' },
  { label: 'Delivery', title: 'Same Day Dhaka', desc: 'Order by noon and receive your fruits before evening.' },
  { label: 'Trust', title: 'Since 2019', desc: 'Five years of serving premium fruits to Bangladeshi homes.' },
]

const testimonials = [
  { name: 'Ayesha Rahman', loc: 'Dhaka', rating: 5, text: 'The Haribhanga mangoes were perfectly ripe and fragrant. Nothing I have found in the market comes close.' },
  { name: 'Rahim Chowdhury', loc: 'Chittagong', rating: 5, text: 'Impeccable packaging and delivery right on schedule. The quality speaks for itself.' },
  { name: 'Nadia Islam', loc: 'Sylhet', rating: 4, text: 'The exclusive collection is genuinely superior. I have been ordering every season for two years.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [exclusive, setExclusive] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products?isFeatured=true&limit=4').catch(() => ({ data: { items: [] } })),
      api.get('/products?isExclusive=true&limit=3').catch(() => ({ data: { items: [] } })),
    ]).then(([featRes, excRes]) => {
      setFeatured(featRes.data.items || [])
      setExclusive(excRes.data.items || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-cream overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end pb-20 sm:pb-28 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/20 to-bark/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 sm:px-10 w-full">
          <motion.div {...fade(0.1)} className="max-w-2xl">
            <p className="label text-white/65 mb-6">Bangladesh's Finest</p>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light text-white leading-none mb-8 text-balance">
              From the<br />
              <em>hillside</em><br />
              to your door.
            </h1>
            <p className="text-white/80 text-base leading-relaxed mb-10 max-w-md">
              Handpicked mangoes, lychees, and seasonal fruits — delivered fresh from the farms of Rajshahi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-white text-bark text-sm font-medium tracking-wide hover:bg-cream transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/shop?isExclusive=true"
                className="px-8 py-3.5 border border-white/60 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
              >
                Exclusive Picks
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          {...fade(1.2)}
          className="absolute bottom-8 right-10 hidden sm:flex items-center gap-2 text-white/35"
        >
          <span className="label text-[10px]">Scroll</span>
          <div className="w-px h-10 bg-white/25" />
        </motion.div>
      </section>

      {/* ─── MARQUEE TICKER ─────────────────────────── */}
      <div className="bg-grove overflow-hidden border-b border-grove/80">
        <div className="py-3 flex">
          <div className="ticker">
            {[
              'Haribhanga Mango', 'Gopalbhog', 'Langra', 'Pineapple',
              'Lychee', 'Jackfruit', 'Guava', 'Star Fruit',
              'Haribhanga Mango', 'Gopalbhog', 'Langra', 'Pineapple',
              'Lychee', 'Jackfruit', 'Guava', 'Star Fruit',
            ].map((name, i) => (
              <span key={i} className="inline-flex items-center gap-4 mx-6">
                <span className="label text-white/80 text-[10px]">{name}</span>
                <span className="w-1 h-1 rounded-full bg-white/25" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── VALUES STRIP ────────────────────────────── */}
      <section className="border-b border-stone">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 grid sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              {...inView(i * 0.07)}
              className={`py-10 pr-8 ${i < values.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-stone' : ''}`}
            >
              <p className="label text-clay/60 mb-3">{v.label}</p>
              <p className="font-display text-xl font-normal text-bark mb-2">{v.title}</p>
              <p className="text-sm text-clay leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
        <motion.div {...inView(0)} className="flex items-end justify-between mb-12">
          <div>
            <p className="label text-clay/60 mb-3">Collection</p>
            <h2 className="font-display text-4xl sm:text-5xl font-normal text-bark">Best Sellers</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block label text-clay hover:text-bark transition-colors border-b border-stone hover:border-bark pb-0.5"
          >
            View All
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-bone mb-3" />
                <div className="h-3 bg-stone rounded w-1/3 mb-2" />
                <div className="h-4 bg-stone rounded w-2/3 mb-2" />
                <div className="h-3 bg-stone rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {featured.map((product, i) => (
              <motion.div key={product.id} {...inView(i * 0.07)}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link to="/shop" className="label text-clay border-b border-stone hover:text-bark hover:border-bark transition-colors pb-0.5">
            View All Products
          </Link>
        </div>
      </section>

      {/* ─── EXCLUSIVE BANNER ───────────────────────── */}
      {exclusive.length > 0 && (
        <section className="bg-bark">
          <div className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
            <motion.div {...inView(0)} className="flex items-end justify-between mb-12">
              <div>
                <p className="label text-white/35 mb-3">Limited Supply</p>
                <h2 className="font-display text-4xl sm:text-5xl font-normal text-white">Exclusive<br /><em>Varieties</em></h2>
              </div>
              <Link
                to="/shop?isExclusive=true"
                className="hidden sm:block label text-white/40 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
              >
                View All
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
              {exclusive.map((product, i) => (
                <motion.div key={product.id} {...inView(i * 0.08)} className="bg-cream/5 p-px">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EDITORIAL SPLIT ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...inView(0)}>
          <p className="label text-clay/60 mb-4">Our Story</p>
          <h2 className="font-display text-4xl sm:text-5xl font-normal text-bark mb-6 leading-none">
            Grown with<br />
            <em>intention.</em>
          </h2>
          <p className="text-clay leading-relaxed mb-5">
            We partner directly with small-scale farmers across Bangladesh's most fertile regions. Every fruit is harvested at peak ripeness and delivered to your door within 24 hours.
          </p>
          <p className="text-clay leading-relaxed mb-8">
            No cold storage. No intermediaries. Just the freshest tropical fruit you have ever tasted.
          </p>
          <Link
            to="/about"
            className="label text-bark border-b border-bark pb-0.5 hover:text-grove hover:border-grove transition-colors"
          >
            Read Our Story
          </Link>
        </motion.div>
        <motion.div {...inView(0.15)} className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1618897996318-5a901fa0b74a?q=80&w=800&auto=format&fit=crop"
              alt="Fresh mangoes"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-mist hidden lg:block" />
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── */}
      <section className="border-t border-stone bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
          <motion.div {...inView(0)} className="text-center mb-14">
            <p className="label text-clay/60 mb-3">Testimonials</p>
            <h2 className="font-display text-4xl font-normal text-bark">What our customers say</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...inView(i * 0.1)} className="border border-stone p-8">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="11" height="11" viewBox="0 0 24 24"
                      fill={j < t.rating ? '#C4923A' : 'none'}
                      stroke="#C4923A" strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-clay leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-stone pt-4">
                  <div className="w-7 h-7 bg-bark flex items-center justify-center text-white text-xs font-medium">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bark">{t.name}</p>
                    <p className="text-xs text-clay">{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST NUMBERS ───────────────────────── */}
      <section className="border-t border-b border-stone">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14 grid grid-cols-2 lg:grid-cols-4">
          {[
            { value: '12,000+', label: 'Happy customers' },
            { value: '30+', label: 'Partner farms' },
            { value: '5+', label: 'Years of sourcing' },
            { value: '100%', label: 'Directly sourced' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              {...inView(i * 0.07)}
              className={`py-10 text-center ${i < 3 ? 'border-r border-stone' : ''}`}
            >
              <p className="font-display text-4xl font-normal text-bark mb-1">{s.value}</p>
              <p className="label text-clay/55 text-[10px]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
        <motion.div
          {...inView(0)}
          className="bg-grove text-white px-12 py-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white" />
          </div>
          <div className="relative">
            <p className="label text-white/40 mb-4">Limited Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl font-normal mb-4">
              20% off your first order
            </h2>
            <p className="text-white/60 mb-8 text-sm">
              Use code <span className="font-mono font-medium text-white tracking-widest">WELCOME20</span> at checkout
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="px-8 py-3 bg-white text-bark text-sm font-medium tracking-wide hover:bg-cream transition-colors">
                Create Account
              </Link>
              <Link to="/shop" className="px-8 py-3 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors">
                Browse First
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
