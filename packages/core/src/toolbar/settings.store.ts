'use client'

import { create } from 'zustand'
import {
  MINI_TOOLBAR_SIZE,
  ToolbarDefaultSize,
  ToolbarPosition,
  settingsStoreDefaultState,
} from '@next-devtools/shared/types'
import { rpcClient } from './rpc'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types'

export const useSettingsStore = create<SettingsStore>()((set, get) => {
  const setState = (state: Partial<SettingsStore>) => {
    set(state)
    rpcClient?.setSettingsStore(state)
  }

  return {
    ...settingsStoreDefaultState,

    async setup() {
      const settings = await rpcClient?.getSettingsStore()
      if (settings) set(settings)
    },

    setState,

    setToolbarSize() {},

    setToolbarPosition(toolbarPosition: ToolbarPosition) {
      const toolbarSize = get().toolbarSize
      const settings: Partial<SettingsStoreState> = { toolbarPosition }

      switch (toolbarPosition) {
        // from vertical to horizontal
        case ToolbarPosition.Top:
        case ToolbarPosition.Bottom: {
          const oldValue = Number(typeof toolbarSize!.width === 'number' ? toolbarSize!.width : toolbarSize!.height)
          if (oldValue === MINI_TOOLBAR_SIZE) {
            settings.toolbarSize = { height: MINI_TOOLBAR_SIZE, width: '100%' }
          } else {
            settings.toolbarSize = ToolbarDefaultSize[toolbarPosition]
          }
          break
        }
        // from horizontal to vertical
        case ToolbarPosition.Left:
        case ToolbarPosition.Right: {
          const oldValue = Number(typeof toolbarSize!.width === 'number' ? toolbarSize!.width : toolbarSize!.height)
          if (oldValue === MINI_TOOLBAR_SIZE) {
            settings.toolbarSize = { width: MINI_TOOLBAR_SIZE, height: '100%' }
          } else {
            settings.toolbarSize = ToolbarDefaultSize[toolbarPosition]
          }
          break
        }
      }

      setState(settings)
    },
  }
})
