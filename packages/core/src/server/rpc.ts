import { WebSocketServer } from 'ws'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { createBirpcGroup } from 'birpc'
import consola from 'consola'
import {
  WS_CLIENT_TO_SERVER_EVENT_NAME,
  WS_PROVIDER_TO_SERVER_EVENT_NAME,
  WS_SERVER_EVENT_NAME,
} from '@next-devtools/shared/types'
import SuperJSON from 'superjson'
import { setupOverviewRpc } from '../features/overview'
import { setupStoreRpc } from '../features/stores'
import { setupNpmRpc } from '../features/npm'
import { setupTerminalRpc } from '../features/terminal'
import { setupRoutesRpc } from '../features/routes'
import { setupComponentsRpc } from '../features/components'
import { setupEnvsRpc } from '../features/envs'
import { setupMemoryRpc } from '../features/memory'
import { setupNetworkRpc } from '../features/network'
import { setupPackagesRpc } from '../features/packages'
import { setupServiceRpc } from '../features/service'
import { setupAssetsRpc } from '../features/assets'
import { setupEditorRpc } from '../features/editor'
import type {
  ClientFunctions,
  NextDevtoolsServerContext,
  RpcMessage,
  ServerFunctions,
} from '@next-devtools/shared/types'
import type { ChannelOptions } from 'birpc'

const serverFunctions = {
  ping: () => 'pong',
} as ServerFunctions

export function createRPCServer(ctx: NextDevtoolsServerContext) {
  // create websocket server
  const wss = new WebSocketServer({ port: RPC_SERVER_PORT })

  Object.assign(serverFunctions, {
    ...setupAssetsRpc(ctx),
    ...setupComponentsRpc(ctx),
    ...setupEditorRpc(ctx),
    ...setupEnvsRpc(ctx),
    ...setupMemoryRpc(ctx),
    ...setupNetworkRpc(ctx),
    ...setupNpmRpc(ctx),
    ...setupOverviewRpc(ctx),
    ...setupPackagesRpc(ctx),
    ...setupRoutesRpc(ctx),
    ...setupServiceRpc(ctx),
    ...setupStoreRpc(ctx),
    ...setupTerminalRpc(ctx),
  })

  globalThis.__NEXT_DEVTOOLS_RPC__ = createBirpcGroup<ClientFunctions, ServerFunctions>(serverFunctions, [], {
    timeout: 120_000,
    onError: (error) => consola.error(error),
    onTimeoutError: (name) => consola.error(`[Next Devtools] RPC (server) timeout on executing "${name}":`),
  })

  wss.on('connection', (ws) => {
    const channel: ChannelOptions = {
      post: (payload) =>
        ws.send(
          JSON.stringify({
            id: crypto.randomUUID(),
            event: WS_SERVER_EVENT_NAME,
            payload,
          }),
        ),
      on: (fn) => {
        ws.on('message', (e) => {
          try {
            const message = JSON.parse(String(e)) as RpcMessage
            if (
              message.event === WS_CLIENT_TO_SERVER_EVENT_NAME ||
              message.event === WS_PROVIDER_TO_SERVER_EVENT_NAME
            ) {
              fn(message.payload)
            }
          } catch {}
        })
      },
      serialize: SuperJSON.stringify,
      deserialize: SuperJSON.parse,
    }
    globalThis.__NEXT_DEVTOOLS_RPC__!.updateChannels((c) => c.push(channel))
    ws.on('close', () => {
      wss.clients.delete(ws)
      globalThis.__NEXT_DEVTOOLS_RPC__!.updateChannels((c) => {
        const index = c.indexOf(channel)
        if (index >= 0) c.splice(index, 1)
      })
    })
  })

  // handle signals
  process.on('SIGTERM', () => {
    wss.close()
  })
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    wss.close()
  })
}
