import { useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Steps through `count` items every `interval` ms while the target is on screen.
 * Manual selection pauses autoplay so the reader stays in control.
 */
export function useAutoCycle<T extends Element>(count: number, interval = 5000) {
  const ref = useRef<T>(null)
  const inView = useInView(ref as RefObject<T>, { amount: 0.35 })
  const [index, setIndex] = useState(0)
  const [manual, setManual] = useState(false)

  const playing = inView && !manual

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval)
    return () => window.clearTimeout(id)
  }, [playing, index, count, interval])

  const select = useCallback((i: number) => {
    setManual(true)
    setIndex(i)
  }, [])

  return { ref, index, select, playing, interval }
}
