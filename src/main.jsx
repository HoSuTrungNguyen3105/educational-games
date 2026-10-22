import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { startSchoolMissionSync } from './lib/schoolMissionSync.js'
import { gameSync } from './lib/gameSync.js'
import { armCoinWallet, loadWallet } from './lib/coinWallet.js'

createRoot(document.getElementById('root')).render(<App />)

// Gửi tiến độ "Trường Vui Vẻ" còn kẹt từ phiên offline trước, kể cả khi người
// chơi mở app ở trang khác (hàng đợi nằm trong localStorage).
startSchoolMissionSync()

// Đồng bộ kết quả chơi còn kẹt trong hàng đợi offline (GĐ5 refactor_game.md):
// gameSync tự chạy mỗi 30s và khi mạng trở lại.
gameSync.startAutoSync(30000)

// Túi tiền của game offline: mở app là gọi API lấy xu về lưu localStorage,
// phần chênh chưa gửi được (mất mạng) sẽ tự gửi lại ngay khi có mạng.
armCoinWallet()
loadWallet()

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
 *
 * iOS Safari fix: iOS không hỗ trợ clientsClaim/skipWaiting tốt như Chrome.
 * Thay vì force reload trong onNeedRefresh (có thể fail trên iOS), ta để
 * SW tự activate qua autoUpdate và reload nhẹ nhàng khi user tương tác.
 */
const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    // IOS Safari fix: KHÔNG gọi updateSW(true) force reload vì có thể fail
    // Thay vì đó, để SW tự activate qua autoUpdate (vite.config.js)
    // và reload nhẹ nhàng khi user tương tác tiếp theo.
    console.info('[PWA] Có bản cập nhật mới, sẽ áp dụng khi reload.')
    // Trên iOS, user cần đóng và mở lại app để nhận update mới
    // Đây là hành vi chuẩn của iOS PWA
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

    // iOS Safari fix: Thêm listener để tự reload khi SW mới active
    // Đây là workaround cho iOS không hỗ trợ clientsClaim tốt
    registration.addEventListener('controllerchange', () => {
      console.info('[PWA] Service Worker mới đã active, reload nhẹ...')
      // Reload trang để apply SW mới
      window.location.reload()
    })
  },

  onRegisterError(err) {
    console.error('[PWA] Đăng ký Service Worker thất bại:', err)
  },
})
