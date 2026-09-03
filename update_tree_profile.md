# 🌱 Garden System – Frontend HTML + Backend ID/Data

## 🎯 Mục tiêu

Xây dựng hệ thống **Garden/Trồng cây** dưới dạng game HTML ở frontend.

Toàn bộ:

* HTML
* CSS
* JavaScript
* Animation
* Hình ảnh
* Template cây
* UI Garden

được lưu và xử lý ở **frontend**.

Backend **không lưu HTML/CSS/JS của Garden**, chỉ quản lý dữ liệu và ID của người chơi.

---

# 🏗️ 1. Kiến trúc

```text
                    🌱 GARDEN
                       │
              ┌────────┴────────┐
              ↓                 ↓
          FRONTEND           BACKEND
              │                 │
       Garden HTML              │
       Garden CSS               │
       Garden JS                │
       Plant assets             │
       Animation                │
       UI / Gameplay            │
              │                 │
              └─────── API ─────┘
                         │
                  ID + Game Data
```

---

# 🎮 2. Frontend chịu trách nhiệm

Frontend chứa toàn bộ phần hiển thị và gameplay:

```text
frontend/
└── games/
    └── garden/
        ├── index.html
        ├── style.css
        ├── game.js
        │
        ├── plants/
        │   ├── apple-tree.html
        │   ├── sunflower.html
        │   ├── cherry-tree.html
        │   └── magic-tree.html
        │
        └── assets/
            ├── plants/
            ├── decorations/
            ├── backgrounds/
            └── effects/
```

Frontend chịu trách nhiệm:

* Render Garden
* Render cây
* Animation
* Hiệu ứng
* Drag & Drop
* Trang trí
* Hiển thị thời gian phát triển
* Hiển thị trạng thái cây
* Hiển thị inventory
* Hiển thị xu
* Hiển thị XP
* Xử lý UI/UX

---

# 🆔 3. Backend chỉ quản lý ID và dữ liệu

Backend không lưu:

* HTML cây
* CSS cây
* JavaScript cây
* Animation
* Hình ảnh
* Template giao diện

Backend chỉ lưu dữ liệu.

Ví dụ:

```json
{
  "gardenId": "garden_001",
  "plants": [
    {
      "id": "plant_001",
      "plantType": "apple_tree",
      "plantedAt": "2026-09-03T08:00:00Z",
      "status": "growing"
    }
  ],
  "coins": 1250
}
```

---

# 🌳 4. Plant ID và Plant Type

Backend trả về ID và loại cây.

Ví dụ:

```json
{
  "id": "plant_001",
  "plantType": "apple_tree"
}
```

Frontend tự mapping:

```js
const plantTemplates = {
  apple_tree: "/games/garden/plants/apple-tree.html",
  sunflower: "/games/garden/plants/sunflower.html",
  cherry_tree: "/games/garden/plants/cherry-tree.html",
  magic_tree: "/games/garden/plants/magic-tree.html"
};
```

Backend không cần biết cây `apple_tree` được render bằng HTML nào.

---

# 🔄 5. Luồng hoạt động

## Khi mở Garden

```text
Học sinh mở Garden
        ↓
Frontend gọi API
        ↓
Backend trả Garden Data
        ↓
Frontend nhận plantType / ID
        ↓
Frontend tìm template tương ứng
        ↓
Render cây
```

Ví dụ:

```text
Backend:

plantType = apple_tree
plantId = plant_001

        ↓

Frontend:

apple_tree
        ↓
apple-tree.html
        ↓
Render cây táo
```

---

# 🌱 6. Trồng cây

Frontend hiển thị cửa hàng:

```text
🌱 Hạt giống

🌻 Sunflower
🍎 Apple Tree
🌸 Cherry Tree
🌳 Magic Tree
```

Khi học sinh chọn cây:

```text
Frontend
    ↓
POST /garden/plant
    ↓
Backend
    ↓
Kiểm tra:
- Người chơi có hạt giống?
- Có đủ điều kiện?
- Garden còn vị trí?
    ↓
Tạo plantId
    ↓
Lưu dữ liệu
    ↓
Trả kết quả về frontend
```

Ví dụ:

```json
{
  "plantId": "plant_001",
  "plantType": "apple_tree",
  "plantedAt": "2026-09-03T08:00:00Z"
}
```

---

# ⏱️ 7. Thời gian phát triển

Frontend có thể hiển thị countdown:

```text
🌱 Apple Tree

Đang phát triển...

01:25:32
```

Nhưng **không được tin hoàn toàn vào timer frontend**.

Backend phải lưu:

```text
plantedAt
growthTime
status
```

Khi thu hoạch, backend tự kiểm tra thời gian.

---

# 🍎 8. Thu hoạch

Frontend:

```text
🌳 Cây đã trưởng thành!

[ THU HOẠCH ]
```

Khi click:

```text
Frontend
    ↓
POST /garden/harvest
plantId = plant_001
    ↓
Backend kiểm tra
    ↓
Plant có tồn tại?
Plant thuộc user?
Đã đủ thời gian?
Đã thu hoạch chưa?
    ↓
YES
    ↓
+ Xu
+ XP
    ↓
Cập nhật database
    ↓
Trả kết quả
```

Ví dụ:

```json
{
  "success": true,
  "reward": {
    "coins": 50,
    "xp": 10
  }
}
```

---

# 🔐 9. Bảo mật

Không được xử lý phần thưởng quan trọng hoàn toàn ở frontend.

### Không làm:

```js
coins += 50;
```

hoặc:

```js
plant.coins = 1000;
```

vì người chơi có thể sửa JavaScript.

### Phải làm:

```text
Frontend
    ↓
"Thu hoạch plant_001"
    ↓
Backend
    ↓
Kiểm tra dữ liệu
    ↓
Tính phần thưởng
    ↓
Cập nhật coins
```

Frontend chỉ hiển thị kết quả backend trả về.

---

# 🪙 10. Hệ thống xu

Xu được quản lý ở backend.

Xu có thể nhận từ:

* Thu hoạch cây
* Hoàn thành bài học
* Mini-game
* Daily Quest
* Achievement
* Event

Xu có thể dùng để:

* Mua hạt giống
* Mua đồ trang trí
* Mua pet
* Mở khu vực Garden

---

# 🎒 11. Inventory

Inventory nên được quản lý bởi backend.

Ví dụ:

```json
{
  "seeds": [
    {
      "itemId": "apple_seed",
      "quantity": 5
    }
  ],
  "decorations": [
    {
      "itemId": "wooden_fence",
      "quantity": 2
    }
  ]
}
```

Frontend chỉ render inventory dựa trên ID.

---

# 🎨 12. Frontend Mapping

Không nên lưu toàn bộ thông tin giao diện trong database.

Database:

```json
{
  "plantType": "apple_tree"
}
```

Frontend:

```js
const plantConfig = {
  apple_tree: {
    template: "/games/garden/plants/apple-tree.html",
    growthStages: [
      "seed",
      "sprout",
      "young",
      "mature"
    ],
    harvestAnimation: "apple-harvest"
  }
};
```

Như vậy có thể thay đổi giao diện mà không cần migration database.

---

# 🏡 13. Garden Layout

Vị trí cây có thể lưu bằng ID/coordinate.

Ví dụ:

```json
{
  "plantId": "plant_001",
  "plantType": "apple_tree",
  "position": {
    "x": 120,
    "y": 240
  }
}
```

Frontend dùng dữ liệu này để render.

---

# 📚 14. Liên kết với hệ thống học tập

Garden phải liên kết với việc học.

Ví dụ:

```text
📚 Hoàn thành 5 câu hỏi
        ↓
💧 Nhận nước
        ↓
🌱 Chăm sóc cây

📚 Hoàn thành Daily Quest
        ↓
⭐ Bonus growth

📚 Streak 7 ngày
        ↓
🎁 Hạt giống hiếm
```

Mục tiêu:

> **Học sinh muốn Garden phát triển thì phải tham gia học tập.**

---

# 🎮 15. Garden và Mini-game

Garden là **module của hệ thống chính**, không cần biến Garden thành một HTML mini-game độc lập hoàn toàn.

```text
🏫 MAIN SYSTEM
│
├── 📚 Learning
├── 🏆 Achievement
├── 🪙 Coins
├── 🎒 Inventory
├── 🌱 Garden
│
└── 🎮 GAME CENTER
    ├── ⚔️ Battle
    ├── 🏃 Runner
    ├── 🧩 Puzzle
    ├── 🏎️ Racing
    └── 👥 Co-op
```

Các mini-game có thể trao thưởng cho Garden:

```text
🎮 Mini-game
      ↓
   + XP / Coin
      ↓
🌱 Garden
      ↓
Mua hạt giống / trang trí
```

---

# 🔄 16. Gameplay Loop

```text
📚 HỌC
  ↓
🎮 CHƠI
  ↓
⭐ XP / 🪙 COIN
  ↓
🌱 TRỒNG CÂY
  ↓
💧 CHĂM SÓC
  ↓
🌳 CÂY TRƯỞNG THÀNH
  ↓
🍎 THU HOẠCH
  ↓
🪙 NHẬN THƯỞNG
  ↓
🏡 TRANG TRÍ GARDEN
  ↓
📚 HỌC TIẾP
```

---

# ⭐ 17. Nguyên tắc kiến trúc

### Frontend

**Chịu trách nhiệm:**

* UI
* HTML
* CSS
* JS
* Animation
* Asset
* Template
* Render
* Gameplay presentation

### Backend

**Chịu trách nhiệm:**

* User ID
* Garden ID
* Plant ID
* Plant Type
* Inventory
* Coins
* XP
* Plant state
* Timestamp
* Reward
* Validation
* Security

---

# 🚀 18. Lợi ích

Kiến trúc này giúp:

* Không phải lưu HTML Garden trong database.
* Dễ thay đổi giao diện.
* Dễ thêm cây mới.
* Dễ thêm animation.
* Không cần sửa backend khi thay đổi visual.
* Giảm dữ liệu backend phải quản lý.
* Có thể phát triển Garden độc lập ở frontend.
* Đồng bộ dữ liệu người chơi qua API.
* Phù hợp với hệ thống nhiều HTML game.

## ✅ Kết luận

**Garden nên được xây dựng như một module/game HTML ở frontend, nhưng dữ liệu người chơi phải được quản lý bởi backend.**

Nguyên tắc:

> **Frontend quyết định Garden trông như thế nào.**

> **Backend quyết định học sinh sở hữu gì và có được nhận thưởng hay không.**

> **Backend chỉ giao tiếp bằng ID + dữ liệu, không lưu HTML/CSS/JS của Garden.**
