import { RPC_SERVER_PORT, createFrameMessageClient } from '@next-devtools/shared'
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { type FrameMessageHandler } from '@next-devtools/shared'
import { type AppRouter } from '../../devtools/src/server/router'

export function createRPCClient() {
  // create persistent WebSocket connection
  const wsClient = createWSClient({ url: `ws://localhost:${RPC_SERVER_PORT}` })
  // configure TRPCClient to use WebSockets transport
  const client = createTRPCProxyClient<AppRouter>({ links: [wsLink({ client: wsClient })] })
  return client
}

export const rpcClient = createRPCClient()

export const messageClient = createFrameMessageClient<FrameMessageHandler>()
