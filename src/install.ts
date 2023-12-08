import { execa } from 'execa'
import { detect, detectWorkSpaces } from './detect'
import { findPath, resolvePackage } from './utils'

export interface InstallPackageOptions {
  cwd?: string
  dev?: boolean
  silent?: boolean
  packageManager?: string
  packageManagerVersion?: string
  preferOffline?: boolean
  additionalArgs?: string[]
}

export async function installPackage(names: string | string[], options: InstallPackageOptions = {}) {
  const { lockPath, packageJsonPath } = await findPath(options.cwd)
  const pkg = resolvePackage(packageJsonPath)

  const detectedAgent = options.packageManager || await detect(pkg, lockPath) || 'npm'
  const [agent] = detectedAgent.split('@')

  const isWorkspaces = await detectWorkSpaces(detectedAgent, pkg, packageJsonPath, options.cwd)

  if (!Array.isArray(names))
    names = [names]

  const args = options.additionalArgs || []

  if (options.preferOffline) {
    // yarn berry uses --cached option instead of --prefer-offline
    if (detectedAgent === 'yarn@berry')
      args.unshift('--cached')
    else
      args.unshift('--prefer-offline')
  }

  if (isWorkspaces) {
    if (detectedAgent.startsWith('pnpm'))
      args.unshift('-w')
  }

  return execa(
    agent,
    [
      agent === 'yarn'
        ? 'add'
        : 'install',
      options.dev ? '-D' : '',
      ...args,
      ...names,
    ].filter(Boolean),
    {
      stdio: options.silent ? 'ignore' : 'inherit',
      cwd: options.cwd,
    },
  )
}
