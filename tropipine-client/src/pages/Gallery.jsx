import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, useScroll, useTransform } from 'framer-motion'

const TITLE_SCROLL = 440

// Mix of wide landscape (58-62%) and tall portrait (130-160%) for dramatic rhythm
const paddingFor = (i) => {
  const pattern = [
    '128%', '60%', '158%', '100%', '118%',
    '58%',  '148%', '100%', '78%',  '138%',
    '62%',  '150%',
  ]
  return pattern[i % pattern.length]
}

export default function Gallery() {
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [gridHeight, setGridHeight] = useState(6000)
  const gridRef = useRef(null)

  const { scrollY } = useScroll()

  const titleY = useTransform(scrollY, [0, TITLE_SCROLL], ['0px', `-${TITLE_SCROLL}px`])
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

  useEffect(() => {
    if (!loading && gridRef.current) {
      setGridHeight(gridRef.current.scrollHeight)
    }
  }, [loading, images])

  const items = loading ? Array(12).fill(null) : images

  return (
    <div className="bg-bark" style={{ height: TITLE_SCROLL + gridHeight }}>

      {/* ─── IMAGE GRID — always fixed, y-locked until title exits ─── */}
      <motion.div
        style={{ y: imageY, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 0 }}
      >
        {/* gap-0: seamless — no hairlines between columns or rows */}
        <div ref={gridRef} className="columns-2 sm:columns-3 gap-0 bg-bark">
          {items.map((image, i) => (
            <div
              key={image?.id ?? i}
              className="break-inside-avoid relative overflow-hidden bg-earth/20"
              style={{ paddingBottom: paddingFor(i) }}
            >
              {image ? (
                /* Zoom-out reveal: each image starts slightly cropped-in, opens out */
                <motion.img
                  initial={{ opacity: 0, scale: 1.09 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1.8,
                    delay: Math.min(i * 0.055, 0.9),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  src={image.url || image.imageUrl}
                  alt={image.caption || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 bg-earth/20 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── TITLE — fixed, scrolls out 1:1 with user ─── */}
      <motion.div
        style={{ y: titleY }}
        className="fixed top-0 left-0 right-0 z-20 pointer-events-none"
      >
        {/* Deep gradient: dark at top, fully transparent by halfway down */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: '46rem',
            background:
              'linear-gradient(to bottom, rgba(28,18,9,0.96) 0%, rgba(28,18,9,0.65) 32%, rgba(28,18,9,0.22) 60%, transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-24 px-8 sm:px-12 lg:px-16"
          style={{ paddingTop: '6.5rem' }}
        >
          <div>
            <p
              className="label text-white/32 mb-6"
              style={{ letterSpacing: '0.28em' }}
            >
              Chittagong Hill Tracts
            </p>
            <h1
              className="font-display font-semibold text-white leading-none"
              style={{ fontSize: 'clamp(4.5rem, 11vw, 10rem)', letterSpacing: '-0.025em' }}
            >
              What the<br />
              <em>Hills Yield</em>
            </h1>
          </div>

          <p className="hidden lg:block text-white/38 text-sm leading-[2] max-w-[220px] lg:pb-3 shrink-0 font-light tracking-wide">
            A visual record of our farms,<br />
            harvests, and the hillside life<br />
            that makes TropiPine possible.
          </p>
        </motion.div>
      </motion.div>

    </div>
  )
}
