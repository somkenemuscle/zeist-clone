import { Bot, Check, Cpu, Database, FileJson, HardDrive, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { usePhaseLoop } from '../../hooks/usePhaseLoop'
import { useTypewriter } from '../../hooks/useTypewriter'
import { StatusPill } from '../ui/StatusPill'
import { Connector } from './Connector'

const COMMAND = 'zeist box create agent --wait'
const CALLS = ['load_dataset()', 'run_evaluation()', 'save_report()']
const STAGES = ['Create', 'Execute', 'Keep the result'] as const

/**
 * Phases of the looping hero story:
 * 0 typing · 1 runtime ready · 2–4 calls execute · 5 output saved
 */
const PHASE_MS = [1500, 1300, 900, 900, 900, 3200]
const LAST = PHASE_MS.length - 1

export function HeroRun() {
  const { ref, phase } = usePhaseLoop<HTMLDivElement>(PHASE_MS)
  const { typed, done } = useTypewriter(COMMAND, phase === 0, 38)
  const ready = phase >= 1
  const callsDone = Math.max(0, phase - 1)
  const saved = phase === LAST
  const stage = phase === 0 ? 0 : saved ? 2 : 1

  return (
    <div ref={ref} className="card relative overflow-hidden p-2">
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-4 rounded-t-xl border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-white/10" />
          ))}
        </div>
        <ol className="flex items-center gap-1 text-xs sm:gap-2">
          {STAGES.map((label, i) => (
            <li key={label} className="flex items-center gap-1 sm:gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-2 py-1 font-mono transition-colors duration-500 sm:px-2.5 ${
                  i === stage ? 'bg-brand/15 text-brand-pale' : i < stage ? 'text-copy' : 'text-dim'
                }`}
              >
                {label}
              </span>
              {i < STAGES.length - 1 && <span className="h-px w-3 bg-line-strong sm:w-5" />}
            </li>
          ))}
        </ol>
        <span className="hidden font-mono text-[11px] text-dim sm:block">illustrative</span>
      </div>

      <div className="grid gap-0 p-3 sm:p-5 lg:grid-cols-[1fr_56px_1.25fr_56px_1fr] lg:items-stretch">
        {/* Agent */}
        <Node icon={<Bot className="size-4" />} title="Your agent" meta="agent.py">
          <div className="rounded-lg border border-line bg-base p-3 font-mono text-[12.5px] leading-relaxed">
            <span className="text-dim">$ </span>
            <span className="text-copy">{phase === 0 ? typed : COMMAND}</span>
            {phase === 0 && !done && <Caret />}
          </div>
          <p className="mt-3 text-sm text-muted">Control it from your CLI or REST API.</p>
        </Node>

        <Connector active={phase === 0 && done} className="lg:h-auto" />

        {/* Runtime */}
        <Node
          icon={<Cpu className="size-4" />}
          title="agent"
          meta="Ubuntu Base · CPU + memory"
          status={
            ready ? (
              <StatusPill tone={saved ? 'brand' : 'live'} pulse={!saved}>
                {saved ? 'Complete' : 'Running'}
              </StatusPill>
            ) : (
              <StatusPill tone="idle">Allocating</StatusPill>
            )
          }
          highlight={ready && !saved}
        >
          <ul className="space-y-1.5 font-mono text-[12.5px]">
            {CALLS.map((call, i) => {
              const state = callsDone > i ? 'done' : callsDone === i && ready && !saved ? 'run' : 'wait'
              return (
                <li
                  key={call}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 transition-colors duration-500 ${
                    state === 'run' ? 'border-brand/40 bg-brand/[0.08]' : 'border-line bg-base'
                  }`}
                >
                  <span className={state === 'wait' ? 'text-dim' : 'text-copy'}>{call}</span>
                  <CallIcon state={state} />
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center gap-2 text-xs text-dim">
            <HardDrive className="size-3.5" /> Root disk attached
            <span className="ml-auto font-mono">/mnt/results</span>
          </div>
        </Node>

        <Connector active={phase === 4 || saved} />

        {/* Volume */}
        <Node
          icon={<Database className="size-4" />}
          title="run-results"
          meta="Managed Volume"
          status={saved ? <StatusPill tone="brand">Saved</StatusPill> : undefined}
          highlight={saved}
        >
          <div className="relative h-[104px]">
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, x: -24, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
                  className="rounded-lg border border-brand/40 bg-brand/[0.08] p-3"
                >
                  <div className="flex items-center gap-2 font-mono text-[12.5px] text-ink">
                    <FileJson className="size-4 text-brand-soft" /> report.json
                  </div>
                  <code className="mt-2 block font-mono text-[12px] text-brand-pale">
                    {'{ "status": "complete" }'}
                  </code>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid h-full place-items-center rounded-lg border border-dashed border-line-strong text-xs text-dim"
                >
                  {phase >= 4 ? 'Receiving the result…' : 'Waiting for output'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 text-sm text-muted">Your work stays.</p>
        </Node>
      </div>
    </div>
  )
}

type NodeProps = {
  icon: React.ReactNode
  title: string
  meta: string
  status?: React.ReactNode
  highlight?: boolean
  children: React.ReactNode
}

function Node({ icon, title, meta, status, highlight, children }: NodeProps) {
  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-700 ${
        highlight
          ? 'border-brand/35 bg-panel shadow-[0_0_60px_-20px_var(--color-brand)]'
          : 'border-line bg-panel/60'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg border border-line-strong bg-raised text-brand-soft">
            {icon}
          </span>
          <div>
            <div className="font-mono text-sm text-ink">{title}</div>
            <div className="text-xs text-dim">{meta}</div>
          </div>
        </div>
        {status}
      </div>
      {children}
    </div>
  )
}

function CallIcon({ state }: { state: 'done' | 'run' | 'wait' }) {
  if (state === 'done') return <Check className="size-3.5 text-signal" />
  if (state === 'run') return <Loader2 className="size-3.5 animate-spin text-brand-soft" />
  return <span className="size-1.5 rounded-full bg-line-strong" />
}

function Caret() {
  return (
    <motion.span
      className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-brand-soft"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    />
  )
}
