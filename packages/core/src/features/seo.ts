// browser-only

import type { SEOMetadata } from '@next-devtools/shared/types'
import type { Facebook } from 'next/dist/lib/metadata/types/extra-types'
import type { WithContext } from 'schema-dts'

export function getSEOMetadata(route?: string): Promise<SEOMetadata> {
  return new Promise<SEOMetadata>((resolve) => {
    if (route && !window.location.pathname.includes(route)) {
      return setTimeout(() => resolve(getSEOMetadata(route)), 1000)
    }

    const result: SEOMetadata = {
      missing: [],
      warnings: [],
    }

    // Basic metadata
    function getBasicMetadata() {
      // title
      const title = document.title
      if (title) result.title = title
      else result.missing.push('title')

      // description
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
      if (description) result.description = description
      else result.missing.push('description')

      // keywords
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')
      if (keywords) result.keywords = keywords.split(',').map((k) => k.trim())

      // author
      const author = document.querySelector('meta[name="author"]')?.getAttribute('content')
      const authorLink = document.querySelector('link[rel="author"]')?.getAttribute('href')
      if (author || authorLink) {
        result.authors = [
          {
            name: author || '',
            url: authorLink || '',
          },
        ]
      }
    }

    // Open Graph - https://ogp.me/
    function getOpenGraphData() {
      const og: Record<string, any> = {}

      // images is a array of objects -
      const images: Record<string, string>[] = []
      const ogTags = document.querySelectorAll('[property^="og:"]')
      ogTags.forEach((tag) => {
        const property = tag.getAttribute('property')?.replace('og:', '')
        const content = tag.getAttribute('content')
        if (property && content) {
          if (property.startsWith('image')) {
            const [, prop] = property.split(':')
            const image: Record<string, string> = prop ? images.at(-1) || { url: content } : { url: content }
            if (prop) {
              image[prop] = content
            }
            if (!prop) {
              images.push(image)
            }
          } else {
            og[property] = content
          }
        }
      })
      if (images.length > 0) {
        og.images = images
      }

      // music
      const musicTags = document.querySelectorAll('[property^="music:"]')
      if (musicTags.length > 0) {
        musicTags.forEach((tag) => {
          const property = tag.getAttribute('property')?.replace('music:', '')
          const content = tag.getAttribute('content')
          if (property) og[property] = content
        })
      }

      // video
      const videoTags = document.querySelectorAll('[property^="video:"]')
      if (videoTags.length > 0) {
        videoTags.forEach((tag) => {
          const property = tag.getAttribute('property')?.replace('video:', '')
          const content = tag.getAttribute('content')
          if (property) og[property] = content
        })
      }

      // article
      const articleTags = document.querySelectorAll('[property^="article:"]')
      if (articleTags.length > 0) {
        articleTags.forEach((tag) => {
          const property = tag.getAttribute('property')?.replace('article:', '')
          const content = tag.getAttribute('content')
          if (property) og[property] = content
        })
      }

      // book
      const bookTags = document.querySelectorAll('[property^="book:"]')
      if (bookTags.length > 0) {
        bookTags.forEach((tag) => {
          const property = tag.getAttribute('property')?.replace('book:', '')
          const content = tag.getAttribute('content')
          if (property) og[property] = content
        })
      }

      // profile
      const profileTags = document.querySelectorAll('[property^="profile:"]')
      if (profileTags.length > 0) {
        profileTags.forEach((tag) => {
          const property = tag.getAttribute('property')?.replace('profile:', '')
          const content = tag.getAttribute('content')
          if (property) og[property] = content
        })
      }

      if (Object.keys(og).length > 0) {
        result.openGraph = og
      }
    }

    // Twitter Card
    function getTwitterData() {
      const twitter: Record<string, any> = {}
      const twitterTags = document.querySelectorAll('[name^="twitter:"]')
      const images: Record<string, string>[] = []

      twitterTags.forEach((tag) => {
        const name = tag.getAttribute('name')?.replace('twitter:', '')
        const content = tag.getAttribute('content')
        if (name && content) {
          if (name.startsWith('image')) {
            const [, prop] = name.split(':')
            const image: Record<string, string> = prop ? images.at(-1) || { url: content } : { url: content }
            if (prop) {
              image[prop] = content
            }
            if (!prop) {
              images.push(image)
            }
          } else {
            twitter[name] = content
          }
        }
      })

      if (images.length > 0) {
        twitter.images = images
      }
      if (Object.keys(twitter).length > 0) {
        result.twitter = twitter
      }
    }

    // Icon data
    function getIconsData() {
      const icons: Record<string, any> = {}
      const iconLinks = document.querySelectorAll('link[rel*="icon"]')

      iconLinks.forEach((link) => {
        const rel = link.getAttribute('rel')
        const href = link.getAttribute('href')
        if (rel && href) {
          if (rel === 'icon') {
            icons.icon = href
          } else if (rel === 'apple-touch-icon') {
            icons.apple = href
          }
        }
      })

      if (Object.keys(icons).length > 0) {
        result.icons = icons
      }
    }

    // Robots
    function getRobotsData() {
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content')
      if (robots) {
        const robotsObj: Record<string, boolean> = {}
        robots.split(',').forEach((directive) => {
          const trimmed = directive.trim()
          if (trimmed.startsWith('no')) {
            robotsObj[trimmed.replace('no', '')] = false
          } else {
            robotsObj[trimmed] = true
          }
        })
        result.robots = robotsObj
      }
    }

    // Verification
    function getVerificationData() {
      const verification: Record<string, string | string[]> = {}
      const verificationTags = document.querySelectorAll('meta[name$="-verification"]')

      verificationTags.forEach((tag) => {
        const name = tag.getAttribute('name')?.replace('-verification', '')
        const content = tag.getAttribute('content')
        if (name && content) {
          verification[name] = content
        }
      })

      if (Object.keys(verification).length > 0) {
        result.verification = verification
      }
    }

    // Facebook
    function getFacebookData() {
      const fbAppId = document.querySelector('meta[property="fb:app_id"]')?.getAttribute('content')
      const fbAdmins = document.querySelector('meta[property="fb:admins"]')?.getAttribute('content')

      if (fbAppId || fbAdmins) {
        result.facebook = {} as Facebook
        if (fbAppId) result.facebook.appId = fbAppId
        if (fbAdmins) result.facebook.admins = [fbAdmins]
      }
    }

    // JSON-LD
    function getJSONLDData() {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')

      scripts.forEach((script) => {
        const jsonRaw = (script.textContent as string) ?? '{}'
        const json = JSON.parse(jsonRaw) as WithContext<any>
        if (!result.jsonLd) result.jsonLd = []
        result.jsonLd.push(json)
      })
    }

    /**
     * name
     * Determine the name from multiple sources, including:
     * - WebSite structured data - https://json-ld.org/
     * - <title>
     * - <h1>
     * - og:size_name
     */
    function getName() {
      const jsonLd = result.jsonLd?.find((json) => json.name)
      if (jsonLd?.name) {
        result.name = jsonLd.name
        return
      }
      const titleTag = document.querySelector('title')?.textContent
      if (titleTag) {
        result.name = titleTag
        return
      }
      const h1Tag = document.querySelector('h1')?.textContent
      if (h1Tag) {
        result.name = h1Tag
        return
      }
      const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
      if (ogSiteName) {
        result.name = ogSiteName
      }
    }

    // Run all checks
    getBasicMetadata()
    getOpenGraphData()
    getTwitterData()
    getIconsData()
    getRobotsData()
    getVerificationData()
    getFacebookData()
    getJSONLDData()
    getName()

    // Check the necessary OpenGraph data
    if (result.openGraph) {
      if (!('url' in result.openGraph)) {
        result.warnings.push('og:url')
      }
      if (!('title' in result.openGraph)) {
        result.warnings.push('og:title')
      }
      if (!('description' in result.openGraph)) {
        result.warnings.push('og:description')
      }
      if (!('images' in result.openGraph)) {
        result.warnings.push('og:image')
      }
      ;(result.openGraph.images as any[])?.forEach((image) => {
        if (!('url' in image)) {
          result.warnings.push('og:image')
        }
      })
    } else {
      result.warnings.push(...['og:url', 'og:title', 'og:description', 'og:image'])
    }

    // Check the necessary Twitter Card data
    if (result.twitter) {
      if (!('card' in result.twitter)) {
        result.missing.push('twitter:card')
      }
    } else {
      result.warnings.push(...['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'])
    }

    return resolve(result)
  })
}
