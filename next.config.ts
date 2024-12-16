import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/xpm',
  experimental: {
    serverActions: {
      allowedOrigins: ['demo.tecnotree.com', 'localhost:5200'],
    },
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://demo.tecnotree.com',
  },
}

export default withPayload(nextConfig)
