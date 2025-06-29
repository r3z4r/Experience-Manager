import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/xpm',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/xpm',
  experimental: {
    serverActions: {
      allowedOrigins: (process.env.ALLOWED_ORIGINS || 'demo.tecnotree.com,localhost:5200').split(
        ',',
      ),
      bodySizeLimit: '10mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'demo.tecnotree.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://demo.tecnotree.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  },
  output: 'standalone' as const,
}

export default withPayload(nextConfig)
