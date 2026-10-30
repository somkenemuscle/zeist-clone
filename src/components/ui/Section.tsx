import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  /** Slightly lifted background with hairline edges, to give the page rhythm. */
  raised?: boolean
  className?: string
  children: ReactNode
}

export function Section({ id, raised = false, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 ${raised ? 'border-y border-line bg-base' : ''} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  /** Two lines, each revealed separately. */
  title: [string, string]
  lead: string
  align?: 'left' | 'center'
  children?: ReactNode
}

const ease = [0.22, 1, 0.36, 1] as const

export function SectionHeading({ eyebrow, title, lead, align = 'left', children }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div className={`mb-14 sm:mb-16 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-brand-soft uppercase ${centered ? 'justify-center' : ''}`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-brand-soft/70 to-transparent" />
        {eyebrow}
      </motion.p>
      <h2 className="text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl md:leading-[1.02]">
        {title.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: '105%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="mt-5 text-lg leading-relaxed text-muted sm:text-xl"
      >
        {lead}
      </motion.p>
      {children}
    </div>
  )
}
