import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { diff } from '@next-devtools/shared/utils'
import { patchFetch } from '../features/network'
import type { NetworkStore, NetworkStoreState } from '@next-devtools/shared/types'

const defaultState: NetworkStoreState = {
  requests: {},
}
export const networkStore = createStore<NetworkStore>()(
  subscribeWithSelector(
    immer((set) => ({
      ...defaultState,

      setup: () => {
        const originalFetch = globalThis.fetch
        // @ts-expect-error: TODO
        globalThis.fetch = patchFetch(originalFetch)
      },
      add: (id, request) => {
        set((state) => {
          state.requests[id] = { ...request }
        })
      },
      update: (id, request) => {
        set((state) => {
          state.requests[id] = {
            ...state.requests[id],
            ...request,
          }
        })
      },
      remove: (id) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete state.requests[id]
        })
      },
      clear: () => {
        set(networkStore.getInitialState())
      },
      set: () => {},
    })),
  ),
)

networkStore.subscribe(
  (state) => state.requests,
  (requests, prevRequests) => {
    const diffedRequests = diff(prevRequests, requests)
    if (diffedRequests.length > 0) {
      globalThis.__NEXT_DEVTOOLS_EE__.emit('network:update', { diff: diffedRequests })
    }
  },
)
