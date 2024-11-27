import type { EventEmitter } from 'node:events'

export function getGlobalThis() {
  return globalThis
}

export const isDev = process.env.NODE_ENV === 'development'

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __NEXT_DEVTOOLS_EE__: EventEmitter
}

export function getFetchHeaders() {
  return {
    'x-next-devtools-version': process.env.VERSION!,
  }
}
