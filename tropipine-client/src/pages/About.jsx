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
    title: 'Hill-Fresh, Always',
    desc: 'We harvest on demand from CHT slopes. Nothing sits in cold storage. Your order triggers a pick from the hillside — not a warehouse.',
  },
  {
    number: '02',
    title: 'Fair at the Source',
    desc: 'Our indigenous farming partners earn above-market rates. Better livelihoods attract better practices, which produces better fruit.',
  },
  {
    number: '03',
    title: 'Nothing Hidden',
    desc: 'No artificial ripeners, no wax coatings, no chemical sprays. What leaves the hill is exactly what reaches your home.',
  },
  {
    number: '04',
    title: 'Rooted in the Region',
    desc: 'Every fruit we sell comes from Bandarban, Rangamati, or Khagrachhari. We do not source from outside the Hill Tracts.',
  },
]

const fruits = [
  {
    name: 'Hill Pineapple',
    origin: 'Rangamati · Khagrachhari',
    note: 'Grown on mineral-rich slopes at elevation. Denser, sweeter, and more aromatic than lowland varieties.',
  },
  {
    name: 'Pahari Mango',
    origin: 'Bandarban · Rangamati',
    note: 'Hill-grown mangoes ripen slower, concentrating sugar. Fibreless flesh with a distinctive floral finish.',
  },
  {
    name: 'Forest Jackfruit',
    origin: 'Khagrachhari',
    note: 'Wild-canopy trees producing smaller, intensely sweet pods. Harvested by hand from old-growth orchards.',
  },
  {
    name: 'Dragon Fruit',
    origin: 'Bandarban',
    note: 'Cultivated on CHT hillside terraces. Vibrant, mildly sweet, with a crunch that lowland varieties rarely achieve.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center sm:items-end pb-0 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop"
            alt="Lush Chittagong Hill Tracts jungle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/25 to-bark/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 sm:px-10 w-full pt-20 pb-12 sm:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="label text-white/60 mb-4">About TropiPine</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-none mb-5">
              The hills<br />
              have a<br />
              <em>flavour.</em>
            </h1>
            <p className="text-white/75 text-base max-w-md leading-relaxed">
              Since 2019 we have sourced from indigenous farming families in the Chittagong Hill Tracts and delivered to thousands of homes — with no middlemen and no compromises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="max-w-7xl mx-auto px-8 sm:px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...inView(0)}>
          <p className="label text-grove mb-4">Our Story</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-bark mb-6 leading-tight">
            Started with a<br />hill pineapple.
          </h2>
          <p className="text-clay leading-relaxed mb-4">
            TropiPine began when our founder visited a Rangamati farming family and tasted a pineapple still warm from the slope. It was nothing like what was sold in Dhaka's markets — sweeter, more fragrant, genuinely alive.
          </p>
          <p className="text-clay leading-relaxed mb-6">
            The problem was the chain between that hillside and your plate: too many hands, too much time, too little care for the fruit or the farmer. We rebuilt it from scratch.
          </p>

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
              src="https://images.unsplash.com/photo-1574184864703-3487b13f0edd?q=80&w=700&auto=format&fit=crop"
              alt="Pineapple harvest in the hills"
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

      {/* ─── CHT REGION STRIP ─── */}
      <section className="border-t border-b border-stone bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-16">
          <motion.div {...inView(0)} className="text-center mb-12">
            <p className="label text-grove mb-3">Where we source</p>
            <h2 className="font-display text-4xl font-semibold text-bark">Three districts. One promise.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-0 border-l border-t border-stone">
            {[
              {
                district: 'Bandarban',
                alt: 'বান্দরবান',
                desc: 'Bangladesh\'s highest hills produce mangoes, dragon fruit, and banana varieties unavailable anywhere else in the country.',
              },
              {
                district: 'Rangamati',
                alt: 'রাঙামাটি',
                desc: 'Kaptai lake shores and surrounding slopes yield the finest hill pineapples and forest jackfruit in the CHT.',
              },
              {
                district: 'Khagrachhari',
                alt: 'খাগড়াছড়ি',
                desc: 'Fertile river valleys and shaded slopes — home to papaya, pomelo, guava, and lychee grown by Tripura and Marma families.',
              },
            ].map((d, i) => (
              <motion.div key={d.district} {...inView(i * 0.08)} className="border-r border-b border-stone p-8 sm:p-10">
                <p className="font-display text-3xl font-semibold text-bark mb-1">{d.district}</p>
                <p className="label text-clay/50 text-[10px] mb-4">{d.alt}</p>
                <p className="text-sm text-clay leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGNATURE FRUITS ─── */}
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
            <h2 className="font-display text-4xl font-semibold text-bark">From hill to door</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-0 border-l border-t border-stone">
            {[
              { step: 'I',   title: 'You Order',    desc: 'Place your order before noon. Our CHT partners receive a harvest request within the hour.' },
              { step: 'II',  title: 'They Pick',    desc: 'Farming families on the hillside select and pack fruit at peak ripeness. No pre-harvest stock.' },
              { step: 'III', title: 'You Receive',  desc: 'Same-day Dhaka delivery. Next-day to most cities. Tasting the hills, on your table.' },
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
        <motion.div {...inView(0)} className="bg-grove text-white px-12 py-20 text-center">
          <p className="label text-white/40 mb-4">Taste the difference</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold mb-6">
            The hills are ready.<br /><em>Are you?</em>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="px-8 py-3.5 bg-white text-bark text-sm font-medium tracking-wide hover:bg-cream transition-colors">
              Shop Now
            </Link>
            <Link to="/contact" className="px-8 py-3.5 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
