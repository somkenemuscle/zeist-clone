import { Bot, Cpu, GitBranch, HardDrive, Layers } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { LifecycleStep } from '../../lib/content'
import { StatusPill } from '../ui/StatusPill'

type Tone = 'live' | 'brand' | 'idle' | 'warn'
type Row = { value: string; tone: Tone }
type Box = { name: string; status: Row; compute: Row; disk: Row; process: Row; tag?: string }

const ready: Box = {
  name: 'agent',
  status: { value: 'Running', tone: 'live' },
  compute: { value: 'Allocated', tone: 'live' },
  disk: { value: 'Attached', tone: 'live' },
  process: { value: 'Ready for your code', tone: 'idle' },
}

// What each lifecycle action does to the sandbox(es) on screen.
const scenes: Record<LifecycleStep['id'], Box[]> = {
  create: [ready],
  run: [{ ...ready, process: { value: 'python evaluate.py', tone: 'brand' } }],
  fork: [
    { ...ready, process: { value: 'python evaluate.py', tone: 'brand' } },
    {
      name: 'agent-branch',
      status: { value: 'Running', tone: 'live' },
      compute: { value: 'Live state copied', tone: 'brand' },
      disk: { value: 'Independent copy', tone: 'brand' },
      process: { value: 'python evaluate.py', tone: 'brand' },
      tag: 'fork',
    },
  ],
  pause: [
    {
      name: 'agent',
      status: { value: 'Paused', tone: 'warn' },
      compute: { value: 'Released', tone: 'idle' },
      disk: { value: 'Checkpoint kept', tone: 'warn' },
      process: { value: 'Stopped', tone: 'idle' },
    },
  ],
  restore: [
    {
      name: 'restored',
      status: { value: 'Running', tone: 'live' },
      compute: { value: 'Allocated', tone: 'live' },
      disk: { value: 'Restored from checkpoint', tone: 'brand' },
      process: { value: 'Fresh process space', tone: 'idle' },
      tag: 'checkpoint',
    },
  ],
}

export function RuntimeDiagram({ step }: { step: LifecycleStep['id'] }) {
  const boxes = scenes[step]
  const forked = boxes.length > 1

  return (
    <div className="card bg-grid relative overflow-hidden p-5 sm:p-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-dim uppercase">Illustrative runtime</span>
        <span className="font-mono text-[11px] text-dim">zeist · sandbox</span>
      </div>

      {/* Caller */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2.5 rounded-full border border-line-strong bg-raised px-4 py-2 text-sm">
          <Bot className="size-4 text-brand-soft" />
          <span className="text-ink">Your agent</span>
          <span className="text-dim">·</span>
          <span className="font-mono text-xs text-muted">CLI / REST API</span>
        </div>
      </div>

      <Wires forked={forked} stepKey={step} />

      <motion.div layout className={`grid gap-4 ${forked ? 'sm:grid-cols-2' : 'mx-auto max-w-sm'}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {boxes.map((box, i) => (
            <SandboxCard key={box.name} box={box} delay={i * 0.25} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function Wires({ forked, stepKey }: { forked: boolean; stepKey: string }) {
  const paths = forked ? ['M200 0 V22 Q200 32 190 32 H110 Q100 32 100 42 V64', 'M200 0 V22 Q200 32 210 32 H290 Q300 32 300 42 V64'] : ['M200 0 V64']
  return (
    <svg viewBox="0 0 400 64" className="mx-auto block h-16 w-full max-w-md" fill="none" aria-hidden>
      {paths.map((d) => (
        <g key={d}>
          <path d={d} stroke="var(--color-line-strong)" strokeWidth="1" />
          <motion.path
            key={stepKey + d}
            d={d}
            stroke="url(#wire)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0.35] }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>
      ))}
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9c6ff" />
          <stop offset="1" stopColor="#635bff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SandboxCard({ box, delay }: { box: Box; delay: number }) {
  const rows = [
    { icon: Cpu, label: 'Compute', row: box.compute },
    { icon: HardDrive, label: 'Root disk', row: box.disk },
    { icon: Layers, label: 'Process space', row: box.process },
  ]
  const live = box.status.tone === 'live'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', bounce: 0.25, duration: 0.8, delay }}
      className={`relative rounded-xl border bg-panel p-4 transition-colors duration-700 ${
        live ? 'border-brand/30 shadow-[0_0_50px_-24px_var(--color-brand)]' : 'border-line'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-sm text-ink">
          {box.tag === 'fork' && <GitBranch className="size-3.5 text-brand-soft" />}
          {box.name}
        </div>
        <StatusPill tone={box.status.tone} pulse={live}>
          {box.status.value}
        </StatusPill>
      </div>
      <dl className="space-y-2">
        {rows.map(({ icon: Icon, label, row }) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-base px-3 py-2.5">
            <dt className="flex items-center gap-2 text-xs text-muted">
              <Icon className="size-3.5" />
              {label}
            </dt>
            <dd className="relative overflow-hidden text-right">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={row.value}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`block font-mono text-xs ${toneText[row.tone]}`}
                >
                  {row.value}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>
      {box.process.tone === 'brand' && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand to-brand-soft"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
    </motion.div>
  )
}

const toneText: Record<Tone, string> = {
  live: 'text-signal',
  brand: 'text-brand-pale',
  idle: 'text-muted',
  warn: 'text-amber',
}
