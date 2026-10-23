import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { startSchoolMissionSync } from './lib/schoolMissionSync.js'
import { gameSync } from './lib/gameSync.js'
import { armCoinWallet, loadWallet } from './lib/coinWallet.js'
import { updateSW } from './lib/pwaUpdate.js'

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
updateSW(true)