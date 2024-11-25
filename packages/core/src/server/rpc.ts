import { WebSocketServer } from 'ws'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { RPC_SERVER_PORT } from '@next-devtools/shared/constants'
import { appRouter } from './router'
import { createContext } from './context'
import type { WebpackOptionsNormalized } from 'webpack'
import type { Context } from './router'

export function createRPCServer(options: WebpackOptionsNormalized, context: Context) {
  // create websocket server
  const wss = new WebSocketServer({ port: Number(RPC_SERVER_PORT) })
  const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContext(options, context) })

  // handle signals
  process.on('SIGTERM', () => {
    handler.broadcastReconnectNotification()
    wss.close()
  })
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    handler.broadcastReconnectNotification()
    wss.close()
  })
}
