import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { Tabs } from '../components/ui/Tabs'
import { StorageFlow } from '../components/visuals/StorageFlow'
import { useAutoCycle } from '../hooks/useAutoCycle'
import { bucketProviders, storageModes, type BucketProvider } from '../lib/content'

const BUCKET_INDEX = storageModes.findIndex((m) => m.id === 'bucket')

export function Storage() {
  const { ref, index, select, playing, interval } = useAutoCycle<HTMLDivElement>(storageModes.length, 6000)
  const mode = storageModes[index]
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [provider, setProvider] = useState(bucketProviders[0])

  const pickProvider = (p: BucketProvider) => {
    setProvider(p)
    select(BUCKET_INDEX)
  }

  return (
    <Section id="storage" tone="light">
      <SectionHeading
        eyebrow="Storage"
        title={['Compute moves.', 'Data stays.']}
        lead="Keep the datasets, results, and model artifacts your next run needs."
      />

      <div ref={ref}>
        <Reveal>
          <Tabs
            tabs={storageModes}
            index={index}
            onSelect={select}
            playing={playing}
            interval={interval}
            layoutId="storage-tab"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{mode.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">{mode.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 border-t border-line-strong pt-5">
              <button
                type="button"
                onClick={() => setDetailsOpen((o) => !o)}
                aria-expanded={detailsOpen}
                className="flex w-full items-center justify-between text-sm font-medium text-copy hover:text-ink"
              >
                Storage details
                <motion.span animate={{ rotate: detailsOpen ? 45 : 0 }}>
                  <Plus className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {detailsOpen && (
                  <motion.p
                    key={mode.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-3 text-sm leading-relaxed text-muted"
                  >
                    {mode.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <StorageFlow mode={mode.id} provider={provider} />
        </Reveal>

        <div className="mt-28">
          <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
            <h3 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
              Bring your
              <br />
              own bucket.
            </h3>
            <p className="max-w-md text-lg leading-relaxed text-muted md:justify-self-end">
              Connect the storage you already use. Mount it at{' '}
              <code className="font-mono text-[0.9em] text-ink">/mnt/data</code> — read only by default, and your
              data stays with its provider.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <ProviderPicker active={mode.id === 'bucket' ? provider.name : null} onPick={pickProvider} />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

type ProviderPickerProps = { active: string | null; onPick: (p: BucketProvider) => void }

function ProviderPicker({ active, onPick }: ProviderPickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Bucket providers">
      {bucketProviders.map((p, i) => {
        const selected = active === p.name
        return (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="last:col-span-2 lg:last:col-span-1"
          >
            <motion.button
              type="button"
              onClick={() => onPick(p)}
              aria-pressed={selected}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={`group flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border bg-base px-4 py-7 text-center transition-[border-color,box-shadow] duration-300 ${
                selected
                  ? 'border-brand/50 shadow-[0_12px_40px_-16px_rgb(99_91_255/0.45)]'
                  : 'border-line hover:border-line-strong hover:shadow-[0_12px_30px_-18px_rgb(0_0_0/0.35)]'
              }`}
            >
              <span className="grid size-14 place-items-center rounded-2xl border border-line bg-white p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <img src={p.logo} alt="" width={32} height={32} loading="lazy" className="size-full object-contain" />
              </span>
              <span className="text-sm font-medium whitespace-nowrap text-ink">{p.name}</span>
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                  selected ? 'text-brand-soft' : 'text-dim group-hover:text-muted'
                }`}
              >
                <span
                  className={`size-1.5 rounded-full transition-colors ${selected ? 'bg-signal' : 'bg-line-strong'}`}
                />
                {selected ? 'Connected' : 'Connect'}
              </span>
            </motion.button>
          </motion.li>
        )
      })}
    </ul>
  )
}
