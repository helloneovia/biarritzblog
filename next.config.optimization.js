/**
 * Next.js Configuration for SEO Optimization
 * 
 * This file contains SEO-related configurations:
 * - Image optimization
 * - Compression
 * - Security headers
 * - Sitemap generation
 */

module.exports = {
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Security Headers for SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect old URLs to new ones if needed
      // Example:
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true, // 301 redirect
      // }
    ]
  },

  // Rewrites for clean URLs
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite sitemap
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        // Rewrite robots.txt
        {
          source: '/robots.txt',
          destination: '/api/robots',
        }
      ]
    }
  }
}
