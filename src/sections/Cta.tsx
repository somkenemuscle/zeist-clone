import { motion } from 'motion/react'
import { Button } from '../components/ui/Button'
import { LogoMark } from '../components/ui/Logo'
import { Reveal } from '../components/ui/Reveal'
import { links } from '../lib/links'

export function Cta() {
  return (
    <section className="relative px-3 pb-24 sm:px-5">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-base px-6 py-20 text-center sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(99_91_255/0.12),transparent_60%)]"
        />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />

        <div className="relative mx-auto mb-10 grid size-40 place-items-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full border border-brand-soft/20"
              style={{ inset: `${i * -22}px` }}
              animate={{ rotate: i % 2 ? -360 : 360 }}
              transition={{ duration: 18 + i * 8, repeat: Infinity, ease: 'linear' }}
            >
              <span className="absolute top-1/2 -left-1 size-2 rounded-full bg-brand-soft shadow-[0_0_14px_var(--color-brand-soft)]" />
            </motion.span>
          ))}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="grid size-24 place-items-center rounded-3xl border border-brand/30 bg-base/80 shadow-[0_0_80px_-10px_var(--color-brand)] backdrop-blur"
          >
            <LogoMark className="size-12" animated />
          </motion.div>
        </div>

        <h2 className="relative text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-6xl md:text-7xl">
          Build what
          <br />
          <span className="text-gradient">comes next.</span>
        </h2>
        <p className="relative mx-auto mt-6 max-w-md text-lg text-muted">
          Bring your agent, your data, and your next workload. Join Zeist early access.
        </p>
        <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={links.earlyAccess} arrow>
            Join early access
          </Button>
          <Button href={links.github} variant="ghost">
            View on GitHub
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
