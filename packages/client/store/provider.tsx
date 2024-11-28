import { createContext, useRef } from 'react'
import { settingsStore } from './settings'
import { networkStore } from './network'
import type { StoreApi } from 'zustand'
import type { ReactNode } from 'react'

export const StoreContext = createContext<StoreApi<any> | undefined>(undefined)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<StoreApi<any>>()
  if (!storeRef.current) {
    storeRef.current = {
      ...settingsStore,
      ...networkStore,
    }
  }

  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
}
