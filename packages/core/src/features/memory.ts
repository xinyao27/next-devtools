import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

export async function getNextServerMemory() {
  return process.memoryUsage()
}

export function setupMemoryRpc(_: NextDevtoolsServerContext) {
  return {
    getNextServerMemory,
  } satisfies Partial<ServerFunctions>
}
