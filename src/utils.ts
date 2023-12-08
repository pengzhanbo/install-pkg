import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { findUp } from 'find-up'
import { LOCKS } from './constants'

export async function findPath(cwd = process.cwd()) {
  const lockPath = await findUp(Object.keys(LOCKS), { cwd })
  let packageJsonPath: string | undefined

  if (lockPath)
    packageJsonPath = path.resolve(lockPath, '../package.json')
  else
    packageJsonPath = await findUp('package.json', { cwd })

  return { lockPath, packageJsonPath }
}

export function resolvePackage(packageJsonPath?: string) {
  let content = {} as any

  if (packageJsonPath && fs.existsSync(packageJsonPath)) {
    try {
      content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    }
    catch { }
  }

  return content
}
