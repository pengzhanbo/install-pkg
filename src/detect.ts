import path from 'node:path'
import process from 'node:process'
import { findUp } from 'find-up'
import { AGENTS, LOCKS } from './constants'
import type { Agent } from './constants'
import { findPath, resolvePackage } from './utils'

export async function detect(pkg: any, lockPath?: string): Promise<Agent | null> {
  let agent: Agent | null = null

  if (typeof pkg.packageManager === 'string') {
    const [name, version] = pkg.packageManager.split('@')
    if (name === 'yarn' && Number.parseInt(version) > 1)
      agent = 'yarn@berry'
    else if (name === 'pnpm' && Number.parseInt(version) < 7)
      agent = 'pnpm@6'
    else if (AGENTS.includes(name))
      agent = name
    else
      console.warn('Unknown packageManager:', pkg.packageManager)
  }

  // detect based on lock
  if (!agent && lockPath)
    agent = LOCKS[path.basename(lockPath)]

  return agent
}

export async function detectPackageManager(cwd = process.cwd()): Promise<Agent | null> {
  const { lockPath, packageJsonPath } = await findPath(cwd)
  const pkg = resolvePackage(packageJsonPath)
  return detect(pkg, lockPath)
}

export async function detectWorkSpaces(agent: string, pkg: any, packageJsonPath?: string, cwd?: string): Promise<boolean> {
  if (agent.startsWith('pnpm'))
    return !!await findUp('pnpm-workspace.yaml', { cwd: packageJsonPath ? path.dirname(packageJsonPath) : cwd })

  return !!pkg.workspaces
}
