import React from 'react'
import { cn } from '@/lib/utils'
import type { SEOMetadata } from '@next-devtools/shared/types'

// from https://github.com/nuxt/devtools
export const ogTags = [
  {
    name: 'title',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title',
    description: 'A concise and descriptive title for the browser that accurately summarizes the content of the page.',
  },
  {
    name: 'description',
    description:
      'A one to two sentence summary for search engines that includes relevant keywords to improve visibility in search results.',
  },
  {
    name: 'icon',
    description:
      'A small image that appears in the browser tab and bookmark menu to help users easily identify the page.',
  },
  {
    name: 'lang',
    description: 'The primary language of the page to help search engines and browsers understand the content.',
  },
  {
    name: 'og:title',
    docs: 'https://ogp.me/#metadata',
    description: 'A title for the link preview used by social media platforms.',
  },
  {
    name: 'og:description',
    docs: 'https://ogp.me/#metadata',
    description: 'A description for the link preview used by social media platforms.',
  },
  {
    name: 'og:image',
    docs: 'https://ogp.me/#metadata',
    description: 'An image for the link preview used by social media platforms.',
  },
  {
    name: 'og:url',
    docs: 'https://ogp.me/#metadata',
    description:
      'A canonical URL for the link preview used to specify the preferred URL to display in search engine results and social media previews when multiple URLs may point to the same page.',
  },
  {
    name: 'twitter:title',
    docs: 'https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards',
    description: 'A title for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:description',
    docs: 'https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards',
    description: 'A description for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:image',
    docs: 'https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards',
    description: 'An image for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:card',
    docs: 'https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards',
    description:
      'The type of Twitter card to use, which determines the type of card to display in link previews on Twitter.',
  },
]
interface Row {
  id: string
  content: (data: SEOMetadata) => React.ReactNode
}
const rows: Row[] = [
  // HTML Meta Tags
  {
    id: 'title',
    content: (data) => data.title as string,
  },
  {
    id: 'description',
    content: (data) => data.description as string,
  },
  // og
  {
    id: 'og:url',
    content: (data) => data.openGraph?.url,
  },
  {
    id: 'og:title',
    content: (data) => data.openGraph?.title as string,
  },
  {
    id: 'og:description',
    content: (data) => data.openGraph?.description as string,
  },
  {
    id: 'og:image',
    content: (data) => (data.openGraph?.images as any[])?.[0]?.url,
  },
  // twitter
  {
    id: 'twitter:card',
    content: (data) => (data.twitter as any)?.card,
  },
  {
    id: 'twitter:title',
    content: (data) => data.twitter?.title,
  },
  {
    id: 'twitter:description',
    content: (data) => data.twitter?.description,
  },
  {
    id: 'twitter:image',
    content: (data) => (data.twitter as any)?.images?.[0]?.url,
  },
]

interface OpenGraphTableProps {
  data?: SEOMetadata
}

const OpenGraphTable = ({ data }: OpenGraphTableProps) => {
  return (
    <dl className="rounded-sm border">
      {rows.map((row, index) => {
        const content = data ? row.content(data) : null
        const missing = data?.missing.includes(row.id)
        const warning = data?.warnings.includes(row.id)
        const description = ogTags.find((item) => item.name === row.id)?.description
        const docs = ogTags.find((item) => item.name === row.id)?.docs

        return (
          <div
            key={row.id}
            className={cn(
              'flex items-center justify-between border-b text-sm',
              !content && 'flex-col items-start',
              index === rows.length - 1 && 'border-b-0',
            )}
          >
            <dt
              className={cn(
                'flex w-[175px] flex-none items-center gap-1.5 text-nowrap p-4 text-base font-normal',
                !content && 'pb-0',
              )}
            >
              {missing ? <i className="i-ri-alert-line size-4 text-red-500" /> : null}
              {warning ? <i className="i-ri-error-warning-line size-4 text-yellow-500" /> : null}
              {row.id}
            </dt>

            <dd className={cn('text-muted-foreground flex-1 p-4 text-left font-mono', !content && 'w-full')}>
              <div className="line-clamp-2">{content}</div>
              {missing || warning ? (
                <div className="bg-secondary/50 overflow-hidden rounded-sm p-4">
                  {description ? <span>{description}</span> : null}
                  {docs ? (
                    <div className="mt-1 overflow-hidden">
                      <a
                        className="inline-block max-w-full truncate text-blue-500 hover:underline"
                        href={docs}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {docs}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export default OpenGraphTable
