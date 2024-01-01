const { withNextDevtools } = require('@next-devtools/core/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }

module.exports = withNextDevtools(nextConfig)
