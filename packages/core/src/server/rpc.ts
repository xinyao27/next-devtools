import type {
  ClientFunctions,
  NextDevtoolsServerContext,
  RpcMessage,
  ServerFunctions,
} from '@next-devtools/shared/types'
import type { ChannelOptions } from 'birpc'

import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import {
  WS_CLIENT_TO_SERVER_EVENT_NAME,
  WS_PROVIDER_TO_SERVER_EVENT_NAME,
  WS_SERVER_EVENT_NAME,
} from '@next-devtools/shared/types'
import { createBirpcGroup } from 'birpc'
import consola from 'consola'
import { WebSocketServer } from 'ws'

import { setupAssetsRpc } from '../features/assets'
import { setupComponentsRpc } from '../features/components'
import { setupEditorRpc } from '../features/editor'
import { setupEnvsRpc } from '../features/envs'
import { setupMemoryRpc } from '../features/memory'
import { setupNetworkRpc } from '../features/network'
import { setupNpmRpc } from '../features/npm'
import { setupOverviewRpc } from '../features/overview'
import { setupPackagesRpc } from '../features/packages'
import { setupRoutesRpc } from '../features/routes'
import { setupServiceRpc } from '../features/service'
import { setupStoreRpc } from '../features/stores'
import { setupTerminalRpc } from '../features/terminal'

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
    onError: (error) => consola.error(error),
    onTimeoutError: (name) => consola.error(`[Next Devtools] RPC (server) timeout on executing "${name}":`),
    timeout: 120_000,
  })

  wss.on('connection', (ws) => {
    const channel: ChannelOptions = {
      deserialize: JSON.parse,
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
      post: (payload) =>
        ws.send(
          JSON.stringify({
            event: WS_SERVER_EVENT_NAME,
            id: crypto.randomUUID(),
            payload,
          }),
        ),
      serialize: JSON.stringify,
    }
    globalThis.__NEXT_DEVTOOLS_RPC__!.updateChannels((c) => c.push(channel))
    ws.on('close', () => {
      wss.clients.delete(ws)
      globalThis.__NEXT_DEVTOOLS_RPC__!.updateChannels((c) => {
        const index = c.indexOf(channel)
        if (index !== -1) c.splice(index, 1)
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
