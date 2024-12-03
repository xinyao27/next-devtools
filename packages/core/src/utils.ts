/* eslint-disable no-var, vars-on-top */

import type { ClientFunctions, ServerFunctions } from '@next-devtools/shared/types'
import type { BirpcGroup } from 'birpc'
import type { EventEmitter } from 'node:events'

export function getGlobalThis() {
  return globalThis
}

export const isDev = process.env.NODE_ENV === 'development'

declare global {
  var __NEXT_DEVTOOLS_EE__: EventEmitter
  var __NEXT_DEVTOOLS_RPC__: BirpcGroup<ClientFunctions, ServerFunctions>
}

export function getFetchHeaders() {
  return {
    'x-next-devtools-version': process.env.VERSION!,
  }
}
