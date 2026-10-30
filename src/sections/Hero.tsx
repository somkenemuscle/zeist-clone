import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type PointerEvent } from 'react'
import { Button } from '../components/ui/Button'
import { StatusPill } from '../components/ui/StatusPill'
import { HeroParticles } from '../components/visuals/HeroParticles'
import { HeroRun } from '../components/visuals/HeroRun'
import { links } from '../lib/links'
import { ease } from '../lib/motion'

const headline = ['Where agents', 'get to work.']
const tiltSpring = { stiffness: 120, damping: 20, mass: 0.6 }

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // Pointer position (-0.5..0.5 of the viewport) drives the card tilt
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), tiltSpring)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), tiltSpring)

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    px.set(e.clientX / window.innerWidth - 0.5)
    py.set(e.clientY / window.innerHeight - 0.5)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28"
    >
      <HeroParticles />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex justify-center"
          >
            <a
              href={links.earlyAccess}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-line bg-surface/70 py-1 pr-4 pl-1 text-sm text-muted backdrop-blur transition-colors hover:border-brand/40 hover:text-copy"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-brand-soft/15 to-transparent transition-[left] duration-1000 group-hover:left-[120%]"
              />
              <StatusPill tone="live" pulse>
                Live
              </StatusPill>
              Now in early access
              <span className="text-brand-soft transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          <h1 className="mt-8 text-[13vw] leading-[0.95] font-semibold tracking-[-0.045em] text-ink sm:text-7xl md:text-[88px]">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%', rotate: 3, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            Agent-first compute for AI agents and machine learning workloads. Create environments, run
            code, and manage compute through the CLI or REST API.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Button href={links.earlyAccess} arrow>
              Join early access
            </Button>
            <Button href="#runtime" variant="ghost">
              Explore the runtime
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.4, delay: 0.85, ease }}
          style={{ transformPerspective: 1400 }}
          className="relative mt-20"
        >
          <motion.div style={{ y: visualY, rotateX, rotateY, transformPerspective: 1600 }}>
            <HeroRun />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
