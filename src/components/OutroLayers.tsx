/** White overlay and footer, both driven by the scroll scene (opacity 0 → 1). */
export function OutroOverlay() {
  return (
    <div
      id="outro-overlay"
      className="pointer-events-none fixed inset-0 z-[12] bg-white"
      style={{ opacity: 0 }}
    />
  )
}

export function OutroFooter() {
  return (
    <div
      id="outro-footer"
      className="pointer-events-none fixed bottom-6 left-4 right-4 z-[15] flex items-center justify-between mix-blend-exclusion sm:bottom-8 sm:right-auto sm:justify-start sm:gap-20"
      style={{ opacity: 0 }}
    >
      <span className="text-[11px] uppercase tracking-[-0.02em] text-white sm:text-[13px]">
        PRACHII&reg; 2026
      </span>
      <span className="text-[11px] uppercase tracking-[-0.02em] text-white sm:text-[13px]">
        PRIVACY POLICY
      </span>
    </div>
  )
}
