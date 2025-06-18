import type { WebpackOptionsNormalized } from 'webpack'

import type { Context } from './rpc'

export function createContext(options: WebpackOptionsNormalized, context: Context) {
  return () => {
    return { context, options }
  }
}
