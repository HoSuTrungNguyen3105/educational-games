// Tự động cập nhật bản build mới phía client.
//
// Vì sao cần: app deploy tĩnh lên GitHub Pages (không đặt được header
// no-cache tuỳ ý) + service worker precache toàn bộ JS/CSS/HTML, nên sau
// mỗi lần deploy người dùng rất dễ kẹt ở bản cũ — trước đây phải tự bấm
// nút "Xóa cache" trong Cài đặt. Cơ chế ở đây thay việc đó:
//   1. Mỗi lần build, Vite sinh dist/version.json chứa build id của bản
//      build (plugin 'build-version-file' trong vite.config.js) và nhúng
//      cùng build id vào bundle qua define __BUILD_ID__. version.json
//      KHÔNG khớp glob precache của Workbox (chỉ js/css/html) nên SW
//      không cache nó — fetch là ra thẳng server.
//   2. Khi app khởi động và mỗi lần tab quay lại foreground, client fetch
//      version.json (cache: 'no-store' + query chống cache) rồi so build
//      id với bản đang chạy.
//   3. Lệch nhau → dọn cache + huỷ đăng ký SW (đúng trình tự của nút
//      "Xóa cache" thủ công — hàm clearAppCaches dùng chung bên dưới)
//      rồi reload để lấy bản mới. sessionStorage ghi dấu build id đích
//      đã reload: mỗi build id chỉ tự reload tối đa 1 lần trong một
//      phiên tab, chống vòng lặp khi server chưa cập nhật kịp.
//   Version khớp hoặc fetch lỗi (mất mạng) → im lặng, không reload,
//   không thông báo.

export const CURRENT_BUILD_ID =
  typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'

// Cho phép kiểm chứng từ console/harness: bản đang chạy là build nào.
if (typeof window !== 'undefined') {
  window.__EDUPLAY_BUILD_ID__ = CURRENT_BUILD_ID
}

const RELOAD_MARK_KEY = 'eduplay_autoupdate_reloaded_for'
const MIN_CHECK_INTERVAL_MS = 30 * 1000

/**
 * Dọn toàn bộ Cache Storage + huỷ đăng ký mọi service worker — đúng
 * trình tự nút "Xóa cache" thủ công ở HomeScreen vẫn làm. Cả nút thủ
 * công lẫn luồng tự cập nhật đều gọi hàm này, không viết trùng logic.
 * Không đụng localStorage: hai khoá gq_pwa_closed/gq_sound là tuỳ chọn
 * riêng của thao tác thủ công, bản tự cập nhật không được reset chúng.
 */
export async function clearAppCaches() {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))
  }
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    )
  }
}

async function fetchRemoteBuildId() {
  const base = import.meta.env.BASE_URL || '/'
  const res = await fetch(`${base}version.json?ts=${Date.now()}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`version.json HTTP ${res.status}`)
  const data = await res.json()
  return typeof data?.buildId === 'string' && data.buildId
    ? data.buildId
    : null
}

let checking = false
let lastCheckAt = 0

/**
 * Kiểm tra bản mới một lần. Trả về true nếu đã kích hoạt reload.
 * Có chống dồn dập: tối thiểu MIN_CHECK_INTERVAL_MS giữa hai lần fetch
 * (trừ lần kiểm tra đầu tiên khi khởi động, force = true).
 */
export async function checkForAppUpdate({ force = false } = {}) {
  if (!import.meta.env.PROD) return false
  if (checking) return false
  const now = Date.now()
  if (!force && now - lastCheckAt < MIN_CHECK_INTERVAL_MS) return false
  checking = true
  lastCheckAt = now
  try {
    const remoteBuildId = await fetchRemoteBuildId()
    if (!remoteBuildId || remoteBuildId === CURRENT_BUILD_ID) return false

    // Chống vòng lặp reload: build id đích này đã từng kích hoạt reload
    // trong phiên tab hiện tại thì không reload nữa — server có thể chưa
    // kịp cập nhật version.json, hoặc lần reload trước chưa lấy được
    // bản mới; cứ để phiên sau/tab mới thử lại.
    let alreadyReloadedFor = null
    try {
      alreadyReloadedFor = sessionStorage.getItem(RELOAD_MARK_KEY)
    } catch {
      /* sessionStorage không khả dụng — bỏ qua dấu, vẫn tiếp tục */
    }
    if (alreadyReloadedFor === remoteBuildId) return false
    try {
      sessionStorage.setItem(RELOAD_MARK_KEY, remoteBuildId)
    } catch {
      /* Không ghi được dấu thì vẫn cập nhật lần này; rủi ro lặp được
         chặn thêm bởi throttle + việc version sẽ khớp sau reload. */
    }

    console.info(
      `[AppUpdate] Có bản mới (${CURRENT_BUILD_ID} → ${remoteBuildId}); dọn cache và tải lại…`,
    )
    await clearAppCaches()
    window.location.reload()
    return true
  } catch {
    // Mất mạng / server chưa có version.json → bỏ qua im lặng, lần
    // foreground kế tiếp sẽ thử lại.
    return false
  } finally {
    checking = false
  }
}

let started = false

/** Gắn bộ theo dõi: kiểm tra ngay khi khởi động + mỗi lần tab hiện lại. */
export function startAppUpdateWatcher() {
  if (started || typeof window === 'undefined') return
  started = true
  checkForAppUpdate({ force: true })
  const onForeground = () => {
    if (document.visibilityState === 'hidden') return
    checkForAppUpdate()
  }
  document.addEventListener('visibilitychange', onForeground)
  window.addEventListener('focus', onForeground)
}
