/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standard output - works better with Docker
  output: "standalone",

  // Force SWC transpiler instead of Babel for Next.js font loader compatibility
  // This is important when a babel config exists in the project
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
