/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-helpers", "spidgorny-react-helpers"],
  serverExternalPackages: ["bull"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
