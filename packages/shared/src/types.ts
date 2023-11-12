import { type NextConfig, type WebpackConfigContext } from 'next/dist/server/config-shared'

export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'json' | 'other' | 'component'

export interface Asset {
  file: string
  type: AssetType
  publicPath?: string
  filePath: string
  size: number
  mtime: number
}

export interface Component extends Asset {
  description?: string
  displayName: string
}

export interface Route {
  route: string
  path: string
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

export type Context = WebpackConfigContext & { runtime: 'node' | 'edge' | 'browser'; nextConfig: NextConfig }
