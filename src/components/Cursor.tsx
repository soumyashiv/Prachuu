import { useEffect, useRef } from 'react'
import { CURSOR_GLYPH } from '../lib/glyphs'

/** Desktop-only custom cursor. Positioned by direct DOM writes, not React state. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      id="custom-cursor"
      aria-hidden="true"
      className="pointer-events-none fixed z-50 hidden h-12 w-12 mix-blend-exclusion lg:block"
      style={{ left: -100, top: -100, transform: 'translate(-50%, -50%)' }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={CURSOR_GLYPH} fill="white" />
        <circle cx="24" cy="24" r="22.75" stroke="white" strokeWidth="2.5" />
      </svg>
    </div>
  )
}
