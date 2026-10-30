import { Box, History, LayoutTemplate, Monitor, Terminal, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CopyCommand } from '../components/ui/CopyCommand'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { useAutoCycle } from '../hooks/useAutoCycle'
import { environments, type Environment } from '../lib/content'

const icons: Record<string, LucideIcon> = {
  ubuntu: Terminal,
  desktop: Monitor,
  image: Box,
  template: LayoutTemplate,
  checkpoint: History,
}

export function Environments() {
  const { ref, index, select } = useAutoCycle<HTMLDivElement>(environments.length, 4200)
  const env = environments[index]

  return (
    <Section id="environments">
      <SectionHeading
        eyebrow="Environments"
        title={['Start with', 'your world.']}
        lead="Let your agent start from the environment its work needs."
      />

      <div ref={ref}>
        <Reveal>
          <div role="tablist" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {environments.map((e, i) => {
              const Icon = icons[e.id]
              const active = i === index
              return (
                <motion.button
                  key={e.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => select(i)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-500 last:col-span-2 sm:last:col-span-1 ${
                    active
                      ? 'border-brand/40 bg-surface shadow-[0_0_40px_-20px_var(--color-brand)]'
                      : 'border-line bg-surface/40 hover:border-line-strong'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="env-glow"
                      className="absolute inset-0 bg-gradient-to-br from-brand/15 via-transparent to-transparent"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    className={`relative size-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${active ? 'text-brand-soft' : 'text-dim group-hover:text-muted'}`}
                  />
                  <div className={`relative mt-6 text-sm font-medium ${active ? 'text-ink' : 'text-muted'}`}>
                    {e.label}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card flex flex-col justify-between p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={env.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-mono text-xs tracking-wider text-brand-soft uppercase">{env.label}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{env.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{env.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10">
              <p className="mb-2 font-mono text-[11px] tracking-wider text-dim uppercase">CLI example</p>
              <CopyCommand command={env.command} />
            </div>
          </div>

          <RecipeStack env={env} />
        </Reveal>
      </div>
    </Section>
  )
}

function RecipeStack({ env }: { env: Environment }) {
  const layers = [
    { label: 'Start here', value: env.recipe, accent: true },
    { label: 'Dependencies', value: 'Your libraries and tools' },
    { label: 'Workload', value: 'Your code and files' },
  ]

  return (
    <div className="card bg-grid relative overflow-hidden p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-dim uppercase">Runtime recipe</span>
        <span className="font-mono text-[11px] text-dim">example configuration</span>
      </div>

      <div className="space-y-2.5">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginLeft: `${i * 12}px`, marginRight: `${(2 - i) * 12}px` }}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
              layer.accent ? 'border-brand/40 bg-brand/[0.07]' : 'border-line bg-panel'
            }`}
          >
            <span className="text-xs text-muted">{layer.label}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.code
                key={layer.value}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                className={`font-mono text-[13px] ${layer.accent ? 'text-brand-pale' : 'text-copy'}`}
              >
                {layer.value}
              </motion.code>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="relative my-3 flex justify-center">
        <motion.div
          key={env.id}
          className="h-8 w-px bg-gradient-to-b from-brand-soft to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ originY: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="rounded-xl border border-line-strong bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-ink">Compute runtime</span>
          <span className="size-2 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-base p-3">
            <dt className="text-dim">CPU + memory</dt>
            <dd className="mt-1 text-copy">Configured by you</dd>
          </div>
          <div className="rounded-lg bg-base p-3">
            <dt className="text-dim">Storage</dt>
            <dd className="mt-1 text-copy">Root disk + mounts</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
