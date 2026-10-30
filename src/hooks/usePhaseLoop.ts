import { useInView } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Advances through phases with per-phase durations while the target is visible.
 * `loop: false` stops on the last phase. These are in-place state changes rather than
 * large movement, so they keep running under "Reduce motion".
 */
export function usePhaseLoop<T extends Element>(durations: number[], { loop = true } = {}) {
  const ref = useRef<T>(null)
  const inView = useInView(ref as RefObject<T>, { amount: 0.3 })
  const last = durations.length - 1
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (!loop && phase === last) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase])
    return () => window.clearTimeout(id)
  }, [phase, inView, loop, last, durations])

  return { ref, phase, last }
}
