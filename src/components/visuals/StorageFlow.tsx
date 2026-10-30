import { Cloud, Cpu, Database, FileText } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { BucketProvider, StorageMode } from '../../lib/content'
import { StatusPill } from '../ui/StatusPill'

// Diagram coordinates share the SVG viewBox, so HTML nodes and wires line up at any width.
const W = 600
const H = 420

type Kind = 'runtime' | 'volume' | 'bucket'
type Node = {
  id: string
  kind: Kind
  x: number
  y: number
  title: string
  meta: string
  status: { label: string; tone: 'live' | 'brand' | 'idle' | 'warn' }
  file?: string
  logo?: string
}
type Edge = { from: string; to: string; label?: string }
type Scene = { nodes: Node[]; edges: Edge[]; caption: string }

const scenes: Record<StorageMode['id'], Scene> = {
  outputs: {
    caption: 'A new run. The same report.',
    nodes: [
      { id: 'a', kind: 'runtime', x: 150, y: 90, title: 'agent', meta: 'CPU and memory released', status: { label: 'Retired', tone: 'idle' } },
      { id: 'b', kind: 'runtime', x: 450, y: 90, title: 'agent-next', meta: 'Reading from storage', status: { label: 'Running', tone: 'live' } },
      { id: 'v', kind: 'volume', x: 300, y: 320, title: 'run-results', meta: 'Managed Volume', status: { label: 'Persistent', tone: 'brand' }, file: 'report.json' },
    ],
    edges: [
      { from: 'a', to: 'v', label: '/mnt/results' },
      { from: 'v', to: 'b', label: '/mnt/data' },
    ],
  },
  shared: {
    caption: 'Two runtimes. One persistent dataset.',
    nodes: [
      { id: 'a', kind: 'runtime', x: 150, y: 90, title: 'train-a', meta: 'Read only mount', status: { label: 'Running', tone: 'live' } },
      { id: 'b', kind: 'runtime', x: 450, y: 90, title: 'train-b', meta: 'Read only mount', status: { label: 'Running', tone: 'live' } },
      { id: 'v', kind: 'volume', x: 300, y: 320, title: 'shared-data', meta: 'Managed Volume', status: { label: 'Shared', tone: 'brand' }, file: 'dataset/train.jsonl' },
    ],
    edges: [
      { from: 'v', to: 'a' },
      { from: 'v', to: 'b' },
    ],
  },
  fork: {
    caption: 'The original data stays unchanged.',
    nodes: [
      { id: 'v', kind: 'volume', x: 150, y: 210, title: 'shared-data', meta: 'Source Volume', status: { label: 'Unchanged', tone: 'idle' }, file: 'dataset/train.jsonl' },
      { id: 'f', kind: 'volume', x: 450, y: 210, title: 'experiment-b', meta: 'Volume fork', status: { label: 'Independent', tone: 'brand' }, file: 'dataset/train.jsonl' },
    ],
    edges: [{ from: 'v', to: 'f', label: 'fork' }],
  },
  bucket: {
    caption: 'Data stays yours. Mounts default to read only.',
    nodes: [
      { id: 'k', kind: 'bucket', x: 150, y: 300, title: 'Your bucket', meta: 'AWS S3', status: { label: 'Connected', tone: 'brand' }, file: 'train.jsonl' },
      { id: 'r', kind: 'runtime', x: 450, y: 120, title: 'agent', meta: '/mnt/data · Read only', status: { label: 'Running', tone: 'live' } },
    ],
    edges: [{ from: 'k', to: 'r', label: '/mnt/data' }],
  },
}

function edgePath(a: Node, b: Node) {
  const midY = (a.y + b.y) / 2
  if (Math.abs(a.y - b.y) < 20) return `M${a.x + 80} ${a.y} C ${a.x + 150} ${a.y}, ${b.x - 150} ${b.y}, ${b.x - 80} ${b.y}`
  const dir = b.y > a.y ? 1 : -1
  return `M${a.x} ${a.y + dir * 52} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - dir * 52}`
}

type StorageFlowProps = { mode: StorageMode['id']; provider: BucketProvider }

export function StorageFlow({ mode, provider }: StorageFlowProps) {
  const scene = scenes[mode]
  // The bucket node shows whichever provider the reader picked
  const nodes = scene.nodes.map((n) =>
    n.kind === 'bucket' ? { ...n, meta: provider.name, logo: provider.logo } : n,
  )
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <div className="card bg-grid relative overflow-hidden p-4 sm:p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-dim uppercase">Illustrative storage workflow</span>
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none" aria-hidden>
          <defs>
            <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#c9c6ff" />
              <stop offset="1" stopColor="#635bff" />
            </linearGradient>
          </defs>
          <AnimatePresence>
            {scene.edges.map((e) => {
              const d = edgePath(byId[e.from], byId[e.to])
              const id = `edge-${mode}-${e.from}-${e.to}`
              return (
                <motion.g key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <path d={d} stroke="var(--color-line-strong)" strokeWidth="1.5" strokeDasharray="4 6" />
                  <motion.path
                    id={id}
                    d={d}
                    stroke="url(#flow)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* Negative begin offsets start particles mid-path instead of parked at the origin */}
                  {[0, 0.6, 1.2].map((offset) => (
                    <circle key={offset} r="3.5" fill="#c9c6ff" style={{ filter: 'drop-shadow(0 0 6px #a69bff)' }}>
                      <animateMotion dur="1.8s" begin={`-${offset}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                        <mpath href={`#${id}`} />
                      </animateMotion>
                    </circle>
                  ))}
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>

        <AnimatePresence mode="popLayout">
          {nodes.map((n, i) => (
            <FlowNode key={`${mode}-${n.id}-${n.logo ?? ''}`} node={n} delay={i * 0.08} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-sm text-muted"
        >
          {scene.caption}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

const kindIcon = { runtime: Cpu, volume: Database, bucket: Cloud }

function FlowNode({ node, delay }: { node: Node; delay: number }) {
  const Icon = kindIcon[node.kind]
  const isStore = node.kind !== 'runtime'
  const dim = node.status.tone === 'idle' && node.kind === 'runtime'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: dim ? 0.6 : 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', bounce: 0.25, duration: 0.7, delay }}
      style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}
      className="absolute w-[44%] max-w-[260px] -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={`rounded-xl border bg-panel p-2.5 sm:p-3.5 ${
          isStore ? 'border-brand/35 shadow-[0_0_50px_-20px_var(--color-brand)]' : 'border-line-strong'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {node.logo ? (
              <span className="grid size-5 shrink-0 place-items-center rounded bg-white p-0.5">
                <img src={node.logo} alt="" className="size-full object-contain" />
              </span>
            ) : (
              <Icon className={`size-3.5 shrink-0 ${isStore ? 'text-brand-soft' : 'text-muted'}`} />
            )}
            <span className="truncate font-mono text-[11px] text-ink sm:text-[13px]">{node.title}</span>
          </div>
          <span className="hidden sm:block">
            <StatusPill tone={node.status.tone} pulse={node.status.tone === 'live'}>
              {node.status.label}
            </StatusPill>
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] text-dim sm:text-xs">{node.meta}</p>
        {node.file && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-line bg-base px-2 py-1.5 font-mono text-[10px] text-brand-pale sm:text-xs">
            <FileText className="size-3 shrink-0" />
            <span className="truncate">{node.file}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
