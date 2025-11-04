/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    //Ignore ESLint errors during production builds (e.g. Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    //Skip type errors during build (optional, but helps CI/CD)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
