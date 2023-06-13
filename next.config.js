/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH || "",
  output: 'export',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true, // For the time being
  },
  transpilePackages: [
    'swagger-ui-react',
    'swagger-client',
    'react-syntax-highlighter',
  ],
}

module.exports = nextConfig
