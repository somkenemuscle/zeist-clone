import { motion } from 'motion/react'

type Tab = { id: string; label: string }

type TabsProps = {
  tabs: readonly Tab[]
  index: number
  onSelect: (i: number) => void
  /** Draws a progress bar under the active tab while autoplay runs. */
  playing?: boolean
  interval?: number
  layoutId: string
  className?: string
}

export function Tabs({ tabs, index, onSelect, playing, interval = 5000, layoutId, className = '' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface/80 p-1 [scrollbar-width:none] ${className}`}
    >
      {tabs.map((tab, i) => {
        const active = i === index
        return (
          <motion.button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onSelect(i)}
            whileTap={{ scale: 0.95 }}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
              active ? 'text-ink' : 'text-muted hover:bg-ink/[0.04] hover:text-copy'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 overflow-hidden rounded-full border border-line-strong bg-raised shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
              >
                {playing && (
                  <motion.span
                    key={index}
                    className="absolute bottom-0 left-3 h-px bg-gradient-to-r from-brand-soft to-brand"
                    initial={{ width: 0 }}
                    animate={{ width: 'calc(100% - 1.5rem)' }}
                    transition={{ duration: interval / 1000, ease: 'linear' }}
                  />
                )}
              </motion.span>
            )}
            <span className="relative">{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
