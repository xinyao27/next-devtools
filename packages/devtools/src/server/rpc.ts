import { WebSocketServer } from 'ws'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { type WebpackOptionsNormalized } from 'webpack'
import { RPC_SERVER_PORT } from '@next-devtools/shared'
import { type Context } from '@next-devtools/shared'
import { appRouter } from './router'
import { createContext } from './context'

export function createRPCServer(options: WebpackOptionsNormalized, context: Context) {
  const wss = new WebSocketServer({ port: Number(RPC_SERVER_PORT) })
  const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContext(options, context) })

  process.on('SIGTERM', () => {
    handler.broadcastReconnectNotification()
    wss.close()
  })
}
