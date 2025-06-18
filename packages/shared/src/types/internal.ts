import type { NextDevtoolsServerContext } from './rpc'

export type ClientInternalStore = ClientInternalStoreActions & ClientInternalStoreState

export interface ClientInternalStoreActions {
  setup: () => void
}

export interface ClientInternalStoreState {
  serverReady: boolean
}

export type InternalStore = InternalStoreActions & InternalStoreState

export interface InternalStoreActions {
  setup: (ctx: NextDevtoolsServerContext) => void
}

export interface InternalStoreState {
  codeRoot: string
  dev: boolean
  isApp: boolean
  isPages: boolean
  isSrcDirectory: boolean
  pkgPath: string | undefined
  publicPath: string | undefined
  root: string
  routePath: string
}
