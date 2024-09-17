/** @type {import('next').NextConfig} */

// const pageExtensions = ['.tsx']

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });
    return config
  },
  reactStrictMode: false,
  trailingSlash: true,
  // pageExtensions,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  // Change the output directory `out` -> `dist`
  distDir: 'dist',
  // basePath: '/test-hangout',
}


module.exports = nextConfig
