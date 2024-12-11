import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/xpm',
}

export default withPayload(nextConfig)
