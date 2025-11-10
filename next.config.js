/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   webpack: (config) => {
      config.resolve.fallback = { fs: false, os: false, path: false };
      return config;
   },
   turbopack: true
};

module.exports = nextConfig;
