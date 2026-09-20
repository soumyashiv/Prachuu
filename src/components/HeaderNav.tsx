import { motion } from 'motion/react'
import { EASE } from '../constants'

export default function HeaderNav() {
  return (
    <motion.header
      id="header-nav"
      className="pointer-events-none fixed right-4 top-4 z-20 flex h-[30px] w-auto flex-row items-center justify-between mix-blend-exclusion sm:right-8 sm:top-8 sm:w-[330px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
    >
      <span className="hidden text-[15px] uppercase leading-[18px] text-white sm:block">About</span>
      <div className="flex flex-row items-center gap-5 sm:gap-[50px]">
        <svg
          className="h-6 w-6 sm:h-[30px] sm:w-[30px]"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 14H40M0 26H40" stroke="white" strokeWidth="2.5" />
        </svg>
        <span className="text-[13px] leading-[18px] text-white sm:text-[15px]">[ CART ]</span>
      </div>
    </motion.header>
  )
}
