'use client'

import { create } from 'zustand'

interface Terminal {
  buffer?: string | Uint8Array
  description?: string
  icon: string
  id: string
  name: string
}

type TerminalStore = TerminalStoreActions & TerminalStoreState

interface TerminalStoreActions {
  onTerminalWrite: (data: { data: string; id: string }) => void
}

interface TerminalStoreState {
  currentId: null | string
  terminals: Terminal[]
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  currentId: null,
  onTerminalWrite: (data) => {
    set((state) => {
      const terminals = structuredClone(state.terminals)
      const terminal = terminals.find((t) => t.id === data.id)
      if (terminal) {
        terminal.buffer = data.data
      }
      return { terminals }
    })
  },

  terminals: [],
}))
