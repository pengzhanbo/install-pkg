export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun'

export const AGENTS = ['pnpm', 'yarn', 'npm', 'pnpm@6', 'yarn@berry', 'bun'] as const

export type Agent = typeof AGENTS[number]

export const LOCKS: Record<string, PackageManager> = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
}
