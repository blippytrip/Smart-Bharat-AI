/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: hide X-Powered-By
  compress: true, // Efficiency: enable compression
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Security
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Security
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Security
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Security
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; img-src 'self' data: https:; font-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
