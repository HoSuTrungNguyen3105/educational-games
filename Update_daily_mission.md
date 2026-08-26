# Thiết kế hệ thống Nhiệm vụ hàng ngày

## 1. Mục tiêu

Xây dựng hệ thống **Nhiệm vụ hàng ngày (Daily Tasks)** cho nền tảng game giáo dục.

Hệ thống phải tự động biết người chơi đã thực hiện nhiệm vụ nào dựa trên các **event phát sinh từ game**, không được phụ thuộc vào việc frontend tự đánh dấu `completed`.

Kiến trúc:

```text
Game
 ↓
Game Event
 ↓
Backend
 ↓
Daily Task Service
 ↓
Kiểm tra điều kiện nhiệm vụ
 ↓
Cập nhật tiến độ
 ↓
Hoàn thành nhiệm vụ
 ↓
Trao phần thưởng
```

---

## 2. Nguyên tắc chính

Game chỉ có nhiệm vụ **phát sinh event**.

Daily Task Service chịu trách nhiệm:

* Nhận event.
* Xác định user.
* Xác định game.
* Kiểm tra các nhiệm vụ đang hoạt động.
* Kiểm tra event có phù hợp với nhiệm vụ không.
* Tăng tiến độ.
* Kiểm tra đã đạt target chưa.
* Đánh dấu hoàn thành.
* Trao phần thưởng.

Không để frontend tự gửi:

```js
completed: true
```

Frontend chỉ hiển thị trạng thái do backend trả về.

---

## 3. Các Game Event chuẩn

Xây dựng một hệ thống event dùng chung cho tất cả game.

Các event cơ bản:

```text
GAME_STARTED
GAME_COMPLETED
GAME_WON
GAME_LOST

QUESTION_ANSWERED
QUESTION_CORRECT
QUESTION_WRONG

LEVEL_COMPLETED

SCORE_ACHIEVED

TIME_PLAYED

STREAK_ACHIEVED
```

Event có thể mở rộng thêm trong tương lai.

---

## 4. Cấu trúc Game Event

Ví dụ:

```json
{
  "userId": "user_123",
  "gameId": "monopoly",
  "gameType": "monopoly",
  "event": "GAME_COMPLETED",
  "score": 120,
  "won": true,
  "questionsAnswered": 10,
  "timestamp": "2026-08-26T20:30:00Z"
}
```

Event phải chứa tối thiểu:

```text
userId
gameId hoặc gameType
event
timestamp
```

Các thông tin khác tùy game có thể gửi thêm.

---

# 5. Database

## DailyTask

Lưu định nghĩa của nhiệm vụ.

```text
DailyTask
├── id
├── taskType
├── title
├── description
├── target
├── reward
├── conditions
├── startDate
├── endDate
├── isActive
└── createdAt
```

Ví dụ:

```json
{
  "id": "task_001",
  "taskType": "COMPLETE_GAME",
  "title": "Hoàn thành một game",
  "description": "Hoàn thành 1 game bất kỳ",
  "target": 1,
  "reward": 50,
  "isActive": true
}
```

---

# 6. UserDailyTask

Lưu tiến độ nhiệm vụ của từng user.

```text
UserDailyTask
├── id
├── userId
├── taskId
├── date
├── progress
├── completed
├── completedAt
├── rewardClaimed
└── createdAt
```

Ví dụ:

```json
{
  "id": "user_task_001",
  "userId": "user_123",
  "taskId": "task_001",
  "date": "2026-08-26",
  "progress": 1,
  "completed": true,
  "completedAt": "2026-08-26T20:30:00Z",
  "rewardClaimed": true
}
```

---

# 7. Logic xác định nhiệm vụ đã hoàn thành

Ví dụ nhiệm vụ:

```text
Hoàn thành 3 game
target = 3
```

User hoàn thành game lần đầu:

```text
GAME_COMPLETED
        ↓
progress = 1
completed = false
```

Lần thứ hai:

```text
GAME_COMPLETED
        ↓
progress = 2
completed = false
```

Lần thứ ba:

```text
GAME_COMPLETED
        ↓
progress = 3
completed = true
```

Sau khi hoàn thành:

```text
completedAt = thời gian hoàn thành
rewardClaimed = true
```

---

# 8. Ví dụ các loại nhiệm vụ

## Hoàn thành game

```text
taskType: COMPLETE_GAME
event: GAME_COMPLETED
target: 3
```

Điều kiện:

```text
Hoàn thành 3 game trong ngày
```

---

## Thắng game

```text
taskType: WIN_GAME
event: GAME_WON
target: 2
```

Điều kiện:

```text
Thắng 2 trận trong ngày
```

---

## Trả lời câu hỏi

```text
taskType: ANSWER_QUESTION
event: QUESTION_ANSWERED
target: 10
```

Điều kiện:

```text
Trả lời 10 câu hỏi
```

---

## Trả lời đúng

```text
taskType: CORRECT_ANSWER
event: QUESTION_CORRECT
target: 10
```

Điều kiện:

```text
Trả lời đúng 10 câu
```

---

## Đạt điểm

```text
taskType: ACHIEVE_SCORE
event: SCORE_ACHIEVED
target: 500
```

Điều kiện:

```text
Đạt tổng 500 điểm trong ngày
```

---

# 9. Nhiệm vụ theo từng game

Hệ thống phải hỗ trợ nhiệm vụ áp dụng cho:

```text
Tất cả game
```

hoặc:

```text
Một game cụ thể
```

Ví dụ:

```json
{
  "taskType": "WIN_GAME",
  "target": 2,
  "conditions": {
    "gameType": "monopoly"
  }
}
```

Nhiệm vụ này chỉ tính khi user thắng game Monopoly.

---

# 10. Conditions

Không hard-code điều kiện trực tiếp vào từng game.

Sử dụng `conditions` để có thể mở rộng.

Ví dụ:

```json
{
  "gameType": "monopoly",
  "minScore": 100
}
```

Hoặc:

```json
{
  "gameType": "quiz",
  "category": "math"
}
```

Hoặc:

```json
{
  "difficulty": "hard"
}
```

Điều này giúp admin có thể tạo nhiều loại nhiệm vụ mà không phải sửa code game.

---

# 11. Daily Reset

Nhiệm vụ phải được tính theo ngày.

Ví dụ:

```text
2026-08-26
```

User có:

```text
progress = 3
completed = true
```

Sang ngày:

```text
2026-08-27
```

Hệ thống tạo tiến độ mới:

```text
progress = 0
completed = false
```

Không sử dụng lại tiến độ của ngày hôm trước.

Nên xác định ngày theo timezone của hệ thống/user một cách nhất quán.

---

# 12. API

## Gửi Game Event

```http
POST /game-events
```

Request:

```json
{
  "gameId": "monopoly",
  "gameType": "monopoly",
  "event": "GAME_COMPLETED",
  "score": 120,
  "won": true
}
```

Backend lấy `userId` từ authentication/token, không tin `userId` do frontend gửi lên.

---

## Lấy nhiệm vụ hàng ngày

```http
GET /daily-tasks
```

Response:

```json
{
  "resultCode": "00",
  "resultMessage": "Thành công",
  "list": [
    {
      "id": "task_001",
      "title": "Hoàn thành 3 game",
      "description": "Hoàn thành 3 game bất kỳ",
      "target": 3,
      "progress": 2,
      "completed": false,
      "reward": 50
    }
  ]
}
```

---

## Nhận phần thưởng

Nếu hệ thống muốn tách việc hoàn thành và nhận thưởng:

```http
POST /daily-tasks/:id/claim
```

Backend phải kiểm tra:

```text
completed === true
AND
rewardClaimed === false
```

Sau đó mới trao thưởng.

Không cho phép nhận thưởng nhiều lần.

---

# 13. Flow hoàn chỉnh

```text
User mở game
      ↓
GAME_STARTED
      ↓
User chơi game
      ↓
GAME_COMPLETED
      ↓
Frontend gửi event
      ↓
Backend xác thực user
      ↓
Daily Task Service nhận event
      ↓
Tìm DailyTask đang active
      ↓
Kiểm tra taskType
      ↓
Kiểm tra conditions
      ↓
Tìm UserDailyTask của ngày hiện tại
      ↓
Tăng progress
      ↓
progress >= target ?
      ↓
     YES
      ↓
completed = true
      ↓
Ghi completedAt
      ↓
Trao reward / cho phép claim reward
```

---

# 14. Chống gian lận

Không cho frontend tự gửi:

```json
{
  "completed": true,
  "progress": 999
}
```

Frontend chỉ gửi event.

Backend tự tính:

```text
progress
completed
reward
```

Đồng thời:

* Không cho tăng progress sau khi nhiệm vụ đã hoàn thành.
* Không cho claim reward nhiều lần.
* Kiểm tra user authentication.
* Kiểm tra game event hợp lệ.
* Có thể lưu `eventId` để chống gửi cùng một event nhiều lần.

Ví dụ:

```json
{
  "eventId": "evt_123456",
  "event": "GAME_COMPLETED"
}
```

Backend kiểm tra `eventId` đã tồn tại chưa trước khi xử lý.

---

# 15. Frontend

Frontend chỉ cần gọi:

```http
GET /daily-tasks
```

Sau đó hiển thị:

```text
┌─────────────────────────────┐
│ 🎮 Hoàn thành 3 game        │
│                             │
│ ████████░░ 2 / 3            │
│                             │
│ 🎁 +50 xu                   │
└─────────────────────────────┘
```

Khi backend trả:

```json
{
  "progress": 3,
  "target": 3,
  "completed": true
}
```

Frontend hiển thị:

```text
┌─────────────────────────────┐
│ 🎮 Hoàn thành 3 game        │
│                             │
│ ██████████ 3 / 3            │
│                             │
│ ✓ Đã hoàn thành             │
│ 🎁 +50 xu                   │
└─────────────────────────────┘
```

Không xử lý logic hoàn thành nhiệm vụ ở UI.

---

# 16. Kiến trúc đề xuất

Tách riêng:

```text
games/
├── monopoly/
├── quiz/
├── word-game/
└── ...

game-events/
├── event.types
├── event.service
└── event.controller

daily-tasks/
├── daily-task.service
├── daily-task.controller
├── daily-task.repository
├── daily-task.rules
└── daily-task.types
```

Các game chỉ cần phát event chuẩn.

Ví dụ:

```js
gameEventService.emit({
  event: "GAME_COMPLETED",
  gameType: "monopoly",
  score: 120,
  won: true
});
```

Daily Task Service xử lý toàn bộ phần còn lại.

---

# 17. Mục tiêu cuối cùng

Hệ thống phải đạt được:

* Một hệ thống Daily Task dùng chung cho tất cả game.
* Game mới không cần viết lại Daily Task.
* Có thể tạo nhiệm vụ cho tất cả game hoặc game cụ thể.
* Theo dõi progress realtime.
* Tự động đánh dấu hoàn thành.
* Tự động/cho phép claim reward.
* Reset nhiệm vụ theo ngày.
* Chống claim reward nhiều lần.
* Chống gửi event trùng.
* Backend là nơi quyết định trạng thái nhiệm vụ.
* Frontend chỉ hiển thị dữ liệu từ backend.

Kiến trúc quan trọng nhất:

```text
GAME
  ↓
EVENT
  ↓
BACKEND
  ↓
DAILY TASK ENGINE
  ↓
PROGRESS
  ↓
COMPLETED
  ↓
REWARD
```
