/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://maxbet247.ng"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "maxbet247.ng",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "sports-api.sportsbookengine.com",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
