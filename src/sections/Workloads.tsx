import { AnimatePresence, motion } from 'motion/react'
import { CopyCommand } from '../components/ui/CopyCommand'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { Tabs } from '../components/ui/Tabs'
import { ToolRun } from '../components/visuals/ToolRun'
import { useAutoCycle } from '../hooks/useAutoCycle'
import { workloads } from '../lib/content'

export function Workloads() {
  const { ref, index, select, playing, interval } = useAutoCycle<HTMLDivElement>(workloads.length, 7000)
  const workload = workloads[index]

  return (
    <Section id="workloads">
      <SectionHeading
        eyebrow="Workloads"
        title={['One runtime.', 'Many workloads.']}
        lead="From agent loops to training runs — agents, experiments, evaluation cases, and the data between them."
      />

      <div ref={ref}>
        <Reveal>
          <Tabs
            tabs={workloads}
            index={index}
            onSelect={select}
            playing={playing}
            interval={interval}
            layoutId="workload-tab"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Remount on change so each workload replays from the first call */}
          <ToolRun key={workload.id} workload={workload} />

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={workload.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-mono text-xs tracking-wider text-brand-soft uppercase">{workload.label}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  From a task to a saved result.
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">{workload.summary}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 space-y-3">
              <CopyCommand command={workload.command} />
              <p className="text-sm leading-relaxed text-dim">
                Your code runs in the environment. Read mounted data at{' '}
                <code className="font-mono text-copy">/mnt/data</code> and write artifacts to{' '}
                <code className="font-mono text-copy">/mnt/results</code>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
