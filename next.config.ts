<<<<<<< HEAD
// import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default {
  ...nextConfig,
  images: {
    domains: ['images.pexels.com', 'm.media-amazon.com'],
  },
};
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
>>>>>>> d5fc395
