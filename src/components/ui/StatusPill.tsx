type Tone = 'live' | 'brand' | 'idle' | 'warn'

const tones: Record<Tone, { dot: string; text: string }> = {
  live: { dot: 'bg-signal', text: 'text-signal' },
  brand: { dot: 'bg-brand-soft', text: 'text-brand-pale' },
  idle: { dot: 'bg-dim', text: 'text-muted' },
  warn: { dot: 'bg-amber', text: 'text-amber' },
}

type StatusPillProps = { tone?: Tone; pulse?: boolean; children: string }

export function StatusPill({ tone = 'live', pulse = false, children }: StatusPillProps) {
  const t = tones[tone]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] ${t.text}`}
    >
      <span className="relative flex size-1.5">
        {pulse && <span className={`absolute inset-0 rounded-full ${t.dot} animate-pulse-ring`} />}
        <span className={`relative size-1.5 rounded-full ${t.dot}`} />
      </span>
      {children}
    </span>
  )
}
