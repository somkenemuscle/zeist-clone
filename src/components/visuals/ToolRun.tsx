import { Check, FileJson, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { usePhaseLoop } from '../../hooks/usePhaseLoop'
import type { Workload } from '../../lib/content'
import { StatusPill } from '../ui/StatusPill'

// One phase per tool call plus the final "saved" phase.
const STEPS = [700, 850, 850, 0]

/** Plays a workload's tool calls one by one, then reveals the saved output. */
export function ToolRun({ workload }: { workload: Workload }) {
  const { ref, phase: done } = usePhaseLoop<HTMLDivElement>(STEPS, { loop: false })
  const total = workload.calls.length
  const complete = done >= total

  return (
    <div ref={ref} className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[13px]">
          <span className="text-ink">{workload.file}</span>
          <span className="text-dim">/ {workload.label}</span>
        </div>
        <StatusPill tone={complete ? 'brand' : 'live'} pulse={!complete}>
          {complete ? 'Complete' : 'Running'}
        </StatusPill>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="mb-1.5 font-mono text-[11px] tracking-wider text-dim uppercase">Task</p>
          <p className="text-ink">{workload.task}</p>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] tracking-wider text-dim uppercase">Tool execution</p>
          <ol className="relative space-y-2">
            <span aria-hidden className="absolute top-3 bottom-3 left-[13px] w-px bg-line" />
            <motion.span
              aria-hidden
              className="absolute top-3 left-[13px] w-px bg-gradient-to-b from-brand-soft to-brand"
              animate={{ height: `calc(${(Math.min(done, total - 1) / (total - 1)) * 100}% - 24px)` }}
              transition={{ duration: 0.5 }}
            />
            {workload.calls.map((call, i) => {
              const state = i < done ? 'done' : i === done ? 'run' : 'queued'
              return (
                <li key={call.label} className="relative flex items-start gap-3">
                  <span
                    className={`relative z-10 mt-1.5 grid size-[27px] shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                      state === 'done'
                        ? 'border-signal/40 bg-signal/10'
                        : state === 'run'
                          ? 'border-brand/50 bg-brand/15'
                          : 'border-line bg-base'
                    }`}
                  >
                    {state === 'done' ? (
                      <Check className="size-3.5 text-signal" />
                    ) : state === 'run' ? (
                      <Loader2 className="size-3.5 animate-spin text-brand-soft" />
                    ) : (
                      <span className="size-1 rounded-full bg-dim" />
                    )}
                  </span>
                  <div
                    className={`flex-1 rounded-lg border px-3.5 py-2.5 transition-colors duration-500 ${
                      state === 'run' ? 'border-brand/30 bg-brand/[0.06]' : 'border-line bg-base/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-sm ${state === 'queued' ? 'text-dim' : 'text-copy'}`}>{call.label}</span>
                      <code className="font-mono text-[11px] text-brand-soft">{call.tool}</code>
                    </div>
                    <code className="mt-0.5 block truncate font-mono text-[11.5px] text-dim">{call.target}</code>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="min-h-[148px]">
          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.7 }}
                className="rounded-xl border border-brand/35 bg-brand/[0.06] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[13px] text-ink">
                    <FileJson className="size-4 text-brand-soft" />
                    {workload.output.file}
                  </span>
                  <span className="font-mono text-[11px] text-dim">/mnt/results · Saved</span>
                </div>
                <pre className="font-mono text-[12px] leading-relaxed text-brand-pale">{workload.output.json}</pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
