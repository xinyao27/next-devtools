import type { Asset, AssetType, NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import fg from 'fast-glob'
import mine from 'mime-types'
import fs from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

import { internalStore } from '../store/internal'

export async function getStaticAssetInfo(path: string) {
  const data = await fs.readFile(path, { encoding: 'base64' })
  const base64 = `data:${mine.lookup(path)};base64,${data}`
  return base64
}

export async function getStaticAssets(): Promise<Asset[]> {
  const publicPath = internalStore.getState().publicPath
  if (!publicPath) return []
  const files = await fg(
    [
      // image
      '**/*.(png|jpg|jpeg|gif|svg|webp|avif|ico|bmp|tiff)',
      // video
      '**/*.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)',
      // audio
      '**/*.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)',
      // font
      '**/*.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)',
      // text
      '**/*.(json|json5|jsonc|txt|text|tsx|jsx|md|mdx|mdc|markdown)',
    ],
    {
      cwd: publicPath,
      ignore: ['**/node_modules/**', '**/dist/**'],
      onlyFiles: true,
    },
  )

  const result = await Promise.all(
    files.map(async (path: string) => {
      const filePath = join(publicPath, path)
      const stat = await fs.lstat(filePath)
      const normalizedPath = publicPath === basename(dirname(path)) ? path.replace(publicPath, '') : path
      return {
        file: normalizedPath,
        filePath,
        mtime: stat.mtimeMs,
        publicPath: `/${normalizedPath}`,
        size: stat.size,
        type: guessType(path),
      }
    }),
  )
  return result
}

export function setupAssetsRpc(_: NextDevtoolsServerContext) {
  return {
    getStaticAssetInfo,
    getStaticAssets,
  } satisfies Partial<ServerFunctions>
}

function guessType(path: string): AssetType {
  if (/\.(a?png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(path)) return 'image'

  if (
    /\.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i.test(
      path,
    )
  )
    return 'video'

  if (
    /\.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i.test(
      path,
    )
  )
    return 'audio'

  if (/\.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i.test(path)) return 'font'

  if (/\.(json[5c]?|te?xt|[cm]?[jt]sx?|md[cx]?|markdown)/i.test(path)) return 'text'

  return 'other'
}
