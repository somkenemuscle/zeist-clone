import { AnimatePresence, motion } from 'motion/react'
import { CopyCommand } from '../components/ui/CopyCommand'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { RuntimeDiagram } from '../components/visuals/RuntimeDiagram'
import { useAutoCycle } from '../hooks/useAutoCycle'
import { lifecycle } from '../lib/content'

export function Runtime() {
  const { ref, index, select, playing, interval } = useAutoCycle<HTMLDivElement>(lifecycle.length, 5500)
  const step = lifecycle[index]

  return (
    <Section id="runtime" raised>
      <SectionHeading
        eyebrow="Runtime"
        title={['A runtime for', 'every next move.']}
        lead="Create it. Run it. Branch it. Your agent calls, compute responds — and your agent stays in control."
      />

      <div ref={ref} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Reveal>
          <ol className="relative space-y-1" role="tablist" aria-label="Sandbox lifecycle">
            {lifecycle.map((s, i) => {
              const active = i === index
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => select(i)}
                    className={`group relative w-full overflow-hidden rounded-xl border px-5 py-4 text-left transition-all duration-500 ${
                      active
                        ? 'border-line-strong bg-surface shadow-[0_8px_30px_-18px_rgb(0_0_0/0.25)]'
                        : 'border-transparent hover:translate-x-1 hover:bg-ink/[0.03]'
                    }`}
                  >
                    {active && playing && (
                      <motion.span
                        key={index}
                        className="absolute top-0 left-0 h-px bg-gradient-to-r from-brand to-brand-soft"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: interval / 1000, ease: 'linear' }}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-1.5 rounded-full transition-colors ${active ? 'bg-brand-soft' : 'bg-line-strong'}`}
                      />
                      <span
                        className={`text-lg font-medium tracking-tight transition-colors ${
                          active ? 'text-ink' : 'text-muted group-hover:text-copy'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 pl-[18px] leading-relaxed text-copy">{s.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <RuntimeDiagram step={step.id} />
          <CopyCommand command={step.command} />
          <AnimatePresence mode="wait">
            <motion.p
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-1 text-sm leading-relaxed text-dim"
            >
              {step.note}
            </motion.p>
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  )
}
