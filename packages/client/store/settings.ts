import { create } from 'zustand'
import { Editor } from '@next-devtools/shared/types/settings'
import { rpcClient } from '@/lib/client'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types/settings'

const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}
export const useSettingsStore = create<SettingsStore>()((set) => ({
  ...defaultState,

  setup() {
    rpcClient?.getSettingsStore.query().then((settings) => {
      set(settings)
    })
  },
}))

useSettingsStore.subscribe((state) => {
  rpcClient?.setSettingsStore.mutate({ settings: state })
})
