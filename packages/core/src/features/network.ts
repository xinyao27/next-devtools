import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import { networkStore } from '../store/network'

export function setupNetworkRpc(_: NextDevtoolsServerContext) {
  return {
    getNetworkRequests: async () => networkStore.getState().requests,
  } satisfies Partial<ServerFunctions>
}
