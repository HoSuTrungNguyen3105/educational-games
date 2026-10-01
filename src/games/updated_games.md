# EDU GAME — WEB & GAME FEATURE PLAN

> Tài liệu định hướng phát triển hệ thống Web + Game giáo dục.
>
> **Quan trọng:** Hệ thống hiện tại đã có cấu trúc `games`, `templates` và API câu hỏi đang hoạt động. Các tính năng mới phải được xây dựng **trên nền tảng hiện tại**, không refactor hoặc thay đổi cấu trúc dữ liệu/API đang sử dụng.
>
> Chỉ **bổ sung field mới** khi một tính năng hoặc một loại game thực sự cần.

---

# 1. MỤC TIÊU HỆ THỐNG

EDU GAME là nền tảng giúp giáo viên:

* Tạo lớp học
* Quản lý học sinh
* Chọn game
* Chọn bộ câu hỏi
* Tạo hoạt động học tập
* Giao hoạt động cho học sinh
* Theo dõi kết quả

Học sinh có thể:

* Tham gia lớp
* Nhận nhiệm vụ
* Chơi game
* Học thông qua gameplay
* Nhận XP / Coin / Reward
* Theo dõi thành tích
* Tham gia game multiplayer

Luồng chính:

```text
GIÁO VIÊN
    │
    ▼
  CHỌN GAME
    │
    ▼
CHỌN CÂU HỎI
    │
    ▼
TẠO HOẠT ĐỘNG
    │
    ▼
GIAO CHO LỚP
    │
    ▼
HỌC SINH
    │
    ▼
  CHƠI GAME
    │
    ▼
  KẾT QUẢ
    │
    ▼
GIÁO VIÊN XEM
```

---

# 2. PHẠM VI HIỆN TẠI

## Tập trung phát triển

### Web giáo viên

* Dashboard
* Class Management
* Student Management
* Game Library
* Game Management
* Question Bank
* Activity
* Assignment
* Result
* Analytics

### Web học sinh

* Home
* Task / Assignment
* Game
* Result
* Profile
* Achievement
* XP / Level / Coin

### Game

* Game Template
* Game Player
* Question
* Score
* Timer
* Progress
* Result
* Play to Learn
* Play to Win
* Solo
* Multiplayer

---

# 3. KHÔNG LÀM TRONG GIAI ĐOẠN HIỆN TẠI

Không đưa các tính năng sau vào scope hiện tại:

* [ ] Quên mật khẩu
* [ ] Xác thực email
* [ ] Email verification
* [ ] Email notification
* [ ] Payment
* [ ] Subscription
* [ ] Marketplace
* [ ] Admin system nâng cao

Các tính năng trên có thể bổ sung ở phase sau.

**Ưu tiên hiện tại là Web + Game + Learning Flow.**

---

# 4. NGUYÊN TẮC DATABASE

## 4.1. Không thay đổi cấu trúc hiện tại

Hệ thống hiện tại đã có:

```text
games
templates
questions
```

Không được tự ý:

* Xóa field hiện tại
* Rename field hiện tại
* Đổi kiểu dữ liệu field hiện tại
* Di chuyển dữ liệu sang collection khác
* Tách `games` thành nhiều collection
* Tách `templates` thành nhiều collection
* Thay đổi quan hệ hiện tại
* Thay đổi API đang sử dụng
* Thay đổi response của API câu hỏi

---

# 5. CHỈ ĐƯỢC MỞ RỘNG

Nếu game mới cần dữ liệu mà schema hiện tại chưa có:

```text
SCHEMA HIỆN TẠI
       +
FIELD MỚI
       =
MỞ RỘNG
```

Không được:

```text
SCHEMA CŨ
   ↓
REFACTOR
   ↓
SCHEMA MỚI
```

Mục tiêu:

> **Backward Compatible**

Game cũ phải tiếp tục hoạt động sau khi thêm game mới.

---

# 6. TEMPLATE

`templates` vẫn giữ cấu trúc hiện tại.

Các thông tin hiện tại tiếp tục được sử dụng, ví dụ:

```text
_id
slug
name
description
category
categoryLabel
icon
ring
htmlTemplate
...
```

Không thay đổi các field đang có.

---

# 7. HTML GAME

HTML game tiếp tục được lưu trong:

```text
templates.htmlTemplate
```

`htmlTemplate` chứa toàn bộ:

```text
HTML
+
CSS
+
JavaScript
```

Ví dụ:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* CSS */
    </style>
</head>

<body>

    <!-- Game UI -->

    <script>
        // Game logic
    </script>

</body>
</html>
```

Không tạo thêm một cơ chế lưu HTML game khác.

---

# 8. PHÁT TRIỂN GAME HTML

Trong quá trình development có thể tổ chức:

```text
src/games/

├── quiz/
│   └── index.html
│
├── maze/
│   └── index.html
│
├── drag-drop/
│   └── index.html
│
└── adventure/
    └── index.html
```

Mỗi game có thể phát triển bằng một file:

```text
index.html
```

bao gồm:

```text
HTML
CSS
JavaScript
```

Sau khi hoàn thiện:

```text
index.html
    ↓
htmlTemplate
    ↓
templates
    ↓
Game Player
```

---

# 9. GAMES

Collection `games` hiện tại phải được giữ nguyên.

Game tiếp tục sử dụng:

```text
templateId
```

để liên kết với template hiện tại.

Không chuyển HTML game vào `games` nếu hiện tại HTML đang được lưu trong `templates`.

---

# 10. GAME TYPE

Hệ thống hỗ trợ các loại:

```text
play-to-learn
play-to-win
```

Field `type` hiện tại tiếp tục được sử dụng.

Không tạo collection riêng cho từng loại game.

Ví dụ:

```text
games
│
├── Game A
│   └── type: play-to-learn
│
├── Game B
│   └── type: play-to-win
│
├── Game C
│   └── type: play-to-learn
│
└── Game D
    └── type: play-to-win
```

---

# 11. GAME CONFIG

Khi một game cần cấu hình riêng, chỉ bổ sung field phù hợp.

Có thể sử dụng cấu trúc:

```json
{
  "gameConfig": {
    "timeLimit": 60,
    "lives": 3,
    "difficulty": "easy"
  }
}
```

Tuy nhiên không bắt buộc mọi game phải có toàn bộ field.

Ví dụ:

### Quiz

```text
gameConfig
├── timeLimit
├── shuffleQuestions
└── shuffleAnswers
```

### Maze

```text
gameConfig
├── lives
├── speed
├── mapSize
└── difficulty
```

### Racing

```text
gameConfig
├── laps
├── speed
└── difficulty
```

---

# 12. QUESTION API

## Không thay đổi API câu hỏi hiện tại

API câu hỏi hiện tại đang được frontend/game sử dụng.

Không thay đổi response chỉ để phục vụ game mới.

Ví dụ response hiện tại:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": []
}
```

Tiếp tục giữ nguyên.

---

# 13. QUESTION DATA

Các field câu hỏi hiện tại tiếp tục sử dụng.

Ví dụ:

```json
{
  "content": "...",
  "options": [],
  "correctAnswer": "...",
  "timeLimit": 20,
  "points": 10
}
```

Không đổi tên hoặc xóa các field hiện tại.

---

# 14. MỞ RỘNG QUESTION

Nếu một game cần dữ liệu riêng thì **chỉ thêm field**.

Ví dụ:

```json
{
  "content": "Kéo đáp án vào đúng vị trí",

  "options": [
    "5",
    "10",
    "15"
  ],

  "correctAnswer": "10",

  "timeLimit": 20,
  "points": 10,

  "gameData": {
    "items": [],
    "targets": [],
    "mappings": []
  }
}
```

Game cũ không sử dụng `gameData` thì vẫn chạy bình thường.

---

# 15. GAME-SPECIFIC DATA

Không tạo Question API riêng cho từng game nếu không cần.

Cấu trúc:

```text
QUESTION
│
├── FIELD CHUNG
│   ├── content
│   ├── options
│   ├── correctAnswer
│   ├── timeLimit
│   └── points
│
└── FIELD MỞ RỘNG
    └── gameData
```

---

# 16. VÍ DỤ THEO TỪNG GAME

## 16.1. Quiz

Có thể sử dụng trực tiếp:

```text
content
options
correctAnswer
timeLimit
points
```

Không cần thay đổi Question API.

---

## 16.2. Maze

Có thể bổ sung:

```json
{
  "gameData": {
    "position": {
      "x": 2,
      "y": 4
    }
  }
}
```

Gameplay:

```text
Player
  ↓
Di chuyển
  ↓
Gặp thử thách
  ↓
Load Question
  ↓
Trả lời
  ↓
Đúng → tiếp tục
Sai → penalty
```

---

## 16.3. Drag & Drop

Có thể bổ sung:

```json
{
  "gameData": {
    "items": [],
    "targets": [],
    "mappings": []
  }
}
```

---

## 16.4. Adventure

Có thể bổ sung:

```json
{
  "gameData": {
    "map": {},
    "player": {},
    "objects": [],
    "missions": []
  }
}
```

Đây là dữ liệu mở rộng, không thay thế Question hiện tại.

---

# 17. BACKWARD COMPATIBILITY

Ví dụ dữ liệu cũ:

```json
{
  "content": "5 + 5 = ?",
  "options": [
    "8",
    "10",
    "12"
  ],
  "correctAnswer": "10"
}
```

Sau khi mở rộng:

```json
{
  "content": "5 + 5 = ?",
  "options": [
    "8",
    "10",
    "12"
  ],
  "correctAnswer": "10",

  "gameData": {}
}
```

Game cũ vẫn phải hoạt động.

---

# 18. WEB GIÁO VIÊN

## 18.1. Dashboard

Hiện tại:

* [x] Dashboard
* [x] Tổng quan
* [x] Game Management
* [x] Class Management

Cải thiện:

* [ ] Tổng số lớp
* [ ] Tổng số học sinh
* [ ] Tổng số game
* [ ] Hoạt động gần đây
* [ ] Hoạt động đang diễn ra
* [ ] Tỷ lệ hoàn thành
* [ ] Điểm trung bình
* [ ] Học sinh cần chú ý

---

# 19. CLASS MANAGEMENT

## Danh sách lớp

* [x] Danh sách lớp
* [x] Tạo lớp
* [x] Mã lớp
* [x] Xem lớp
* [ ] Chỉnh sửa lớp
* [ ] Đóng lớp
* [ ] Xóa lớp

---

# 20. CLASS DETAIL

Tabs:

```text
Tổng quan
Học sinh
Hoạt động
Kết quả
```

### Học sinh

* [x] Danh sách học sinh
* [ ] Tìm kiếm
* [ ] Profile
* [ ] XP
* [ ] Level
* [ ] Lịch sử chơi
* [ ] Kết quả học tập

---

# 21. GAME LIBRARY

Giữ nguyên Game Library hiện tại.

Cải thiện:

* [x] Danh sách game
* [x] Category
* [x] Search
* [x] Filter
* [ ] Filter môn học
* [ ] Filter lớp
* [ ] Filter độ khó
* [ ] Filter game type
* [ ] Preview game

---

# 22. QUESTION BANK

Giáo viên có thể quản lý bộ câu hỏi.

Chức năng:

* [ ] Tạo bộ câu hỏi
* [ ] Chỉnh sửa
* [ ] Xóa
* [ ] Thêm câu hỏi
* [ ] Chỉnh sửa câu hỏi
* [ ] Xóa câu hỏi
* [ ] Preview
* [ ] Duplicate
* [ ] Search
* [ ] Filter

Không thay đổi cấu trúc Question API hiện tại.

---

# 23. CREATE ACTIVITY

Activity là nơi kết nối:

```text
GAME
+
QUESTION
+
CLASS
```

Ví dụ:

```text
Tên:
Ôn tập phép nhân

Game:
Mê cung phép tính

Question Set:
Phép nhân lớp 3

Class:
3A

Thời gian:
20 phút
```

Có thể bổ sung:

* [ ] Chọn game
* [ ] Chọn question set
* [ ] Chọn class
* [ ] Đặt tên
* [ ] Deadline
* [ ] Số lần chơi
* [ ] Random câu hỏi
* [ ] Random đáp án

---

# 24. ASSIGNMENT

Flow:

```text
Activity
    ↓
Assign
    ↓
Class
    ↓
Students
```

Trạng thái:

```text
Chưa bắt đầu
      ↓
Đang chơi
      ↓
Hoàn thành
      ↓
Hết hạn
```

---

# 25. WEB HỌC SINH

## Home

Hiển thị:

```text
Xin chào 👋

Level
XP
Coin

Nhiệm vụ hôm nay
Game đang chơi
Game đề xuất
```

---

# 26. STUDENT TASK

Các trạng thái:

```text
Tất cả
Chưa làm
Đang làm
Đã hoàn thành
```

Thông tin:

```text
Tên hoạt động
Game
Giáo viên
Deadline
Điểm
Trạng thái
```

---

# 27. GAME PLAYER

Flow:

```text
Load Template
      ↓
Load Question
      ↓
Initialize Game
      ↓
Student Play
      ↓
Submit Answer
      ↓
Calculate Result
      ↓
Finish
```

Game Player không được hard-code câu hỏi:

```javascript
const question = "5 + 5 = ?";
```

Thay vào đó:

```text
Game Template
      ↓
Question API
      ↓
Question Data
      ↓
Game Render
```

---

# 28. GAME RESULT

Sau khi hoàn thành game có thể hiển thị:

```text
🎉 HOÀN THÀNH!

Score: 850

Correct: 18 / 20

Time: 04:32

+100 XP
+30 Coin
```

Có thể:

```text
[ CHƠI LẠI ]

[ VỀ TRANG CHỦ ]
```

Nếu backend hiện tại đã có Result thì giữ nguyên cấu trúc, chỉ bổ sung field cần thiết.

---

# 29. PLAY TO LEARN

```text
type = play-to-learn
```

Mục tiêu:

```text
Học kiến thức
    ↓
Chơi
    ↓
Trả lời
    ↓
Feedback
    ↓
Hoàn thành
```

Game phù hợp:

* Quiz
* Maze
* Matching
* Drag & Drop
* Puzzle

---

# 30. PLAY TO WIN

```text
type = play-to-win
```

Mục tiêu:

```text
Gameplay
    ↓
Challenge
    ↓
Score
    ↓
Win
```

Game phù hợp:

* Racing
* Adventure
* Treasure
* Collection
* Competition

---

# 31. SOLO MODE

Học sinh có thể chơi một mình:

```text
Student
   ↓
Select Game
   ↓
Select Difficulty
   ↓
Play
   ↓
Result
```

---

# 32. MULTIPLAYER MODE

Tận dụng Socket hiện tại.

Flow:

```text
Teacher
   ↓
Create Room
   ↓
Room Code
   ↓
Students Join
   ↓
Ready
   ↓
Start
   ↓
Realtime Game
   ↓
Leaderboard
   ↓
Result
```

Không thay đổi Question API để phục vụ multiplayer.

---

# 33. XP / LEVEL / COIN

## XP

Nhận XP khi:

```text
Trả lời đúng
+
Hoàn thành game
+
Hoàn thành nhiệm vụ
```

## Level

```text
Level 1
 ↓
Level 2
 ↓
Level 3
 ↓
...
```

## Coin

Có thể sử dụng cho:

```text
Shop
Avatar
Skin
Pet
House
Item
```

---

# 34. ACHIEVEMENT

Ví dụ:

```text
🏆 First Game
Hoàn thành game đầu tiên

⭐ Perfect
100% câu đúng

🔥 Streak
Học liên tục

🧠 Math Master
Hoàn thành nhiều game Toán
```

---

# 35. DAILY MISSION

Có thể bổ sung:

```text
☐ Chơi 1 game
☐ Trả lời đúng 10 câu
☐ Kiếm 100 XP
☐ Hoàn thành 2 nhiệm vụ
```

Reward:

```text
+ XP
+ Coin
```

---

# 36. ADVENTURE SYSTEM

Phát triển sau Core Game.

Ví dụ:

```text
QUEST
  ↓
COMPLETE LEARNING TASK
  ↓
GET RESOURCE
  ↓
BUILD / COLLECT
  ↓
UNLOCK AREA
```

Có thể có:

* Treasure
* Mining
* Planting
* Building
* Pet
* Item
* Quest
* Collection

---

# 37. GAME SESSION

Nếu cần lưu trạng thái một lần chơi:

```text
Game
  ↓
Game Session
  ↓
Student
  ↓
Result
```

Có thể bổ sung:

```text
gameId
studentId
activityId
startedAt
completedAt
status
score
```

Chỉ thêm nếu hệ thống hiện tại chưa có cơ chế tương ứng.

---

# 38. RESULT ANALYTICS

Giáo viên cần xem:

```text
Hoàn thành: 27 / 32

Điểm trung bình: 78%

Cao nhất: 100
Thấp nhất: 42
```

Danh sách:

```text
Học sinh       Điểm       Trạng thái

Nguyễn An      95         Hoàn thành
Minh Anh       90         Hoàn thành
Hoàng Nam      72         Hoàn thành
Lan            --         Chưa làm
```

Có thể phân tích:

* Điểm
* Câu đúng
* Câu sai
* Thời gian
* Câu hỏi khó
* Câu hỏi dễ
* Số lần chơi
* Tỷ lệ hoàn thành

---

# 39. DATA FLOW TỔNG THỂ

```text
                 TEMPLATE
                    │
                    │ templateId
                    ▼
                  GAME
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
        GAME CONFIG     QUESTION
                            │
                            ▼
                      GAME PLAYER
                            │
                            ▼
                         STUDENT
                            │
                            ▼
                         RESULT
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
                 XP                 ANALYTICS
                COIN
```

---

# 40. TEACHER → GAME → STUDENT

Flow hoàn chỉnh:

```text
Teacher
   ↓
Create / Select Class
   ↓
Select Game
   ↓
Select Question Set
   ↓
Create Activity
   ↓
Assign
   ↓
Student
   ↓
Open Activity
   ↓
Load Template
   ↓
Load Questions
   ↓
Play
   ↓
Result
   ↓
Teacher Analytics
```

---

# 41. PHASE 1 — GAME CORE

Ưu tiên hoàn thiện trước:

* [x] Game Template
* [x] HTML Game
* [x] CSS Game
* [x] JavaScript Game
* [x] Question API
* [ ] Game Player ổn định
* [ ] Score
* [ ] Timer
* [ ] Progress
* [ ] Correct / Wrong Feedback
* [ ] Game Over
* [ ] Retry
* [ ] Result Screen

Ưu tiên **2–3 game đầu tiên thật ổn định** trước khi mở rộng số lượng game.

---

# 42. PHASE 2 — TEACHER WEB

* [x] Dashboard
* [x] Game Library
* [x] Game Management
* [x] Class Management
* [ ] Question Bank hoàn chỉnh
* [ ] Activity
* [ ] Assignment
* [ ] Result
* [ ] Analytics

---

# 43. PHASE 3 — STUDENT WEB

* [x] Login
* [x] Register
* [ ] Home
* [ ] Assignment
* [ ] Game
* [ ] Result
* [ ] Profile

---

# 44. PHASE 4 — GAMIFICATION

* [ ] XP
* [ ] Level
* [ ] Coin
* [ ] Achievement
* [ ] Mission
* [ ] Streak
* [ ] Reward

---

# 45. PHASE 5 — MULTIPLAYER

* [ ] Room
* [ ] Join
* [ ] Ready
* [ ] Start
* [ ] Realtime State
* [ ] Realtime Score
* [ ] Leaderboard
* [ ] Result

---

# 46. PHASE 6 — ADVANCED GAME

Sau khi Core Game ổn định:

* [ ] Maze
* [ ] Drag & Drop
* [ ] Racing
* [ ] Adventure
* [ ] Treasure
* [ ] Mining
* [ ] Planting
* [ ] Building
* [ ] Collection

---

# 47. QUY TẮC PHÁT TRIỂN GAME MỚI

Mỗi khi thêm một game mới:

### Bước 1

Xác định:

```text
Game Type
```

Ví dụ:

```text
play-to-learn
```

### Bước 2

Kiểm tra template hiện tại có đáp ứng được không.

### Bước 3

Kiểm tra Question API hiện tại có đáp ứng được không.

### Bước 4

Nếu thiếu dữ liệu:

```text
THÊM FIELD
```

Không sửa field cũ.

### Bước 5

Phát triển HTML + CSS + JS.

### Bước 6

Đưa HTML game vào:

```text
templates.htmlTemplate
```

### Bước 7

Kết nối:

```text
Game
+
Question
+
Game Player
+
Result
```

### Bước 8

Kiểm tra game cũ.

---

# 48. CHECKLIST BACKWARD COMPATIBILITY

Trước khi merge game mới:

* [ ] Game cũ vẫn load được
* [ ] Template cũ vẫn load được
* [ ] Question API không thay đổi response
* [ ] Question cũ vẫn render được
* [ ] Game cũ không yêu cầu field mới
* [ ] API cũ vẫn hoạt động
* [ ] `games` không bị đổi cấu trúc
* [ ] `templates` không bị đổi cấu trúc
* [ ] `htmlTemplate` vẫn hoạt động
* [ ] Không phát sinh migration không cần thiết

---

# 49. CORE PRODUCT

Core của EDU GAME không phải là số lượng game.

Core là:

```text
       TEACHER
          │
          ▼
       ACTIVITY
          │
          ▼
         GAME
          │
          ▼
       STUDENT
          │
          ▼
        RESULT
          │
          ▼
      ANALYTICS
```

Khi flow này hoạt động ổn định, hệ thống đã có nền tảng chính.

Các tính năng:

```text
XP
Coin
Level
Achievement
Mission
Multiplayer
Adventure
Pet
House
Mining
Treasure
Shop
```

là lớp **Gamification / Advanced Game**, phát triển sau.

---

# 50. KẾT LUẬN

Hệ thống hiện tại được xem là nền tảng gốc.

## Giữ nguyên

```text
templates
games
questions
Question API
Game Template
htmlTemplate
```

## Được phép mở rộng

```text
gameConfig
gameData
session data
result data
gamification data
```

khi thực sự cần.

Nguyên tắc quan trọng nhất:

> **Không thay đổi cấu trúc database và API hiện tại chỉ để phục vụ một tính năng hoặc một game mới.**

> **Game mới phải thích nghi với kiến trúc hiện tại; chỉ bổ sung field cần thiết để hỗ trợ gameplay mới.**

> **HTML + CSS + JavaScript của game vẫn được quản lý thông qua `templates.htmlTemplate`.**

> **Question API và cấu trúc câu hỏi hiện tại tiếp tục được sử dụng. Nếu một loại game cần dữ liệu đặc biệt, chỉ thêm field mở rộng, không thay thế field cũ.**

Mục tiêu cuối cùng:

```text
                 EDU GAME
                    │
        ┌───────────┴───────────┐
        │                       │
     TEACHER                 STUDENT
        │                       │
        ▼                       ▼
     ACTIVITY                 TASK
        │                       │
        └──────────┬────────────┘
                   ▼
                 GAME
                   │
          ┌────────┴────────┐
          ▼                 ▼
      QUESTION           GAMEPLAY
          │                 │
          └────────┬────────┘
                   ▼
                 RESULT
                   │
          ┌────────┴────────┐
          ▼                 ▼
       ANALYTICS        GAMIFICATION
```

**Ưu tiên: hoàn thiện vòng đời Web → Activity → Game → Question → Student → Result trước, sau đó mới mở rộng Gamification, Multiplayer và Adventure.**

---

# 51. ĐÃ TRIỂN KHAI — KHÉP KÍN CORE FLOW

Phần này ghi lại phần **đã có trong code** sau khi triển khai §40 và §49.
Toàn bộ thay đổi đều là **bổ sung**, không sửa/xóa/rename field hay API cũ.

## 51.1. Field mới được thêm

### `users`

```json
{
  "xp": 0,
  "coinsEarnedOn": "2026-01-31",
  "coinsEarnedToday": 120
}
```

Cả 3 field đều **optional**. User cũ không có vẫn đọc được như trước.

| Field | Ý nghĩa |
| --- | --- |
| `xp` | XP tích luỹ từ game |
| `coinsEarnedOn` | Ngày đang tính coin thưởng (`YYYY-MM-DD`) |
| `coinsEarnedToday` | Tổng coin đã kiếm trong ngày đó (chặn spam) |

Level tính từ `xp`, không lưu riêng:

```text
level = floor(xp / 120) + 1
```

`120` là `XP_PER_LEVEL`, đồng nhất với `miniGameService.js`.

### `results`

```json
{
  "userId": "u-...",
  "playId": "play-...",
  "verified": true,
  "xpGained": 40,
  "coinGained": 0,
  "source": "html-game",
  "playMode": "assignment",

  "assignmentId": "asgn-...",
  "submissionId": "sub-...",
  "gameScore": 880
}
```

Tất cả đều **optional** → document cũ ghi qua `POST /api/results` vẫn hợp lệ.

`verified` cho biết kết quả đã được server chấm (`true`) hay mới nhận điểm
tự khai từ client (`false`). Chỉ `verified = true` mới được cộng XP.

Các field cũ (`gameId`, `playerId`, `playerName`, `score`,
`correctAnswers`, `totalQuestions`, `accuracy`, `completionTime`)
giữ **nguyên tên và nguyên ý nghĩa**.

## 51.2. Endpoint mới

```text
POST /api/game-plays/complete
```

Chốt ván chơi khi học sinh **đã đăng nhập**.

```json
{
  "gameId": "...",
  "playerName": "An",
  "playId": "play-xxx",
  "answers": [{ "questionId": "q1", "value": "b", "timeSpent": 6 }],
  "questionIds": ["q1", "q2"],
  "clientScore": 880,
  "timeUsed": 64,
  "gameType": "play-to-learn",
  "playMode": "solo"
}
```

Quy tắc:

```text
có answers + có câu hỏi trong DB  → server chấm lại, BỎ QUA `clientScore`
                                   verified = true  → được cộng XP
không answers / không có câu hỏi → dùng `clientScore` nhưng chặn trần 100000
                                   verified = false → KHÔNG cộng XP
```

`verified = false` giữ cho game cũ (chưa dùng `EG_ANSWER`) vẫn có điểm trên
bảng xếp hạng, đồng thời đảm bảo không ai gian lận XP bằng cách tự khai điểm.

Trả về document `results` (cấu trúc cũ) **cộng thêm**:

```json
{
  "xpGained": 40,
  "profile": {
    "xp": 40,
    "level": 1,
    "xpIntoLevel": 40,
    "xpPerLevel": 120,
    "leveledUp": false
  },
  "verified": true,
  "replayed": false
}
```

---

```text
POST /api/game-plays/assignment
```

Ghi nhận ván chơi của một bài giao **đã nộp xong**. Không chấm lại — đọc kết quả
đã lưu trong `submissions`, rồi ghi `results` + cấp XP.

```json
{
  "submissionId": "sub-...",
  "playId": "play-xxx",
  "gameScore": 880,
  "timeUsed": 64
}
```

---

```text
POST /api/game-plays/reward-coins
```

Game tự thưởng coin (ví dụ XO thắng). Trần **500 coin/ngày/user** nên iframe
không thể spam `add-coins` vô hạn.

```json
{ "amount": 50 }
```

---

```text
GET /api/auth/me/xp
```

```json
{ "xp": 40, "level": 1, "xpIntoLevel": 40, "xpPerLevel": 120 }
```

**Không có** endpoint nào cho phép tự cộng XP từ client.

## 51.3. Bridge cho game HTML

Bridge được **tiêm lúc chạy** (không phải lúc lưu), nên không cần sửa
`templates.htmlTemplate` đã có:

```javascript
// trong game HTML
EG_ANSWER.answer(questionId, value, timeSpent);
EG_ANSWER.answerAll([{ questionId, value, timeSpent }]);
EG_ANSWER.getAnswers();   // [{ questionId, value, timeSpent }]
EG_ANSWER.clear();

// Hoặc gửi thẳng kết quả (mặc định lấy answers từ getAnswers())
EG_ANSWER.finish({ score, correct, totalQuestions, timeUsed, coinReward });
```

Nếu game không dùng `EG_ANSWER` (game cũ):

* vẫn chạy bình thường — bridge chỉ là script thêm vào
* `answers` gửi lên rỗng → server không chấm được → `score = 0`
* muốn nhận XP, game cần gọi `EG_ANSWER.answer(...)` khi học sinh trả lời

## 51.4. Assignment chạy được game

`GET /api/assignments/resolve/:code` trả thêm field (đều optional):

```json
{
  "gameId": "...",
  "templateId": "..."
}
```

Client chỉ bật chế độ game khi **cả hai điều kiện** đúng:

```text
assignment.gameId có giá trị
AND template.htmlTemplate khác rỗng
```

Nếu không → giữ nguyên form trắc nghiệm như cũ.

Lý do kiểm tra `htmlTemplate`: `PlayGameScreen` (React fallback) so sánh
`q.correctAnswer`, mà field này **bị API cắt khỏi response cho học sinh**.
Nếu không có guard, mọi câu sẽ bị chấm sai.

## 51.5. Luồng đầy đủ sau khi triển khai

```text
GIÁO VIÊN
  AssignmentCreate: chọn Game + Question Set + Class
        │
        ▼
  HỌC SINH mở /assignment/:code
        │
        ├─ có htmlTemplate ──→ HtmlGameLoader (iframe)
        │                        game tự dùng questions từ init
        │                        EG_ANSWER.answer() mỗi câu
        │                            ↓
        │                   POST /assignments/:id/submit   (server chấm)
        │                            ↓
        │                   POST /game-plays/assignment    (results + XP)
        │                            ↓
        │                       Màn hình kết quả
        │
        └─ không có ────────→ form trắc nghiệm (như cũ)

CHƠI TỰ DO (StudentApp)
  GamePlayRouter
        ↓
  POST /game-plays/complete   (server chấm từ answers + cấp XP)
        ↓
  Màn hình kết quả + XP/Level
```

## 51.6. Công thức XP (server-side)

XP **chỉ** được cấp khi `verified === true` (server đã chấm từ `answers`).

```text
play-to-learn:
    trả lời đúng : 5 XP / câu
    hoàn thành   : 10 XP   (chỉ khi có ít nhất 1 câu đúng)
    tỷ lệ đúng   : floor(accuracy / 100 × 20)   (tối đa 20 XP)

play-to-win: không cộng (không có câu hỏi để xác thực)
```

Chống spam:

```text
XP   : tối đa 50 ván nhận XP / game / ngày / user
Coin : tối đa 500 coin / ngày / user
Score: chặn trần 100000 khi unverified
```

## 51.7. Idempotency

`playId` do client sinh 1 lần cho mỗi lượt chơi. Gửi lại cùng `playId`
→ server trả lại kết quả cũ, **không** cộng XP/coin lần 2:

```text
results có { userId, playId }  →  index (db.js)
```

## 51.8. Checklist backward compatibility (§48)

| Mục | Trạng thái |
| --- | --- |
| Game cũ vẫn load được | OK — chỉ thêm script bridge khi chạy |
| Template cũ vẫn load được | OK — không đổi `templates.htmlTemplate` |
| Question API không đổi response | OK — `routes/questions.js` không bị sửa |
| Question cũ vẫn render được | OK — không thêm field bắt buộc nào |
| Game cũ không yêu cầu field mới | OK — bridge là optional |
| API cũ vẫn hoạt động | OK — `POST /api/results` giữ nguyên |
| `games` không đổi cấu trúc | OK |
| `templates` không đổi cấu trúc | OK |
| `htmlTemplate` vẫn hoạt động | OK |
| Không phát sinh migration | OK — field mới đều optional, đọc bằng `|| 0` |
