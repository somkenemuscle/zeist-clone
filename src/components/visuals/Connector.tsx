import { motion } from 'motion/react'

type ConnectorProps = { active: boolean; className?: string }

const pulse = { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } as const

/** A thin rail with a light pulse travelling along it while active. Vertical when stacked, horizontal on lg+. */
export function Connector({ active, className = '' }: ConnectorProps) {
  return (
    <div aria-hidden className={`relative flex items-center justify-center ${className}`}>
      <div className="relative h-8 w-px overflow-hidden bg-line-strong lg:h-px lg:w-full">
        {active && (
          <>
            <motion.span
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-brand-soft to-transparent lg:hidden"
              initial={{ top: -40 }}
              animate={{ top: [-40, 40] }}
              transition={pulse}
            />
            <motion.span
              className="absolute inset-y-0 hidden w-16 bg-gradient-to-r from-transparent via-brand-soft to-transparent lg:block"
              initial={{ left: '-64px' }}
              animate={{ left: ['-64px', '100%'] }}
              transition={pulse}
            />
          </>
        )}
      </div>
      <motion.span
        className="absolute size-1.5 rounded-full"
        animate={{
          backgroundColor: active ? '#a69bff' : '#33343f',
          boxShadow: active ? '0 0 12px 2px rgb(166 155 255 / 0.6)' : '0 0 0 0 rgb(0 0 0 / 0)',
        }}
      />
    </div>
  )
}
