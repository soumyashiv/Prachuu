import { motion } from 'motion/react'
import { EASE } from '../constants'
import { LOGO_MARK } from '../lib/glyphs'

export default function Logo() {
  return (
    <motion.div
      id="logo"
      className="pointer-events-none fixed left-4 top-4 z-20 w-[124px] mix-blend-exclusion sm:left-8 sm:top-8 sm:w-[266px] lg:w-[355px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0 }}
    >
      <svg
        role="img"
        aria-label="prachii"
        className="block h-auto w-full"
        viewBox="0 0 355 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* textLength pins the wordmark to the same width the old "prmpt" glyphs used */}
        <text
          x="0"
          y="87"
          fill="white"
          fontFamily="'Inter Tight', sans-serif"
          fontWeight={500}
          fontSize="96"
          textLength="284"
          lengthAdjust="spacing"
        >
          prachii
        </text>
        <path d={LOGO_MARK} fill="white" />
      </svg>
    </motion.div>
  )
}
