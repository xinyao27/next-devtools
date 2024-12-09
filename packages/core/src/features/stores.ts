import { internalStore } from '../store/internal'
import { settingsStore } from '../store/settings'
import type { NextDevtoolsServerContext, ServerFunctions, SettingsStoreState } from '@next-devtools/shared/types'

export function setupStoreRpc(_: NextDevtoolsServerContext) {
  return {
    setSettingsStore: async (settings: Partial<SettingsStoreState>) => {
      settingsStore.setState(settings)
    },
    getSettingsStore: async () => settingsStore.getState(),

    getInternalStore: async () => internalStore.getState(),
  } satisfies Partial<ServerFunctions>
}
