import type { NextConfig } from 'next'

import { withNextDevtools } from '@next-devtools/core/plugin'

const nextConfig: NextConfig = {
  env: { FROM: 'next.config.js' },
}

export default withNextDevtools(nextConfig)
