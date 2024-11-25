import { join, resolve } from 'node:path'
import { createStore } from 'zustand/vanilla'
import { existsSync } from 'fs-extra'
import type { WebpackOptionsNormalized } from 'webpack'
import type { InternalStore } from '@next-devtools/shared/types/internal'

export const internalStore = createStore<InternalStore>()((set) => ({
  root: '',
  isSrcDirectory: false,
  codeRoot: '',
  pkgPath: undefined,
  publicPath: undefined,
  isApp: false,
  isPages: false,
  routePath: '',

  setup: (options: WebpackOptionsNormalized) => {
    const root = options.context!
    const isSrcDirectory = existsSync(join(root, '/src'))
    const codeRoot = isSrcDirectory ? join(root, '/src') : root
    let pkgPath: InternalStore['pkgPath'] = resolve(root, 'package.json')
    // Make sure package.json exists
    if (!existsSync(pkgPath)) pkgPath = undefined
    let publicPath: InternalStore['publicPath'] = join(root, 'public')
    if (!existsSync(publicPath)) publicPath = undefined
    const isApp = existsSync(join(codeRoot, '/app'))
    const isPages = existsSync(join(codeRoot, '/pages'))
    const routePath = join(codeRoot, isApp ? '/app' : isPages ? '/pages' : '/app')

    set({
      root,
      isSrcDirectory,
      codeRoot,
      pkgPath,
      publicPath,
      isApp,
      isPages,
      routePath,
    })
  },
}))
