const { withNextDevtools } = require('@next-devtools/core/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = { env: { FROM: 'next.config.js' } }

module.exports = withNextDevtools(nextConfig)
