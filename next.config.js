/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
};

module.exports = nextConfig;
