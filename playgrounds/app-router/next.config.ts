import { withNextDevtools } from '@next-devtools/core/plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = { env: { FROM: 'next.config.js' } }

export default withNextDevtools(nextConfig)
