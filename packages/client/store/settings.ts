import { create } from 'zustand'
import { Editor } from '@next-devtools/shared/types/settings'
import { trpcClient } from '@/lib/client'
import type { SettingsStore, SettingsStoreState } from '@next-devtools/shared/types/settings'

const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: Editor.VSCode,
  componentDirectory: '/src/components',
}
export const useSettingsStore = create<SettingsStore>()((set) => ({
  ...defaultState,

  async setup() {
    const settings = await trpcClient.getSettingsStore.query()
    set(settings)
  },
}))

useSettingsStore.subscribe((state) => {
  trpcClient.setSettingsStore.mutate({ settings: state })
})
