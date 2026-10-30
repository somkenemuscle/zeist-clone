import { useEffect, useState } from 'react'

/** Types `text` out character by character while `active` is true; rewinds when inactive. */
export function useTypewriter(text: string, active: boolean, speed = 32) {
  const [count, setCount] = useState(0)
  const target = active ? text.length : 0

  useEffect(() => {
    if (count === target) return
    const id = window.setTimeout(() => setCount(active ? count + 1 : 0), active ? speed : 0)
    return () => window.clearTimeout(id)
  }, [active, count, target, speed])

  return { typed: text.slice(0, count), done: count >= text.length }
}
