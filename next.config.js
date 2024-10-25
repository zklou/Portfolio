/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

// next.config.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? '/Portfolio/' : '',
  basePath: isProd ? '/Portfolio' : '',
  output: 'export',
  trailingSlash: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      // 如果有其他页面，按照如下格式添加：
      // '/about': { page: '/about' },
      // '/contact': { page: '/contact' },
    };
  },
  images: {
    unoptimized: true, // 禁用图片优化
  },
};
