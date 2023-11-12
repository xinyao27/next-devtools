import { RPC_SERVER_PORT } from '@next-devtools/shared'
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { type AppRouter } from '../server/router'

export function createRPCClient() {
  // create persistent WebSocket connection
  const wsClient = createWSClient({ url: `ws://localhost:${RPC_SERVER_PORT}` })
  // configure TRPCClient to use WebSockets transport
  const client = createTRPCProxyClient<AppRouter>({ links: [wsLink({ client: wsClient })] })
  return client
}

export const rpcClient = createRPCClient()
