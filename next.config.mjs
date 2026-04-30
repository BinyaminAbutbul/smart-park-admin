/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // השורה החדשה שצריך להוסיף
  images: {
    unoptimized: true,
  },
};

export default nextConfig;