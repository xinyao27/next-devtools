import { proxy } from 'valtio'

export interface NavBarStoreState {
  collapsed: boolean | undefined
}
export const navBarStore = proxy<NavBarStoreState>({ collapsed: undefined })
