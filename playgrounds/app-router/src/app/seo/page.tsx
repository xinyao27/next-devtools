import type { Metadata } from 'next'

const SITE_NAME = 'Chicken Garden Paradise'
const SITE_DESC =
  'Discover the joy of backyard chicken farming and organic gardening. Learn how to create your perfect garden sanctuary.'
const BASE_URL = 'https://www.chickengarden.paradise'
const DEFAULT_IMAGE = `/banner.jpg`

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: BASE_URL,
    },
    authors: [{ name: 'Garden Paradise LLC' }],
    description: SITE_DESC,
    icons: {
      apple: '/icon.png',
      icon: '/favicon.ico',
    },
    keywords: ['chicken farming', 'organic gardening', 'sustainable living', 'backyard gardens'],

    // Open Graph
    openGraph: {
      description: SITE_DESC,
      images: [
        {
          alt: 'Chicken Garden Paradise Banner',
          height: 630,
          url: DEFAULT_IMAGE,
          width: 1200,
        },
        'https://picsum.photos/300/200',
      ],
      locale: 'en_US',
      siteName: SITE_NAME,
      title: SITE_NAME,
      type: 'website',
      url: BASE_URL,
    },

    // other
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
    },

    themeColor: '#4ade80',
    title: SITE_NAME,
    // Twitter
    twitter: {
      card: 'summary',
      // images: [DEFAULT_IMAGE],
      creator: '@ChickenGarden',
      description: SITE_DESC,
      title: SITE_NAME,
    },
    viewport: {
      initialScale: 1,
      width: 'device-width',
    },
  }
}

export default function Page() {
  return <h1>SEO</h1>
}
