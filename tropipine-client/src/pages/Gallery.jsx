import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import { motion, useScroll, useTransform } from 'framer-motion'
import Footer from '../components/Footer'

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// Scroll distance (px) the user travels through the title
// before the image grid begins moving.
const TITLE_SCROLL = 520

// Easing curves
const EXPO_OUT  = [0.16, 1, 0.3,  1]
const QUART_OUT = [0.25, 1, 0.5,  1]
const SINE_OUT  = [0.39, 0.575, 0.565, 1]

// ─── ASPECT RATIOS ───────────────────────────────────────────────────────────
// Each column gets its own repeating rhythm of aspect ratios,
// creating an intentional editorial cadence rather than random variation.

const COL_RHYTHMS = [
  // Left column: anchored by tall portraits
  ['2/3', '4/3', '3/4', '1/1', '2/3', '16/9'],
  // Middle column: landscape-leaning, grounded by squares
  ['4/3', '3/4', '1/1', '4/3', '3/4', '2/3'],
  // Right column: varied — tall portrait leads, then opens out
  ['3/4', '16/9', '2/3', '4/3', '1/1', '3/4'],
]

const aspectFor = (colIdx, rowIdx) => {
  const rhythm = COL_RHYTHMS[colIdx % COL_RHYTHMS.length]
  return rhythm[rowIdx % rhythm.length]
}

// ─── RESPONSIVE COLUMN COUNT ─────────────────────────────────────────────────

const getNumCols = () => {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640)  return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

// ─── IMAGE REVEAL ANIMATION ──────────────────────────────────────────────────
// Zoom-out + fade: image begins slightly cropped-in, then opens to full.

const revealVariants = {
  hidden: { opacity: 0, scale: 1.08 },
  show: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 1.4, delay, ease: QUART_OUT },
      scale:   { duration: 2.4, delay, ease: EXPO_OUT },
    },
  }),
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Gallery() {
  const [images, setImages]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [gridHeight, setGridHeight] = useState(6000)
  const [numCols, setNumCols]       = useState(getNumCols)
  const gridRef = useRef(null)

  // ── Scroll setup ───────────────────────────────────────────────────────────
  const { scrollY } = useScroll()

  const rawTitleY = useTransform(scrollY, [0, TITLE_SCROLL], [0, -TITLE_SCROLL])
  const rawImageY = useTransform(scrollY, (v) =>
    v < TITLE_SCROLL ? 0 : -(v - TITLE_SCROLL)
  )

  const titleY = rawTitleY
  const imageY = rawImageY

  // ── Data ───────────────────────────────────────────────────────────────────
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    axios.get(`${API_URL}/gallery`)
      .then((r) => setImages(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // ── Responsive columns ────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setNumCols(getNumCols())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Grid height tracking ──────────────────────────────────────────────────
  // ResizeObserver keeps gridHeight accurate on load, image-in, and resize.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setGridHeight(el.scrollHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Column layout ─────────────────────────────────────────────────────────
  // 12 skeletons = 2 complete passes through each column's 6-rhythm,
  // so loading state itself has balanced visual weight.
  const items = loading ? Array(12).fill(null) : images

  const columns = useMemo(
    () =>
      Array.from({ length: numCols }, (_, col) =>
        items.reduce((acc, item, i) => {
          if (i % numCols === col) acc.push({ item, globalIdx: i })
          return acc
        }, [])
      ),
    [items, numCols]
  )

  // ─────────────────────────────────────────────────────────────────────────
  return (
    // Outer container provides the total scroll height.
    // bg-bark fills below the grid in case of any residual gap.
    <div style={{ height: TITLE_SCROLL + gridHeight, backgroundColor: '#1A1410' }}>

      {/* ════════════════════════════════════════════════════════════════════
          IMAGE GRID
          Fixed to viewport. imageY spring keeps it motionless while the
          title scrolls, then scrolls it at 1:1 (spring-smoothed) after.
          ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        aria-hidden="true"
        style={{
          y: imageY,
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 0,
          willChange: 'transform',
        }}
      >
        {/*
          Manual column layout — three flex-col divs side by side.
          Explicitly distributes images so aspect ratios per column
          follow the COL_RHYTHMS patterns above.

          The LAST image in each column uses flex-grow: 1 + min-height
          so it stretches to fill any remaining column height, guaranteeing
          all columns end at exactly the same pixel row — no dark void.
        */}
        <div ref={gridRef}>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              backgroundColor: '#1A1410',
            }}
          >
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {col.map(({ item, globalIdx }, rowIdx) => {
                  const isLast = rowIdx === col.length - 1
                  const delay  = Math.min(globalIdx * 0.045, 0.85)

                  return (
                    <div
                      key={item?.id ?? globalIdx}
                      style={{
                        // Non-last: fixed aspect ratio drives height.
                        // Last: flex-grow to fill remaining column height.
                        ...(isLast
                          ? { flexGrow: 1, flexShrink: 0, minHeight: 220 }
                          : { aspectRatio: aspectFor(colIdx, rowIdx), flexShrink: 0 }),
                        position: 'relative',
                        overflow: 'hidden',
                        // bg fills sub-pixel seams between tiles
                        backgroundColor: '#1A1410',
                      }}
                    >
                      {item ? (
                        /*
                          Cinematic reveal:
                          scale 1.08→1 over 2.4 s (EXPO_OUT) — image "breathes" open.
                          opacity 0→1 over 1.4 s (QUART_OUT) — gentle materialisation.
                          brightness/contrast → editorial "printed" depth.
                        */
                        <motion.img
                          custom={delay}
                          initial="hidden"
                          animate="show"
                          variants={revealVariants}
                          src={item.url || item.imageUrl}
                          alt={item.caption || ''}
                          loading="lazy"
                          draggable={false}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.93) contrast(1.05)',
                            willChange: 'transform, opacity',
                          }}
                        />
                      ) : (
                        // Loading skeleton — dark pulse, matches bg
                        <motion.div
                          animate={{ opacity: [0.3, 0.55, 0.3] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: SINE_OUT }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: '#2A1E14',
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <Footer />
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════
          TITLE OVERLAY
          Also fixed. titleY spring scrolls it upward on user input,
          exiting the viewport before imageY begins responding.
          ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: titleY,
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 20,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        {/* ── Gradient ── */}
        {/* Seven-stop fade ensures a smooth, seam-free transition
            from fully opaque (for navbar + title) to fully transparent.
            This prevents any visible gradient "band" over images. */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 auto 0',
            height: '56rem',
            background: [
              'linear-gradient(to bottom,',
              'hsl(25 35% 7% / 0.98)   0%,',
              'hsl(25 35% 7% / 0.92)  12%,',
              'hsl(25 35% 7% / 0.78)  26%,',
              'hsl(25 35% 7% / 0.55)  42%,',
              'hsl(25 35% 7% / 0.28)  60%,',
              'hsl(25 35% 7% / 0.08)  76%,',
              'hsl(25 35% 7% / 0.00) 100%)',
            ].join(' '),
          }}
        />

        {/* ── Title block ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EXPO_OUT }}
          style={{
            position: 'relative',
            padding: '6.5rem 4rem 0',
          }}
        >
          {/* Eyebrow — decorative rule + provenance label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: QUART_OUT }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ height: 1, width: 40, backgroundColor: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <span style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}>
              Chittagong Hill Tracts
            </span>
          </motion.div>

          {/* Main headline + sidebar */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '3rem' }}>

            <h1
              style={{
                fontFamily: '"Cormorant Garant", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(4.8rem, 12vw, 11rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 48px rgba(0,0,0,0.3)',
              }}
            >
              What the
              <br />
              <em style={{ fontStyle: 'italic' }}>Hills Yield</em>
            </h1>

            {/* Sidebar — only visible on large screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: QUART_OUT }}
              style={{
                display: 'none',
                flexDirection: 'column',
                gap: '1rem',
                paddingBottom: '0.5rem',
                maxWidth: 195,
                flexShrink: 0,
              }}
              className="lg-sidebar"
            >
              <div style={{ height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <p style={{
                color: 'rgba(255,255,255,0.32)',
                fontSize: '0.78rem',
                lineHeight: 1.95,
                fontWeight: 300,
                letterSpacing: '0.04em',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                margin: 0,
              }}>
                A visual record of our farms,
                {' '}harvests, and the hillside
                {' '}life that makes TropiPine
                {' '}possible.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      {/* Inline style for the sidebar media query —
          avoids adding Tailwind breakpoints to inline-style elements. */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; }
        }
        @media (max-width: 639px) {
          [data-gallery-grid] { padding-top: 0; }
        }
      `}</style>

    </div>
  )
}
