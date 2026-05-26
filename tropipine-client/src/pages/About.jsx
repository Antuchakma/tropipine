import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const values = [
  { icon: '🌿', title: 'Quality First', desc: 'Carefully selected fresh fruits from trusted farms.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day in Dhaka, reliable nationwide shipping.' },
  { icon: '🌾', title: 'Farm Direct', desc: 'Sourced directly from growers — fair prices for everyone.' },
  { icon: '🔒', title: 'Secure Payment', desc: 'bKash, Nagad, Rocket with verified checkout.' },
]

const specialties = [
  { name: 'Haribhanga Mango', emoji: '🥭', type: 'Mango' },
  { name: 'Gopalbhog Mango', emoji: '🥭', type: 'Mango' },
  { name: 'Pineapple', emoji: '🍍', type: 'Pineapple' },
  { name: 'Seasonal Fruits', emoji: '🍊', type: 'Seasonal' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="bg-white border-b border-edge">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-4">About TropiPine</p>
            <h1 className="font-display text-5xl md:text-6xl font-black text-ink mb-4">
              Fresh Fruits, <span className="text-brand-600">Pure Care</span>
            </h1>
            <p className="text-ink-muted max-w-2xl text-lg leading-relaxed">
              We connect farms to homes with a focus on freshness, simplicity, and honest quality.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 space-y-24">
        <section className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-5">Our Story</h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              TropiPine started with a simple idea — deliver fresh tropical fruits directly from farmers to customers without unnecessary complexity or loss of quality.
            </p>
            <p className="text-ink-muted leading-relaxed">
              We work with local farmers across Bangladesh to ensure better pricing for growers and fresher fruits for families.
            </p>
          </div>
          <div className="bg-white border border-edge rounded-3xl p-10 text-center shadow-card">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="font-semibold text-brand-600">Farm to Table</h3>
            <p className="text-ink-muted text-sm mt-2">Direct sourcing, no middle layers</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-edge rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-bold text-ink mb-4">Our Mission</h3>
            <p className="text-ink-muted mb-6 leading-relaxed">Make fresh tropical fruits accessible through a fair and simple supply chain.</p>
            <ul className="space-y-2 text-ink-muted text-sm">
              <li>✓ Premium quality fruits</li>
              <li>✓ Fair support for farmers</li>
              <li>✓ Sustainable sourcing</li>
            </ul>
          </div>
          <div className="bg-white border border-edge rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-bold text-ink mb-4">Our Vision</h3>
            <p className="text-ink-muted mb-6 leading-relaxed">Become a trusted tropical fruit brand in South Asia built on simplicity and quality.</p>
            <ul className="space-y-2 text-ink-muted text-sm">
              <li>✓ Expand regional reach</li>
              <li>✓ Support local farming communities</li>
              <li>✓ Eco-friendly operations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl font-bold text-ink mb-10 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item) => (
              <div key={item.title} className="bg-white border border-edge rounded-3xl p-6 text-center shadow-card hover:shadow-card-hover transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-ink mb-1">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-edge rounded-3xl p-10 shadow-card">
          <h2 className="font-display text-2xl font-bold text-ink mb-8">Our Specialty Fruits</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {specialties.map((f) => (
              <div key={f.name} className="bg-surface border border-edge rounded-2xl p-6">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <p className="font-medium text-ink">{f.name}</p>
                <p className="text-xs text-brand-600 mt-1 font-semibold">{f.type}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gradient-dark text-white rounded-[40px] px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Have questions? We&apos;re happy to help with orders, wholesale, or partnerships.</p>
          <Link to="/contact" className="inline-block gradient-brand text-white px-8 py-3 rounded-2xl font-semibold shadow-brand hover:opacity-90 transition">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  )
}
