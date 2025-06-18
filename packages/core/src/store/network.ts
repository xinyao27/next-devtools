import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

import { diff } from '@next-devtools/shared/utils'
import { subscribeWithSelector } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { patchFetch } from '../utils'

const defaultState: NetworkStoreState = {
  requests: {},
}
export const networkStore = createStore<NetworkStore>()(
  subscribeWithSelector((set) => ({
    ...defaultState,

    add: (id, request) => {
      set((state) => {
        const requests = structuredClone(state.requests)
        requests[id] = request
        return { requests }
      })
    },
    clear: () => {
      set(networkStore.getInitialState())
    },
    remove: (id) => {
      set((state) => {
        const requests = structuredClone(state.requests)

        delete requests[id]
        return { requests }
      })
    },
    setup: () => {
      // make sure networkStore is setup after all the servers are created
      const originalFetch = globalThis.fetch
      // @ts-expect-error: TODO
      globalThis.fetch = patchFetch(originalFetch)
    },
    update: (id, request) => {
      set((state) => {
        const requests = structuredClone(state.requests)
        requests[id] = {
          ...state.requests[id],
          ...request,
        }
        return { requests }
      })
    },
  })),
)

networkStore.subscribe(
  (state) => state.requests,
  (requests, prevRequests) => {
    const diffedRequests = diff(prevRequests, requests)
    if (diffedRequests.length > 0) {
      globalThis.__NEXT_DEVTOOLS_RPC__?.broadcast.onNetworkUpdate(diffedRequests)
    }
  },
)
