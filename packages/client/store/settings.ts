'use client'

import { createStore } from 'zustand/vanilla'
import { Editor } from '@next-devtools/shared/types'
import { useContext } from 'react'
import { useStore } from 'zustand'
import { trpcClient } from '@/lib/client'
import { StoreContext } from './provider'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types'

const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}
export const settingsStore = createStore<SettingsStore>()((set) => ({
  ...defaultState,

  async setup() {
    const settings = await trpcClient.getSettingsStore.query()
    set(settings)
  },
}))

export type SettingsStoreApi = typeof settingsStore

settingsStore.subscribe((state) => {
  trpcClient.setSettingsStore.mutate({ settings: state })
})

export const useSettingsStore = <T>(selector: (store: SettingsStore) => T): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useSettingsStore must be used within StoreProvider`)
  }

  return useStore(storeContext, selector)
}
