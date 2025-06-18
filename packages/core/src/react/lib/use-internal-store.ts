import type { ClientInternalStore } from '@next-devtools/shared/types'

import { create } from 'zustand'

export const useInternalStore = create<ClientInternalStore>()((set) => ({
  serverReady: false,
  setup: () => {
    set({ serverReady: true })
  },
}))
