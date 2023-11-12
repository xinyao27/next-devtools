import ws from 'ws'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import consola from 'consola'
import { type WebpackOptionsNormalized } from 'webpack'
import { RPC_SERVER_PORT } from '@next-devtools/shared'
import { type Context } from '@next-devtools/shared'
import { appRouter } from './router'
import { createContext } from './context'

export function createRPCServer(options: WebpackOptionsNormalized, context: Context) {
  const wss = new ws.Server({ port: Number(RPC_SERVER_PORT) })
  const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContext(options, context) })

  wss.on('connection', (ws) => {
    consola.log(`➕➕ Connection (${wss.clients.size})`)
    ws.once('close', () => {
      consola.log(`➖➖ Connection (${wss.clients.size})`)
    })
  })

  process.on('SIGTERM', () => {
    consola.log('SIGTERM')
    handler.broadcastReconnectNotification()
    wss.close()
  })
}
