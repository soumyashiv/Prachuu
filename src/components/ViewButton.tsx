/** Pill CTA. Hidden at scale(0); the scroll scene scales it in during the outro. */
export default function ViewButton() {
  return (
    <div
      id="outro-buy"
      className="pointer-events-none fixed bottom-[60px] left-4 right-4 z-20 flex h-[100px] items-center justify-center rounded-[1335px] bg-white mix-blend-exclusion sm:bottom-8 sm:left-auto sm:right-8 sm:h-[174px] sm:w-[330px]"
      style={{ transform: 'scale(0)', transformOrigin: 'right bottom' }}
    >
      <span className="text-center text-[72px] leading-none tracking-[-0.04em] text-white mix-blend-exclusion sm:text-[110px]">
        view
      </span>
    </div>
  )
}
