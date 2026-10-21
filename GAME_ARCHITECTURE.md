# Kiến trúc Game Offline/Online cho EduPlay

## Tổng quan

Hệ thống EduPlay đã được nâng cấp để hỗ trợ cả game offline và online với cơ chế cache, đồng bộ và cập nhật tự động. Document này mô tả kiến trúc và cách sử dụng.

## Các thành phần chính

### 1. Manifest Game (`src/games/offline/games-src/manifest.js`)

Danh sách game offline với metadata đầy đủ:

```javascript
{
  id: 'math',              // ID duy nhất của game
  name: 'Săn Trái Cây',    // Tên hiển thị
  icon: '🍓',              // Emoji icon
  tag: 'Arcade',           // Tag phân loại
  grad: 'from-orange-400 to-amber-500', // Gradient màu
  engine: 'single',        // Loại engine
  file: 'src/games/offline/math.html', // Path file HTML
  type: 'play-to-learn',   // Mục đích game
  playMode: 'offline',     // Chế độ chơi
  version: 1               // Phiên bản
}
```

**Thuộc tính mới:**
- `type`: Mục đích game (`play-to-learn` hoặc `play-to-win`)
- `playMode`: Chế độ vận hành (`offline` hoặc `online`)
- `version`: Phiên bản hiện tại của game

> **Lưu ý (server):** Trên document game của backend, `playMode` đang mang
> nghĩa lớp học (`solo` / `classroom`) và đã có từ trước, nên refactor_game.md
> mục 4 dùng field riêng **`deliveryMode`** (`offline` / `online`) để biểu thị
> cách tải dữ liệu. `deliveryMode` mặc định `online` với dữ liệu cũ; game HTML
> offline do `scripts/sync-html-games.mjs` tạo ra mang `deliveryMode: "offline"`.
> Manifest client ở `src/games/offline/` vẫn dùng `playMode: "offline"` vì đó
> là catalog tĩnh riêng của trang `/offline/:id`.

### 2. Services Layer

#### `gameDataService.js` - Quản lý dữ liệu game

```javascript
import { gameDataService } from './services/gameDataService.js';

// Lấy danh sách game
const games = await gameDataService.list({ type: 'play-to-learn', playMode: 'offline' });

// Lấy thông tin game
const game = await gameDataService.get('math');

// Lấy data JSON của game
const data = await gameDataService.getData('math');

// Kiểm tra phiên bản mới nhất
const versionInfo = await gameDataService.getVersion('math');
// { version: 5, publishedAt: '2026-10-20T10:00:00Z' }
```

#### `gameVersionService.js` - Quản lý phiên bản game

```javascript
import { gameVersionService } from './services/gameVersionService.js';

// Subscribe để nhận thông báo cập nhật
const unsubscribe = gameVersionService.subscribe('math', (versionInfo) => {
  console.log('Có phiên bản mới:', versionInfo);
});

// Kiểm tra thủ công
const hasUpdate = await gameVersionService.checkForUpdate('math', 4);

// Xử lý WebSocket event
gameVersionService.handleWebSocketEvent({
  event: 'game.version.updated',
  templateId: 'math',
  version: 5
});

// Hủy subscribe
unsubscribe();
```

#### `gameResultService.js` - Quản lý kết quả game

```javascript
import { gameResultService } from './services/gameResultService.js';

// Gửi kết quả game
await gameResultService.submit({
  attemptId: 'unique-attempt-id',
  templateId: 'math',
  gameVersion: 4,
  score: 80,
  details: { timeTaken: 120, correctAnswers: 8 }
});

// Lấy số lượng kết quả đang chờ đồng bộ
const pendingCount = gameResultService.getPendingCount();

// Đồng bộ thủ công
const result = await gameResultService.syncPendingResults();
// { success: 5, failed: 0 }

// Xóa kết quả đang chờ
gameResultService.clearPendingResults();
```

### 3. IndexedDB Cache (`src/lib/gameCache.js`)

Module quản lý cache dữ liệu game trong IndexedDB:

```javascript
import { gameCache } from './lib/gameCache.js';

// Lưu data game vào cache
await gameCache.save('math', gameData, 5);

// Lấy data từ cache
const data = await gameCache.get('math');

// Kiểm tra xem có trong cache không
const hasCache = await gameCache.has('math');

// Xóa cache
await gameCache.delete('math');

// Lấy danh sách tất cả cache
const allCache = await gameCache.list();

// Lấy tổng dung lượng cache
const size = await gameCache.getSize();

// Dọn dẹp game cũ (không dùng trong 30 ngày)
await gameCache.cleanupOldGames();
```

**Tính năng:**
- Tự động dọn dẹp khi vượt quá 50MB
- Giữ lại 80% dung lượng khi dọn dẹp
- Tự động xóa game cũ sau 30 ngày
- Hỗ trợ versioning

### 4. Game Sync (`src/lib/gameSync.js`)

Module quản lý đồng bộ kết quả offline:

```javascript
import { gameSync } from './lib/gameSync.js';

// Bắt đầu đồng bộ tự động (mỗi 30 giây)
gameSync.startAutoSync(30000);

// Dừng đồng bộ tự động
gameSync.stopAutoSync();

// Đồng bộ ngay lập tức
const result = await gameSync.sync();
// { success: 5, failed: 0, total: 5 }

// Lấy trạng thái đồng bộ
const status = gameSync.getStatus();
// { isSyncing: false, pendingCount: 2, currentRetryDelay: 5000 }

// Force sync
await gameSync.forceSync();

// Xóa tất cả kết quả đang chờ
gameSync.clearPending();
```

**Tính năng:**
- Tự động đồng bộ khi có mạng trở lại
- Retry logic với exponential backoff
- Giới hạn số lần retry (tối đa 10 lần)
- Tự động bắt đầu khi trang tải xong

### 5. React Hooks

#### `useGameData.js` - Hook quản lý dữ liệu game

```javascript
import { useGameData } from './hooks/useGameData.js';

function GameComponent({ gameId }) {
  const {
    data,           // Dữ liệu game
    version,        // Phiên bản hiện tại
    loading,        // Đang tải
    error,          // Lỗi (nếu có)
    source,         // Nguồn dữ liệu ('cache' | 'api')
    reload,         // Hàm tải lại
    updateData,     // Hàm cập nhật data
    clearCache,     // Hàm xóa cache
  } = useGameData(gameId, { playMode: 'offline' });

  if (loading) return <Loader />;
  if (error) return <Error />;

  return <Game data={data} />;
}
```

#### `useGameVersion.js` - Hook quản lý phiên bản game

```javascript
import { useGameVersion } from './hooks/useGameVersion.js';

function GameComponent({ gameId, currentVersion }) {
  const {
    latestVersion,    // Phiên bản mới nhất
    hasUpdate,        // Có cập nhật không
    checking,         // Đang kiểm tra
    lastChecked,      // Thời gian kiểm tra lần cuối
    checkForUpdate,   // Hàm kiểm tra thủ công
    markAsUpdated,    // Đánh dấu đã cập nhật
  } = useGameVersion(gameId, currentVersion);

  if (hasUpdate) {
    return <UpdateNotification onUpdate={handleUpdate} />;
  }

  return <Game />;
}
```

### 6. GameVersionProvider

Provider để quản lý kiểm tra phiên bản tự động:

```javascript
import { GameVersionProvider } from './components/GameVersionProvider.jsx';

function App() {
  return (
    <GameVersionProvider>
      {/* App content */}
    </GameVersionProvider>
  );
}
```

**Tính năng:**
- Kiểm tra phiên bản định kỳ (mỗi 5 phút)
- Lắng nghe WebSocket events
- Tự động khởi động khi mount
- Tự động dừng khi unmount

## Luồng hoạt động

### Game Offline

1. **Lần đầu mở game (có mạng):**
   - Frontend tải data từ API
   - Lưu vào IndexedDB cache
   - Hiển thị game

2. **Lần sau mở game (có mạng):**
   - Frontend kiểm tra cache trước
   - Nếu có cache, dùng ngay
   - Background kiểm tra phiên bản mới
   - Nếu có phiên bản mới, hiển thị thông báo

3. **Mở game khi mất mạng:**
   - Frontend kiểm tra cache
   - Nếu có cache, dùng ngay
   - Nếu không có cache, hiển thị thông báo cần mạng

4. **Khi có mạng trở lại:**
   - Kiểm tra phiên bản mới
   - Tải data mới nếu có
   - Cập nhật cache
   - Đồng bộ kết quả offline

### Game Online

1. **Mở game:**
   - Frontend gọi API lấy data
   - Backend xác thực và trả về data
   - Hiển thị game

2. **Khi mất mạng:**
   - Hiển thị thông báo lỗi
   - Không chuyển sang dùng cache (online cần realtime)

3. **Kết quả game:**
   - Gửi lên backend ngay
   - Nếu lỗi mạng, lưu vào hàng đợi
   - Đồng bộ khi có mạng trở lại

## Backend API cần thiết

Các endpoint cần được implement ở backend:

```
GET    /api/games                    - Lấy danh sách game
GET    /api/games/:templateId        - Lấy thông tin game
GET    /api/games/:templateId/version - Kiểm tra phiên bản mới nhất
GET    /api/games/:templateId/data   - Tải JSON game
POST   /api/game-attempts            - Gửi kết quả game
POST   /api/admin/games             - Tạo game (admin)
PUT    /api/admin/games/:templateId - Cập nhật bản nháp (admin)
POST   /api/admin/games/:templateId/publish - Xuất bản phiên bản mới (admin)
```

## WebSocket Events

Sự kiện để thông báo cập nhật phiên bản:

```json
{
  "event": "game.version.updated",
  "templateId": "math",
  "version": 5,
  "publishedAt": "2026-10-20T10:00:00Z"
}
```

## Cấu trúc thư mục mới

```
src/
├── services/
│   ├── gameDataService.js      # Service quản lý dữ liệu game
│   ├── gameVersionService.js   # Service quản lý phiên bản
│   └── gameResultService.js    # Service quản lý kết quả
├── lib/
│   ├── gameCache.js            # IndexedDB cache
│   └── gameSync.js             # Đồng bộ kết quả offline
├── hooks/
│   ├── useGameData.js          # Hook quản lý dữ liệu game
│   └── useGameVersion.js       # Hook quản lý phiên bản
├── components/
│   └── GameVersionProvider.jsx # Provider kiểm tra phiên bản
└── games/
    └── offline/
        └── games-src/
            └── manifest.js     # Manifest với type, playMode, version
```

## Hướng dẫn tích hợp

### Thêm game mới vào manifest

```javascript
{
  id: 'new-game',
  name: 'Game Mới',
  icon: '🎮',
  tag: 'Arcade',
  grad: 'from-blue-400 to-indigo-600',
  engine: 'single',
  file: 'src/games/offline/new-game.html',
  type: 'play-to-learn',
  playMode: 'offline',
  version: 1
}
```

### Sử dụng trong component

```javascript
import { useGameData } from './hooks/useGameData.js';
import { useGameVersion } from './hooks/useGameVersion.js';

function MyGamePage({ gameId }) {
  const { data, loading, error, reload } = useGameData(gameId, {
    playMode: 'offline'
  });

  const { hasUpdate, checkForUpdate, markAsUpdated } = useGameVersion(
    gameId,
    data?.version || 1
  );

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div>
      {hasUpdate && (
        <UpdateBanner onUpdate={() => {
          reload();
          markAsUpdated();
        }} />
      )}
      <Game data={data} />
    </div>
  );
}
```

## Lưu ý quan trọng

1. **Không thay đổi data giữa chừng:** Ván đang chơi sử dụng phiên bản cố định, phiên bản mới chỉ áp dụng cho ván tiếp theo.

2. **Idempotency:** Mỗi lượt chơi có `attemptId` duy nhất để tránh ghi nhận trùng khi đồng bộ.

3. **Xác thực ở backend:** Không tin tuyệt đối vào điểm số từ frontend, backend phải xác thực trước khi cộng thưởng.

4. **Dung lượng cache:** IndexedDB có giới hạn, module tự động dọn dẹp khi vượt quá 50MB.

5. **Retry logic:** Kết quả offline được retry tối đa 10 lần với exponential backoff.

6. **Service Worker:** Để hỗ trợ offline hoàn toàn, cần implement Service Worker để cache các tài nguyên tĩnh.

## Testing

### Test cache

```javascript
// Test lưu và đọc cache
await gameCache.save('test', { questions: [] }, 1);
const data = await gameCache.get('test');
console.assert(data !== null);
```

### Test đồng bộ

```javascript
// Test đồng bộ kết quả
await gameResultService.submit({
  attemptId: 'test-123',
  templateId: 'math',
  gameVersion: 1,
  score: 100
});
const count = gameResultService.getPendingCount();
console.assert(count > 0);
```

### Test phiên bản

```javascript
// Test kiểm tra phiên bản
const hasUpdate = await gameVersionService.checkForUpdate('math', 1);
console.log('Has update:', hasUpdate);
```

## Troubleshooting

### Cache không hoạt động

- Kiểm tra xem trình duyệt có hỗ trợ IndexedDB không
- Kiểm tra quyền truy cập storage
- Xóa cache và thử lại: `await gameCache.clear()`

### Đồng bộ không hoạt động

- Kiểm tra kết nối mạng
- Kiểm tra localStorage có bị full không
- Xem console log để debug

### Phiên bản không cập nhật

- Kiểm tra WebSocket có kết nối không
- Kiểm tra endpoint `/api/games/:templateId/version`
- Xóa cache và tải lại: `await gameCache.delete(gameId)`

## Tài liệu tham khảo

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
