export interface InternalStoreState {
  root: string
  isSrcDirectory: boolean
  codeRoot: string
  pkgPath: string | undefined
  publicPath: string | undefined
  isApp: boolean
  isPages: boolean
  routePath: string
}

export interface InternalStoreActions {
  setup: (options: any) => void
}

export type InternalStore = InternalStoreState & InternalStoreActions
