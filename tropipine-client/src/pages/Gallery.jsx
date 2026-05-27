import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/gallery`)
      setImages(response.data.data || [])
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'ALL',
    'FARM',
    'HARVEST',
    'PACKAGING',
    'TEAM',
    'EVENTS',
  ]

  const filteredImages =
    activeCategory === 'ALL'
      ? images
      : images.filter((img) => img.category === activeCategory)

  return (
    <div className="min-h-screen bg-surface">
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1464454709131-ffd692591ee5?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-28 flex items-center justify-center min-h-[400px]">
          <div className="max-w-2xl space-y-4 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">Gallery</p>
              <h1 className="font-display text-5xl font-black text-white mb-3">
                Moments of <span className="text-orange-500">Freshness</span>
              </h1>
              <p className="text-white/80 max-w-2xl">
                Explore our farms, harvesting process, and premium fruit handling journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat
                  ? 'gradient-brand text-white border-transparent shadow-brand'
                  : 'bg-white text-ink-muted border-edge hover:border-brand-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= STATES ================= */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-edge border-t-brand-500 animate-spin" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white border border-edge rounded-3xl p-12 text-center">
            <p className="text-ink-muted">
              No images available in this category.
            </p>
          </div>
        ) : (
          /* ================= GRID ================= */
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="
                  group cursor-pointer
                  bg-white border border-edge
                  rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover
                  transition-all duration-300
                "
              >
                <div className="relative overflow-hidden h-64 bg-surface">
                  <img
                    src={image.url || image.imageUrl}
                    alt={image.caption}
                    className="
                      w-full h-full object-cover
                      group-hover:scale-105
                      transition duration-500
                    "
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                </div>

                <div className="p-4">
                  <p className="text-sm text-ink-muted line-clamp-2">
                    {image.caption || 'No caption'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= INFO SECTION ================= */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: '',
              title: 'Farm Fresh',
              desc: 'Directly sourced from trusted farms',
            },
            {
              icon: '',
              title: 'Quality Control',
              desc: 'Strict inspection for every batch',
            },
            {
              icon: '',
              title: 'Safe Packaging',
              desc: 'Eco-friendly and freshness-safe packaging',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-edge rounded-3xl p-6 text-center shadow-card"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-ink mb-1">{item.title}</h3>
              <p className="text-sm text-ink-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url || selectedImage.imageUrl}
              alt={selectedImage.caption}
              className="w-full max-h-[70vh] object-cover"
            />

            <div className="p-5 flex justify-between items-center">
              <p className="text-ink-muted text-sm">
                {selectedImage.caption || 'No caption'}
              </p>

              <button
                onClick={() => setSelectedImage(null)}
                className="text-brand-600 font-bold text-lg"
              >

              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}