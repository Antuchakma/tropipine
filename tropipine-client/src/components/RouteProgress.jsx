import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function RouteProgress() {
  const location = useLocation()
  const [key, setKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setKey((k) => k + 1)
    setVisible(true)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={key}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 0.3, delay: 0.5 },
          }}
          onAnimationComplete={(def) => {
            if (def === 'exit') setVisible(false)
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: '#2A3B26',
            transformOrigin: 'left',
            zIndex: 9998,
          }}
        />
      )}
    </AnimatePresence>
  )
}
