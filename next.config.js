const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Cache game pages (HTML)
    {
      urlPattern: /^https?:\/\/.*\/games\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'nova-game-pages',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    // Cache 3D assets (GLB/GLTF) — CacheFirst for offline play
    {
      urlPattern: /\.(?:glb|gltf)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nova-3d-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache audio files — CacheFirst for offline play
    {
      urlPattern: /\.(?:mp3|ogg|wav)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nova-audio',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache images and textures
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|svg|ktx2|basis)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nova-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache JS/CSS bundles
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'nova-static-resources',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nova-google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    config.module.rules.push({
      test: /\.(mp3|ogg|wav)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = withPWA(nextConfig);
