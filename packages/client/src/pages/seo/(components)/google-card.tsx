import type { SEOMetadata } from '@next-devtools/shared/types'

import { formatDistanceToNow } from 'date-fns'
import React from 'react'

interface GoogleCardProps {
  data?: SEOMetadata
}

const GoogleCard = ({ data }: GoogleCardProps) => {
  if (!data) return null

  const icon = (data.icons as any)?.icon
  const name = data.name
  const title = data.title as string
  const description = data.description
  const url = typeof window !== 'undefined' ? window.location.origin : ''
  const updatedAt = React.useMemo(() => {
    // JSON-LD
    if (data.jsonLd) {
      const jsonLd = Array.isArray(data.jsonLd) ? data.jsonLd[0] : data.jsonLd
      if ('datePublished' in jsonLd) {
        return new Date(jsonLd.datePublished as string)
      }
      if ('dateModified' in jsonLd) {
        return new Date(jsonLd.dateModified as string)
      }
    }

    // OpenGraph
    if ((data.openGraph as any)?.published_time) {
      return new Date((data.openGraph as any).published_time)
    } else if ((data.openGraph as any)?.modifiedTime) {
      return new Date((data.openGraph as any).modifiedTime)
    }

    return null
  }, [data])

  return (
    <div className="group max-w-[600px] overflow-hidden">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-3">
          <div className="flex size-[26px] items-center justify-center rounded-full border border-[#dadce0] bg-[#f1f3f4]">
            {icon ? (
              <img
                className="block size-[18px]"
                src={icon}
              />
            ) : (
              <svg
                className="size-[18px] fill-current text-[#5e5e5e]"
                focusable="false"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-nowrap font-[Arial,sans-serif] text-[14px] leading-[18px] text-[#202124]">{name}</div>
            <div className="truncate text-[12px] leading-[18px] text-[#4d5156]">{url}</div>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="mb-[3px] cursor-pointer font-[Arial,sans-serif] text-[20px] leading-[26px] text-[#1a0dab] hover:underline">
            {title}
          </h3>
          <div className="line-clamp-2 font-[Arial,sans-serif] text-[14px] leading-[22px] text-[#474747]">
            {updatedAt ? (
              <span className="font-[Arial,sans-serif] text-[14px] leading-[22px] text-[#5e5e5e]">
                {formatDistanceToNow(updatedAt)}
                {' — '}
              </span>
            ) : null}
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleCard
