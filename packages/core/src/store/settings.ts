import path from 'node:path'
import fs from 'fs-extra'
import { createStore } from 'zustand/vanilla'
import { ToolbarPosition, settingsStoreDefaultState } from '@next-devtools/shared/types'
import { SETTINGS_FILE, TEMP_DIR } from '@next-devtools/shared/constants'
import consola from 'consola'
import { internalStore } from './internal'
import type { NextDevtoolsServerContext, SettingsStore } from '@next-devtools/shared/types'

export const settingsStore = createStore<SettingsStore>()((set, get) => ({
  ...settingsStoreDefaultState,

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

  setState(state) {
    set(state)
  },

  setToolbarSize(size) {
    const toolbarPosition = get().toolbarPosition

    switch (toolbarPosition) {
      case ToolbarPosition.Top:
      case ToolbarPosition.Bottom:
        set({ toolbarSize: { width: '100%', height: size } })
        break
      case ToolbarPosition.Left:
      case ToolbarPosition.Right:
        set({ toolbarSize: { width: size, height: '100%' } })
        break
    }
  },

  setToolbarPosition: () => {},
  toggleToolbar: () => {},
}))

settingsStore.subscribe((state) => {
  const internal = internalStore.getState()
  const dir = path.join(internal.root, TEMP_DIR)
  const settingsPath = path.join(dir, SETTINGS_FILE)
  fs.writeJSON(settingsPath, state)

  globalThis.__NEXT_DEVTOOLS_RPC__.broadcast.onSettingsStoreUpdate(state)
})
