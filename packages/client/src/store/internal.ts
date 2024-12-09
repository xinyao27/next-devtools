import { create } from 'zustand'
import type { ClientInternalStore } from '@next-devtools/shared/types'

export const useInternalStore = create<ClientInternalStore>()((set) => ({
  serverReady: false,

  setup: () => {
    set({ serverReady: true })
  },
}))
