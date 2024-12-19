import type { Difference } from 'microdiff'
import type { InternalStoreState } from './internal'
import type { NetworkStoreState } from './network'
import type { Editor, SettingsStoreState } from './settings'
import type { Asset, Component, Env, Package, Route } from './features'
import type { NextConfig, WebpackConfigContext } from 'next/dist/server/config-shared'
import type { WebpackOptionsNormalized } from 'webpack'

export interface WebpackContext extends WebpackConfigContext {
  staticServerPort: number
  runtime: 'node' | 'edge' | 'browser'
  nextConfig: NextConfig
}

export interface NextDevtoolsServerContext {
  options: WebpackOptionsNormalized
  context: WebpackContext
}

export interface ServerFunctions {
  ping: () => string

  // assets
  getStaticAssets: () => Promise<Asset[]>
  getStaticAssetInfo: (path: string) => Promise<string>

  // components
  getComponents: () => Promise<Component[]>

  // editor
  openInEditor: (opts: {
    path: string
    line?: number | string
    column?: number | string
    editor?: Editor
  }) => Promise<void>

  // envs
  getEnvs: () => Promise<Env>

  // memory
  getNextServerMemory: () => Promise<NodeJS.MemoryUsage>

  // network
  getNetworkRequests: () => Promise<NetworkStoreState['requests']>

  // npm
  runAnalyzeBuild: () => Promise<void>

  // overview
  getOverviewData: () => Promise<{
    version: string
    nextVersion: string
    reactVersion: string
    routes: Route[]
    components: Component[]
    assets: Asset[]
    packages: Package[]
  }>

  // packages
  getPackages: () => Promise<Package[]>
  getPackageInfo: (name: string, github?: boolean) => Promise<Record<string, any>>
  checkPackageVersion: (
    name: string,
    current?: string,
  ) => Promise<{
    name: string
    current: string
    latest: string | null
    isOutdated: boolean
    npmData: Record<string, any>
  } | null>
  updatePackageVersion: (name: string, options?: Record<string, any>) => Promise<void>

  // routes
  getRoutes: () => Promise<{
    type: 'app' | 'pages'
    routes: Route[]
    apiRoutes: Route[]
  }>

  // service
  restartProject: () => Promise<void>

  // store
  setSettingsStore: (settings: Partial<SettingsStoreState>) => Promise<void>
  getSettingsStore: () => Promise<SettingsStoreState>
  getInternalStore: () => Promise<InternalStoreState>

  // terminal
  getTerminals: () => Promise<
    {
      id: string
      name: string
      description?: string
      icon: string
      buffer?: string | Uint8Array
    }[]
  >
  getTerminal: (id: string) => Promise<
    | {
        id: string
        name: string
        description?: string
        icon: string
        buffer?: string | Uint8Array
      }
    | undefined
  >
  runTerminalAction: (id: string, action: 'restart' | 'clear' | 'terminate') => Promise<boolean>
  executeCommand: (
    input: { command: string; args?: string[]; options?: { onExit?: (code: number) => void } } & {
      id: string
      name: string
      description?: string
      icon: string
    },
  ) => Promise<void>
}

export interface ClientFunctions {
  serverReady: () => void

  onNetworkUpdate: (diff: Difference[]) => void
  onTerminalWrite: (data: { id: string; data: string }) => void
  onSettingsStoreUpdate: (settings: Partial<SettingsStoreState>) => void
}

export const WS_SERVER_EVENT_NAME = 'next:devtools:rpc:server'
export const WS_CLIENT_TO_SERVER_EVENT_NAME = 'next:devtools:rpc:client_to_server'
export const WS_PROVIDER_TO_SERVER_EVENT_NAME = 'next:devtools:rpc:provider_to_server'
export interface RpcMessage {
  id: string
  event: typeof WS_SERVER_EVENT_NAME | typeof WS_CLIENT_TO_SERVER_EVENT_NAME | typeof WS_PROVIDER_TO_SERVER_EVENT_NAME
  payload: any
}
