const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: { formats: ['image/webp'], deviceSizes: [360, 720], imageSizes: [128, 256] },
};
module.exports = nextConfig;
