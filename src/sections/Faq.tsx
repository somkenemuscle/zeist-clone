import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { faqs } from '../lib/content'
import { links } from '../lib/links'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="FAQ"
            title={['Before', 'you build.']}
            lead="A few things to know about Zeist today."
          />
          <p className="-mt-6 text-sm text-dim">
            Still curious?{' '}
            <a href={links.discord} target="_blank" rel="noreferrer" className="text-brand-soft hover:underline">
              Ask us on Discord
            </a>
            .
          </p>
        </div>

        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <li key={item.q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span
                        className={`text-lg font-medium tracking-tight transition-all duration-300 ${
                          isOpen ? 'text-ink' : 'text-copy group-hover:translate-x-1.5 group-hover:text-ink'
                        }`}
                      >
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                        className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
                          isOpen
                            ? 'border-brand/50 bg-brand/10 text-brand-soft'
                            : 'border-line text-muted group-hover:border-line-strong group-hover:text-ink'
                        }`}
                      >
                        <Plus className="size-4" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
