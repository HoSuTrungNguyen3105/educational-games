# Refactor hệ thống Nhiệm vụ cho HTML Game

## 1. Mục tiêu

Hiện tại hệ thống lưu toàn bộ HTML của game vào API/Database.

Cần refactor hệ thống nhiệm vụ theo hướng:

- Vẫn lưu toàn bộ HTML game như hiện tại.
- Khi lưu HTML, tự động inject `GameTaskBridge`.
- HTML game chỉ phát sinh event.
- HTML không gọi trực tiếp Task API.
- React là trung gian nhận event từ HTML.
- React sử dụng API service hiện tại để gửi event lên Backend.
- Backend chịu trách nhiệm xử lý nhiệm vụ, progress và reward.
- Không hard-code danh sách nhiệm vụ trong HTML hoặc Frontend.
- Sau này thêm nhiệm vụ mới không cần sửa từng game.

---

# 2. Kiến trúc tổng thể

```text
HTML Game
    │
    │ GameTaskBridge.emit(...)
    ▼
React Game Container
    │
    │ POST /task-events
    ▼
Backend Task API
    │
    ▼
Task Engine
    │
    ├── Kiểm tra Task
    ├── Cập nhật Progress
    ├── Hoàn thành Task
    └── Xử lý Reward
3. Vì sao HTML không gọi trực tiếp API?

HTML game được lưu vào API/Database và có thể không biết:

API Base URL là gì.
Backend đang chạy ở domain nào.
Authentication/token hiện tại.
API endpoint nào dùng cho Task.
Cấu trúc Backend.

Do đó không nên inject:

fetch("https://api.example.com/task-events")

vào HTML.

HTML chỉ nên phát event.

4. Sử dụng postMessage

Nếu HTML game đang chạy trong iframe của React, sử dụng:

HTML Game
    ↓
window.parent.postMessage()
    ↓
React
    ↓
API Service hiện tại
    ↓
Backend

HTML không cần biết API nằm ở đâu.

5. Inject GameTaskBridge khi lưu HTML

Khi người dùng bấm Save Game:

Original HTML
    ↓
HTML Processor
    ↓
Inject GameTaskBridge
    ↓
Processed HTML
    ↓
Lưu vào API/Database

Ví dụ Bridge được inject:

window.GameTaskBridge = {
    emit(type, data = {}) {
        window.parent.postMessage({
            source: "game",
            type,
            data
        }, "*");
    }
};

Sau khi inject, game có thể sử dụng:

GameTaskBridge.emit("GAME_PLAYED", {
    gameId: "2345678-2e2232323232-232323232323"
});
6. HTML Game chỉ phát Event

Các event cơ bản:

GAME_STARTED
GAME_PLAYED
GAME_WON
GAME_LOST
QUESTION_ANSWERED
ANSWER_CORRECT
XP_EARNED

Ví dụ:

GameTaskBridge.emit("GAME_PLAYED", {
     gameId: "2345678-2e2232323232-232323232323"
});

Khi thắng:

GameTaskBridge.emit("GAME_WON", {
     gameId: "2345678-2e2232323232-232323232323"
});

Quiz trả lời đúng:

GameTaskBridge.emit("ANSWER_CORRECT", {
      gameId: "2345678-2e2232323232-232323232323"
});
7. Không xử lý Task trong HTML

Không được viết:

if (gamesPlayed >= 3) {
    completeTask("PLAY_3_GAME");
}

Không được:

updateTaskProgress();

Không được:

rewardCoin(100);

Không được gọi trực tiếp:

fetch("/task-events");

HTML chỉ:

GameTaskBridge.emit("GAME_PLAYED", {
     gameId: "2345678-2e2232323232-232323232323"
});
8. React nhận Event

React Game Container lắng nghe:

useEffect(() => {
    const handleMessage = (event) => {
        if (event.data?.source !== "game") {
            return;
        }

        const { type, data } = event.data;

        trackTaskEvent({
            type,
            ...data
        });
    };

    window.addEventListener("message", handleMessage);

    return () => {
        window.removeEventListener("message", handleMessage);
    };
}, []);

Sau đó React sử dụng API service hiện tại:

trackTaskEvent({
    type: "GAME_WON",
     gameId: "2345678-2e2232323232-232323232323"
});

API URL và authentication được xử lý bởi API service hiện tại của React.

HTML hoàn toàn không cần biết API URL.

9. Task API

Backend tạo API nhận event:

POST /task-events

Body:

{
    "eventId": "unique-event-id",
    "type": "GAME_WON",
    "gameId": "2345678-2e2232323232-232323232323",
    "metadata": {
        "score": 500,
        "duration": 120
    }
}

Backend tự xử lý:

Event
 ↓
Tìm Task phù hợp
 ↓
Kiểm tra gameId
 ↓
Kiểm tra scope
 ↓
Tăng progress
 ↓
Kiểm tra target
 ↓
Hoàn thành Task
 ↓
Xử lý reward
10. Task không được hard-code

Không tạo:

PLAY_1_GAME
PLAY_3_GAME
PLAY_5_GAME
PLAY_10_GAME

Thay vào đó:

type = GAME_PLAYED

và cấu hình:

target = 1
target = 3
target = 5
target = 10

Ví dụ:

Chơi 1 trận
type = GAME_PLAYED
target = 1

Chơi 3 trận
type = GAME_PLAYED
target = 3

Chơi 10 trận
type = GAME_PLAYED
target = 10

Một event GAME_PLAYED có thể cập nhật nhiều Task cùng lúc.

11. Database tasks

Đề xuất:

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

Ví dụ:

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
12. Database user_task_progress

Lưu tiến độ của từng user:

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

Ví dụ:

Chơi 1 trận       1/1   completed
Chơi 3 trận       2/3   chưa hoàn thành
Thắng 1 trận      0/1   chưa hoàn thành

Nên có unique constraint phù hợp với:

userId + taskId + periodKey
13. Database task_events

Dùng để chống event bị gửi nhiều lần:

id
eventId
userId
type
gameId
metadata
createdAt

eventId phải unique.

Ví dụ:

{
    "eventId": "game-session-123-finished",
    "type": "GAME_PLAYED",
    "gameId": "2345678-2e2232323232-232323232323"
}

Nếu cùng eventId được gửi lại, Backend không được cộng progress lần thứ hai.

14. Game riêng và Game chung
Task chỉ dành cho Monopoly
type = GAME_WON
gameId = monopoly
target = 3

Chỉ event từ Monopoly được tính.

Task áp dụng cho tất cả Game
type = GAME_WON
gameId = null
target = 10

Game nào thắng cũng được tính.

15. Scope

Hỗ trợ:

DAILY
WEEKLY
TOTAL
EVENT

Ví dụ:

Chơi 3 trận mỗi ngày

type = GAME_PLAYED
target = 3
scope = DAILY

Hoặc:

Chơi 100 trận tổng cộng

type = GAME_PLAYED
target = 100
scope = TOTAL

Nên có periodKey để xác định chu kỳ.

16. Frontend Task UI

Frontend không hard-code:

<TaskItem name="Chơi 1 trận" />
<TaskItem name="Chơi 3 trận" />
<TaskItem name="Trả lời 5 câu" />

Mà lấy từ API:

const { tasks } = useTasks();

Render:

{tasks.map(task => (
    <TaskItem
        key={task.id}
        task={task}
    />
))}

Frontend chỉ hiển thị dữ liệu Backend trả về:

name
description
progress
target
completed
reward
icon
17. API Service Frontend

Tạo service dùng chung:

export const getDailyTasks = () =>
    api.get("/me/tasks?scope=daily");

export const trackTaskEvent = (payload) =>
    api.post("/task-events", payload);

export const claimTaskReward = (taskId) =>
    api.post(`/tasks/${taskId}/claim`);

Phải sử dụng API instance hiện tại của project.

Không tạo API URL riêng trong từng HTML game.

18. HTML Processor

Tạo bước xử lý HTML trước khi lưu:

saveGame(html)
    ↓
processGameHtml(html)
    ↓
injectTaskBridge(html)
    ↓
saveProcessedHtml()

Nên tách:

processGameHtml()
injectTaskBridge()

thành các function/service riêng.

19. Không Inject Bridge nhiều lần

Khi lưu lại HTML nhiều lần, không được tạo:

Bridge
Bridge
Bridge
Bridge

Nên sử dụng marker:

<!-- GAME_TASK_BRIDGE_START -->
...
<!-- GAME_TASK_BRIDGE_END -->

Nếu marker đã tồn tại:

→ Replace/Update Bridge

Không inject thêm.

20. Bridge Version

Nên có version:

window.GameTaskBridge = {
    version: "1.0.0",

    emit(type, data = {}) {
        window.parent.postMessage({
            source: "game",
            type,
            data
        }, "*");
    }
};

Hoặc:

<!-- GAME_TASK_BRIDGE_VERSION: 1.0.0 -->

Mục đích:

Dễ debug.
Có thể cập nhật Bridge.
Có thể migrate HTML cũ.
Tránh nhiều version Bridge chạy cùng lúc.
21. Bảo mật postMessage

Không nên tin tưởng mọi message.

React cần kiểm tra:

event.source
event.origin
event.data.source
event.data.type

Chỉ nhận event từ iframe/game hợp lệ.

Không cho HTML quyết định reward.

Ví dụ HTML không được gửi:

{
    "type": "GAME_WON",
    "rewardCoin": 999999
}

Reward phải do Backend lấy từ cấu hình Task.

22. Claim Reward

Nếu nhiệm vụ yêu cầu người dùng bấm nhận thưởng:

completed = true
claimed = false

Frontend hiển thị:

Đã hoàn thành

[ Nhận thưởng ]

Gọi:

POST /tasks/:taskId/claim

Backend kiểm tra:

completed = true
claimed = false

Sau khi nhận:

claimed = true
claimedAt = ...

Phải sử dụng transaction để tránh nhận thưởng nhiều lần.

23. Ví dụ hoàn chỉnh

User chơi Monopoly và thắng.

HTML:

GameTaskBridge.emit("GAME_PLAYED", {
    gameId: "2345678-2e2232323232-232323232323"
});

GameTaskBridge.emit("GAME_WON", {
    gameId: "2345678-2e2232323232-232323232323"
});

React nhận:

GAME_PLAYED
GAME_WON

React gửi Backend.

Backend tự cập nhật:

Chơi 1 trận       1/1   ✅
Chơi 3 trận       1/3
Chơi 10 trận      1/10
Thắng 1 trận      1/1   ✅
Thắng 3 trận      1/3

HTML không cần biết các Task này tồn tại.

24. Thêm nhiệm vụ mới

Ví dụ thêm:

Chơi 20 trận
+200 coin

Chỉ cần thêm cấu hình:

name = Chơi 20 trận
type = GAME_PLAYED
target = 20
rewardCoin = 200

Không cần sửa:

HTML Game.
Monopoly.
Quiz.
Memory.
Task UI.
API riêng cho Task.
Logic trong từng game.

Game vẫn chỉ gửi:

GameTaskBridge.emit("GAME_PLAYED", {
     gameId: "2345678-2e2232323232-232323232323"
});
25. Lưu HTML gốc và HTML đã Process

Nếu có thể thay đổi database, nên cân nhắc:

originalHtml
processedHtml
bridgeVersion

Trong đó:

originalHtml
→ HTML gốc của game

processedHtml
→ HTML đã inject Bridge

bridgeVersion
→ Version của Task Bridge

Lợi ích:

Khi thay:

Bridge 1.0
    ↓
Bridge 2.0

có thể process lại HTML gốc.

Nếu chưa muốn thay database, ít nhất phải có marker/version để quản lý HTML đã inject.

26. Cấu trúc Backend
modules/
└── tasks/
    ├── task.controller
    ├── task.service
    ├── task-engine.service
    ├── task-event.service
    ├── user-task-progress.service
    ├── reward.service
    └── ...
27. Cấu trúc Frontend
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
28. Cấu trúc HTML Processor
game-html/
├── processGameHtml.js
├── injectTaskBridge.js
└── taskBridge.js
29. Thứ tự Refactor
Phase 1 – Backend
Refactor bảng tasks.
Tạo user_task_progress.
Tạo task_events.
Tạo TaskEngineService.
Tạo API POST /task-events.
Tạo API lấy Task.
Tạo API claim reward.
Thêm idempotency cho eventId.
Thêm transaction cho reward.
Phase 2 – HTML Processor
Tạo processGameHtml.
Tạo injectTaskBridge.
Inject Bridge khi Save HTML.
Chống inject trùng.
Thêm Bridge version.
Đảm bảo HTML cũ vẫn chạy bình thường.
Phase 3 – React
Tạo taskService.
Tạo useTasks.
Refactor UI Task lấy dữ liệu từ API.
Lắng nghe postMessage.
Gửi event lên Backend bằng API instance hiện tại.
Hiển thị progress/completed/reward.
Phase 4 – HTML Game
Xác định điểm phát event.
Thêm GameTaskBridge.emit(...).
Không thêm logic Task.
Test game độc lập.
Test game trong iframe.
Phase 5 – Test

Test:

- GAME_STARTED
- GAME_PLAYED
- GAME_WON
- GAME_LOST
- QUESTION_ANSWERED
- ANSWER_CORRECT
- XP_EARNED
- Một event cập nhật nhiều Task
- Task đạt target
- Task chưa đạt target
- Event gửi trùng
- Claim reward trùng
- Daily reset
- Weekly reset
- Task riêng game
- Task áp dụng tất cả game
- Task inactive
- Save HTML nhiều lần không inject trùng
- HTML cũ không bị hỏng
30. Kết quả cuối cùng
                    SAVE HTML
                       │
                       ▼
                HTML PROCESSOR
                       │
                       ▼
              Inject Task Bridge
                       │
                       ▼
                  Store HTML


                    PLAY GAME
                       │
                       ▼
                   HTML GAME
                       │
                       │ emit event
                       ▼
                  postMessage
                       │
                       ▼
                     REACT
                       │
                       │ API Service hiện tại
                       ▼
                  BACKEND API
                       │
                       ▼
                  TASK ENGINE
                       │
              ┌────────┴────────┐
              ▼                 ▼
          Progress           Reward
Nguyên tắc cuối cùng

HTML Game không quản lý nhiệm vụ.

HTML Game không gọi trực tiếp Task API.

HTML Game chỉ phát Event thông qua GameTaskBridge.

React nhận Event từ iframe bằng postMessage.

React sử dụng API service hiện tại để gửi Event lên Backend.

Backend quyết định nhiệm vụ nào được cập nhật, progress bao nhiêu và reward bao nhiêu.

Task được cấu hình bằng type + target + scope + gameId + reward.

Inject Bridge tự động lúc lưu HTML để chuẩn hóa các game hiện tại và giúp thêm game mới dễ dàng.


- Sau khi phân tích yêu cầu rồi thì có thể làm ở các file html sau F:\Clone\edu_game\educational-games\src\games\dungeon-quest để làm mẫu trước đi