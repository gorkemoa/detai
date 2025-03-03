/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
  },
  // Build sırasında ESLint kontrolünü devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Build sırasında TypeScript tip kontrolünü devre dışı bırak
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 