import { RESTART_EXIT_CODE } from '@next-devtools/shared'

export function setupService() {
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    setTimeout(() => {
      process.exit(RESTART_EXIT_CODE)
    }, 1000)
  })
}

export function restartProject() {
  __NEXT_DEVTOOLS_EE__.emit('project:restart')
}
