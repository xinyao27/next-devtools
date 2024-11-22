import { resolve } from 'node:path'

export const packageDir = resolve(__dirname, '../..')
export const distDir = resolve(__dirname, '../dist')
export const clientDir =
  process.env.NODE_ENV === 'development' ? resolve(packageDir, 'client') : resolve(distDir, 'client')
