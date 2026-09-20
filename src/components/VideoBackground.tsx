import { useEffect, useRef, useState } from 'react'
import { VIDEO_LEFT, VIDEO_RIGHT } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const hasDuration = (v: HTMLVideoElement) => Number.isFinite(v.duration) && v.duration > 0

/** Only request a new seek once the browser has finished the previous one. */
function seek(v: HTMLVideoElement, t: number) {
  if (v.seeking) return
  if (Math.abs(v.currentTime - t) < 0.001) return
  v.currentTime = t
}

const show = (v: HTMLVideoElement) => {
  if (v.style.display !== 'block') v.style.display = 'block'
}
const hide = (v: HTMLVideoElement) => {
  if (v.style.display !== 'none') v.style.display = 'none'
}

export default function VideoBackground() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  // Fade the canvas in once both videos have data. The timeout is a fallback for
  // browsers (iOS Safari) that won't preload a video until it is played.
  useEffect(() => {
    const candidates = isDesktop ? [leftRef.current, rightRef.current] : [leftRef.current]
    const videos = candidates.filter((v): v is HTMLVideoElement => v !== null)
    let loaded = 0
    const cleanups: Array<() => void> = []
    const markReady = () => setReady(true)

    videos.forEach((v) => {
      if (v.readyState >= 2) {
        loaded++
        return
      }
      const onLoaded = () => {
        loaded++
        if (loaded >= videos.length) markReady()
      }
      v.addEventListener('loadeddata', onLoaded, { once: true })
      cleanups.push(() => v.removeEventListener('loadeddata', onLoaded))
    })
    if (loaded >= videos.length) markReady()

    const fallback = window.setTimeout(markReady, 3000)
    return () => {
      cleanups.forEach((fn) => fn())
      window.clearTimeout(fallback)
    }
  }, [isDesktop])

  // Desktop: scrub by cursor X. Videos are never played.
  useEffect(() => {
    if (!isDesktop) return
    const vl = leftRef.current
    const vr = rightRef.current
    if (!vl || !vr) return

    let targetX = window.innerWidth / 2
    let side: 'left' | 'right' = 'right' // which side of centre the cursor was last on
    let raf = 0

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      if (hasDuration(vl) && hasDuration(vr)) {
        const width = window.innerWidth || 1000
        const centerX = width / 2
        const x = clamp(targetX, 0, width)
        const deadZone = Math.max(30, width * 0.05)
        const dist = x - centerX
        const inDeadZone = Math.abs(dist) <= deadZone

        // Side only changes once the cursor leaves the dead zone.
        if (!inDeadZone) side = dist < 0 ? 'left' : 'right'

        // Cursor on the left shows the RIGHT video, and vice versa.
        const shown = side === 'left' ? vr : vl
        const hidden = side === 'left' ? vl : vr
        show(shown)
        hide(hidden)

        if (inDeadZone) {
          seek(vl, 0)
          seek(vr, 0)
        } else {
          const progress =
            side === 'left'
              ? (centerX - deadZone - x) / Math.max(1, centerX - deadZone)
              : (x - (centerX + deadZone)) / Math.max(1, width - centerX - deadZone)
          seek(shown, clamp(progress, 0, 1) * shown.duration)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isDesktop])

  // Touch (mobile/tablet): autoplay, alternating left → right → left.
  useEffect(() => {
    if (isDesktop) return
    const vl = leftRef.current
    const vr = rightRef.current
    if (!vl || !vr) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const play = (v: HTMLVideoElement) => {
      v.currentTime = 0
      v.play().catch(() => {})
    }
    const onLeftEnded = () => {
      hide(vl)
      show(vr)
      play(vr)
    }
    const onRightEnded = () => {
      hide(vr)
      show(vl)
      play(vl)
    }

    show(vl)
    hide(vr)
    vl.currentTime = 0
    vl.addEventListener('ended', onLeftEnded)
    vr.addEventListener('ended', onRightEnded)
    if (!reduceMotion) vl.play().catch(() => {})

    // If autoplay was blocked, the first tap starts whichever video is showing.
    const onTap = () => {
      if (reduceMotion) return
      const current = vl.style.display === 'block' ? vl : vr
      if (current.paused) current.play().catch(() => {})
    }
    window.addEventListener('pointerdown', onTap, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', onTap)
      vl.removeEventListener('ended', onLeftEnded)
      vr.removeEventListener('ended', onRightEnded)
      vl.pause()
      vr.pause()
    }
  }, [isDesktop])

  return (
    <div
      id="main-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-[220px] z-0 h-[calc(100vh-220px)] w-screen overflow-hidden sm:top-0 sm:h-full sm:w-full"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      <video
        ref={leftRef}
        src={VIDEO_LEFT}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ display: 'none' }}
      />
      <video
        ref={rightRef}
        src={VIDEO_RIGHT}
        muted
        playsInline
        preload={isDesktop ? 'auto' : 'metadata'}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  )
}
