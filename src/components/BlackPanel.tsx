import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GALLERY } from '../constants'
import { buildLayout } from '../lib/layout'
import { useMediaQuery } from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Black gallery panel.
 *
 * - GSAP ScrollTrigger (scrub) slides the panel up over the first 100vh of scroll.
 * - A requestAnimationFrame loop (reading window.scrollY, no scroll listener) then
 *   scrolls the inner wrapper, scales the cards, and drives the outro elements.
 */
export default function BlackPanel() {
  const isTabletUp = useMediaQuery('(min-width: 640px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const cols = isDesktop ? 4 : isTabletUp ? 3 : 2
  const layout = useMemo(() => buildLayout(GALLERY.length, cols), [cols])

  const panelRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Phase 1: panel slides up from below.
  useGSAP(() => {
    gsap.fromTo(
      panelRef.current,
      { y: () => window.innerHeight },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scroll-spacer',
          start: 'top top',
          end: () => `+=${window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  }, [])

  // Phase 2 + outro: RAF loop.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const spacer = document.getElementById('scroll-spacer')
    const mainCanvas = document.getElementById('main-canvas')
    const overlay = document.getElementById('outro-overlay')
    const info = document.getElementById('outro-info')
    const buy = document.getElementById('outro-buy')
    const footer = document.getElementById('outro-footer')

    let vh = window.innerHeight
    let maxScroll = 0
    let items: HTMLElement[] = []
    let tops: number[] = []
    let heights: number[] = []
    let scales: number[] = []
    let lastSy = -1
    let inPhase2 = false
    let raf = 0
    let resizeTimer = 0

    const measure = () => {
      vh = window.innerHeight
      items = Array.from(wrap.querySelectorAll<HTMLElement>('.bp-card'))
      // Cards are absolutely positioned inside their cell; the cell holds the layout box.
      const cells = items.map((el) => el.parentElement as HTMLElement)
      tops = cells.map((c) => c.offsetTop) // relative to `wrap` (position: relative)
      heights = cells.map((c) => c.offsetHeight)
      scales = items.map(() => -1)
      maxScroll = Math.max(0, wrap.scrollHeight - vh)
      if (spacer) spacer.style.height = `${vh + maxScroll + 2 * vh}px`
      lastSy = -1 // force a recompute on the next frame
    }

    const setScale = (i: number, s: number) => {
      const v = Math.round(s * 1000) / 1000
      if (scales[i] === v) return
      scales[i] = v
      items[i].style.transform = `scale(${v})`
    }

    const scaleCards = (panelOffset: number, phase2: number) => {
      for (let i = 0; i < items.length; i++) {
        const top = tops[i] - phase2 + panelOffset
        const bottom = top + heights[i]
        if (bottom <= 0 || top >= vh) {
          setScale(i, 0)
          continue
        }
        const enter = Math.min(1, Math.max(0, (vh - top) / (vh * 0.6)))
        const exit = Math.min(1, Math.max(0, bottom / (vh * 0.4)))
        setScale(i, Math.min(enter, exit))
      }
    }

    const tick = () => {
      const sy = window.scrollY

      if (sy !== lastSy) {
        lastSy = sy

        // Video is hidden once the first viewport has scrolled past.
        if (mainCanvas) mainCanvas.style.visibility = sy >= vh ? 'hidden' : 'visible'

        if (sy < vh) {
          // Phase 1: panel is still sliding (GSAP owns its transform).
          if (inPhase2) {
            inPhase2 = false
            wrap.style.transform = 'translateY(0px)'
            if (overlay) overlay.style.opacity = '0'
            if (info) info.style.transform = 'translateY(0px)'
            if (buy) buy.style.transform = 'scale(0)'
            if (footer) footer.style.opacity = '0'
          }
          scaleCards(vh - sy, 0)
        } else {
          // Phase 2: panel is fixed, inner wrapper scrolls up.
          inPhase2 = true
          const phase2 = Math.min(sy - vh, maxScroll)
          wrap.style.transform = `translateY(${-phase2}px)`

          // Outro: white overlay, product info lifts, "view" scales in, footer fades in.
          const outro = Math.min(1, Math.max(0, (sy - vh - maxScroll) / (vh - 100)))
          if (overlay) overlay.style.opacity = String(outro)
          if (info) {
            const offset = Number(info.dataset.outroOffset || 166)
            info.style.transform = `translateY(${-outro * offset}px)`
          }
          if (buy) buy.style.transform = `scale(${outro})`
          if (footer) footer.style.opacity = String(outro)

          scaleCards(0, phase2)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(measure, 50)
    }

    measure()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [layout])

  return (
    <div
      ref={panelRef}
      id="black-panel"
      className="fixed inset-0 z-10 overflow-hidden bg-black"
      style={{ transform: 'translateY(100vh)' }}
    >
      <div ref={wrapRef} className="relative w-full pt-[min(400px,40vh)]">
        {layout.map((row, r) => (
          <div key={`${cols}-${r}`} className="flex w-full">
            {row.map((idx, ci) => (
              <div key={ci} className="relative aspect-[2/3] flex-1">
                {idx !== -1 && (
                  <div
                    className="bp-card absolute inset-0"
                    style={{
                      transform: 'scale(0)',
                      transformOrigin: ci < cols / 2 ? 'right bottom' : 'left bottom',
                    }}
                  >
                    <img
                      src={GALLERY[idx]}
                      alt=""
                      draggable={false}
                      decoding="async"
                      className="h-full w-full select-none object-cover [-webkit-user-drag:none]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
