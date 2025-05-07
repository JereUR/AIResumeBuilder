import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "7to32hh3fmdbb3jf.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
