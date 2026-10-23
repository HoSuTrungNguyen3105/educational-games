import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  immediate: true,

  onRegisteredSW(swUrl, registration) {
    if (!registration) return

    console.info('[PWA] Service Worker:', swUrl)

    // Kiểm tra cập nhật mỗi 60 phút
    setInterval(() => {
      registration.update().catch(() => {})
    }, 60 * 60 * 1000)
  },

  onOfflineReady() {
    console.info('[PWA] Đã sẵn sàng chạy offline.')
  },

  onRegisterError(err) {
    console.error('[PWA] Đăng ký SW thất bại:', err)
  },
})