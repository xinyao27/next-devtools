import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { RPC_SERVER_PORT } from '@next-devtools/shared'
import type { CreateTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '@next-devtools/core/types'

export function createRPCClient(ip?: string): CreateTRPCProxyClient<AppRouter> | null {
  if (typeof window != 'undefined') {
    const _ip = window.location.hostname
    // create persistent WebSocket connection
    const wsClient = createWSClient({ url: `ws://${ip || _ip}:${RPC_SERVER_PORT}` })
    // configure TRPCClient to use WebSockets transport
    return createTRPCProxyClient<AppRouter>({ links: [wsLink({ client: wsClient })] })
  }
  return null
}
