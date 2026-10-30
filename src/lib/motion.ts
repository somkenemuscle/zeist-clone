/**
 * Respect the OS "Reduce motion" setting by default. Add `?motion=full` to the URL to
 * preview every animation regardless (useful for design review).
 */
export const reducedMotionMode: 'user' | 'never' =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('motion') === 'full'
    ? 'never'
    : 'user'

export const ease = [0.22, 1, 0.36, 1] as const
