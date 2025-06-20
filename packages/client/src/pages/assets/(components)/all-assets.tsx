'use client'

import type { Asset } from '@next-devtools/shared/types'

import { useQuery } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import React, { useMemo } from 'react'

import CopyToClipboard from '@/components/copy-to-clipboard'
import OpenInVscode from '@/components/open-in-editor'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { rpcClient } from '@/lib/client'
import { formatBytes } from '@/lib/utils'

interface AssetProps {
  data: Asset
}
interface Props {
  data?: Asset[]
}

export default function AllAssets({ data }: Props) {
  return (
    <div className="grid grid-cols-3 p-4 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
      {data?.map((asset) => (
        <AssetComponent
          data={asset}
          key={asset.file}
        />
      ))}
    </div>
  )
}
function AssetComponent({ data }: AssetProps) {
  const { data: assetInfo, isLoading } = useQuery({
    queryFn: () => rpcClient.getStaticAssetInfo(data.filePath),
    queryKey: ['getStaticAssetInfo', data.filePath],
  })

  const previewElement = useMemo(
    () =>
      isLoading ? (
        <Skeleton style={{ height: 32, width: 32 }} />
      ) : (
        <img
          alt={data.file}
          height={32}
          src={assetInfo!}
          width={32}
        />
      ),
    [data, assetInfo, isLoading],
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hover:bg-muted flex flex-col items-center gap-1 rounded p-2 transition">
          <div className="bg-muted flex h-28 w-28 items-center justify-center rounded border p-2">{previewElement}</div>
          <div className="truncate whitespace-nowrap text-xs">{data.file}</div>
        </button>
      </SheetTrigger>
      <SheetContent className="sm:w-[540px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>{data.file}</SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Preview</h4>
                <div>
                  <div className="bg-muted flex h-28 w-28 items-center justify-center rounded border p-2">
                    {previewElement}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Details</h4>
                <table className="table-fixed">
                  <tbody>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">File Path</td>
                      <td>
                        <OpenInVscode value={data.filePath}>{data.filePath}</OpenInVscode>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Public Path</td>
                      <td>
                        <CopyToClipboard value={data.publicPath}>{data.publicPath}</CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Type</td>
                      <td>{data.type}</td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">File Size</td>
                      <td>{formatBytes(data.size)}</td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Last modified</td>
                      <td>
                        {format(data.mtime, 'MM/dd/yyyy, HH:mm:ss')}{' '}
                        <span className="opacity-50">({formatDistanceToNow(data.mtime, { addSuffix: true })})</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
