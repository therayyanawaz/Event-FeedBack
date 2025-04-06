/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
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
}

module.exports = nextConfig 