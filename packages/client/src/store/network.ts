'use client'

import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

import { create } from 'zustand'

const defaultState: NetworkStoreState = {
  requests: {},
}
export const useNetworkStore = create<NetworkStore>()((set) => ({
  ...defaultState,

  add: () => {},
  clear: () => {
    set(useNetworkStore.getInitialState())
  },
  remove: () => {},
  setup: () => {},
  update: () => {},
}))
