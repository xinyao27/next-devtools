export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'json' | 'other' | 'component'

export interface Asset {
  file: string
  type: AssetType
  publicPath?: string
  filePath: string
  size: number
  mtime: number
}

export interface Documentation {
  description?: string
  displayName?: string
}

export interface Component extends Asset {
  documentations: Documentation[]
}

export interface Route {
  id: number
  route: string
  name: string
  parentNode: number | null
  path: string
  contents: string[]
  render: 'client' | 'server'
}

export interface Package {
  type: string
  version: string
  name: string
}

export interface Env {
  publicEnv: Record<string, string>
  privateEnv: Record<string, string>
  loadedEnvFiles: {
    path: string
    contents: Record<string, string>
  }[]
}
