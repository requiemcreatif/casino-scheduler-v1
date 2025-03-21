/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standard output - works better with Docker
  output: "standalone",

  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
