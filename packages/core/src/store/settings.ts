import type { NextDevtoolsServerContext, SettingsStore } from '@next-devtools/shared/types'

import { SETTINGS_FILE, TEMP_DIR } from '@next-devtools/shared/constants'
import { settingsStoreDefaultState, ToolbarPosition } from '@next-devtools/shared/types'
import consola from 'consola'
import fs from 'fs-extra'
import path from 'node:path'
import { createStore } from 'zustand/vanilla'

import { internalStore } from './internal'

export const settingsStore = createStore<SettingsStore>()((set, get) => ({
  ...settingsStoreDefaultState,

  setState(state) {
    set(state)
  },

  setToolbarPosition: () => {},

  setToolbarSize(size) {
    const toolbarPosition = get().toolbarPosition

    switch (toolbarPosition) {
      case ToolbarPosition.Bottom:
      case ToolbarPosition.Top:
        set({ toolbarSize: { height: size, width: '100%' } })
        break
      case ToolbarPosition.Left:
      case ToolbarPosition.Right:
        set({ toolbarSize: { height: '100%', width: size } })
        break
    }
  },

  setup: (ctx: NextDevtoolsServerContext) => {
    const dir = path.join(ctx.context.dir, TEMP_DIR)
    const settingsPath = path.join(dir, SETTINGS_FILE)
    let settings = settingsStoreDefaultState
    try {
      settings = fs.readJSONSync(settingsPath)
    } catch {
      consola.info('No settings file found, using default settings')
      fs.ensureDirSync(dir)
      fs.writeJSONSync(settingsPath, settingsStoreDefaultState)
    }
    set(settings)
  },
  toggleToolbar: () => {},
}))

settingsStore.subscribe((state) => {
  const internal = internalStore.getState()
  const dir = path.join(internal.root, TEMP_DIR)
  const settingsPath = path.join(dir, SETTINGS_FILE)
  fs.writeJSON(settingsPath, state)

  globalThis.__NEXT_DEVTOOLS_RPC__.broadcast.onSettingsStoreUpdate(state)
})
