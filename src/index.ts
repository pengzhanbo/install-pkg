import { installPackage } from './install'

export { type PackageManager, Agent } from './constants'
export * from './install'
export { detectPackageManager } from './detect'

export default installPackage
