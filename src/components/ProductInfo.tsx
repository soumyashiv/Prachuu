import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { EASE, SYMBOLS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function ProductInfo() {
  const isDesktopUp = useMediaQuery('(min-width: 640px)')
  const [symbol, setSymbol] = useState('8')

  // Circle symbol shuffles on scroll, throttled to 80ms.
  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const now = performance.now()
      if (now - last < 80) return
      last = now
      setSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      id="outro-info"
      // Read every frame by the scroll scene to lift this block during the outro.
      data-outro-offset={isDesktopUp ? 166 : 132}
      className="pointer-events-none fixed bottom-12 left-0 right-0 z-20 flex w-auto flex-col items-center mix-blend-exclusion sm:bottom-20 sm:left-auto sm:right-8 sm:w-[330px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
    >
      <div className="mb-3 flex w-[252px] flex-col items-start sm:mb-8 sm:w-full">
        <div className="relative h-5 w-5 sm:h-[30px] sm:w-[30px]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="20"
              cy="20"
              r="18.75"
              stroke="white"
              className="[stroke-width:2] sm:[stroke-width:2.5]"
            />
          </svg>
          <span
            id="circle-symbol"
            className="absolute inset-0 flex items-center justify-center text-[10px] uppercase leading-none tracking-[-0.04em] text-white sm:text-[15px]"
          >
            {symbol}
          </span>
        </div>
        <span className="w-full text-center text-[20px] uppercase leading-none tracking-[-0.04em] text-white sm:text-[30px]">
          ARCHIVE COLLECTION
          <br />
          &quot;PRACHII&quot;
        </span>
      </div>
      <span className="w-full text-center text-[60px] leading-none tracking-[-0.04em] text-white sm:text-[80px]">
        $97,33
      </span>
    </motion.div>
  )
}
