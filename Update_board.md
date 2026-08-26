# Yêu cầu phát triển Game Cờ Tỷ Phú

## 1. Ý tưởng tổng quan

Xây dựng game **Cờ Tỷ Phú Phiêu Lưu** dành cho trẻ em, kết hợp cơ chế Cờ Tỷ Phú với nội dung học tập.

Game cần có giao diện vui nhộn, nhiều màu sắc, dễ sử dụng và phù hợp với trẻ em.

## 2. File HTML tham khảo

Sử dụng file HTML hiện có:

```text
F:\Clone\edu_game\educational-games\src\games\block-master\Board.html
```

### Yêu cầu

* Kiểm tra và tận dụng cấu trúc HTML, CSS, layout và các thành phần giao diện phù hợp từ `Board.html`.
* Có thể chỉnh sửa trực tiếp file hiện tại để phát triển thành Cờ Tỷ Phú.
* Nếu cấu trúc hiện tại không phù hợp thì tạo component/file mới nhưng vẫn **tái sử dụng các phần giao diện có thể dùng lại từ `Board.html`**.
* Không làm ảnh hưởng đến game `block-master` hiện tại.
* Nếu dùng React thì chuyển đổi phần HTML/CSS cần thiết sang component React tương ứng.
* Tách rõ phần UI và logic game để sau này dễ mở rộng.

## 3. Bàn cờ phải Full Width

Đây là yêu cầu quan trọng.

### Desktop

Bàn cờ phải sử dụng **toàn bộ chiều rộng khu vực game**, không để bàn cờ nhỏ nằm giữa màn hình.

```text
┌──────────────────────────────────────────────────────────────┐
│                         GAME SCREEN                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │                    BÀN CỜ TỶ PHÚ                       │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Ưu tiên:

```css
.board {
    width: 100%;
    max-width: none;
}
```

Nếu có container bao ngoài thì không được giới hạn bàn cờ bằng `max-width` nhỏ.

### Responsive

Bàn cờ phải responsive theo kích thước màn hình:

```text
Desktop → full width
Tablet  → full width
Mobile  → full width + tự co giãn
```

Không để xuất hiện khoảng trắng lớn hai bên trên desktop.

## 4. Chủ đề

Game hỗ trợ nhiều `theme`:

* 🌎 Khám phá Việt Nam
* 🌍 Khám phá thế giới
* 🚀 Vũ trụ
* 🦖 Khủng long
* 🔬 Khoa học
* 🌱 Môi trường
* 📚 Kiến thức tổng hợp
* 🧮 Toán học
* 🇬🇧 Tiếng Anh
* 🏰 Lịch sử

Chỉ xây dựng **một Game Engine Cờ Tỷ Phú**.

Theme chỉ thay đổi dữ liệu:

```text
Board
Property
Question
Event
Image
Sound
Reward
```

Không viết lại logic game cho từng theme.

## 5. Các loại ô

Hỗ trợ:

```text
START
PROPERTY
QUESTION
EVENT
BONUS
TAX
JAIL
TELEPORT
CHANCE
REST
```

### PROPERTY

Người chơi có thể mua và nâng cấp tài sản.

### QUESTION

Người chơi phải trả lời câu hỏi.

### EVENT

Kích hoạt sự kiện ngẫu nhiên.

### BONUS

Nhận phần thưởng.

### TAX

Trừ tiền.

### TELEPORT

Di chuyển đến vị trí khác.

## 6. Hệ thống câu hỏi

Câu hỏi lấy từ API hiện có của hệ thống.

Hỗ trợ:

```text
subject
difficulty
grade
topic
questionType
```

Ví dụ:

```json
{
  "id": "q001",
  "subject": "science",
  "difficulty": "easy",
  "question": "Hành tinh nào gần Mặt Trời nhất?",
  "options": [
    "Trái Đất",
    "Sao Kim",
    "Sao Thủy",
    "Sao Hỏa"
  ],
  "answer": 2,
  "reward": 100
}
```

## 7. Tiền trong game

Sử dụng tiền trong game:

```text
💰 Coin
```

Coin dùng để:

* Mua tài sản.
* Nâng cấp tài sản.
* Trả phí.
* Nhận thưởng.
* Giao dịch.
* Thực hiện các hành động đặc biệt.

## 8. XP và Level

Người chơi có:

```text
XP
Level
Achievement
```

Ví dụ:

```text
Trả lời đúng → +50 XP
Mua tài sản → +XP
Hoàn thành game → +XP
```

## 9. Chế độ chơi

### Solo

Người chơi đấu với AI.

### Multiplayer

Nhiều người chơi cùng tham gia.

### Teacher Mode

Giáo viên có thể:

* Chọn câu hỏi.
* Chọn theme.
* Chọn độ khó.
* Cộng/trừ tiền.
* Di chuyển người chơi.
* Kích hoạt event.
* Tạm dừng game.

## 10. Flow

```text
Chọn Game
    ↓
Chọn Theme
    ↓
Chọn Mode
    ↓
Chọn Difficulty
    ↓
Tạo game
    ↓
Khởi tạo Player
    ↓
Bắt đầu lượt
    ↓
Tung xúc xắc
    ↓
Di chuyển Player
    ↓
Kiểm tra ô
    ↓
Xử lý hành động
    ↓
Kết thúc lượt
    ↓
Player tiếp theo
    ↓
Kiểm tra điều kiện kết thúc
    ↓
Hiển thị kết quả
```

## 11. Kiến trúc

```text
Monopoly Game
├── Game Engine
├── Game Rules
├── Board
├── Player
├── Dice
├── Property
├── Economy
├── Question System
├── Event System
├── Theme System
└── Result / Leaderboard
```

## 12. Tái sử dụng Board.html

Khi phát triển giao diện, ưu tiên lấy lại:

* Cấu trúc bàn cờ.
* Layout.
* CSS.
* Hiệu ứng.
* Animation.
* Các thành phần UI phù hợp.

Từ file:

```text
F:\Clone\edu_game\educational-games\src\games\block-master\Board.html
```

Sau đó điều chỉnh lại để phù hợp với Cờ Tỷ Phú.

**Không copy nguyên toàn bộ nếu có code không liên quan.**

Chỉ lấy những phần cần thiết và tổ chức lại cho đúng kiến trúc game hiện tại.

## 13. Yêu cầu giao diện bàn cờ

Bàn cờ phải là thành phần trung tâm của màn hình.

Trên desktop ưu tiên:

```text
┌───────────────────────────────────────────────────────────────┐
│                         HEADER                                │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                    FULL WIDTH BOARD                           │
│                                                               │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ Player 1     Player 2     Player 3     Player 4               │
└───────────────────────────────────────────────────────────────┘
```

Không sử dụng kiểu:

```css
max-width: 600px;
width: 600px;
```

hoặc các giới hạn tương tự khiến bàn cờ bị nhỏ.

Nên sử dụng:

```css
.board-wrapper {
    width: 100%;
}

.board {
    width: 100%;
    max-width: none;
}
```

Nếu cần giữ tỷ lệ bàn cờ thì sử dụng CSS Grid/Aspect Ratio để bàn cờ tự co giãn theo width.

## 14. Responsive

Phải kiểm tra tối thiểu:

```text
1920px
1440px
1280px
1024px
768px
480px
375px
```

Đảm bảo:

* Không vỡ layout.
* Không tràn ngang ngoài ý muốn.
* Các ô bàn cờ tự co giãn.
* Quân cờ vẫn nằm đúng vị trí.
* Text không bị tràn.
* Modal câu hỏi hiển thị tốt.
* Sidebar/thông tin người chơi không làm bàn cờ bị thu nhỏ quá mức.

## 15. Mục tiêu cuối cùng

Tạo một **Game Engine Cờ Tỷ Phú dùng chung**, có thể thay đổi chủ đề bằng data/API.

Ví dụ:

```text
Cờ Tỷ Phú
│
├── 🇻🇳 Việt Nam
├── 🚀 Vũ trụ
├── 🦖 Khủng long
├── 🔬 Khoa học
├── 🧮 Toán học
├── 🇬🇧 Tiếng Anh
├── 🌱 Môi trường
└── 📚 Kiến thức tổng hợp
```

Mỗi theme chỉ thay đổi:

* Nội dung.
* Board data.
* Property data.
* Question data.
* Event data.
* Hình ảnh.
* Âm thanh.
* Phần thưởng.

**Không thay đổi Game Engine.**

### Yêu cầu quan trọng nhất

1. Kiểm tra và tận dụng `Board.html`.
2. Có thể sửa `Board.html` hoặc tạo mới tùy kiến trúc phù hợp.
3. Không phá game `block-master`.
4. Bàn cờ phải **full width** trên desktop.
5. Bàn cờ phải responsive trên mobile.
6. Tách UI và logic game.
7. Thiết kế theo hướng data-driven để sau này thêm theme dễ dàng.
8. Tái sử dụng tối đa các component/UI/animation có sẵn nếu phù hợp.
