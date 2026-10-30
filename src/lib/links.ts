export const links = {
  earlyAccess: 'https://app.youform.com/forms/snhif9ai',
  github: 'https://github.com/zeisthq',
  discord: 'https://discord.gg/RgYquNdd9P',
} as const

export const navItems = [
  { id: 'runtime', label: 'Runtime' },
  { id: 'environments', label: 'Environments' },
  { id: 'storage', label: 'Storage' },
  { id: 'workloads', label: 'Workloads' },
  { id: 'templates', label: 'Templates' },
] as const

export type SectionId = (typeof navItems)[number]['id']
