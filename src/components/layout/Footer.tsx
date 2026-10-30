import { ArrowUp } from 'lucide-react'
import { links } from '../../lib/links'
import { Logo } from '../ui/Logo'

const footerLinks = [
  { label: 'GitHub', href: links.github },
  { label: 'Discord', href: links.discord },
  { label: 'Questions', href: '#faq' },
]

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-dim">Agent-first compute. Built for what comes next.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          {footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
              className="relative transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-ink hover:after:origin-left hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
          <a href="#top" className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink">
            Back to top <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 font-mono text-xs text-dim sm:px-8">© 2026 Zeist</div>
    </footer>
  )
}
