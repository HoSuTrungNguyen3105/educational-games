import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')).render(<App />)

/**
 * Đăng ký Service Worker (mục 5 của Update_PWA.md).
 *
 * Mục tiêu: sau MỖI lần deploy, người dùng nhận frontend mới mà không phải
 * tự xoá cache. Không hiện nút "Update" — cập nhật diễn ra âm thầm.
 *
 * - immediate: kiểm tra SW ngay khi app mở, không đợi tải xong rồi mới chạy.
 * - registerType 'autoUpdate' (xem vite.config.js) khiến SW mới tự
 *   skipWaiting + clientsClaim, nên không cần bấm gì cả.
 * - Hàm 60 phút gọi reg.update() để app mở lâu (PWA cài trên máy) vẫn nhận
 *   bản mới khi user quay lại app, thay vì phải F5.
 */
const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    // Chỉ dùng khi SW chưa tự activate. Gọi updateSW(true) để chuyển ngay
    // sang SW mới và reload ứng dụng.
    updateSW(true)
  },

  onOfflineReady() {
    console.info('[PWA] Đã sẵn sàng chạy offline.')
  },

  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    console.info('[PWA] Service Worker đăng ký tại:', swUrl)
    // Nhắc lại sau mỗi 60 phút (tab PWA có thể mở cả ngày).
    setInterval(() => {
      registration.update().catch(() => {})
    }, 60 * 60 * 1000)
  },

  onRegisterError(err) {
    console.error('[PWA] Đăng ký Service Worker thất bại:', err)
  },
})
