import { CopyCommand } from '../components/ui/CopyCommand'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionHeading } from '../components/ui/Section'
import { NetworkCard } from '../components/visuals/NetworkCard'
import { TemplatePipeline } from '../components/visuals/TemplatePipeline'

export function Templates() {
  return (
    <Section id="templates" tone="light">
      <SectionHeading
        eyebrow="Templates & network"
        title={['Build once.', 'Run it again.']}
        lead="Turn a Dockerfile into a private VM template. Keep a version. Launch it when the work arrives."
      />

      <Reveal>
        <TemplatePipeline />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.05} className="card flex flex-col justify-between p-6 sm:p-8">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-ink">Start the next run from the same setup.</h3>
            <p className="mt-3 leading-relaxed text-muted">
              A Dockerfile packages the supported Ubuntu base, your dependencies, and your code into a private
              template. Launch new runtimes from it whenever your workflow needs them.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-wider text-dim uppercase">Build</p>
              <CopyCommand command="zeist build -t eval-worker:v1 ." />
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-wider text-dim uppercase">Launch</p>
              <CopyCommand command="zeist box create eval-run --template eval-worker:v1 --wait" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <NetworkCard />
        </Reveal>
      </div>
    </Section>
  )
}
