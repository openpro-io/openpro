/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
