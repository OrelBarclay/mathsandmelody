import type { NextConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/a/**',
      }, 
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          }
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          }
        ],
      },
      {
        source: '/__/auth/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          }
        ],
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mathsandmelodyacademy.com',
          },
        ],
        destination: 'https://www.mathsandmelodyacademy.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mathsandmelody--mathandmelody-a677f.us-central1.hosted.app',
          },
        ],
        destination: 'https://www.mathsandmelodyacademy.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
