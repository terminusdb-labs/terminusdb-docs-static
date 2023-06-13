/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "docs2",
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
