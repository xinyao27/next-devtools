export interface Asset {
  file: string
  filePath: string
  mtime: number
  publicPath?: string
  size: number
  type: AssetType
}

export type AssetType = 'audio' | 'component' | 'font' | 'image' | 'json' | 'other' | 'text' | 'video'

export interface Component extends Asset {
  documentations: Documentation[]
}

export interface Documentation {
  description?: string
  displayName?: string
}

export interface Env {
  loadedEnvFiles: {
    contents: Record<string, string>
    path: string
  }[]
  privateEnv: Record<string, string>
  publicEnv: Record<string, string>
}

export interface Package {
  name: string
  type: string
  version: string
}

export interface Route {
  contents: string[]
  id: number
  name: string
  parentNode: null | number
  path: string
  render: 'client' | 'server'
  route: string
}
