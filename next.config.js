/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Disable Edge Runtime completely for the entire application
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    esmExternals: 'loose',
    disableOptimizedLoading: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build:
      // https://github.com/vercel/next.js/issues/7755
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
  // Force all API routes to use Node.js runtime
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
}

module.exports = nextConfig 