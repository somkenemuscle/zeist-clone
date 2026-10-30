import { motion } from 'motion/react'

type LogoMarkProps = { className?: string; animated?: boolean }

/** Isometric cube mark, redrawn as SVG so it scales and animates crisply. */
export function LogoMark({ className = 'size-7', animated = false }: LogoMarkProps) {
  const draw = animated
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {}

  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="zeist-mark" x1="4" y1="2" x2="28" y2="30">
          <stop stopColor="#c9c6ff" />
          <stop offset="1" stopColor="#635bff" />
        </linearGradient>
      </defs>
      <g stroke="url(#zeist-mark)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <motion.path d="M16 3 28 9.5v13L16 29 4 22.5v-13L16 3Z" {...draw} />
        <motion.path d="M4 9.5 16 16l12-6.5M16 16v13" {...draw} />
        <motion.path d="M10 12.8v6.6l6 3.3 6-3.3v-6.6" strokeWidth="1.8" opacity={0.75} {...draw} />
      </g>
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight text-ink">Zeist</span>
    </span>
  )
}
