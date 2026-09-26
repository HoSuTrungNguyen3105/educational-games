import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'eduplay-icon.svg', 'eduplay-icon-192x192.png', 'eduplay-icon-512x512.svg', 'eduplay-logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Educational Games - Trò chơi giáo dục',
        short_name: 'EduGames',
        description: 'Nền tảng trò chơi giáo dục tương tác cho học sinh - Học mà chơi, chơi mà giỏi!',
        theme_color: '#6C3BF5',
        background_color: '#FBF7EE',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'any',
        scope: '/educational-games/',
        start_url: '/educational-games/',
        id: '/educational-games/',
        lang: 'vi',
        dir: 'ltr',
        categories: ['education', 'games', 'entertainment'],
        launch_handler: { client_mode: 'navigate-existing' },
        handle_links: 'preferred',
        edge_side_panel: { preferred_width: 400 },
        icons: [
          {
            src: 'eduplay-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'eduplay-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'eduplay-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'eduplay-icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'eduplay-icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'banner.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Trang chủ EduPlay - Trò chơi giáo dục',
          },
        ],
        shortcuts: [
          {
            name: 'Chơi game',
            short_name: 'Chơi',
            description: 'Khám phá trò chơi giáo dục',
            url: '/educational-games/#/games',
            icons: [{ src: 'eduplay-icon-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Lớp học',
            short_name: 'Lớp',
            description: 'Xem lớp học của tôi',
            url: '/educational-games/#/profile',
            icons: [{ src: 'eduplay-icon-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        file_handlers: [],
        share_target: {
          action: '/educational-games/',
          method: 'GET',
          params: { title: 'title', text: 'text', url: 'url' },
        },
      },
      workbox: {
        importScripts: ['firebase-messaging-sw.js'],
        globPatterns: ['**/*.{js,css,html}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globIgnores: [
          '**/games/**',
          '**/game/**',
          '**/*.mp3',
          '**/*.wav',
          '**/*.ogg',
          '**/*.mp4',
          '**/*.aac',
          '**/*.m4a',
          '**/*.md',
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwindcss-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
  base: '/educational-games/',
  build: {
    target: 'es2020',
    // Bỏ bước tính gzip size cho từng chunk → build nhanh hơn
    reportCompressedSize: false,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
})
