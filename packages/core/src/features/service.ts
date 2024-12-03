import { RESTART_EXIT_CODE } from '@next-devtools/shared/constants'
import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

export function setupService() {
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    setTimeout(() => {
      process.exit(RESTART_EXIT_CODE)
    }, 1000)
  })
}

export async function restartProject() {
  __NEXT_DEVTOOLS_EE__.emit('project:restart')
}

export function setupServiceRpc(_: NextDevtoolsServerContext) {
  return {
    restartProject,
  } satisfies Partial<ServerFunctions>
}
