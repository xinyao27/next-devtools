'use client'

import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types'

import {
  DEFAULT_TOOLBAR_SIZE,
  MINI_TOOLBAR_SIZE,
  settingsStoreDefaultState,
  ToolbarDefaultSize,
  ToolbarPosition,
} from '@next-devtools/shared/types'
import { create } from 'zustand'

import { rpcClient } from '@/lib/client'

export const useSettingsStore = create<SettingsStore>()((set, get) => {
  const setState = (state: Partial<SettingsStore>) => {
    set(state)
    rpcClient.setSettingsStore(state)
  }

  return {
    ...settingsStoreDefaultState,

    setState,

    setToolbarPosition(toolbarPosition: ToolbarPosition) {
      const toolbarSize = get().toolbarSize
      const settings: Partial<SettingsStoreState> = { toolbarPosition }

      switch (toolbarPosition) {
        // from vertical to horizontal
        case ToolbarPosition.Bottom:
        case ToolbarPosition.Top: {
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
            settings.toolbarSize = { height: '100%', width: MINI_TOOLBAR_SIZE }
          } else {
            settings.toolbarSize = ToolbarDefaultSize[toolbarPosition]
          }
          break
        }
      }

      setState(settings)
    },

    setToolbarSize(size) {
      const toolbarPosition = get().toolbarPosition

      switch (toolbarPosition) {
        case ToolbarPosition.Bottom:
        case ToolbarPosition.Top:
          setState({ toolbarSize: { height: size, width: '100%' } })
          break
        case ToolbarPosition.Left:
        case ToolbarPosition.Right:
          setState({ toolbarSize: { height: '100%', width: size } })
          break
      }
    },

    async setup() {
      const settings = await rpcClient.getSettingsStore()
      set(settings)
    },

    toggleToolbar() {
      const setToolbarSize = get().setToolbarSize
      let toolbarSize: number
      switch (get().toolbarPosition) {
        case ToolbarPosition.Bottom:
        case ToolbarPosition.Top:
          toolbarSize = Number(get().toolbarSize!.height)
          break
        case ToolbarPosition.Left:
        case ToolbarPosition.Right:
          toolbarSize = Number(get().toolbarSize!.width)
          break
      }

      if (toolbarSize === MINI_TOOLBAR_SIZE) {
        setToolbarSize(DEFAULT_TOOLBAR_SIZE)
      } else {
        setToolbarSize(MINI_TOOLBAR_SIZE)
      }
    },
  }
})
