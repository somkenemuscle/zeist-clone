import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

type CopyCommandProps = { command: string; className?: string }

/** Terminal-style command with copy. Always dark, even inside light sections. */
export function CopyCommand({ command, className = '' }: CopyCommandProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can be blocked (insecure context); the command stays selectable.
    }
  }

  return (
    <div
      className={`theme-dark group/cmd flex items-center gap-3 rounded-xl border border-line bg-base py-2 pr-2 pl-4 font-mono text-[13px] transition-colors duration-300 hover:border-line-strong ${className}`}
    >
      <span className="text-brand-soft transition-transform duration-300 select-none group-hover/cmd:translate-x-0.5">
        $
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.code
          key={command}
          initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
          transition={{ duration: 0.25 }}
          className="min-w-0 flex-1 truncate text-copy"
        >
          {command}
        </motion.code>
      </AnimatePresence>
      <div className="relative">
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 font-sans text-[11px] whitespace-nowrap text-void"
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.85 }}
          aria-label={copied ? 'Copied' : 'Copy command'}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-ink"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'check' : 'copy'}
              initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: 45, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.35 }}
            >
              {copied ? <Check className="size-4 text-signal" /> : <Copy className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
