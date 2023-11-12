import { type WebpackOptionsNormalized } from 'webpack'
import { type Context } from '@next-devtools/shared'

export function createContext(options: WebpackOptionsNormalized, context: Context) {
  return () => {
    return { options, context }
  }
}
