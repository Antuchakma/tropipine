import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['ALL', 'FARM', 'HARVEST', 'PACKAGING', 'TEAM', 'EVENTS']

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
})

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [lightbox, setLightbox] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    axios.get(`${API_URL}/gallery`)
      .then((r) => setImages(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Close lightbox on escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = activeCategory === 'ALL'
    ? images
    : images.filter((img) => img.category === activeCategory)

  // Assign height classes for visual variety in masonry
  const heightFor = (i) => {
    const pattern = [
      'aspect-[4/5]',
      'aspect-[4/3]',
      'aspect-square',
      'aspect-[4/5]',
      'aspect-[16/10]',
      'aspect-square',
    ]
    return pattern[i % pattern.length]
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ─── PAGE HEADER ─── */}
      <div className="pt-28 pb-16 border-b border-stone">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 grid lg:grid-cols-2 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="label text-clay/60 mb-3">TropiPine</p>
            <h1 className="font-display text-5xl sm:text-6xl font-normal text-bark leading-none">
              From Farm<br />
              <em>to Frame</em>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-clay leading-relaxed lg:pb-1"
          >
            A visual record of how we source, harvest, and deliver premium tropical fruits — from the fields of Rajshahi to your door.
          </motion.p>
        </div>
      </div>

      {/* ─── EDITORIAL FEATURE STRIP ─── */}
      <div className="border-b border-stone">
        <div className="grid grid-cols-3 h-64 sm:h-80">
          {[
            'https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop',
          ].map((src, i) => (
            <div key={i} className={`relative overflow-hidden group ${i < 2 ? 'border-r border-stone' : ''}`}>
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-bark/20 group-hover:bg-bark/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14">

        {/* ─── CATEGORY FILTERS ─── */}
        <div className="flex flex-wrap gap-1.5 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs tracking-widest font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-bark text-white border-bark'
                  : 'bg-transparent text-clay border-stone hover:border-bark hover:text-bark'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-clay/50 hidden sm:block">
            {filtered.length} {filtered.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {/* ─── LOADING ─── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`${heightFor(i)} bg-bone animate-pulse`}
              />
            ))}
          </div>
        )}

        {/* ─── EMPTY ─── */}
        {!loading && filtered.length === 0 && (
          <div className="border border-stone bg-white p-16 text-center">
            <p className="font-display text-2xl font-normal text-bark mb-2">No images yet</p>
            <p className="text-clay text-sm">This category hasn't been photographed yet.</p>
          </div>
        )}

        {/* ─── MASONRY GRID ─── */}
        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:balance]"
            >
              {filtered.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="mb-3 sm:mb-4 break-inside-avoid overflow-hidden group cursor-pointer relative bg-bone"
                  onClick={() => setLightbox(image)}
                >
                  <img
                    src={image.url || image.imageUrl}
                    alt={image.caption || 'TropiPine gallery'}
                    className={`w-full ${heightFor(i)} object-cover transition-transform duration-700 group-hover:scale-105`}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/20 transition-colors duration-300 flex items-end p-4">
                    {image.caption && (
                      <p className="text-white text-xs font-medium translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {image.caption}
                      </p>
                    )}
                  </div>
                  {/* Category pill */}
                  {image.category && image.category !== 'ALL' && (
                    <div className="absolute top-3 left-3 label text-[9px] bg-white/90 text-bark px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.category}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bark/90 z-50 flex items-center justify-center p-4 sm:p-10"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.url || lightbox.imageUrl}
                alt={lightbox.caption || ''}
                className="w-full max-h-[85vh] object-contain"
              />
              {lightbox.caption && (
                <p className="text-white/60 text-sm mt-3 text-center">{lightbox.caption}</p>
              )}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-9 h-9 bg-white text-bark flex items-center justify-center text-sm hover:bg-cream transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
