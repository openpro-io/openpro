/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
