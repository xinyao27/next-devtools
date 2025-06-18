export interface NetworkActions {
  add: (id: NetworkId, request: NetworkRequest) => void
  clear: () => void
  remove: (id: NetworkId) => void
  setup: () => void
  update: (id: NetworkId, request: Partial<NetworkRequest>) => void
}

export type NetworkHeaders = HeadersInit

export type NetworkId = string

export type NetworkMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export interface NetworkRequest {
  body: null | string
  endTime: number
  headers: NetworkHeaders
  id: NetworkId
  method: NetworkMethod
  size: number
  startTime: number
  status: number
  statusText?: string
  url: string
}

export type NetworkStore = NetworkActions & NetworkStoreState

export interface NetworkStoreState {
  requests: Record<NetworkId, NetworkRequest>
}
