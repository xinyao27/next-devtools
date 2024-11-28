'use client'

import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { useContext } from 'react'
import { useStore } from 'zustand'
import { StoreContext } from './provider'
import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

const defaultState: NetworkStoreState = {
  requests: new Map(),
}
export const networkStore = createStore<NetworkStore>()(
  subscribeWithSelector((set) => ({
    ...defaultState,

    setup: () => {},
    add: () => {},
    update: () => {},
    remove: () => {},
    clear: () => {
      set(networkStore.getInitialState())
    },
    set: (data) => {
      const requests = data instanceof Map ? data : new Map(data.map((request) => [request.id, request]))
      set({ requests })
    },
  })),
)

export type NetworkStoreApi = typeof networkStore

export const useNetworkStore = <T>(selector: (store: NetworkStore) => T): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useNetworkStore must be used within StoreProvider`)
  }

  return useStore(storeContext, selector)
}
