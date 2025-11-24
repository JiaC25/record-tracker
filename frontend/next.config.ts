import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Rewrite rule to proxy API requests to backend server during development
  // This allows the frontend to call /api/* without worrying about CORS
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "http://localhost:5000/api/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
