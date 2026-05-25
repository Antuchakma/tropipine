import { useState, useEffect } from 'react'
import axios from 'axios'

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
    <div className="min-h-screen bg-[#F6F1E8] text-[#1E1E1E]">

      {/* ================= HERO ================= */}
      <section className="border-b border-[#E7DBCF] bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-[#8B5E3C] uppercase tracking-[0.25em] text-sm mb-3">
            Gallery
          </p>

          <h1 className="text-5xl font-black mb-3">
            Moments of <span className="text-[#8B5E3C]">Freshness</span>
          </h1>

          <p className="text-[#5A5149] max-w-2xl">
            Explore our farms, harvesting process, and premium fruit handling journey.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ================= FILTER ================= */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium
                border transition-all duration-300
                ${
                  activeCategory === cat
                    ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                    : 'bg-white text-[#5A5149] border-[#E7DBCF] hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= STATES ================= */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-[#E7DBCF] border-t-[#8B5E3C] animate-spin"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-12 text-center">
            <p className="text-[#6A625B]">
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
                  bg-white border border-[#E7DBCF]
                  rounded-3xl overflow-hidden
                  hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                  transition-all duration-300
                "
              >
                <div className="relative overflow-hidden h-64 bg-[#F6F1E8]">
                  <img
                    src={image.imageUrl}
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
                  <p className="text-sm text-[#5A5149] line-clamp-2">
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
              icon: '🚜',
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
              className="bg-white border border-[#E7DBCF] rounded-3xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-[#6A625B]">{item.desc}</p>
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
              src={selectedImage.imageUrl}
              alt={selectedImage.caption}
              className="w-full max-h-[70vh] object-cover"
            />

            <div className="p-5 flex justify-between items-center">
              <p className="text-[#5A5149] text-sm">
                {selectedImage.caption || 'No caption'}
              </p>

              <button
                onClick={() => setSelectedImage(null)}
                className="text-[#8B5E3C] font-bold text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}