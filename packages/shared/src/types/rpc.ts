import type { Difference } from 'microdiff'
import type { NextConfig, WebpackConfigContext } from 'next/dist/server/config-shared'
import type { WebpackOptionsNormalized } from 'webpack'

import type { Asset, Component, Env, Package, Route } from './features'
import type { InternalStoreState } from './internal'
import type { NetworkStoreState } from './network'
import type { Editor, SettingsStoreState } from './settings'

export interface ClientFunctions {
  onNetworkUpdate: (diff: Difference[]) => void

  onSettingsStoreUpdate: (settings: Partial<SettingsStoreState>) => void
  onTerminalWrite: (data: { data: string; id: string }) => void
  serverReady: () => void
}

export interface NextDevtoolsServerContext {
  context: WebpackContext
  options: WebpackOptionsNormalized
}

export interface ServerFunctions {
  checkPackageVersion: (
    name: string,
    current?: string,
  ) => Promise<null | {
    current: string
    isOutdated: boolean
    latest: null | string
    name: string
    npmData: Record<string, any>
  }>

  executeCommand: (
    input: { args?: string[]; command: string; options?: { onExit?: (code: number) => void } } & {
      description?: string
      icon: string
      id: string
      name: string
    },
  ) => Promise<void>
  // components
  getComponents: () => Promise<Component[]>

  // envs
  getEnvs: () => Promise<Env>

  getInternalStore: () => Promise<InternalStoreState>

  // network
  getNetworkRequests: () => Promise<NetworkStoreState['requests']>

  // memory
  getNextServerMemory: () => Promise<NodeJS.MemoryUsage>

  // overview
  getOverviewData: () => Promise<{
    assets: Asset[]
    components: Component[]
    nextVersion: string
    packages: Package[]
    reactVersion: string
    routes: Route[]
    version: string
  }>

  getPackageInfo: (name: string, github?: boolean) => Promise<Record<string, any>>

  // packages
  getPackages: () => Promise<Package[]>

  // routes
  getRoutes: () => Promise<{
    routes: Route[]
    type: 'app' | 'pages'
  }>
  getSettingsStore: () => Promise<SettingsStoreState>
  getStaticAssetInfo: (path: string) => Promise<string>
  // assets
  getStaticAssets: () => Promise<Asset[]>

  getTerminal: (id: string) => Promise<
    | undefined
    | {
        buffer?: string | Uint8Array
        description?: string
        icon: string
        id: string
        name: string
      }
  >

  // terminal
  getTerminals: () => Promise<
    {
      buffer?: string | Uint8Array
      description?: string
      icon: string
      id: string
      name: string
    }[]
  >

  // editor
  openInEditor: (opts: {
    column?: number | string
    editor?: Editor
    line?: number | string
    path: string
  }) => Promise<void>
  ping: () => string
  // service
  restartProject: () => Promise<void>

  // npm
  runAnalyzeBuild: () => Promise<void>
  runTerminalAction: (id: string, action: 'clear' | 'restart' | 'terminate') => Promise<boolean>
  // store
  setSettingsStore: (settings: Partial<SettingsStoreState>) => Promise<void>
  updatePackageVersion: (name: string, options?: Record<string, any>) => Promise<void>
}

export interface WebpackContext extends WebpackConfigContext {
  nextConfig: NextConfig
  runtime: 'browser' | 'edge' | 'node'
  staticServerPort: number
}

export const WS_SERVER_EVENT_NAME = 'next:devtools:rpc:server'
export const WS_CLIENT_TO_SERVER_EVENT_NAME = 'next:devtools:rpc:client_to_server'
export const WS_PROVIDER_TO_SERVER_EVENT_NAME = 'next:devtools:rpc:provider_to_server'
export interface RpcMessage {
  event: typeof WS_CLIENT_TO_SERVER_EVENT_NAME | typeof WS_PROVIDER_TO_SERVER_EVENT_NAME | typeof WS_SERVER_EVENT_NAME
  id: string
  payload: any
}
