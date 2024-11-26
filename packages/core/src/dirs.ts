import { resolve } from 'node:path'
import { isDev } from './utils'

export const packageDir = resolve(__dirname, '../../..')
export const distDir = resolve(__dirname, '../../dist')
export const clientDir = isDev ? resolve(packageDir, 'client') : resolve(distDir, 'client')
