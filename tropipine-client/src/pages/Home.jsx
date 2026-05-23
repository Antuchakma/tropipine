import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import {
  FaBoxOpen,
  FaTruck,
  FaHeadset,
  FaShieldAlt,
  FaArrowRight,
} from 'react-icons/fa'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products?featured=true&limit=6')
        setFeatured(response.data.items || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1E1E1E] overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative">
        {/* Soft Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D8C3A5]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B08968]/20 rounded-full blur-3xl"></div>

        <motion.div
          className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-20 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#D6C6B8] px-5 py-2 rounded-full shadow-sm mb-8"
            >
              <span className="w-2 h-2 bg-[#8B5E3C] rounded-full"></span>

              <p className="text-sm tracking-[0.2em] text-[#7A5C43] uppercase font-medium">
                Premium Tropical Fruits
              </p>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black leading-[1.05] mb-8"
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Freshness With <br />
              <span className="text-[#8B5E3C]">Elegant Taste</span>
            </motion.h1>

            <motion.p
              className="text-lg leading-relaxed text-[#5A5149] max-w-xl mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Handpicked tropical fruits delivered with premium care and refined
              presentation. Simple, fresh, and beautifully curated.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/shop"
                className="group bg-[#1F1F1F] hover:bg-black text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl flex items-center gap-3"
              >
                Explore Store
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/register"
                className="bg-white border border-[#D6C6B8] hover:border-[#8B5E3C] px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                Join Now
              </Link>
            </motion.div>

            {/* STATS */}
            <div className="flex gap-12 mt-16 flex-wrap">
              <div>
                <h3 className="text-3xl font-black text-[#8B5E3C]">10K+</h3>
                <p className="text-[#6A625B]">Happy Customers</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-[#8B5E3C]">500+</h3>
                <p className="text-[#6A625B]">Fresh Products</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-[#8B5E3C]">24/7</h3>
                <p className="text-[#6A625B]">Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-[#E4D9CD]">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop"
                alt="Fresh Fruits"
                className="w-full h-[600px] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-3xl shadow-2xl border border-[#E5D8CA] px-7 py-5">
              <p className="text-sm text-[#7B746E] mb-1">
                Same Day Delivery
              </p>

              <h2 className="text-4xl font-black text-[#1F1F1F]">
                Fresh Daily
              </h2>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaBoxOpen />,
              title: 'Premium Quality',
              desc: 'Only the finest tropical selections from trusted farms.',
            },
            {
              icon: <FaTruck />,
              title: 'Fast Delivery',
              desc: 'Reliable delivery that keeps every fruit fresh.',
            },
            {
              icon: <FaHeadset />,
              title: 'Customer Care',
              desc: 'Dedicated support whenever you need assistance.',
            },
            {
              icon: <FaShieldAlt />,
              title: 'Secure Payments',
              desc: 'Simple and secure checkout experience.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#E7DBCF] shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F1E5D9] text-[#8B5E3C] flex items-center justify-center text-3xl mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">{item.title}</h3>

              <p className="text-[#6A625B] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
          <div>
            <p className="uppercase tracking-[0.3em] text-[#8B5E3C] text-sm mb-3">
              Featured Collection
            </p>

            <h2 className="text-4xl md:text-5xl font-black">
              Best Selling Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-[#8B5E3C] hover:text-black font-semibold transition"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 rounded-full border-4 border-[#D8C3A5] border-t-[#8B5E3C] animate-spin"></div>
          </div>
        ) : featured.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#E7DBCF] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E7DBCF] p-16 text-center">
            <p className="text-[#6A625B] text-lg">
              No featured products available
            </p>
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="relative overflow-hidden rounded-[40px] bg-[#1F1F1F] text-white px-8 py-24 shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#8B5E3C]/20 rounded-full blur-3xl"></div>

          <div className="relative text-center">
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Get 20% Off <br />
              Your First Order
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed mb-10">
              Join TropiPine today and enjoy premium tropical fruit delivery
              with exclusive member discounts.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Link
                to="/register"
                className="bg-[#F6F1E8] hover:bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all duration-300"
              >
                Create Account
              </Link>

              <Link
                to="/shop"
                className="border border-white/20 hover:border-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}