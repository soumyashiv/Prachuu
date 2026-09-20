import { motion } from 'motion/react'
import { EASE } from '../constants'

export default function Caption() {
  return (
    <motion.p
      id="caption"
      className="pointer-events-none fixed left-4 top-[118px] z-20 w-[calc(100vw-32px)] text-[12px] leading-[140%] tracking-[-0.04em] text-white mix-blend-exclusion sm:left-8 sm:top-[180px] sm:w-[calc(50vw-48px)] lg:top-[244px] lg:w-[692px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
    >
      When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a
      small dead zone: if cursor is within ±50px of center, keep both videos at currentTime = 0 and
      show whichever was last active.
    </motion.p>
  )
}
