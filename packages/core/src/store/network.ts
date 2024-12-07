import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { diff } from '@next-devtools/shared/utils'
import { patchFetch } from '../utils'
import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

const defaultState: NetworkStoreState = {
  requests: {},
}
export const networkStore = createStore<NetworkStore>()(
  subscribeWithSelector((set) => ({
    ...defaultState,

    setup: () => {
      // make sure networkStore is setup after all the servers are created
      const originalFetch = globalThis.fetch
      // @ts-expect-error: TODO
      globalThis.fetch = patchFetch(originalFetch)
    },
    add: (id, request) => {
      set((state) => {
        const requests = structuredClone(state.requests)
        requests[id] = request
        return { requests }
      })
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
    remove: (id) => {
      set((state) => {
        const requests = structuredClone(state.requests)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requests[id]
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
  (requests, prevRequests) => {
    const diffedRequests = diff(prevRequests, requests)
    if (diffedRequests.length > 0) {
      globalThis.__NEXT_DEVTOOLS_RPC__?.broadcast.onNetworkUpdate(diffedRequests)
    }
  },
)
