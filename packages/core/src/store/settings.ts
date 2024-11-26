import path from 'node:path'
import fs from 'fs-extra'
import { createStore } from 'zustand/vanilla'
import { Editor } from '@next-devtools/shared/types'
import { SETTINGS_FILE, TEMP_DIR } from '@next-devtools/shared/constants'
import consola from 'consola'
import { internalStore } from './internal'
import type { Context } from '../server/router'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types'

const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}
export const settingsStore = createStore<SettingsStore>()((set) => ({
  ...defaultState,

  setup: async (context: Context) => {
    const dir = path.join(context.dir, TEMP_DIR)
    const settingsPath = path.join(dir, SETTINGS_FILE)
    let settings = defaultState
    try {
      settings = await fs.readJSON(settingsPath)
    } catch {
      consola.info('No settings file found, using default settings')
      await fs.writeJSON(settingsPath, defaultState)
    }
    set(settings)
  },
}))

settingsStore.subscribe((state) => {
  const internal = internalStore.getState()
  const dir = path.join(internal.root, TEMP_DIR)
  const settingsPath = path.join(dir, SETTINGS_FILE)
  fs.writeJSON(settingsPath, state)
})
