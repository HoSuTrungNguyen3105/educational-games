import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/admin.css'
import App from './App.jsx'
import { startSchoolMissionSync } from './lib/schoolMissionSync.js'
import { gameSync } from './lib/gameSync.js'
import { armCoinWallet, loadWallet } from './lib/coinWallet.js'
import { updateSW } from './lib/pwaUpdate.js'
import { startAppUpdateWatcher } from './lib/appUpdate.js'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'
import { installPreloadErrorHandler } from './lib/chunkRecovery.js'

// Bắt sự kiện vite:preloadError (Vite phát khi preload của dynamic
// import lỗi) — đi chung đường tự khôi phục của AppErrorBoundary:
// còn lượt thì tự tải lại 1 lần, hết lượt thì lỗi ném vào boundary.
installPreloadErrorHandler()

// Boundary ngoài cùng: đỡ cả lỗi phát sinh ngay khi App render lần đầu,
// để app không bao giờ trắng trang (boundary theo route nằm trong App).
createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
)

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
updateSW(true)

// Tự phát hiện bản build mới sau mỗi lần deploy (version.json) và tự
// dọn cache + tải lại, khỏi cần người dùng bấm nút "Xóa cache" thủ công.
startAppUpdateWatcher()