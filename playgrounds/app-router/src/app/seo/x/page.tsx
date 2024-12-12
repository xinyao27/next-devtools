import type { Metadata } from 'next'

const TITLE = 'Next.js 15.1 | Next.js'
const DESCRIPTION =
  'Next.js 15.1 introduces React 19 stable support, improved error debugging, new experimental authorization APIs, and more.'
const BASE_URL = 'https://nextjs.org'
const IMAGE_URL = 'https://nextjs.org/static/blog/next-15-1/twitter-card.png'

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,

    // Basic metadata
    authors: [{ name: 'Delba de Oliveira' }, { name: 'Jimmy Lai' }, { name: 'Rich Haines' }],

    // OpenGraph
    openGraph: {
      title: TITLE,
      siteName: 'OG siteName',
      description: DESCRIPTION,
      url: `${BASE_URL}/blog/next-15-1`,
      images: [
        {
          url: IMAGE_URL,
        },
      ],
      type: 'article',
      publishedTime: '2024-12-10T20:00:00.000Z',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: [
        {
          url: IMAGE_URL,
          alt: 'Next.js 15',
        },
        {
          url: IMAGE_URL,
          alt: 'Next.js 15 - 2',
        },
      ],
    },

    // facebook
    facebook: {
      appId: '12345678',
    },

    // Other
    alternates: {
      canonical: `${BASE_URL}/blog/next-15`,
    },
    icons: {
      icon: 'https://nextjs.org/favicon.ico',
    },
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: TITLE,
    image: IMAGE_URL,
    description: DESCRIPTION,
  }
  const jsonLd2 = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: TITLE + 1111,
    image: IMAGE_URL,
    description: DESCRIPTION,
  }

  return (
    <div>
      <h1>h1Tag</h1>
      Next.js 15
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd2) }} type="application/ld+json" />
    </div>
  )
}
