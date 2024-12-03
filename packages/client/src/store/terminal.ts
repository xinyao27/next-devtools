'use client'

import { create } from 'zustand'

interface Terminal {
  id: string
  name: string
  description?: string
  icon: string
  buffer?: string | Uint8Array
}

interface TerminalStoreState {
  terminals: Terminal[]
  currentId: string | null
}

interface TerminalStoreActions {
  onTerminalWrite: (data: { id: string; data: string }) => void
}

type TerminalStore = TerminalStoreState & TerminalStoreActions

export const useTerminalStore = create<TerminalStore>((set) => ({
  terminals: [],
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
}))
