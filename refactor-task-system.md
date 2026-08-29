# Refactor hệ thống Nhiệm vụ – Backend API & Frontend

## 1. Mục tiêu

Refactor toàn bộ phần **Nhiệm vụ / Daily Tasks** ở Backend API và Frontend theo hướng **data-driven + event-driven**, giúp hệ thống dễ mở rộng khi số lượng game và nhiệm vụ tăng lên.

Kiến trúc cần đảm bảo:

```text
Game
  ↓
Game Event
  ↓
Task Engine / Backend
  ↓
User Task Progress
  ↓
Reward
  ↓
Frontend hiển thị
```

### Nguyên tắc quan trọng

- Game **không tự quản lý logic hoàn thành nhiệm vụ**.
- Game chỉ phát sinh các **event** mô tả hành động của người chơi.
- Backend là nơi duy nhất xử lý tiến độ nhiệm vụ và phần thưởng.
- Danh sách nhiệm vụ phải được cấu hình từ Backend/Database, không hard-code trong Frontend.
- Thêm nhiệm vụ mới chủ yếu bằng cách thêm/cập nhật cấu hình, hạn chế phải sửa code game.
- Một event có thể đồng thời cập nhật nhiều nhiệm vụ.
- Có cơ chế chống xử lý event trùng lặp.

---

# 2. Kiến trúc tổng thể

```text
┌──────────────┐
│     GAME     │
│              │
│ Monopoly     │
│ Quiz         │
│ Memory       │
└──────┬───────┘
       │
       │ GAME_PLAYED
       │ GAME_WON
       │ QUESTION_ANSWERED
       │ ANSWER_CORRECT
       │ XP_EARNED
       ▼
┌─────────────────────┐
│   TASK EVENT API    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│     TASK ENGINE     │
│                     │
│ - tìm task phù hợp  │
│ - kiểm tra điều kiện│
│ - tăng progress     │
│ - complete task     │
│ - xử lý reward      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ USER TASK PROGRESS  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│      FRONTEND       │
│ Hiển thị task động  │
└─────────────────────┘
```

---

# 3. Backend – Refactor Database

## 3.1. Bảng `tasks`

Tạo/refactor bảng nhiệm vụ theo hướng cấu hình.

Các field đề xuất:

```text
id
code
name
description
type
target
rewardXp
rewardCoin
icon
scope
gameId
isActive
startAt
endAt
sortOrder
createdAt
updatedAt
```

### Ý nghĩa

- `code`: mã nhiệm vụ duy nhất.
- `name`: tên hiển thị.
- `description`: mô tả.
- `type`: loại event mà nhiệm vụ theo dõi.
- `target`: mục tiêu cần đạt.
- `rewardXp`: XP nhận được.
- `rewardCoin`: coin nhận được.
- `icon`: icon hiển thị.
- `scope`: phạm vi nhiệm vụ.
- `gameId`: game áp dụng; `null` nếu áp dụng cho tất cả game.
- `isActive`: bật/tắt nhiệm vụ.
- `startAt`, `endAt`: hỗ trợ nhiệm vụ theo thời gian/event.
- `sortOrder`: thứ tự hiển thị.

---

# 4. Task Type / Event Type

Không tạo type riêng cho từng nhiệm vụ.

### Không nên

```text
PLAY_1_GAME
PLAY_3_GAME
PLAY_5_GAME
PLAY_10_GAME
```

### Nên

```text
GAME_PLAYED
```

và dùng:

```text
target = 1
target = 3
target = 5
target = 10
```

Các event cơ bản:

```text
GAME_STARTED
GAME_PLAYED
GAME_WON
GAME_LOST
QUESTION_ANSWERED
ANSWER_CORRECT
XP_EARNED
LOGIN
```

Có thể mở rộng thêm event khi hệ thống cần.

---

# 5. Scope của nhiệm vụ

Hỗ trợ ít nhất:

```text
DAILY
WEEKLY
TOTAL
EVENT
```

Ví dụ:

### Daily

```text
Chơi 3 trận
type = GAME_PLAYED
target = 3
scope = DAILY
```

### Total

```text
Chơi 100 trận
type = GAME_PLAYED
target = 100
scope = TOTAL
```

### Weekly

```text
Thắng 10 trận
type = GAME_WON
target = 10
scope = WEEKLY
```

Thiết kế `periodKey` để xác định chu kỳ của nhiệm vụ, ví dụ:

```text
2026-08-29
2026-W35
TOTAL
event-2026-09
```

---

# 6. Bảng `user_task_progress`

Lưu tiến độ nhiệm vụ của từng user.

Đề xuất:

```text
id
userId
taskId
progress
target
completed
claimed
completedAt
claimedAt
periodKey
createdAt
updatedAt
```

### Ví dụ

```text
User: user7

Chơi 1 trận       1/1   completed
Chơi 3 trận       2/3   chưa hoàn thành
Trả lời 5 câu     4/5   chưa hoàn thành
Thắng 1 trận      0/1   chưa hoàn thành
```

Nên có unique constraint phù hợp với:

```text
userId + taskId + periodKey
```

để tránh tạo progress trùng trong cùng một chu kỳ.

---

# 7. Bảng `task_events`

Tạo bảng lưu event đã nhận/xử lý để chống cộng nhiệm vụ nhiều lần.

Đề xuất:

```text
id
eventId
userId
type
gameId
metadata
createdAt
```

`eventId` phải unique.

Ví dụ:

```json
{
  "eventId": "unique-event-id",
  "type": "GAME_PLAYED",
  "gameId": "monopoly",
  "metadata": {
    "score": 500,
    "duration": 120
  }
}
```

Nếu Frontend/Game gửi lại cùng `eventId`, Backend không được cộng progress lần thứ hai.

---

# 8. Backend API

## 8.1. Lấy nhiệm vụ

```http
GET /tasks/daily
```

Hoặc API tổng quát:

```http
GET /me/tasks?scope=daily
```

Response nên trả thẳng dữ liệu cần cho Frontend:

```json
{
  "resultCode": "00",
  "resultMessage": "Thành công",
  "data": {
    "tasks": [
      {
        "id": 1,
        "code": "PLAY_GAME_1",
        "name": "Chơi 1 trận",
        "description": "",
        "icon": "🎮",
        "progress": 1,
        "target": 1,
        "completed": true,
        "claimed": false,
        "reward": {
          "xp": 0,
          "coin": 10
        }
      }
    ],
    "completedCount": 1,
    "totalCount": 10
  }
}
```

Frontend không cần tự tính progress.

---

# 9. API nhận Game Event

Tạo API:

```http
POST /task-events
```

Body:

```json
{
  "eventId": "unique-event-id",
  "type": "GAME_PLAYED",
  "gameId": "monopoly",
  "metadata": {
    "score": 500,
    "duration": 120
  }
}
```

Backend thực hiện:

```text
1. Validate user
2. Kiểm tra eventId
3. Nếu event đã tồn tại → bỏ qua
4. Lưu event
5. Tìm các task đang active
6. Lọc task theo type
7. Kiểm tra gameId
8. Kiểm tra scope / period
9. Tăng progress
10. Nếu progress >= target → completed
11. Xử lý reward
12. Trả kết quả cập nhật
```

---

# 10. Task Engine

Tạo service riêng, ví dụ:

```text
TaskEngineService
```

Không nhét toàn bộ logic vào Controller.

Controller:

```text
TaskEventController
        ↓
TaskEventService
        ↓
TaskEngineService
        ↓
UserTaskProgressService
        ↓
RewardService
```

Task Engine chịu trách nhiệm:

```text
Event
 ↓
Find matching tasks
 ↓
Check conditions
 ↓
Update progress
 ↓
Complete
 ↓
Reward
```

---

# 11. Matching Task

Ví dụ event:

```json
{
  "type": "GAME_PLAYED",
  "gameId": "monopoly"
}
```

Backend tìm:

```text
GAME_PLAYED + gameId = monopoly
```

và:

```text
GAME_PLAYED + gameId = null
```

Kết quả:

```text
Chơi 1 trận          → +1
Chơi 3 trận          → +1
Chơi 10 trận         → +1
Chơi 5 trận Monopoly → +1
```

Không cần viết logic riêng cho từng nhiệm vụ.

---

# 12. Game – Refactor

Các game không được chứa:

```text
completeTask(...)
updateTaskProgress(...)
rewardTask(...)
```

Thay vào đó chỉ phát event.

Ví dụ khi chơi xong:

```js
trackTaskEvent({
  type: "GAME_PLAYED",
  gameId: "monopoly"
});
```

Khi thắng:

```js
trackTaskEvent({
  type: "GAME_WON",
  gameId: "monopoly"
});
```

Khi trả lời:

```js
trackTaskEvent({
  type: "QUESTION_ANSWERED",
  gameId: "quiz"
});
```

Khi trả lời đúng:

```js
trackTaskEvent({
  type: "ANSWER_CORRECT",
  gameId: "quiz"
});
```

Game chỉ báo sự kiện, không biết nhiệm vụ nào sẽ được cập nhật.

---

# 13. Tạo hàm dùng chung cho Frontend/Game

Tạo một service/helper dùng chung:

```js
trackTaskEvent(type, data)
```

Ví dụ:

```js
await trackTaskEvent("GAME_PLAYED", {
  gameId: "monopoly"
});
```

Service tự tạo `eventId` duy nhất và gọi:

```http
POST /task-events
```

Không để từng game tự viết axios/fetch riêng cho Task API.

---

# 14. Frontend – Refactor

Frontend không hard-code:

```jsx
<TaskItem name="Chơi 1 trận" />
<TaskItem name="Chơi 3 trận" />
<TaskItem name="Trả lời 5 câu" />
```

Thay bằng API:

```js
const { tasks } = useTasks();
```

Sau đó:

```jsx
{tasks.map(task => (
  <TaskItem
    key={task.id}
    task={task}
  />
))}
```

---

# 15. Component đề xuất

```text
src/
├── services/
│   └── taskService.js
│
├── hooks/
│   └── useTasks.js
│
├── components/
│   └── tasks/
│       ├── TaskList.jsx
│       ├── TaskItem.jsx
│       ├── TaskProgress.jsx
│       └── TaskReward.jsx
│
└── games/
    ├── monopoly/
    ├── quiz/
    └── memory/
```

---

# 16. Frontend API Service

Tạo:

```js
getTasks()
trackTaskEvent()
claimTaskReward()
```

Ví dụ:

```js
export const getDailyTasks = () =>
  api.get("/me/tasks?scope=daily");

export const trackTaskEvent = (payload) =>
  api.post("/task-events", payload);

export const claimTaskReward = (taskId) =>
  api.post(`/tasks/${taskId}/claim`);
```

Tên endpoint có thể điều chỉnh theo convention hiện tại của project.

---

# 17. Claim Reward

Nếu hệ thống yêu cầu user bấm nhận thưởng:

```text
completed = true
claimed = false
```

Frontend hiển thị:

```text
🎉 Đã hoàn thành

[ Nhận 30 coin ]
```

Khi bấm:

```http
POST /tasks/:taskId/claim
```

Backend phải đảm bảo:

```text
completed = true
claimed = false
```

mới được nhận thưởng.

Sau khi nhận:

```text
claimed = true
claimedAt = ...
```

Phải xử lý transaction để không thể nhận thưởng hai lần.

---

# 18. Ví dụ hoàn chỉnh

Database có:

```text
Chơi 1 trận
type = GAME_PLAYED
target = 1
rewardCoin = 10

Chơi 3 trận
type = GAME_PLAYED
target = 3
rewardCoin = 30

Thắng 1 trận
type = GAME_WON
target = 1
rewardCoin = 40
```

User chơi và thắng Monopoly.

Game gửi:

```text
GAME_PLAYED
GAME_WON
```

Backend tự cập nhật:

```text
Chơi 1 trận       1/1   ✅
Chơi 3 trận       1/3
Thắng 1 trận      1/1   ✅
```

Game không cần biết có 3 nhiệm vụ trên.

---

# 19. Thêm nhiệm vụ sau này

Ví dụ muốn thêm:

```text
Chơi 20 trận → +200 coin
```

Chỉ cần tạo task:

```text
name = Chơi 20 trận
type = GAME_PLAYED
target = 20
rewardCoin = 200
```

Không cần:

- sửa Monopoly
- sửa Quiz
- sửa Memory
- sửa TaskItem
- thêm if/else trong Frontend
- thêm API riêng cho nhiệm vụ mới

Đây là mục tiêu chính của refactor.

---

# 20. Yêu cầu quan trọng khi refactor

## Không làm

```text
Game → completeTask("PLAY_3")
Game → rewardUser()
Frontend → tự tăng progress
Frontend → tự xác định completed
Mỗi task → một API riêng
Mỗi game → một bộ task logic riêng
```

## Phải làm

```text
Game → Event
Event → Backend
Backend → Task Engine
Task Engine → Progress
Task Engine → Reward
Frontend → đọc dữ liệu từ API
```

---

# 21. Tính mở rộng

Hệ thống sau refactor phải hỗ trợ:

- Nhiều game.
- Nhiều nhiệm vụ.
- Daily / Weekly / Total / Event.
- Nhiệm vụ áp dụng cho tất cả game.
- Nhiệm vụ riêng từng game.
- Nhiều nhiệm vụ cùng được tăng bởi một event.
- Thêm nhiệm vụ mà không sửa code game.
- Bật/tắt nhiệm vụ.
- Nhiệm vụ có thời gian bắt đầu/kết thúc.
- Reward XP/Coin.
- Chống event trùng.
- Chống nhận reward nhiều lần.

---

# 22. Thứ tự thực hiện

### Bước 1 – Backend Database

Refactor/tạo:

```text
tasks
user_task_progress
task_events
```

### Bước 2 – Backend Task Engine

Tạo:

```text
TaskEngineService
TaskEventService
UserTaskProgressService
RewardService
```

### Bước 3 – Backend API

Tạo/refactor:

```text
GET  /me/tasks
POST /task-events
POST /tasks/:taskId/claim
```

### Bước 4 – Frontend Service

Tạo:

```text
taskService
useTasks
trackTaskEvent
```

### Bước 5 – Frontend UI

Refactor:

```text
DailyTasks
TaskList
TaskItem
```

để render hoàn toàn từ API.

### Bước 6 – Refactor các Game

Từng game chuyển từ:

```text
tự xử lý nhiệm vụ
```

sang:

```text
phát event
```

### Bước 7 – Test

Test tối thiểu:

```text
- Chơi 1 trận
- Chơi nhiều trận
- Thắng trận
- Trả lời đúng/sai
- Một event cập nhật nhiều task
- Task đạt target
- Task chưa đạt target
- Event gửi trùng
- Claim reward trùng
- Daily reset
- Weekly reset
- Task riêng game
- Task áp dụng tất cả game
- Task inactive
```

---

# 23. Kết quả mong muốn

Sau refactor, hệ thống phải đạt được:

```text
                    ┌───────────────┐
                    │  TASK CONFIG  │
                    │   Database    │
                    └───────┬───────┘
                            │
                            ▼
Game ──► Event API ──► Task Engine ──► Progress
                            │
                            ▼
                         Reward
                            │
                            ▼
                       Frontend UI
```

**Mục tiêu cuối cùng:**

> Game chỉ phát event. Backend quyết định event đó ảnh hưởng đến nhiệm vụ nào. Frontend chỉ hiển thị dữ liệu nhiệm vụ từ API.

Không hard-code danh sách nhiệm vụ trong game hoặc frontend và không tạo logic riêng cho từng nhiệm vụ.
