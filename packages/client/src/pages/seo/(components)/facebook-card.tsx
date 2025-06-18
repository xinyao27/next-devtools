import type { SEOMetadata } from '@next-devtools/shared/types'

import React from 'react'

interface FacebookCardProps {
  data?: SEOMetadata
}

const FacebookCard = ({ data }: FacebookCardProps) => {
  if (!data || !data.openGraph)
    return (
      <div className="text-muted-foreground text-center">
        <p className="mb-2">Missing `og:` related metadata</p>
        <a
          className="text-blue-500 hover:underline"
          href="https://ogp.me/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>
      </div>
    )

  const og = data?.openGraph
  const title = (og?.title as string) || (data?.title as string) || data.name
  const description = og?.description || data?.description
  const image = (og?.images as any[])?.[0]
  const siteName = og?.siteName || data?.applicationName || ''

  return (
    <div className="max-w-[527px] overflow-hidden border border-[#dadde1] bg-[#f2f3f5]">
      {image ? (
        <div className="h-[274px] w-full">
          <img
            alt=""
            className="size-full object-cover"
            src={image.url}
          />
        </div>
      ) : null}
      <div className="max-h-[190px] px-[12px] py-[10px] text-[12px] text-[#4b4f56]">
        <div className="truncate whitespace-nowrap text-[12px] uppercase leading-[16px] text-[#606770]">{siteName}</div>
        <div className="mt-[5px] truncate text-[16px] font-semibold leading-[20px]">{title}</div>
        <div className="mt-[3px] max-h-[80px] truncate font-[Helvetica,Arial,sans-serif] text-[13px] text-[#606770]">
          {description}
        </div>
      </div>
    </div>
  )
}

export default FacebookCard
