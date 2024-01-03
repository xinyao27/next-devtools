import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { type AppRouter } from '../../devtools/src/server/router'
import { RPC_SERVER_PORT } from '.'

export function createRPCClient() {
  // create persistent WebSocket connection
  const wsClient = createWSClient({ url: `ws://localhost:${RPC_SERVER_PORT}` })
  // configure TRPCClient to use WebSockets transport
  const client = createTRPCProxyClient<AppRouter>({ links: [wsLink({ client: wsClient })] })
  return client
}
