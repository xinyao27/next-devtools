import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

const defaultState: NetworkStoreState = {
  requests: new Map(),
}
export const networkStore = createStore<NetworkStore>()(
  subscribeWithSelector((set) => ({
    ...defaultState,

    setup: () => {},
    add: (id, request) => {
      set((state) => {
        const requests = new Map(state.requests)
        requests.set(id, request)
        return { requests }
      })
    },
    update: (id, request) => {
      set((state) => {
        const requests = new Map(state.requests)
        requests.set(id, request)
        return { requests }
      })
    },
    remove: (id) => {
      set((state) => {
        const requests = new Map(state.requests)
        requests.delete(id)
        return { requests }
      })
    },
    clear: () => {
      set(networkStore.getInitialState())
    },
  })),
)

networkStore.subscribe(
  (state) => state.requests,
  (requests) => {
    globalThis.__NEXT_DEVTOOLS_EE__.emit('network:update', { requests })
  },
)
