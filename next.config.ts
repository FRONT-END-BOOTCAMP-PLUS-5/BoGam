/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
          { key: 'Access-Control-Allow-Credentials', value: 'false' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mblogthumb-phinf.pstatic.net', // 네이버 블로그 이미지 (6-1 단계 내용증명)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibbiu.com', // 등기부등본 샘플 이미지 (6-2 단계 임차권등기명령)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1tgonli21s4df.cloudfront.net', // CloudFront 이미지 (6-3 단계 지급명령서)
        port: '',
        pathname: '/**',
      },
      
    ],
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

module.exports = withPWA(nextConfig);
