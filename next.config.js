/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This ensures better client-side performance
  swcMinify: true,
  experimental: {
    // This will make all pages client-side rendered by default
    appDir: true,
  }
}

module.exports = nextConfig
