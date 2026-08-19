# Game Builder — Mô tả tính năng

## Mục tiêu

Xây dựng một **Game Builder** cho phép giáo viên tự tạo và thiết kế mẫu trò chơi bằng giao diện kéo-thả, tương tự Canva.

Giáo viên không cần viết code.

Giáo viên có thể tạo một game template, thiết kế giao diện, thêm câu hỏi/đáp án và lưu lại để sử dụng nhiều lần.

---

# 1. Giao diện chính

Game Builder gồm 3 khu vực chính:

```text
┌────────────────────────────────────────────────────────────┐
│ Toolbar                                                    │
│ Tên game                    Undo Redo   Preview   Save     │
├──────────────┬───────────────────────────────┬─────────────┤
│              │                               │             │
│   Elements   │            Canvas             │  Properties │
│              │                               │             │
│ Text         │                               │ Position    │
│ Image        │       Game Design Area        │ Size        │
│ Button       │                               │ Color       │
│ Shape        │                               │ Font        │
│ Question     │                               │ Background  │
│ Answer       │                               │ Animation   │
│ Timer        │                               │             │
│ Leaderboard  │                               │             │
│              │                               │             │
└──────────────┴───────────────────────────────┴─────────────┘
```

---

# 2. Elements

Giáo viên có thể thêm các element vào Canvas.

Các element cơ bản:

### Text

* Nội dung
* Font
* Font size
* Font weight
* Color
* Alignment
* Position
* Width / Height

### Image

* Upload image
* Image URL
* Width / Height
* Position
* Border radius
* Opacity

### Button

* Text
* Background
* Text color
* Border
* Border radius
* Width / Height
* Position

### Shape

Hỗ trợ:

* Rectangle
* Circle
* Line

Có thể thay đổi:

* Color
* Border
* Size
* Position

### Question

Element đặc biệt dành cho game.

Có thể hiển thị:

```text
Câu hỏi
```

Nội dung câu hỏi sẽ được lấy từ dữ liệu game khi game chạy.

### Answer

Element dành cho đáp án.

Ví dụ:

```text
A. Paris
B. London
C. Tokyo
D. Seoul
```

Có thể thiết kế giao diện của từng đáp án.

### Timer

Hiển thị thời gian còn lại của câu hỏi.

Ví dụ:

```text
00:30
```

Timer lấy trạng thái realtime từ game session.

### Leaderboard

Hiển thị bảng xếp hạng người chơi.

Dữ liệu lấy từ game session realtime.

---

# 3. Canvas

Canvas là khu vực thiết kế chính.

Giáo viên có thể:

* Drag element vào Canvas
* Di chuyển element
* Resize element
* Select element
* Delete element
* Duplicate element
* Copy / Paste
* Layer phía trước / phía sau
* Align element
* Thay đổi style
* Zoom Canvas

Element được chọn phải có visual indicator.

Ví dụ:

```text
┌─────────────────────────────┐
│                             │
│      ┌────────────────┐     │
│      │     TEXT       │     │
│      └────────────────┘     │
│       ↑ Selected element    │
│                             │
└─────────────────────────────┘
```

---

# 4. Drag & Drop

Element từ sidebar có thể kéo vào Canvas.

Flow:

```text
Element Sidebar
      ↓
Drag
      ↓
Canvas
      ↓
Drop
      ↓
Create Element
      ↓
Select Element
      ↓
Edit Properties
```

Element đã nằm trên Canvas có thể tiếp tục kéo để thay đổi vị trí.

---

# 5. Properties Panel

Khi click vào element:

```text
Properties
────────────────

Position
X: 120
Y: 80

Size
Width: 300
Height: 80

Style
Color
Background
Border
Radius

Typography
Font
Size
Weight
Alignment

Layer
Bring Forward
Send Backward

[Delete]
```

Properties thay đổi phải cập nhật Canvas realtime.

---

# 6. Game Data và Design Data

Phải tách **design** và **game data**.

### Design

Lưu:

```text
position
size
font
color
background
border
animation
layer
```

### Game Data

Lưu:

```text
question
answers
correctAnswer
score
time
players
```

Không hard-code câu hỏi trực tiếp vào Canvas.

Ví dụ Canvas chỉ lưu:

```json
{
  "type": "question",
  "id": "question-title",
  "x": 100,
  "y": 80,
  "width": 600,
  "height": 100
}
```

Khi game chạy, hệ thống lấy question data rồi render vào element này.

---

# 7. Zustand

Sử dụng Zustand để quản lý state của Game Builder.

Ví dụ:

```text
gameEditorStore
├── template
├── elements
├── selectedElementId
├── zoom
├── canvasSize
├── addElement
├── updateElement
├── deleteElement
├── duplicateElement
├── selectElement
├── moveElement
├── resizeElement
├── bringForward
├── sendBackward
├── undo
├── redo
└── resetEditor
```

Mọi thay đổi trên Canvas phải cập nhật Zustand.

---

# 8. Element Schema

Mỗi element nên có cấu trúc thống nhất.

Ví dụ:

```ts
interface GameElement {
  id: string;

  type:
    | "text"
    | "image"
    | "button"
    | "shape"
    | "question"
    | "answer"
    | "timer"
    | "leaderboard";

  x: number;
  y: number;

  width: number;
  height: number;

  rotation?: number;

  zIndex: number;

  properties: Record<string, unknown>;
}
```

Không tạo một schema riêng hoàn toàn khác cho từng element nếu không cần thiết.

---

# 9. Undo / Redo

Game Builder phải hỗ trợ:

```text
Ctrl + Z
→ Undo

Ctrl + Y
→ Redo
```

Các thao tác cần hỗ trợ:

* Add element
* Delete element
* Move element
* Resize element
* Update properties
* Duplicate element
* Layer change

Có thể lưu history trong Zustand.

---

# 10. Preview

Có nút:

```text
Preview
```

Preview phải hiển thị game gần giống lúc học sinh chơi.

Editor:

```text
Teacher
   ↓
Game Builder
```

Preview:

```text
Game Template
      ↓
Game Renderer
      ↓
Student View
```

Không hiển thị các công cụ chỉnh sửa trong Preview.

---

# 11. Save Template

Khi giáo viên bấm:

```text
Save
```

Frontend gửi template lên backend.

Ví dụ:

```json
{
  "name": "Quiz vui nhộn",
  "canvas": {
    "width": 1280,
    "height": 720
  },
  "elements": []
}
```

Backend lưu template vào database.

Khi giáo viên mở lại template:

```text
Backend
   ↓
Template JSON
   ↓
Zustand
   ↓
Canvas
```

---

# 12. Game Runtime

Game Builder chỉ tạo template.

Khi chạy game:

```text
Game Template
      ↓
Game Runtime
      ↓
Socket.IO
      ↓
Students
```

Socket.IO dùng để realtime:

* Start game
* Join game
* Question started
* Timer
* Submit answer
* Score update
* Leaderboard
* Next question
* End game

Không dùng Socket.IO cho thao tác kéo-thả trong Editor.

---

# 13. Phân tách Editor và Runtime

Phải tách rõ:

```text
Game Editor
→ Giáo viên thiết kế game

Game Renderer / Runtime
→ Render game cho học sinh
```

Editor không nên chứa logic realtime của game.

Runtime mới kết nối Socket.IO.

---

# 14. Mục tiêu cuối cùng

Giáo viên có thể:

```text
Tạo game
   ↓
Mở Game Builder
   ↓
Kéo Text / Image / Question / Answer / Timer
   ↓
Thiết kế Canvas
   ↓
Chỉnh Properties
   ↓
Preview
   ↓
Save Template
   ↓
Tạo Game Session
   ↓
Start Game
   ↓
Học sinh tham gia realtime
```

Mục tiêu UX là tạo cảm giác giống **Canva dành riêng cho việc tạo trò chơi giáo dục**, nhưng đơn giản hơn và tập trung vào các element cần thiết cho game học tập.
