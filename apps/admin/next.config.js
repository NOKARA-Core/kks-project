/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["postgres"],
  transpilePackages: ["@repo/database", "@repo/ui"],
};

export default nextConfig;
