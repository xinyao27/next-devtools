import { networkStore } from '../store/network'
import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

export function setupNetworkRpc(_: NextDevtoolsServerContext) {
  return {
    getNetworkRequests: async () => networkStore.getState().requests,
  } satisfies Partial<ServerFunctions>
}
