'use client'

import React, { useMemo } from 'react'
import { type Asset } from '@next-devtools/shared'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import OpenInVscode from '@/components/open-in-vscode'
import CopyToClipboard from '@/components/copy-to-clipboard'
import { formatBytes } from '@/lib/utils'

interface AssetProps {
  data: Asset
}
function AssetComponent({ data }: AssetProps) {
  const previewElement = useMemo(() => (
    <Image
      alt={data.file}
      height={32}
      src={`/api/assets?u=${data.filePath}`}
      width={32}
    />
  ), [data])
  return (
    <Sheet>
      <SheetTrigger>
        <button className="flex flex-col items-center gap-1 hover:bg-muted rounded p-2 transition">
          <div className="flex items-center justify-center rounded p-2 border h-28 w-28">
            {previewElement}
          </div>
          <div className="truncate whitespace-nowrap text-xs">{data.file}</div>
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
                  <div className="flex items-center justify-center rounded p-2 border h-28 w-28">{previewElement}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary">Details</h4>
                <table className="table-fixed">
                  <tbody>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">File Path</td>
                      <td className="text-primary">
                        <OpenInVscode value={data.filePath}>{data.filePath}</OpenInVscode>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Public Path</td>
                      <td className="text-primary">
                        <CopyToClipboard value={data.publicPath}>{data.publicPath}</CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Type</td>
                      <td className="text-primary">{data.type}</td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">File Size</td>
                      <td className="text-primary">{formatBytes(data.size)}</td>
                    </tr>
                    <tr>
                      <td className="w-28 whitespace-nowrap pr-4 text-right opacity-50">Last modified</td>
                      <td className="text-primary">{format(data.mtime, 'MM/dd/yyyy, HH:mm:ss')} <span className="opacity-50">({formatDistanceToNow(data.mtime, { addSuffix: true })})</span></td>
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
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 p-4">
      {data?.map(asset => (
        <AssetComponent
          key={asset.file}
          data={asset}
        />
      ))}
    </div>
  )
}
