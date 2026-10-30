import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { links, navItems } from '../../lib/links'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

const sectionIds = navItems.map((n) => n.id)

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const active = useActiveSection(sectionIds)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-brand px-3 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-3 pl-5 transition-all duration-500 ${
            scrolled
              ? 'border-line bg-base/70 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <a href="#top" aria-label="Zeist home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
            {navItems.map((item) => {
              const isActive = active === item.id
              const lit = (hovered ?? active) === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onMouseEnter={() => setHovered(item.id)}
                    className={`relative block rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      lit ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    {lit && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.07]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand-soft"
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button href={links.earlyAccess} className="!h-9 !px-4 !text-sm">
              Join early access
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-full text-copy hover:bg-white/5 md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-brand via-brand-soft to-brand-pale"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-void/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-17 items-center justify-between px-8 pt-3">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-full text-copy hover:bg-white/5"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-1 px-8">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-3xl font-semibold tracking-tight text-ink"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-8 pt-10">
              <Button href={links.earlyAccess} arrow className="w-full">
                Join early access
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
