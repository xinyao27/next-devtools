'use client'

import { create } from 'zustand'
import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

const defaultState: NetworkStoreState = {
  requests: {},
}
export const useNetworkStore = create<NetworkStore>()((set) => ({
  ...defaultState,

  setup: () => {},
  add: () => {},
  update: () => {},
  remove: () => {},
  clear: () => {
    set(useNetworkStore.getInitialState())
  },
}))
