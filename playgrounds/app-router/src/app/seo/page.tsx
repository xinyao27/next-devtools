import type { Metadata } from 'next'

const SITE_NAME = 'Chicken Garden Paradise'
const SITE_DESC =
  'Discover the joy of backyard chicken farming and organic gardening. Learn how to create your perfect garden sanctuary.'
const BASE_URL = 'https://www.chickengarden.paradise'
const DEFAULT_IMAGE = `/banner.jpg`

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SITE_NAME,
    description: SITE_DESC,
    keywords: ['chicken farming', 'organic gardening', 'sustainable living', 'backyard gardens'],
    authors: [{ name: 'Garden Paradise LLC' }],
    themeColor: '#4ade80',

    // Open Graph
    openGraph: {
      type: 'website',
      url: BASE_URL,
      title: SITE_NAME,
      description: SITE_DESC,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Chicken Garden Paradise Banner',
        },
        'https://picsum.photos/300/200',
      ],
      locale: 'en_US',
    },

    // Twitter
    twitter: {
      card: 'summary',
      title: SITE_NAME,
      description: SITE_DESC,
      // images: [DEFAULT_IMAGE],
      creator: '@ChickenGarden',
    },

    // other
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/icon.png',
    },
    alternates: {
      canonical: BASE_URL,
    },
  }
}

export default function Page() {
  return <h1>SEO</h1>
}
