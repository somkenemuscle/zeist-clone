import { Globe, Laptop, Lock, Server, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const rules = ['pypi.org', 'huggingface.co', '10.0.0.0/8']

export function NetworkCard() {
  return (
    <div className="card h-full p-6 sm:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">Choose what connects.</h3>
      <p className="mt-3 max-w-md leading-relaxed text-muted">
        Set outbound domain and CIDR rules. Open a private tunnel, or publish an HTTP service with a public HTTPS
        endpoint.
      </p>

      <div className="mt-8 space-y-3">
        <Link
          icon={<Lock className="size-3.5" />}
          title="Private tunnel"
          note="Through your local machine"
          from={<Laptop className="size-4" />}
          to={<Server className="size-4" />}
          bidirectional
        />
        <Link
          icon={<Globe className="size-3.5" />}
          title="Public endpoint"
          note="Unauthenticated HTTPS"
          from={<Server className="size-4" />}
          to={<Globe className="size-4" />}
          warn
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-wider text-dim uppercase">
          <ShieldCheck className="size-3.5" /> Outbound rules · illustrative
        </p>
        <ul className="flex flex-wrap gap-2">
          {rules.map((r, i) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-md border border-line bg-base px-2.5 py-1 font-mono text-xs text-copy"
            >
              <span className="mr-1.5 text-signal">allow</span>
              {r}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type LinkProps = {
  icon: ReactNode
  title: string
  note: string
  from: ReactNode
  to: ReactNode
  bidirectional?: boolean
  warn?: boolean
}

function Link({ icon, title, note, from, to, bidirectional, warn }: LinkProps) {
  const color = warn ? 'bg-amber' : 'bg-brand-soft'
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-panel/70 p-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm text-ink">
          <span className={warn ? 'text-amber' : 'text-brand-soft'}>{icon}</span>
          {title}
        </div>
        <p className="mt-0.5 text-xs text-dim">{note}</p>
      </div>
      <div className="flex w-36 items-center gap-2 text-muted sm:w-44">
        {from}
        <div className="relative h-px flex-1 overflow-hidden bg-line-strong">
          <motion.span
            className={`absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full ${color}`}
            animate={{ left: ['-6px', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {bidirectional && (
            <motion.span
              className={`absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full ${color}`}
              animate={{ left: ['100%', '-6px'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            />
          )}
        </div>
        {to}
      </div>
    </div>
  )
}
