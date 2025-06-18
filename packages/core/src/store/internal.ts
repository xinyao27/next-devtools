import type { InternalStore, NextDevtoolsServerContext } from '@next-devtools/shared/types'

import fs from 'fs-extra'
import { join, resolve } from 'node:path'
import { createStore } from 'zustand/vanilla'

export const internalStore = createStore<InternalStore>()((set) => ({
  codeRoot: '',
  dev: false,
  isApp: false,
  isPages: false,
  isSrcDirectory: false,
  pkgPath: undefined,
  publicPath: undefined,
  root: '',
  routePath: '',

  setup: (ctx: NextDevtoolsServerContext) => {
    const root = ctx.options.context!
    const isSrcDirectory = fs.existsSync(join(root, '/src'))
    const codeRoot = isSrcDirectory ? join(root, '/src') : root
    let pkgPath: InternalStore['pkgPath'] = resolve(root, 'package.json')
    // Make sure package.json exists
    if (!fs.existsSync(pkgPath)) pkgPath = undefined
    let publicPath: InternalStore['publicPath'] = join(root, 'public')
    if (!fs.existsSync(publicPath)) publicPath = undefined
    const isApp = fs.existsSync(join(codeRoot, '/app'))
    const isPages = fs.existsSync(join(codeRoot, '/pages'))
    const routePath = join(codeRoot, isApp ? '/app' : isPages ? '/pages' : '/app')
    const dev = ctx.context.dev

    set({
      codeRoot,
      dev,
      isApp,
      isPages,
      isSrcDirectory,
      pkgPath,
      publicPath,
      root,
      routePath,
    })
  },
}))
