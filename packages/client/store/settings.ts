import { proxy, subscribe } from 'valtio'

export type Editor = 'vscode' | 'cursor' | 'windsurf'
export interface SettingsStoreState {
  sidebarCollapsed: boolean | undefined
  uiScale: number
  editor: Editor
  componentDirectory: string
}

const NEXT_DEVTOOLS_SETTINGS_KEY = 'NEXT_DEVTOOLS_SETTINGS'
const defaultState: SettingsStoreState = {
  sidebarCollapsed: undefined,
  uiScale: 15,
  editor: 'vscode',
  componentDirectory: '/src/components',
}
export const settingsStore = proxy<SettingsStoreState>(
  typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem(NEXT_DEVTOOLS_SETTINGS_KEY) || 'null') || defaultState
    : defaultState,
)

subscribe(settingsStore, () => {
  localStorage.setItem(NEXT_DEVTOOLS_SETTINGS_KEY, JSON.stringify(settingsStore))
})
