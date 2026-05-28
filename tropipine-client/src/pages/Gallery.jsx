import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
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
          /* ================= MASONRY BENTO ================= */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
            {filteredImages.map((image, index) => {
              const heightClass =
                index % 6 === 0
                  ? 'h-[260px] md:h-[320px]'
                  : index % 5 === 0
                  ? 'h-[200px] md:h-[240px]'
                  : index % 4 === 0
                  ? 'h-[170px] md:h-[210px]'
                  : 'h-[220px] md:h-[270px]'

              return (
                <div
                  key={image.id}
                  className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-xl border border-edge bg-white shadow-card"
                >
                  <img
                    src={image.url || image.imageUrl}
                    alt={image.caption || 'Gallery image'}
                    className={`w-full ${heightClass} object-cover`}
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* ================= INFO SECTION ================= */}
        
       
      </div>
    </div>
  )
}