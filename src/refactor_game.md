# Đề xuất kiến trúc game Offline và Online cho EduPlay

## 1. Mục tiêu

Hệ thống EduPlay hiện có hai loại game:

- **Game Offline:** Học sinh có thể chơi mà không cần kết nối Internet sau khi dữ liệu game đã được tải về thiết bị.
- **Game Online:** Học sinh cần kết nối Internet để tải câu hỏi từ backend khi chơi.

Mục tiêu triển khai:

1. Admin có thể quản lý, thêm, sửa, xóa câu hỏi và cấu hình game bằng JSON.
2. Khi Admin xuất bản phiên bản JSON mới, hệ thống tự động cập nhật cho học sinh đang online mà không cần build lại frontend.
3. Học sinh vẫn chơi được game offline khi mất mạng nếu dữ liệu đã được lưu trên thiết bị.
4. Khi có mạng trở lại, game offline tự kiểm tra và cập nhật dữ liệu mới.
5. Kết quả học tập được lưu và đồng bộ an toàn, hạn chế mất dữ liệu hoặc ghi nhận trùng.
6. Tận dụng kiến trúc hiện tại của EduPlay, hạn chế viết lại toàn bộ hệ thống game.

## 2. Kiến trúc tổng thể

```text
                    ADMIN PAGE
                        |
            Quản lý JSON và cấu hình game
                        |
                  Backend EduPlay
                        |
           Database + API + Version Control
                        |
              +---------+---------+
              |                   |
         GAME OFFLINE         GAME ONLINE
              |                   |
       Kiểm tra cache        Gọi API lấy câu hỏi
              |                   |
       +------+-------+       Chơi game
       |              |           |
    Có cache       Chưa có cache   |
       |              |           |
    Chơi ngay      Tải từ API      |
       |              |           |
       +------+-------+-----------+
                        |
                Lưu kết quả chơi
                        |
           Đồng bộ kết quả với backend
```

### Nguyên tắc thiết kế

Tách biệt ba thành phần:

- **Game Engine:** Xử lý luật chơi, giao diện, tính điểm và tương tác.
- **Game Data:** JSON chứa câu hỏi, đáp án và cấu hình game.
- **Game Delivery:** Cơ chế tải dữ liệu, lưu cache, kiểm tra phiên bản và cập nhật.

Nhờ đó, Admin có thể thay đổi nội dung game mà không cần sửa code của game engine.

## 3. Quản lý JSON trong Admin Page

### 3.1. Dữ liệu game mẫu

```json
{
  "templateId": "treasure-hunt",
  "type": "play-to-learn",
  "playMode": "offline",
  "version": 5,
  "title": "Đào kho báu",
  "config": {
    "timeLimit": 60,
    "questionsPerRound": 10
  },
  "questions": [
    {
      "id": "q1",
      "content": "5 + 3 = ?",
      "answers": ["6", "7", "8", "9"],
      "correctAnswer": 2
    }
  ]
}
```

Đây là cấu trúc minh họa. Khi triển khai, cần điều chỉnh theo định dạng dữ liệu mà các game hiện tại đang sử dụng.

### 3.2. Chức năng Admin cần có

- Xem danh sách game và trạng thái xuất bản.
- Thêm, sửa, xóa câu hỏi.
- Quản lý đáp án đúng và nội dung câu hỏi.
- Chỉnh sửa cấu hình game.
- Nhập hoặc xuất JSON.
- Kiểm tra cấu trúc JSON trước khi lưu.
- Xem trước game trước khi xuất bản.
- Lưu bản nháp và xuất bản phiên bản mới.
- Xem lịch sử phiên bản để hỗ trợ khôi phục khi cần.

### 3.3. Quy trình xuất bản

1. Admin chỉnh sửa dữ liệu game.
2. Backend kiểm tra JSON và tính hợp lệ của dữ liệu.
3. Backend lưu phiên bản mới vào database.
4. Phiên bản được tăng lên, ví dụ từ `version: 5` thành `version: 6`.
5. Backend thông báo cho các client đang online rằng game có phiên bản mới.
6. Frontend kiểm tra phiên bản, tải dữ liệu mới và cập nhật cache.

Không cần build lại frontend khi chỉ thay đổi câu hỏi hoặc cấu hình game.

## 4. Phân biệt loại game

Không nên sử dụng chung một thuộc tính để biểu thị cả mục đích và cách vận hành game.

### 4.1. Thuộc tính `type`

Biểu thị mục đích của game:

- `play-to-learn`: Game phục vụ học tập.
- `play-to-win`: Game thiên về thi đấu, thử thách hoặc chiến thắng.

### 4.2. Thuộc tính `playMode`

Biểu thị cách tải dữ liệu và vận hành:

- `offline`: Có thể chơi bằng dữ liệu đã lưu trên thiết bị.
- `online`: Cần kết nối mạng để tải dữ liệu phục vụ lượt chơi.

Ví dụ:

```json
{
  "templateId": "treasure-hunt",
  "type": "play-to-learn",
  "playMode": "offline"
}
```

```json
{
  "templateId": "quiz-challenge",
  "type": "play-to-learn",
  "playMode": "online"
}
```

Frontend căn cứ vào `playMode` để quyết định cách tải dữ liệu.

## 5. Lưu trữ dữ liệu

| Nơi lưu | Mục đích |
|---|---|
| Database backend | Lưu dữ liệu gốc, cấu hình, phiên bản và trạng thái xuất bản |
| IndexedDB | Lưu JSON đã tải trên thiết bị học sinh để chơi offline |
| localStorage | Lưu một số thiết lập nhỏ hoặc thông tin phiên bản đơn giản |
| File JSON trong frontend | Có thể dùng làm dữ liệu mặc định ban đầu, không nên là nguồn dữ liệu chính |

### Vì sao nên dùng IndexedDB?

IndexedDB phù hợp để lưu nhiều bộ câu hỏi và cấu hình game trên trình duyệt. Khi mất mạng, frontend có thể đọc dữ liệu đã lưu mà không cần gọi API.

Mỗi bản cache nên được xác định bằng các thông tin như:

- `templateId`
- `version`
- Thời điểm tải
- Nội dung JSON
- Trạng thái hợp lệ của dữ liệu

Cần có cơ chế kiểm tra dung lượng cache và xử lý dữ liệu cũ.

## 6. Quy trình chạy game Offline

### Trường hợp 1: Đã có dữ liệu cache

1. Học sinh mở game.
2. Frontend đọc JSON từ IndexedDB.
3. Khởi chạy game bằng dữ liệu đã lưu.
4. Nếu có Internet, hệ thống kiểm tra xem backend có phiên bản mới hay không.

### Trường hợp 2: Chưa có dữ liệu cache

1. Học sinh mở game.
2. Frontend kiểm tra kết nối và cache.
3. Nếu có mạng, tải JSON từ backend.
4. Kiểm tra dữ liệu rồi lưu vào IndexedDB.
5. Khởi chạy game.

Nếu chưa có dữ liệu cache và thiết bị không có mạng, frontend phải thông báo rằng cần kết nối Internet để tải game lần đầu.

### Ví dụ xử lý trong React JSX

```js
async function startGame(game) {
  if (game.playMode === "offline") {
    const cachedData = await getCachedQuestions(
      game.templateId
    );

    if (cachedData) {
      return launchGame(game, cachedData.questions);
    }

    const data = await fetchGameData(game.templateId);

    await saveCachedQuestions(game.templateId, data);

    return launchGame(game, data.questions);
  }

  const data = await fetchGameData(game.templateId);

  return launchGame(game, data.questions);
}
```

Đây là ví dụ minh họa. Cần bổ sung xử lý lỗi mạng, xác thực dữ liệu, định dạng response API và trạng thái tải dữ liệu theo code thực tế của EduPlay.

## 7. Cập nhật JSON tự động

### 7.1. Khi Admin xuất bản phiên bản mới

Ví dụ:

- Phiên bản hiện tại: `5`
- Phiên bản mới: `6`

Backend lưu phiên bản 6 và thông báo cho frontend.

Frontend có thể sử dụng WebSocket để nhận sự kiện thông báo cập nhật.

Ví dụ sự kiện:

```json
{
  "event": "game.version.updated",
  "templateId": "treasure-hunt",
  "version": 6
}
```

Sự kiện chỉ cần thông báo game nào đã thay đổi và phiên bản mới nhất. Frontend tải dữ liệu qua API để tránh truyền toàn bộ JSON qua sự kiện.

### 7.2. Khi học sinh đang online

1. Nhận thông báo phiên bản mới hoặc phát hiện phiên bản mới qua API.
2. Tải JSON mới.
3. Kiểm tra dữ liệu.
4. Cập nhật cache trong IndexedDB.
5. Sử dụng phiên bản mới ở lượt chơi tiếp theo.

### 7.3. Khi học sinh đang offline

- Tiếp tục sử dụng phiên bản JSON đã lưu.
- Không yêu cầu kết nối mạng trong quá trình chơi offline.
- Khi có mạng trở lại, kiểm tra phiên bản mới và tự động tải dữ liệu cập nhật.

**Lưu ý:** Không thể cập nhật dữ liệu ngay trên thiết bị đang mất mạng.

### 7.4. Khi game đang được chơi

Không nên thay đổi dữ liệu giữa chừng vì có thể gây lỗi câu hỏi, đáp án hoặc điểm số.

Nên áp dụng quy tắc:

- Ván đang chơi sử dụng một phiên bản JSON cố định.
- Phiên bản mới chỉ áp dụng cho ván tiếp theo.
- Không xóa phiên bản cache đang được một lượt chơi sử dụng.

## 8. Quy trình chạy game Online

Đối với game online:

1. Học sinh chọn game.
2. Frontend gọi API backend để lấy dữ liệu.
3. Backend xác thực quyền truy cập và trả về dữ liệu cần thiết.
4. Frontend hiển thị câu hỏi.
5. Học sinh trả lời.
6. Kết quả được gửi lên backend để lưu trữ hoặc kiểm tra.
7. Backend trả về kết quả và cập nhật tiến trình học tập.

Game online cần xử lý trạng thái mất kết nối rõ ràng. Không nên tự chuyển sang dùng JSON cache nếu game yêu cầu câu hỏi hoặc đáp án được cấp theo từng lượt từ server.

## 9. Đồng bộ kết quả học tập khi Offline

Nếu học sinh hoàn thành game offline trong lúc mất mạng, kết quả nên được lưu tạm vào IndexedDB.

Ví dụ:

```json
{
  "attemptId": "unique-attempt-id",
  "templateId": "treasure-hunt",
  "gameVersion": 5,
  "score": 80,
  "completedAt": "2026-10-20T10:30:00Z",
  "syncStatus": "pending"
}
```

Khi có mạng trở lại:

1. Lấy danh sách kết quả đang chờ đồng bộ.
2. Gửi từng kết quả lên backend.
3. Backend kiểm tra và xử lý.
4. Đánh dấu kết quả đã đồng bộ khi nhận xác nhận thành công.
5. Nếu lỗi mạng, tiếp tục retry sau.

### Yêu cầu quan trọng

- Mỗi lượt chơi có `attemptId` duy nhất.
- Backend xử lý idempotency để tránh ghi nhận trùng.
- Có giới hạn số lần retry.
- Không xóa kết quả chờ đồng bộ trước khi backend xác nhận.
- Với điểm thưởng, xu hoặc bảng xếp hạng, backend phải xác thực dữ liệu trước khi cộng thưởng.

Không nên tin tuyệt đối vào điểm số hoặc đáp án do frontend gửi lên.

## 10. API đề xuất

Tên endpoint dưới đây chỉ là đề xuất, cần thống nhất với quy ước API hiện tại.

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/api/games` | Lấy danh sách game |
| `GET` | `/api/games/{templateId}` | Lấy thông tin game |
| `GET` | `/api/games/{templateId}/version` | Kiểm tra phiên bản mới nhất |
| `GET` | `/api/games/{templateId}/data` | Tải JSON game |
| `POST` | `/api/admin/games` | Tạo game |
| `PUT` | `/api/admin/games/{templateId}` | Cập nhật bản nháp |
| `POST` | `/api/admin/games/{templateId}/publish` | Xuất bản phiên bản mới |
| `POST` | `/api/game-attempts/sync` | Đồng bộ kết quả offline |

API quản trị phải có xác thực và phân quyền. Cần tránh để học sinh truy cập các chức năng chỉnh sửa hoặc xuất bản game.

## 11. Chiến lược cập nhật phiên bản

Mỗi game nên có:

- Phiên bản hiện tại đã xuất bản.
- Bản nháp đang chỉnh sửa.
- Lịch sử các phiên bản.
- Thời điểm xuất bản.
- Trạng thái hoạt động.

Frontend có thể kiểm tra phiên bản tại các thời điểm:

- Khi mở trang học tập.
- Khi mở trang chi tiết game.
- Khi bắt đầu một lượt chơi.
- Khi nhận sự kiện WebSocket.
- Khi thiết bị kết nối mạng trở lại.

Để tránh gọi API quá nhiều, có thể dùng `ETag`, `If-None-Match` hoặc endpoint phiên bản nhẹ. Chỉ tải toàn bộ JSON khi dữ liệu thực sự thay đổi.

## 12. Service đề xuất trong Frontend

Có thể tổ chức các module JavaScript như sau:

```text
src/
├── services/
│   ├── gameService.js
│   ├── gameVersionService.js
│   └── gameResultService.js
├── lib/
│   ├── gameCache.js
│   └── gameSync.js
├── hooks/
│   ├── useGameData.js
│   └── useGameVersion.js
└── games/
    ├── engine/
    └── components/
```

Vai trò:

- `gameService.js`: Gọi API để lấy dữ liệu game.
- `gameVersionService.js`: Kiểm tra phiên bản và xử lý thông báo cập nhật.
- `gameResultService.js`: Gửi kết quả chơi lên backend.
- `gameCache.js`: Đọc và ghi cache IndexedDB.
- `gameSync.js`: Đồng bộ các kết quả đang chờ.
- `useGameData.js`: Quản lý trạng thái tải dữ liệu game trong React.
- `useGameVersion.js`: Theo dõi phiên bản mới.

Đây là cấu trúc gợi ý, không bắt buộc phải tạo tất cả file nếu dự án hiện tại đã có service tương đương.

## 13. Lưu ý về việc hỗ trợ Offline

Cache JSON chỉ giải quyết phần dữ liệu. Để học sinh có thể mở lại website khi mất mạng, cần bảo đảm các file cần thiết như HTML, JavaScript, CSS và tài nguyên game đã được lưu trên thiết bị.

Có thể sử dụng Service Worker hoặc PWA để cache các tài nguyên tĩnh. Tuy nhiên, cần thiết kế chính sách cập nhật cache riêng, tránh để Service Worker giữ frontend quá cũ trong khi backend đã cập nhật API.

Nên kiểm tra riêng các trường hợp:

- Lần đầu mở game khi có mạng.
- Mở game khi mất mạng.
- Tải JSON thất bại giữa chừng.
- Có phiên bản mới khi đang chơi.
- Kết nối mạng trở lại.
- Xóa cache hoặc hết dung lượng lưu trữ.
- Đăng xuất rồi đăng nhập tài khoản học sinh khác.

## 14. Lộ trình triển khai

### Giai đoạn 1: Chuẩn hóa dữ liệu

- Kiểm tra cấu trúc JSON hiện tại.
- Phân biệt `type` và `playMode`.
- Chuẩn hóa `templateId`, câu hỏi, đáp án và cấu hình.
- Bảo đảm backend lưu được dữ liệu và phiên bản.

### Giai đoạn 2: Hoàn thiện Admin Page

- Chỉnh sửa câu hỏi và cấu hình.
- Kiểm tra JSON.
- Xem trước game.
- Xuất bản phiên bản mới.
- Lưu lịch sử phiên bản.

### Giai đoạn 3: Hỗ trợ Offline

- Xây dựng IndexedDB cache.
- Tải dữ liệu lần đầu.
- Khởi chạy game từ cache.
- Kiểm tra và cập nhật phiên bản.
- Cache các tài nguyên cần thiết nếu cần mở website khi mất mạng.

### Giai đoạn 4: Cập nhật tự động

- Kiểm tra phiên bản qua API.
- Tích hợp WebSocket nếu backend đã hỗ trợ.
- Tải JSON mới khi có phiên bản mới.
- Chỉ áp dụng dữ liệu mới từ lượt chơi tiếp theo.

### Giai đoạn 5: Đồng bộ kết quả

- Lưu kết quả offline.
- Tự động gửi kết quả khi có mạng.
- Xử lý retry và chống ghi nhận trùng.
- Kiểm tra tính hợp lệ của điểm số và phần thưởng ở backend.

## 15. Kết luận

Hướng phù hợp cho EduPlay là sử dụng **backend làm nguồn dữ liệu chính, Admin quản lý JSON và phiên bản, IndexedDB lưu dữ liệu game offline, API phục vụ game online và cơ chế đồng bộ xử lý kết quả khi có mạng**.

Cách này cho phép Admin cập nhật nội dung game mà không cần build lại frontend, đồng thời giúp học sinh tiếp tục học tập khi kết nối Internet không ổn định.

Trước khi triển khai, cần kiểm tra cách lưu JSON và cách các game hiện tại được tổ chức để chọn phương án tích hợp phù hợp, tránh viết lại những phần đã hoạt động tốt.
