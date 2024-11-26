import { withNextDevtools } from '@next-devtools/core/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { FROM: 'next.config.mjs' },
}

export default withNextDevtools(nextConfig)
