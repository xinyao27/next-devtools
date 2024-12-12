import type { Metadata } from 'next/dist/types'
import type { WithContext } from 'schema-dts'

// Simplified from the type of nextjs metadata
export interface SEOMetadata extends Metadata {
  missing: string[]
  warnings: string[]
  jsonLd?: WithContext<any>[]

  /**
   * Determine the name from multiple sources, including:
   * - WebSite structured data - https://json-ld.org/
   * - <title>
   * - <h1>
   * - og:size_name
   */
  name?: string
}
