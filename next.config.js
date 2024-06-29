/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "web.raimax.bet",
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
