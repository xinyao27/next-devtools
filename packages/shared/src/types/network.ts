export type NetworkId = string

export type NetworkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'

export type NetworkHeaders = HeadersInit

export interface NetworkRequest {
  id: NetworkId
  url: string
  method: NetworkMethod
  status: number
  statusText?: string
  startTime: number
  endTime: number
  size: number
  headers: NetworkHeaders
  body: string | null
}

export interface NetworkStoreState {
  requests: Record<NetworkId, NetworkRequest>
}

export interface NetworkActions {
  setup: () => void
  add: (id: NetworkId, request: NetworkRequest) => void
  update: (id: NetworkId, request: Partial<NetworkRequest>) => void
  remove: (id: NetworkId) => void
  clear: () => void
  set: (data: Record<NetworkId, NetworkRequest>) => void
}

export type NetworkStore = NetworkStoreState & NetworkActions
