import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 
 * Enhanced Next.js Configuration for Production Stability
 * Includes comprehensive webpack optimizations and error handling
 * 
 * @type {import('next').NextConfig}
 * @author Revenue Management System
 * @version 2.1.0
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  /**
   * Webpack Configuration for Module Resolution and Optimization
   * Prevents module not found errors and improves build stability
   */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enhanced module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }

    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          recharts: {
            test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
            name: 'recharts',
            priority: 10,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            priority: 5,
            chunks: 'all',
          },
        },
      }
    }

    // Add webpack plugins for better error handling
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.BUILD_ID': JSON.stringify(buildId),
      })
    )

    // Improve module resolution
    config.resolve.modules = ['node_modules', ...config.resolve.modules]
    
    // Add alias for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }

    return config
  },

  /**
   * Build optimization settings
   */
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  /**
   * Error handling and logging
   */
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  /**
   * Production optimizations
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  /**
   * Headers for better caching and security
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  /**
   * Redirects for better SEO and UX
   */
  async redirects() {
    return []
  },

  /**
   * Environment variables validation
   */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
}

export default nextConfig
