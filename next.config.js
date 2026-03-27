/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-project.supabase.co'],
  },
}

let exportedConfig = nextConfig

try {
  const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  })
  exportedConfig = withPWA(nextConfig)
} catch (e) {
  console.warn('next-pwa not found, running without PWA support')
}

module.exports = exportedConfig
