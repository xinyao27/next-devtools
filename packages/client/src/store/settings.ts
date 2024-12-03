'use client'

import { create } from 'zustand'
import { Editor } from '@next-devtools/shared/types'
import { rpcClient } from '@/lib/client'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types'

const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}
export const useSettingsStore = create<SettingsStore>()((set) => ({
  ...defaultState,

  async setup() {
    const settings = await rpcClient.getSettingsStore()
    set(settings)
  },
}))

useSettingsStore.subscribe((state) => {
  rpcClient.setSettingsStore(state)
})
