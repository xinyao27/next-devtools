'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import useSWR from 'swr'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import OpenInVscode from '@/components/open-in-vscode'
import CopyToClipboard from '@/components/copy-to-clipboard'
import { formatBytes } from '@/lib/utils'
import { useRPCClient } from '@/lib/client'
import { Skeleton } from '@/components/ui/skeleton'
import type { Asset } from '@next-devtools/shared'

interface AssetProps {
  data: Asset
}
function AssetComponent({ data }: AssetProps) {
  const rpcClient = useRPCClient()
  const { data: assetInfo, isLoading } = useSWR(
    `getStaticAssetInfo/${data.filePath}`,
    data ? () => rpcClient.current?.getStaticAssetInfo.query(data.filePath) : null,
  )
  const previewElement = useMemo(
    () =>
      isLoading ? (
        <Skeleton style={{ width: 32, height: 32 }} />
      ) : (
        <Image alt={data.file} height={32} src={assetInfo!} width={32} />
      ),
    [data, assetInfo, isLoading],
  )
  return (
    <Sheet>
      <SheetTrigger>
        <button className="flex flex-col items-center gap-1 p-2 transition rounded hover:bg-muted">
          <div className="flex items-center justify-center p-2 border rounded h-28 w-28 bg-muted">{previewElement}</div>
          <div className="text-xs truncate whitespace-nowrap">{data.file}</div>
        </button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{data.file}</SheetTitle>
          <SheetDescription>
            <div className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary">Preview</h4>
                <div>
                  <div className="flex items-center justify-center p-2 border rounded h-28 w-28 bg-muted">
                    {previewElement}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary">Details</h4>
                <table className="table-fixed">
                  <tbody>
                    <tr>
                      <td className="pr-4 text-right opacity-50 w-28 whitespace-nowrap">File Path</td>
                      <td className="text-primary">
                        <OpenInVscode value={data.filePath}>{data.filePath}</OpenInVscode>
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-4 text-right opacity-50 w-28 whitespace-nowrap">Public Path</td>
                      <td className="text-primary">
                        <CopyToClipboard value={data.publicPath}>{data.publicPath}</CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-4 text-right opacity-50 w-28 whitespace-nowrap">Type</td>
                      <td className="text-primary">{data.type}</td>
                    </tr>
                    <tr>
                      <td className="pr-4 text-right opacity-50 w-28 whitespace-nowrap">File Size</td>
                      <td className="text-primary">{formatBytes(data.size)}</td>
                    </tr>
                    <tr>
                      <td className="pr-4 text-right opacity-50 w-28 whitespace-nowrap">Last modified</td>
                      <td className="text-primary">
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

interface Props {
  data?: Asset[]
}
export default function AllAssets({ data }: Props) {
  return (
    <div className="grid grid-cols-3 p-4 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
      {data?.map((asset) => <AssetComponent key={asset.file} data={asset} />)}
    </div>
  )
}
