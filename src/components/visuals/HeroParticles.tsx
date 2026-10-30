// A few slow-drifting points of light behind the hero copy. Pure CSS keyframes, no React renders.

const particles = [
  [12, 22, 7], [22, 64, 9], [31, 38, 11], [44, 14, 8], [57, 70, 10], [68, 30, 7],
  [79, 58, 12], [88, 18, 9], [93, 46, 8], [6, 48, 10], [50, 44, 13], [74, 80, 9],
] as const

export function HeroParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(([left, top, duration], i) => (
        <span
          key={i}
          className="animate-float absolute size-1 rounded-full bg-brand-soft/60 shadow-[0_0_8px_rgb(166_155_255/0.8)]"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            opacity: 0.25 + (i % 4) * 0.15,
            ['--float-duration' as string]: `${duration}s`,
            animationDelay: `${-i * 0.9}s`,
          }}
        />
      ))}
    </div>
  )
}
