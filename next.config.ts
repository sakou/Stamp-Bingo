import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 画像最適化
  images: {
    domains: ['instagram.com', 'x.com', 'tiktok.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // 実験的機能
  experimental: {
    typedRoutes: true,
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/events',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
