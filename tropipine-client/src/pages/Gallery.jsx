import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, useScroll, useTransform } from 'framer-motion'

// How many px of scroll the title occupies before images unlock
const TITLE_SCROLL = 440

const paddingFor = (i) => {
  const pattern = [
    '138%', '76%', '162%', '98%', '122%',
    '84%', '152%', '105%', '88%', '144%',
    '72%', '130%',
  ]
  return pattern[i % pattern.length]
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [gridHeight, setGridHeight] = useState(5000)
  const gridRef = useRef(null)

  const { scrollY } = useScroll()

  // Title scrolls out at 1:1 with user scroll
  const titleY = useTransform(
    scrollY,
    [0, TITLE_SCROLL],
    ['0px', `-${TITLE_SCROLL}px`]
  )

  // Images: locked at y=0 while title scrolls, then scroll 1:1 after
  const imageY = useTransform(scrollY, (val) =>
    val < TITLE_SCROLL ? 0 : -(val - TITLE_SCROLL)
  )

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    axios.get(`${API_URL}/gallery`)
      .then((r) => setImages(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Measure the grid after it renders so the page height is accurate
  useEffect(() => {
    if (!loading && gridRef.current) {
      setGridHeight(gridRef.current.scrollHeight)
    }
  }, [loading, images])

  const items = loading ? Array(12).fill(null) : images

  return (
    // Page height = title scroll distance + full grid height
    // This gives the browser the correct total scroll space
    <div className="bg-cream" style={{ height: TITLE_SCROLL + gridHeight }}>

      {/* ─── IMAGES: always fixed, animated y unlocks after title exits ─── */}
      <motion.div
        style={{ y: imageY, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 0 }}
      >
        <div
          ref={gridRef}
          className="columns-2 sm:columns-3 xl:columns-4 gap-px bg-stone"
        >
          {items.map((image, i) => (
            <div
              key={image?.id ?? i}
              className="mb-px break-inside-avoid relative overflow-hidden bg-bone"
              style={{ paddingBottom: paddingFor(i) }}
            >
              {image ? (
                <img
                  src={image.url || image.imageUrl}
                  alt={image.caption || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 bg-bone animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {!loading && images.length > 0 && (
          <div className="bg-cream border-t border-stone py-8 flex items-center justify-center gap-6">
            <div className="w-16 h-px bg-stone" />
            <p className="label text-clay/40 text-[10px]" style={{ letterSpacing: '0.2em' }}>
              Bandarban · Rangamati · Khagrachhari
            </p>
            <div className="w-16 h-px bg-stone" />
          </div>
        )}
      </motion.div>

      {/* ─── TITLE: fixed, translated up as user scrolls ─── */}
      <motion.div
        style={{ y: titleY }}
        className="fixed top-0 left-0 right-0 z-20 pointer-events-none"
      >
        {/* Gradient fade so title is legible over any image */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: '40rem',
            background: 'linear-gradient(to bottom, rgba(28,18,9,0.93) 0%, rgba(28,18,9,0.52) 38%, rgba(28,18,9,0.14) 68%, transparent 100%)',
          }}
        />

        <div
          className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-20 px-8 sm:px-12 lg:px-16"
          style={{ paddingTop: '6.5rem' }}
        >
          <div>
           
            <h1
              className="font-display font-semibold text-white leading-none"
              style={{ fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)', letterSpacing: '-0.02em' }}
            >
              What the<br />
              <em>Hills Yield</em>
            </h1>
          </div>

          <p className="hidden lg:block text-white text-sm leading-[1.8] max-w-[260px] lg:pb-2 shrink-0">
            A visual record of our farms,<br />
            harvests, and the hillside life<br />
            that makes TropiPine possible.
          </p>
        </div>
      </motion.div>

    </div>
  )
}
