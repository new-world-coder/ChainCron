/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Handle potential module resolution issues
    if (!isServer) {
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
    }
    
    // Handle pino-pretty module resolution
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': require.resolve('pino-pretty'),
      }
    } catch (error) {
      // Fallback if pino-pretty is not found
      console.warn('pino-pretty not found, using fallback')
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      }
    }
    
    // Handle @react-native-async-storage/async-storage module resolution
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': require.resolve('@react-native-async-storage/async-storage'),
      }
    } catch (error) {
      // Fallback mock for async-storage if not found
      console.warn('@react-native-async-storage/async-storage not found, using mock')
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
      }
    }
    
    // Add externals for server-side rendering
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'pino-pretty': 'commonjs pino-pretty',
        '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      })
    }
    
    // Ignore WalletConnect warnings
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found: Can't resolve '@react-native-async-storage\/async-storage'/,
      /Module not found: Can't resolve 'pino-pretty'/,
    ]
    
    return config
  },
  // Add headers to handle CORS and WebSocket issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
