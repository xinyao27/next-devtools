import { on } from 'node:events'
import { getFetchHeaders } from '../utils'
import { networkStore } from '../store/network'
import type { NetworkId, NetworkMethod, NetworkRequest } from '@next-devtools/shared/types'

export function patchFetch(original: typeof globalThis.fetch) {
  const patched = function (resource: URL | RequestInfo, options?: RequestInit) {
    if (isNextDevToolsRequest(options?.headers)) {
      return Reflect.apply(original, this, [resource, options])
    }

    const startTime = Date.now()
    const id = crypto.randomUUID()
    const urlString = resource.toString()
    const method = (options?.method || 'GET') as NetworkMethod
    const headers = options?.headers || {}
    const networkRequest: NetworkRequest = {
      id,
      url: urlString,
      method,
      status: 0,
      startTime,
      endTime: 0,
      size: 0,
      headers,
      body: null,
    }
    networkStore.getState().add(networkRequest.id, networkRequest)

    return Reflect.apply(original, this, [resource, options])
      .then(async (response) => {
        const endTime = Date.now()
        const clonedResponse = response.clone()
        networkRequest.endTime = endTime
        networkRequest.status = clonedResponse.status
        networkRequest.size = Number(clonedResponse.headers.get('content-length') || 0)
        networkRequest.body = await clonedResponse.text()
        networkStore.getState().update(networkRequest.id, networkRequest)

        return response
      })
      .catch((error) => {
        networkRequest.endTime = Date.now()
        networkRequest.status = 500
        networkRequest.statusText = error instanceof Error ? error.message : 'Internal Server Error'
        networkStore.getState().update(networkRequest.id, networkRequest)

        return console.error(error)
      })
  }

  patched.__nextDevtoolsPatched = true
  return patched
}

function isNextDevToolsRequest(headers?: HeadersInit) {
  if (!headers) return false
  const nextDevtoolsHeader = getFetchHeaders()
  if (!nextDevtoolsHeader) return false
  for (const [key, value] of Object.entries(nextDevtoolsHeader)) {
    if ((headers as Record<string, string>)[key] !== value) return false
  }

  return true
}

export async function* onNetworkUpdate(opts: any) {
  for await (const [data] of on(globalThis.__NEXT_DEVTOOLS_EE__, 'network:update', {
    signal: opts.signal,
  })) {
    if (data.requests) {
      const requestsMap = data.requests as Map<NetworkId, NetworkRequest>
      const requests = Array.from(requestsMap.values())
      yield requests.sort((a, b) => b.startTime - a.startTime)
    }
  }
}
