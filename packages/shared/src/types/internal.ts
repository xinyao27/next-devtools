import type { NextDevtoolsServerContext } from './rpc'

export interface InternalStoreState {
  root: string
  isSrcDirectory: boolean
  codeRoot: string
  pkgPath: string | undefined
  publicPath: string | undefined
  isApp: boolean
  isPages: boolean
  routePath: string
  dev: boolean
}

export interface InternalStoreActions {
  setup: (ctx: NextDevtoolsServerContext) => void
}

export type InternalStore = InternalStoreState & InternalStoreActions

export interface ClientInternalStoreState {
  serverReady: boolean
}

export interface ClientInternalStoreActions {
  setup: () => void
}

export type ClientInternalStore = ClientInternalStoreState & ClientInternalStoreActions
