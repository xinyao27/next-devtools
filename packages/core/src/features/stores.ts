import type { NextDevtoolsServerContext, ServerFunctions, SettingsStoreState } from '@next-devtools/shared/types'

import { internalStore } from '../store/internal'
import { settingsStore } from '../store/settings'

export function setupStoreRpc(_: NextDevtoolsServerContext) {
  return {
    getInternalStore: async () => internalStore.getState(),
    getSettingsStore: async () => settingsStore.getState(),

    setSettingsStore: async (settings: Partial<SettingsStoreState>) => {
      settingsStore.setState(settings)
    },
  } satisfies Partial<ServerFunctions>
}
