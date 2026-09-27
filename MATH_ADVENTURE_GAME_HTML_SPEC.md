# Math Adventure Game – HTML Prototype

## 1. Mục tiêu

Xây dựng một mini-game Toán học dành cho học sinh trong hệ thống **Edu Garden**, theo hướng **vừa học vừa chơi**.

Game không nên giống một trang quiz thông thường. Học sinh cần **tương tác trực tiếp với đồ vật trong game**, giải câu hỏi để tiếp tục gameplay và nhận phần thưởng.

Prototype đầu tiên phải được làm bằng:

- **HTML**
- **CSS**
- **JavaScript thuần**
- Chỉ **1 file HTML duy nhất**
- Không tách `.css`, `.js` hoặc component riêng.
- Có thể dùng CDN nếu thật sự cần, nhưng ưu tiên HTML/CSS/JS thuần để dễ tích hợp vào hệ thống game template.

## 2. Vị trí file

Tạo file HTML tại:

```text
F:\Clone\edu_game\educational-games\src\games
```

Ví dụ:

```text
F:\Clone\edu_game\educational-games\src\games\math-adventure.html
```

Tên file có thể thay đổi nếu project đã có convention đặt tên game, nhưng chỉ tạo **1 file HTML cho prototype này**.

---

# 3. Concept

Tên game đề xuất:

> **Math Adventure – Phiêu lưu Toán học**

Phong cách:

- Cute cartoon
- Fantasy garden
- Gamification
- Dành cho học sinh
- Màu sắc tươi sáng
- Bo góc
- Animation nhẹ
- Có nhân vật và pet
- Có coin, EXP, level
- Có nhiệm vụ
- Có phần thưởng

Phong cách tổng thể kết hợp:

- Educational game
- Garden Adventure
- Puzzle
- Drag & Drop
- Maze
- Boss Battle

Không làm giao diện giống một form bài kiểm tra truyền thống.

---

# 4. Gameplay chính

Gameplay chính:

> **Kéo item vào đúng ô đáp án**

Ví dụ:

```text
Có 6 quả táo + 3 quả táo

🍎 🍎 🍎
🍎 🍎 🍎

+

🍎 🍎 🍎

6 + 3 = ?

┌───────┐
│   7   │
└───────┘

┌───────┐
│   9   │  ← kéo item vào đây
└───────┘

┌───────┐
│  10   │
└───────┘
```

Khi học sinh kéo item vào đáp án:

### Đúng

```text
🎉 Chính xác!

+10 EXP
+20 Coin
+1 Nước tưới

🌱 Cây trong vườn đã lớn!
```

### Sai

```text
💡 Gần đúng rồi!

Hãy thử lại nhé.

Bạn vẫn nhận được +2 EXP.
```

Không nên phạt học sinh quá nặng khi trả lời sai.

---

# 5. Gameplay phụ – Math Maze

Có thêm một mode:

> **Mê cung Toán học**

Ví dụ:

```text
Câu hỏi:

6 + 3 = ?

START
  ↓
┌───┬───┬───┐
│ 8 │ 9 │ 7 │
├───┼───┼───┤
│ 6 │   │ 4 │
├───┼───┼───┤
│ 3 │ 5 │ 2 │
└───┴───┴───┘
        ↓
      🏆
```

Học sinh điều khiển nhân vật đi đến ô có đáp án đúng.

Mode này nên là gameplay phụ, không phải gameplay duy nhất.

---

# 6. Gameplay nâng cao – Boss Battle

Sau khi có đủ tiến trình, có thể mở Boss Battle.

Ví dụ:

```text
⚔️ RỒNG TOÁN HỌC

HP Boss
████████████░░░░ 800/1000

15 × 8 = ?

[ 100 ] [ 120 ]
[ 130 ] [ 140 ]

        ⚔️ TẤN CÔNG
```

Trả lời đúng:

```text
💥 -50 HP Boss

+20 EXP
+30 Coin
```

Boss Battle có thể mở khóa sau khi học sinh hoàn thành một số nhiệm vụ.

---

# 7. Các dạng câu hỏi

Prototype nên hỗ trợ nhiều dạng câu hỏi nhưng dùng chung hệ thống gameplay.

## Cộng

```text
3 + 2 = ?
```

## Trừ

```text
8 - 3 = ?
```

## Nhân

```text
3 × 4 = ?
```

## Chia

```text
12 ÷ 3 = ?
```

## Đếm vật phẩm

```text
🥕 🥕 🥕 🥕 🥕

Có bao nhiêu củ cà rốt?
```

## Phân số

```text
3/4 + 1/4 = ?
```

## So sánh

```text
8 □ 5

>
<
=
```

## Bài toán hình ảnh

Ví dụ:

```text
Có 3 luống cây.
Mỗi luống có 4 cây.

Có tất cả bao nhiêu cây?
```

---

# 8. UI Layout

Thiết kế màn hình game theo layout:

```text
┌────────────────────────────────────────────────────────────┐
│ 🌱 Edu Garden   ⭐ Lv.12   💰 1,250   ❤️ 100               │
├──────────────┬─────────────────────────────────────────────┤
│              │                                             │
│ 🏠 Trang chủ │              🌳 TOÁN HỌC                    │
│              │                                             │
│ 🎮 Chơi game │         Câu 3 / 10                         │
│              │                                             │
│ 📚 Học tập   │             6 + 3 = ?                      │
│              │                                             │
│ 🎯 Nhiệm vụ  │       🥕 🥕 🥕 🥕 🥕                       │
│              │                                             │
│ 🌱 Khu vườn  │      [ 7 ] [ 9 ] [ 10 ]                   │
│              │                                             │
│ 🎒 Kho đồ    │                                             │
│              │          ⏱ 00:42                           │
│ 🏆 Thành tựu │                                             │
│              │                    [ TRẢ LỜI ]              │
└──────────────┴─────────────────────────────────────────────┘
```

Tuy nhiên, màn hình gameplay phải ưu tiên **khu vực chơi**, không làm sidebar quá lớn.

---

# 9. Header

Header hiển thị:

```text
🌱 Edu Garden

💰 1,250
⭐ Lv 12
❤️ 100

👤 An Nhiên
```

Có progress EXP:

```text
Lv 12

████████████░░░░
320 / 600 EXP
```

---

# 10. Khu vực câu hỏi

Ở trung tâm màn hình:

```text
┌─────────────────────────────┐
│        Câu 3 / 10           │
├─────────────────────────────┤
│                             │
│          6 + 3 = ?          │
│                             │
│        🍎 🍎 🍎              │
│        🍎 🍎 🍎              │
│                             │
└─────────────────────────────┘
```

Có thể thêm:

- Icon âm thanh
- Hint
- Difficulty
- Progress
- Timer

---

# 11. Khu vực đáp án

Các đáp án là những ô lớn, dễ click/kéo:

```text
┌────────────┐  ┌────────────┐
│     7      │  │     9      │
│     🎯     │  │     🎯     │
└────────────┘  └────────────┘

┌────────────┐  ┌────────────┐
│    10      │  │    12      │
│     🎯     │  │     🎯     │
└────────────┘  └────────────┘
```

Nếu sử dụng Drag & Drop:

- Item có thể kéo bằng chuột.
- Có hiệu ứng khi item đang được kéo.
- Ô đáp án highlight khi item đi vào.
- Đúng → animation success.
- Sai → animation shake.

---

# 12. Nhân vật

Có một nhân vật nhỏ đứng trong game world.

Ví dụ:

```text
       👨‍🌾
       🧢
      /|\
      / \
```

Có thể có pet:

```text
🐶
```

Pet phản ứng theo kết quả:

### Đúng

```text
🐶 ❤️
"Tuyệt vời!"
```

### Sai

```text
🐶 💡
"Thử lại nhé!"
```

---

# 13. Reward System

Khi trả lời đúng:

```text
┌─────────────────────────────┐
│        🎉 Chính xác!        │
│                             │
│        ⭐ +10 EXP           │
│        💰 +20 Coin          │
│        💧 +1 Nước           │
│                             │
│    🌱 Cây cà rốt lớn lên!   │
│                             │
│       [ Câu tiếp theo ]     │
└─────────────────────────────┘
```

Có animation:

- Coin bay vào counter.
- EXP tăng.
- Cây lớn lên.
- Sparkle.
- Confetti nhẹ.

---

# 14. Nhiệm vụ hiện tại

Bên phải hoặc phía trên gameplay:

```text
🎯 Nhiệm vụ hiện tại

✓ Làm 5 câu Toán
  3 / 5

🎁 Phần thưởng

⭐ +10 EXP
💰 +20 Coin
💧 +1 Nước
```

---

# 15. Timer

Có timer cho những mode cần giới hạn thời gian:

```text
⏱ Thời gian còn lại

████████████░░░░

00:45
```

Không nên ép timer quá nhanh ở mode dành cho học sinh nhỏ.

---

# 16. Difficulty

Hiển thị:

```text
Độ khó: Dễ
⭐ ☆ ☆ ☆
```

Có thể có:

```text
Dễ
Trung bình
Khó
```

---

# 17. Hint

Có nút:

```text
💡 Mẹo nhỏ
```

Khi click:

```text
💡 Hãy cộng các tử số
và giữ nguyên mẫu số.
```

Hint có thể tiêu tốn một ít tài nguyên:

```text
💡 Hint
-5 Energy
```

hoặc miễn phí ở level thấp.

---

# 18. Progress

Luôn hiển thị:

```text
Câu 3 / 10

████████░░ 30%
```

Điều này giúp học sinh biết mình đang tiến bộ.

---

# 19. Màu sắc

Màu chính:

```css
--green: #22C55E;
--yellow: #FBBF24;
--blue: #3B82F6;
--red: #EF4444;
--purple: #8B5CF6;
--background: #F8FAFC;
```

Có thể dùng thêm màu pastel.

Không dùng quá nhiều màu mạnh cùng lúc.

---

# 20. Responsive

HTML phải chạy tốt trên:

- Desktop
- Laptop
- Tablet

Mobile có thể hỗ trợ cơ bản nhưng gameplay desktop là ưu tiên đầu tiên.

---

# 21. Animation

Nên có:

### Khi kéo item

```text
scale(1.05)
```

### Khi đúng

```text
bounce
sparkle
confetti
```

### Khi sai

```text
shake
```

### Khi nhận coin

```text
coin → bay lên header
```

### Khi nhận EXP

```text
progress bar tăng
```

Animation phải nhẹ, không gây rối mắt.

---

# 22. Không làm

Không nên:

- Làm giao diện giống trang quiz truyền thống.
- Chỉ có radio button.
- Chỉ click A/B/C/D.
- Quá nhiều text.
- Quá nhiều menu.
- Màn hình quá nhiều card.
- Animation quá mạnh.
- Phạt học sinh nặng khi trả lời sai.
- Làm gameplay phụ thuộc hoàn toàn vào timer.

Mục tiêu là:

> **Học sinh cảm thấy mình đang chơi game, nhưng thực tế đang luyện Toán.**

---

# 23. Cấu trúc JavaScript trong một file HTML

Dù chỉ có một file HTML, nên tổ chức code rõ ràng:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- CSS -->
</head>

<body>

    <!-- Game UI -->

    <script>
        // =========================
        // GAME STATE
        // =========================

        const gameState = {
            questionIndex: 0,
            score: 0,
            exp: 320,
            coin: 1250,
            lives: 3,
            level: 12
        };


        // =========================
        // QUESTIONS
        // =========================

        const questions = [
            {
                type: "addition",
                question: "6 + 3 = ?",
                answer: 9,
                options: [7, 9, 10, 12]
            }
        ];


        // =========================
        // GAME LOGIC
        // =========================

        function checkAnswer(answer) {
            // kiểm tra đáp án
        }

        function nextQuestion() {
            // chuyển câu
        }

        function addReward() {
            // cộng EXP / Coin / Item
        }

        function showResult() {
            // popup đúng / sai
        }


        // =========================
        // UI
        // =========================

        function renderQuestion() {
            // render câu hỏi
        }

        function updateProgress() {
            // update progress
        }

        function updatePlayerStats() {
            // update coin / exp / level
        }


        // =========================
        // INIT
        // =========================

        initGame();
    </script>

</body>
</html>
```

---

# 24. Dữ liệu game

Prototype nên dùng dữ liệu mock trong JavaScript:

```javascript
const questions = [
    {
        id: 1,
        type: "addition",
        question: "6 + 3 = ?",
        answer: 9,
        options: [7, 8, 9, 10],
        reward: {
            exp: 10,
            coin: 20,
            water: 1
        }
    },
    {
        id: 2,
        type: "subtraction",
        question: "8 - 3 = ?",
        answer: 5,
        options: [4, 5, 6, 7],
        reward: {
            exp: 10,
            coin: 20,
            water: 1
        }
    }
];
```

Sau này dữ liệu này sẽ được thay bằng API.

---

# 25. Mục tiêu của prototype

Prototype HTML phải thể hiện được đầy đủ cảm giác:

```text
Vào game
   ↓
Nhận câu hỏi
   ↓
Tương tác với item
   ↓
Chọn / kéo đáp án
   ↓
Đúng / sai
   ↓
Nhận EXP + Coin
   ↓
Cập nhật progress
   ↓
Câu tiếp theo
   ↓
Hoàn thành màn chơi
   ↓
🎁 Tổng kết phần thưởng
```

## Kết quả mong muốn

Không phải một trang HTML demo đơn giản.

Phải tạo cảm giác như một **mini educational game thực sự**, có:

- Game world
- Character
- Pet
- Question
- Drag & Drop
- Answer
- Progress
- Timer
- Coin
- EXP
- Level
- Quest
- Reward
- Animation
- Success / Error state
- Game completion screen

Tất cả nằm trong **một file `.html` duy nhất** tại:

```text
F:\Clone\edu_game\educational-games\src\games
```
