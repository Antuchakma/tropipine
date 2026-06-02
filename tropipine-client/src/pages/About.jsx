import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
})


const values = [
  {
    number: '01',
    title: 'Radical Freshness',
    desc: 'We harvest on demand. Nothing sits in cold storage. Every order triggers a harvest, not a warehouse pick.',
  },
  {
    number: '02',
    title: 'Fair at Source',
    desc: 'Our farmers earn above market rate. Better pay attracts better practices, which produces better fruit.',
  },
  {
    number: '03',
    title: 'Zero Pretense',
    desc: 'We don\'t add artificial ripeners or wax coatings. What you receive is exactly what left the farm.',
  },
  {
    number: '04',
    title: 'Measured Growth',
    desc: 'We expand slowly, only to regions where we can guarantee our supply chain standards hold.',
  },
]

const fruits = [
  { name: 'Haribhanga', origin: 'Rajshahi', note: 'The most sought-after mango in Bangladesh. Fibreless, intensely sweet.' },
  { name: 'Gopalbhog', origin: 'Chapainawabganj', note: 'Early season variety. Small, rich, with a distinct honey note.' },
  { name: 'Langra', origin: 'Chapainawabganj', note: 'Green-skinned when ripe. Tangy finish, beloved by connoisseurs.' },
  { name: 'Pineapple', origin: 'Sylhet / Chittagong', note: 'Grown on hillside soil. Higher sugar, lower acid than lowland varieties.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center sm:items-end pb-0 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop"
            alt="Mango orchard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/20 to-bark/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 sm:px-10 w-full pt-20 pb-12 sm:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="label text-white/65 mb-4">About TropiPine</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-none mb-5">
              We take<br />
              <em>freshness</em><br />
              personally.
            </h1>
            <p className="text-white/80 text-base max-w-md leading-relaxed">
              Since 2019, we have sourced directly from Bangladeshi farms and delivered to thousands of homes — with no middlemen and no compromises.
            </p>
          </motion.div>
        </div>
      </section>


      {/* ─── STORY ─── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...inView(0)}>
          <p className="label text-grove mb-4">Our Story</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-bark mb-6 leading-tight">
            Started with a<br />mango and a question.
          </h2>
          <p className="text-clay leading-relaxed mb-4">
            TropiPine began when our founder — returning from a farm visit in Rajshahi — asked: why does the best mango in Bangladesh never make it to Dhaka in good condition?
          </p>
          <p className="text-clay leading-relaxed mb-6">
            The answer was a long, broken supply chain. Middlemen, improper handling, cold storage that stripped flavor. We rebuilt that chain from scratch.
          </p>

          {/* Pull quote */}
          <blockquote className="border-l-2 border-grove pl-6 py-2 mb-6">
            <p className="font-display text-xl font-semibold italic text-bark leading-snug">
              "If we wouldn't eat it ourselves, it doesn't go out."
            </p>
            <cite className="label text-clay/50 text-[10px] not-italic mt-2 block">— Our quality standard, since day one</cite>
          </blockquote>

          <Link to="/shop" className="label text-bark border-b border-bark pb-0.5 hover:text-grove hover:border-grove transition-colors">
            Explore our fruits →
          </Link>
        </motion.div>

        <motion.div {...inView(0.15)}>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1605027990121-cbae9e0642df?q=80&w=700&auto=format&fit=crop"
              alt="Mango harvest"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-bark">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
          <motion.div {...inView(0)} className="mb-14">
            <p className="label text-white/35 mb-3">What we stand for</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white">Our principles</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-0 border-l border-t border-white/10">
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                {...inView(i * 0.08)}
                className="border-r border-b border-white/10 p-8 sm:p-10"
              >
                <p className="font-mono text-xs text-white/25 mb-5">{v.number}</p>
                <h3 className="font-display text-xl font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPECIALTY FRUITS ─── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
        <motion.div {...inView(0)} className="mb-12">
          <p className="label text-grove mb-3">What we grow</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-bark">Our signature fruits</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-stone">
          {fruits.map((f, i) => (
            <motion.div
              key={f.name}
              {...inView(i * 0.07)}
              className="border-r border-b border-stone p-7 group"
            >
              <div className="w-8 h-px bg-stone mb-5 group-hover:bg-grove group-hover:w-12 transition-all duration-300" />
              <h3 className="font-display text-2xl font-semibold text-bark mb-1">{f.name}</h3>
              <p className="label text-clay/60 text-[10px] mb-3">{f.origin}</p>
              <p className="text-sm text-clay leading-relaxed">{f.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="border-t border-b border-stone bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
          <motion.div {...inView(0)} className="text-center mb-14">
            <p className="label text-grove mb-3">How it works</p>
            <h2 className="font-display text-4xl font-semibold text-bark">From order to door</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-0 border-l border-t border-stone">
            {[
              { step: 'I', title: 'You Order', desc: 'Place your order before noon for same-day dispatch from Dhaka.' },
              { step: 'II', title: 'We Harvest', desc: 'Our farm partners receive the request and pick to spec. No pre-harvest.' },
              { step: 'III', title: 'You Receive', desc: 'Same-day Dhaka delivery. Next-day to most other cities. Always fresh.' },
            ].map((p, i) => (
              <motion.div
                key={p.step}
                {...inView(i * 0.1)}
                className="border-r border-b border-stone p-10"
              >
                <p className="font-display text-4xl font-semibold text-stone mb-6">{p.step}</p>
                <h3 className="font-display text-xl font-semibold text-bark mb-3">{p.title}</h3>
                <p className="text-clay text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24">
        <motion.div
          {...inView(0)}
          className="bg-grove text-white px-12 py-20 text-center"
        >
          <p className="label text-white/40 mb-4">Ready to taste the difference?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold mb-6">
            Your first order.<br /><em>Unforgettable.</em>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-white text-bark text-sm font-medium tracking-wide hover:bg-cream transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
