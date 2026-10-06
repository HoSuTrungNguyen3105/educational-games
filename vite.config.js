import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cleanup-dist',
      closeBundle() {
        const folders = ['dist/farmgame', 'dist/games', 'dist/src/games'];
        folders.forEach(f => {
          const p = path.resolve(__dirname, f);
          if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
        });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      // Đăng ký SW thủ công trong src/main.jsx để kiểm soát chặt chẽ.
      // Mặc định 'auto' tự chèn thêm 1 script vào index.html -> đăng ký 2 lần.
      injectRegister: false,
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
        // Dọn cache Workbox cũ không còn dùng sau mỗi lần deploy (mục 4).
        // Không có dòng này thì cache tích tụ theo từng phiên bản.
        cleanupOutdatedCaches: true,
        // SW mới phải chiếm quyền (clientsClaim) các tab đang mở, nếu không
        // tab cũ vẫn chạy SW cũ tới lần F12/đóng tab kế tiếp -> user thấy
        // bản cũ dù deploy đã lên (đúng triệu chứng mục 14 mô tả).
        clientsClaim: true,
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
            // ── HTML GAME / TEMPLATE ĐỘNG (mục 6, 9, 10, 18) ─────────────
            // Admin sửa HTML trên Storage/API là người dùng phải nhận bản mới
            // NGAY, không cần build lại frontend. Vì vậy tuyệt đối KHÔNG dùng
            // CacheFirst cho nhóm này — chỉ dùng cache khi mất mạng.
            //
            // Khớp được mọi nguồn HTML động của hệ thống:
            //   · Firebase : https://firebasestorage.googleapis.com/.../x.html?alt=media
            //   · R2 / CDN  : https://pub-xxx.r2.dev/templates/x.html
            //   · API       : https://api.hiweb.vn/templates/x.html
            //   · Cùng origin: /educational-games/index.html
            //
            // Phải khai trước rule /\/api\/.* bên dưới vì Workbox dừng ở
            // rule khớp đầu tiên.
            urlPattern: /\.html?(\?.*)?$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'game-html-cache',
              cacheableResponse: { statuses: [0, 200] },
              // Online: luôn chờ mạng tối đa 5s để lấy HTML mới nhất.
              // Quá 5s (mạng chậm/yếu) thì dùng bản cache để game vẫn mở được.
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 24 * 7,
                purgeOnQuotaError: true,
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              // Danh sách game / cấu hình đổi thường xuyên — cache ngắn lại
              // để trang chủ và trang cấu hình không bị kẹt dữ liệu cũ.
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 10 },
              cacheableResponse: { statuses: [0, 200] },
              // 15s là quá dài: người dùng sẽ nhận dữ liệu cũ khi mạng chậm.
              // 5s đủ để đọc, quá ngưỡng thì fallback cache cho chịu mạng yếu.
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
