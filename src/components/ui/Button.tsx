import { ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

type ButtonProps = Omit<HTMLMotionProps<'a'>, 'children'> & {
  variant?: Variant
  arrow?: boolean
  /** Pulls gently toward the pointer. On by default for the primary CTA. */
  magnetic?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_8px_30px_-12px_rgb(99_91_255/0.6)] hover:bg-[#7069ff] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.18)_inset,0_10px_40px_-8px_rgb(99_91_255/0.8)]',
  ghost: 'border border-line-strong bg-ink/[0.02] text-ink hover:border-dim hover:bg-ink/[0.05]',
}

const spring = { stiffness: 260, damping: 18, mass: 0.4 }

export function Button({
  variant = 'primary',
  arrow,
  magnetic = variant === 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const x = useSpring(useMotionValue(0), spring)
  const y = useSpring(useMotionValue(0), spring)
  const external = props.href?.startsWith('http')

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      {...(external && { target: '_blank', rel: 'noreferrer' })}
      {...props}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-[15px] font-medium transition-[background-color,border-color,box-shadow] duration-300 ${variants[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-[left] duration-700 ease-out group-hover:left-[150%]"
        />
      )}
      <span className="relative inline-flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </motion.a>
  )
}
