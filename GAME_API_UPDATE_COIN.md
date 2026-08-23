# Thiết kế Coin và tiến trình người chơi cho hệ thống nhiều game

## 1. Mục tiêu

Hệ thống có nhiều trò chơi khác nhau dành cho trẻ em, ví dụ:

* Làng của tôi
* Happywheel
* Ninja Vượt Ải Từ Vựng
* Hầm Ngục Kiến Thức
* Đại Phiêu Lưu Toán Học
* Phân loại rác thải
* Các trò chơi khác trong tương lai

Do mỗi game có gameplay và cơ chế phần thưởng khác nhau, **Coin nên được quản lý riêng theo từng game** thay vì dùng chung cho toàn bộ tài khoản.

---

## 2. Không lưu Coin trực tiếp trong User Profile

### User Profile

Profile chỉ chứa thông tin chung của người chơi:

```json
{
  "_id": "...",
  "username": "kid01",
  "name": "Nguyễn Minh",
  "email": null,
  "avatar": null,
  "role": "user"
}
```

Không nên đặt:

```json
{
  "coins": 1250
}
```

trực tiếp trong User.

Lý do:

* User có thể chơi nhiều game.
* Mỗi game có nền kinh tế riêng.
* Coin của game này không nên ảnh hưởng đến game khác.
* Dễ mở rộng thêm game mới.
* Tránh việc người chơi kiếm quá nhiều Coin ở một game rồi mang sang game khác.

---

# 3. Coin riêng theo từng game

Mỗi quan hệ giữa `User` và `Game` sẽ có một dữ liệu tiến trình riêng.

Ví dụ:

```json
{
  "userId": "...",
  "gameId": "game-001",
  "coins": 1250,
  "level": 8,
  "experience": 740,
  "progress": 75,
  "gamesPlayed": 24,
  "questsCompleted": 18
}
```

Có thể gọi collection/model này là:

```text
UserGameProgress
```

hoặc:

```text
GameProgress
```

---

# 4. Quan hệ dữ liệu

```text
User
 │
 ├── Game: Làng của tôi
 │    ├── coins: 1250
 │    ├── level: 8
 │    ├── experience: 740
 │    └── inventory: [...]
 │
 ├── Game: Ninja Vượt Ải Từ Vựng
 │    ├── coins: 430
 │    ├── level: 5
 │    ├── experience: 320
 │    └── inventory: [...]
 │
 ├── Game: Đại Phiêu Lưu Toán Học
 │    ├── coins: 820
 │    ├── level: 6
 │    └── experience: 510
 │
 └── Game: Hầm Ngục Kiến Thức
      ├── coins: 210
      ├── level: 3
      └── experience: 180
```

Một User có thể có nhiều `UserGameProgress`.

---

# 5. Ví dụ thực tế

## Làng của tôi

Coin có thể dùng để:

* Xây nhà
* Mua đất
* Mua cây
* Mua vật liệu
* Nâng cấp nhà
* Mua đồ trang trí
* Mở khu vực mới

```json
{
  "userId": "user-001",
  "gameId": "game-village",
  "coins": 1250,
  "level": 8,
  "experience": 740
}
```

## Ninja Vượt Ải Từ Vựng

Coin có thể dùng để:

* Mua vật phẩm hỗ trợ
* Mở skin
* Mở nhân vật
* Nâng cấp kỹ năng

```json
{
  "userId": "user-001",
  "gameId": "game-ninja",
  "coins": 430,
  "level": 5,
  "experience": 320
}
```

Hai game này **không sử dụng chung 1.680 Coin**.

Mỗi game có số Coin riêng.

---

# 6. API Profile

API:

```http
GET /api/users/me
```

Response:

```json
{
  "_id": "...",
  "username": "kid01",
  "name": "Nguyễn Minh",
  "email": null,
  "avatar": null,
  "role": "user"
}
```

API này chỉ trả về thông tin chung của tài khoản.

---

# 7. API danh sách game của User

API:

```http
GET /api/users/me/games
```

Response:

```json
[
  {
    "gameId": "game-001",
    "name": "Làng của tôi",
    "progress": 75,
    "level": 8,
    "coins": 1250,
    "lastPlayedAt": "2026-08-23T09:20:00Z"
  },
  {
    "gameId": "game-002",
    "name": "Ninja Vượt Ải Từ Vựng",
    "progress": 42,
    "level": 5,
    "coins": 430,
    "lastPlayedAt": "2026-08-22T15:10:00Z"
  },
  {
    "gameId": "game-003",
    "name": "Đại Phiêu Lưu Toán Học",
    "progress": 60,
    "level": 6,
    "coins": 820,
    "lastPlayedAt": "2026-08-21T10:00:00Z"
  }
]
```

API này dùng cho màn hình danh sách game.

---

# 8. API tiến trình của một Game

Khi người chơi chọn một game:

```http
GET /api/users/me/games/:gameId
```

Ví dụ:

```http
GET /api/users/me/games/game-001
```

Response:

```json
{
  "gameId": "game-001",
  "progress": 75,
  "level": 8,
  "experience": 740,
  "coins": 1250,
  "gamesPlayed": 24,
  "questsCompleted": 18
}
```

Nếu game có hệ thống vật phẩm:

```json
{
  "gameId": "game-001",
  "progress": 75,
  "level": 8,
  "experience": 740,
  "coins": 1250,
  "inventory": [
    {
      "itemId": "wood",
      "quantity": 120
    },
    {
      "itemId": "gold",
      "quantity": 35
    }
  ]
}
```

---

# 9. Level và Experience

`level` và `experience` cũng nên **riêng theo từng game** nếu mỗi game có gameplay khác nhau.

Ví dụ:

```text
Làng của tôi
Level 8
XP 740

Ninja Vượt Ải
Level 5
XP 320

Đại Phiêu Lưu Toán Học
Level 6
XP 510
```

Không nên dùng một Level duy nhất cho tất cả game nếu mỗi game có hệ thống phát triển riêng.

---

# 10. Điểm chung của toàn hệ thống

Nếu muốn tạo cảm giác người chơi có một tài khoản phát triển xuyên suốt nhiều game, có thể thêm một hệ thống riêng:

```json
{
  "totalExperience": 12500,
  "achievementPoints": 320,
  "achievements": [...]
}
```

Các dữ liệu này mang tính **toàn hệ thống**, không phải dữ liệu của từng game.

Ví dụ:

* Tổng XP
* Thành tựu
* Huy hiệu
* Số game đã chơi
* Số nhiệm vụ đã hoàn thành
* Thành tích đặc biệt

Không dùng `coins` chung cho phần này.

---

# 11. Cấu trúc đề xuất

```text
User
│
├── Profile
│   ├── username
│   ├── name
│   ├── email
│   ├── avatar
│   └── role
│
├── UserGameProgress
│   ├── gameId
│   ├── coins
│   ├── level
│   ├── experience
│   ├── progress
│   ├── gamesPlayed
│   ├── questsCompleted
│   └── inventory
│
└── UserAchievements
    ├── achievements
    ├── achievementPoints
    └── totalExperience
```

---

# 12. Nguyên tắc quan trọng

### Coin

```text
Coin = riêng từng Game
```

### Level

```text
Level = riêng từng Game
```

### Experience

```text
Experience = riêng từng Game
```

### Inventory

```text
Inventory = riêng từng Game
```

### Quest

```text
Quest = riêng từng Game
```

### Achievement

```text
Achievement = có thể dùng chung toàn hệ thống
```

### Profile

```text
Profile = chỉ chứa thông tin tài khoản chung
```

---

# 13. Kết luận

Với hệ thống có nhiều game khác nhau, kiến trúc nên là:

```text
User
   │
   ├── Profile chung
   │
   ├── Game 1 → Coin + Level + XP + Inventory
   │
   ├── Game 2 → Coin + Level + XP + Inventory
   │
   ├── Game 3 → Coin + Level + XP + Inventory
   │
   └── Game N → Coin + Level + XP + Inventory
```

**Không nên dùng Coin chung cho toàn bộ game.**

Cách này giúp mỗi game có thể tự xây dựng nền kinh tế, vật phẩm, nhiệm vụ và tiến trình riêng mà không ảnh hưởng đến các game khác. Đồng thời hệ thống vẫn có thể bổ sung một lớp **thành tựu/điểm chung** để tạo cảm giác người chơi đang phát triển một tài khoản xuyên suốt toàn bộ nền tảng.
