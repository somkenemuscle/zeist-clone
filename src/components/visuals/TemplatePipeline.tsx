import { Check, FileCode2, Hammer, Loader2, Rocket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { usePhaseLoop } from '../../hooks/usePhaseLoop'
import { buildSteps, dockerfile } from '../../lib/content'
import { StatusPill } from '../ui/StatusPill'

// 0 write Dockerfile · 1–4 build steps · 5 launch · 6 hold
const PHASES = [1800, 650, 650, 650, 650, 1400, 3000]

export function TemplatePipeline() {
  const { ref, phase } = usePhaseLoop<HTMLDivElement>(PHASES)
  const built = phase >= 5
  const buildDone = built ? buildSteps.length : Math.max(0, phase - 1)
  const launched = phase >= 6
  const stage = phase === 0 ? 0 : built ? 2 : 1

  return (
    <div ref={ref} className="grid gap-3 lg:grid-cols-3">
      <Stage active={stage === 0} done={stage > 0} icon={<FileCode2 className="size-4" />} title="Dockerfile">
        <pre className="font-mono text-[12px] leading-[1.9]">
          {dockerfile.map((line, i) => {
            const [kw, ...rest] = line.split(' ')
            return (
              <motion.div
                key={line}
                initial={false}
                animate={{ opacity: phase === 0 ? [0, 1] : 1, x: phase === 0 ? [-6, 0] : 0 }}
                transition={{ delay: phase === 0 ? i * 0.28 : 0, duration: 0.3 }}
              >
                <span className="text-brand-soft">{kw}</span> <span className="text-copy">{rest.join(' ')}</span>
              </motion.div>
            )
          })}
        </pre>
        <p className="mt-4 text-xs text-dim">Template builds use the supported Zeist Ubuntu base.</p>
      </Stage>

      <Stage active={stage === 1} done={built} icon={<Hammer className="size-4" />} title="Build">
        <ul className="space-y-2">
          {buildSteps.map((s, i) => {
            const state = i < buildDone ? 'done' : i === buildDone && stage === 1 ? 'run' : 'wait'
            return (
              <li key={s} className="flex items-center gap-2.5 text-[13px]">
                <span className="grid size-4 place-items-center">
                  {state === 'done' ? (
                    <Check className="size-3.5 text-signal" />
                  ) : state === 'run' ? (
                    <Loader2 className="size-3.5 animate-spin text-brand-soft" />
                  ) : (
                    <span className="size-1 rounded-full bg-dim" />
                  )}
                </span>
                <span className={state === 'wait' ? 'text-dim' : 'text-copy'}>{s}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-5 rounded-lg border border-line bg-base p-3">
          <div className="flex items-center justify-between">
            <code className="font-mono text-[13px] text-ink">eval-worker:v1</code>
            {built ? <StatusPill tone="brand">Available</StatusPill> : <StatusPill tone="idle">Building</StatusPill>}
          </div>
          <div className="mt-2 flex gap-4 text-[11px] text-dim">
            <span>Version v1</span>
            <span>Visibility Private</span>
          </div>
        </div>
      </Stage>

      <Stage active={stage === 2} done={launched} icon={<Rocket className="size-4" />} title="Launch">
        <AnimatePresence mode="wait">
          {built ? (
            <motion.div
              key="run"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
              className="rounded-lg border border-brand/35 bg-brand/[0.07] p-4"
            >
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm text-ink">eval-run</code>
                <StatusPill tone="live" pulse>
                  Ready
                </StatusPill>
              </div>
              <p className="mt-3 text-xs text-dim">
                From <code className="font-mono text-brand-pale">eval-worker:v1</code>
              </p>
              <p className="mt-1 text-xs text-dim">
                Ready to run <code className="font-mono text-copy">evaluate.py</code>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid h-[118px] place-items-center rounded-lg border border-dashed border-line-strong text-xs text-dim"
            >
              Waiting for template
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-4 text-xs text-dim">Same setup. A new runtime. The private template stays available.</p>
      </Stage>
    </div>
  )
}

type StageProps = { active: boolean; done: boolean; icon: ReactNode; title: string; children: ReactNode }

function Stage({ active, done, icon, title, children }: StageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-base p-5 transition-all duration-700 ${
        active ? 'border-brand/40 shadow-[0_0_60px_-25px_var(--color-brand)]' : 'border-line'
      }`}
    >
      {active && (
        <motion.div
          layoutId="template-stage"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-soft to-transparent"
        />
      )}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`grid size-8 place-items-center rounded-lg border transition-colors ${
              active || done ? 'border-brand/40 text-brand-soft' : 'border-line text-dim'
            }`}
          >
            {icon}
          </span>
          <span className="font-medium text-ink">{title}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
