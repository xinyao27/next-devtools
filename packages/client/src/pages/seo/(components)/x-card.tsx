import type { SEOMetadata } from '@next-devtools/shared/types'

// Learn more about the [X Card markup reference](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup).
import React from 'react'

import { cn } from '@/lib/utils'

interface XCardProps {
  data?: SEOMetadata
}

const XCard = ({ data }: XCardProps) => {
  if (!data || !data.twitter)
    return (
      <div className="text-muted-foreground text-center">
        <p className="mb-2">Missing `twitter:` related metadata</p>
        <a
          className="text-blue-500 hover:underline"
          href="https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>
      </div>
    )

  const title = data.title as string
  const image = (data.twitter?.images as any[])?.[0]
  const description = data.twitter?.description

  const type = React.useMemo(() => {
    if (!image) return 'summary'
    return (data.twitter as any)?.card || 'summary_large_image'
  }, [image, data.twitter])

  return (
    <div
      className="group min-w-[438px] max-w-[514px] overflow-hidden rounded-[16px] border border-[#2f3336] bg-black text-[#71767b]"
      style={{
        fontFamily: "TwitterChirp, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div className={cn('overflow-hidden', type !== 'summary_large_image' ? 'flex' : '')}>
        <div
          className={cn(
            'bg-[#16181c]',
            type === 'summary_large_image'
              ? 'h-[220px] w-full border-b border-[#2f3336]'
              : 'h-[129px] w-[130px] flex-none border-r border-[#2f3336]',
          )}
        >
          {image ? (
            type === 'summary_large_image' ? (
              <img
                alt={image?.alt}
                className="block size-full object-cover"
                src={image?.url}
              />
            ) : (
              <img
                alt={image?.alt}
                className="block size-full object-cover"
                src={image?.url}
              />
            )
          ) : (
            <div className="flex size-full items-center justify-center bg-[#16181c]">
              <svg
                aria-hidden="true"
                className="h-[30px] fill-current text-[#71767b]"
                viewBox="0 0 24 24"
              >
                <g>
                  <path d="M1.998 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.12 2.5 2.5v13c0 1.38-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.276 0-.5.22-.5.5v13c0 .28.224.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zM6 7h6v6H6V7zm2 2v2h2V9H8zm10 0h-4V7h4v2zm0 4h-4v-2h4v2zm-.002 4h-12v-2h12v2z" />
                </g>
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-[2px] p-3 group-hover:bg-[#16181c]">
          <div className="truncate whitespace-nowrap text-[15px] leading-[20px] text-[#71767b]">
            {window.location.origin}
          </div>
          <div className="truncate text-[15px] leading-[20px] text-[#e7e9ea]">{title}</div>
          <div className="line-clamp-2 break-words text-left text-[15px] leading-[20px] text-[#71767b]">
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default XCard
