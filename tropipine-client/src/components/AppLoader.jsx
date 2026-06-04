import { useEffect } from 'react'
import { motion } from 'framer-motion'

const EXPO_OUT  = [0.16, 1, 0.3, 1]
const QUART_OUT = [0.25, 1, 0.5, 1]

export default function AppLoader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.6, ease: QUART_OUT }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#1A1410',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Eyebrow */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8, delay: 0.3, ease: QUART_OUT }}
        style={{
          color: '#F8F5F0',
          fontSize: '0.62rem',
          fontWeight: 500,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}
      >
        Chittagong Hill Tracts
      </motion.span>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: EXPO_OUT }}
        style={{
          fontFamily: '"Cormorant Garant", Georgia, serif',
          fontWeight: 600,
          fontStyle: 'italic',
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: '#F8F5F0',
          margin: 0,
        }}
      >
        TropiPine
      </motion.h1>

      {/* Drawing line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.5, ease: EXPO_OUT }}
        style={{
          height: 1,
          width: 'clamp(120px, 20vw, 220px)',
          backgroundColor: '#8C6F58',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  )
}
