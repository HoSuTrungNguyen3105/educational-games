# Yêu cầu cập nhật LuckyWheel – Classroom Play Mode

## 1. File cần cập nhật

File game:

```text
src/games/timed-games/LuckyWheel.html
```

Game có `playMode`:

```html
playMode="classroom"
```

## 2. Quy tắc quan trọng

Chỉ khi:

```text
playMode === "classroom"
```

thì game mới sử dụng **Classroom Mode dành cho giáo viên**.

Nếu:

```text
playMode !== "classroom"
```

thì **không hiển thị giao diện Classroom** và game hoạt động theo giao diện/chế độ thông thường hiện tại.

Không được hiển thị phần chọn lớp, chọn học sinh hoặc điều khiển giáo viên đối với các mode khác.

---

# 3. Khi vừa mở game

Khi game được mở với:

```text
playMode = classroom
```

không vào thẳng vòng quay ngay.

Thay vào đó hiển thị màn hình chuẩn bị cho giáo viên.

Ví dụ:

```text
┌──────────────────────────────────────────┐
│ 🎡 VÒNG QUAY MAY MẮN                     │
│                                          │
│          CHẾ ĐỘ LỚP HỌC                 │
│                                          │
│ Lớp học                                  │
│ [ Chọn lớp ▼ ]                           │
│                                          │
│ Học sinh                                 │
│ [ Chọn học sinh ▼ ]                     │
│                                          │
│                                          │
│          [ BẮT ĐẦU GAME ]                │
└──────────────────────────────────────────┘
```

Chỉ sau khi giáo viên chọn đủ thông tin cần thiết thì mới cho bắt đầu game.

---

# 4. Không nhập tên học sinh thủ công làm cách chính

Trong Classroom Mode, **không nên bắt giáo viên nhập tên học sinh bằng text input thông thường**.

Ưu tiên:

```text
Giáo viên
   ↓
Chọn lớp
   ↓
API lấy danh sách học sinh
   ↓
Chọn học sinh
   ↓
Bắt đầu game
```

Ví dụ:

```text
Lớp:
[ Lớp 3A ▼ ]

Học sinh:
[ Nguyễn Văn A ▼ ]
```

Giá trị thực tế nên dùng:

```json
{
  "studentId": 101,
  "studentName": "Nguyễn Văn A"
}
```

Không chỉ lưu:

```json
{
  "studentName": "Nguyễn Văn A"
}
```

vì có thể có nhiều học sinh trùng tên.

---

# 5. API Classroom

Khi:

```text
playMode = classroom
```

API cần trả đủ thông tin cần thiết cho Classroom Mode.

Ví dụ:

```json
{
  "playMode": "classroom",
  "classroom": {
    "id": 12,
    "name": "Lớp 3A"
  },
  "students": [
    {
      "id": 101,
      "name": "Nguyễn Văn A"
    },
    {
      "id": 102,
      "name": "Trần Thị B"
    },
    {
      "id": 103,
      "name": "Lê Văn C"
    }
  ]
}
```

Frontend sử dụng:

```text
classroom.id
classroom.name
students[].id
students[].name
```

để hiển thị giao diện.

---

# 6. Trường hợp API trả danh sách lớp

Nếu giáo viên có nhiều lớp, API có thể trả:

```json
{
  "playMode": "classroom",
  "classrooms": [
    {
      "id": 12,
      "name": "Lớp 3A"
    },
    {
      "id": 13,
      "name": "Lớp 3B"
    }
  ]
}
```

Khi giáo viên chọn:

```text
Lớp 3A
```

frontend gọi API lấy học sinh của lớp đó:

```text
GET /classrooms/12/students
```

API trả:

```json
{
  "students": [
    {
      "id": 101,
      "name": "Nguyễn Văn A"
    },
    {
      "id": 102,
      "name": "Trần Thị B"
    }
  ]
}
```

---

# 7. Sau khi chọn học sinh

Sau khi giáo viên chọn học sinh:

```text
Nguyễn Văn A
```

hiển thị rõ trên giao diện:

```text
┌──────────────────────────────────┐
│ 👤 Học sinh đang chơi            │
│                                  │
│ Nguyễn Văn A                     │
│                                  │
│             🎡                   │
│                                  │
│        [ QUAY ]                  │
└──────────────────────────────────┘
```

Game phải biết:

```json
{
  "studentId": 101,
  "studentName": "Nguyễn Văn A"
}
```

---

# 8. Giáo viên là người điều khiển

Trong:

```text
playMode = classroom
```

giáo viên là người điều khiển game.

Cần có các thao tác chính:

```text
[ Bắt đầu ]
[ Quay ]
[ Dừng ]
[ Chơi lại ]
[ Chọn học sinh khác ]
```

Tùy logic hiện tại của LuckyWheel mà giữ lại những nút thực sự cần thiết.

Không nên để học sinh tự thay đổi các thiết lập Classroom.

---

# 9. Sau khi vòng quay kết thúc

Hiển thị kết quả rõ ràng:

```text
┌──────────────────────────────────┐
│          🎉 KẾT QUẢ              │
│                                  │
│      Nguyễn Văn A                │
│                                  │
│         ⭐ 10 điểm               │
│                                  │
│       [ TIẾP TỤC ]              │
└──────────────────────────────────┘
```

Kết quả cần gắn với:

```text
studentId
```

thay vì chỉ dựa vào tên học sinh.

---

# 10. Chọn học sinh khác

Sau khi kết thúc một lượt, giáo viên có thể:

```text
[ Chọn học sinh khác ]
```

→ quay lại danh sách học sinh.

Ví dụ:

```text
Lớp 3A

✓ Nguyễn Văn A
○ Trần Thị B
○ Lê Văn C
○ Phạm Văn D
```

Có thể đánh dấu học sinh đã được chọn để tránh chọn trùng nếu logic game yêu cầu.

---

# 11. Khi không phải Classroom Mode

Ví dụ:

```text
playMode = "normal"
```

hoặc:

```text
playMode = "solo"
```

thì:

**Không hiển thị:**

```text
❌ Chọn lớp
❌ Chọn học sinh
❌ Danh sách học sinh
❌ Giao diện điều khiển giáo viên
❌ Classroom information
```

Game phải sử dụng giao diện hiện tại của mode đó.

---

# 12. Logic khởi tạo

Khi game load:

```text
Đọc playMode
     │
     ├── classroom
     │      ↓
     │   Classroom Setup
     │      ↓
     │   Chọn lớp
     │      ↓
     │   Chọn học sinh
     │      ↓
     │   Bắt đầu game
     │
     └── mode khác
            ↓
       Game bình thường
```

Pseudo code:

```js
if (playMode === "classroom") {
    showClassroomSetup();
} else {
    showNormalGame();
}
```

Không được mặc định hiển thị Classroom Setup rồi mới kiểm tra mode.

---

# 13. Trạng thái game

Có thể quản lý:

```text
CLASSROOM_SETUP
       ↓
STUDENT_SELECTED
       ↓
READY
       ↓
PLAYING
       ↓
RESULT
       ↓
NEXT_STUDENT
```

Ví dụ:

```js
const gameState = {
    playMode: "classroom",
    classroomId: null,
    studentId: null,
    studentName: "",
    status: "CLASSROOM_SETUP"
};
```

---

# 14. Yêu cầu API và Frontend phải thống nhất

Không tự tạo dữ liệu học sinh giả ở frontend nếu API đã có dữ liệu thật.

Frontend cần lấy:

```text
classroomId
studentId
studentName
```

từ API.

Nếu API chưa có endpoint phù hợp, cần xác định endpoint trước khi hoàn thiện Classroom Mode.

---

# 15. Trường hợp chưa có API

Nếu `playMode="classroom"` nhưng API chưa trả được:

```text
classroom
students
```

thì không được làm game bị trắng hoặc lỗi.

Hiển thị:

```text
┌────────────────────────────────────┐
│ 🎓 CHẾ ĐỘ LỚP HỌC                 │
│                                    │
│ Chưa có dữ liệu lớp học.           │
│ Vui lòng kiểm tra kết nối API      │
│ hoặc cấu hình lớp học.             │
│                                    │
│ [ Thử lại ]                        │
└────────────────────────────────────┘
```

Không dùng dữ liệu giả để thay thế dữ liệu thật trong production.

---

# 16. Mục tiêu cuối cùng

LuckyWheel cần hoạt động theo nguyên tắc:

```text
playMode = classroom
        ↓
Mở game
        ↓
Hiển thị Classroom Setup
        ↓
Giáo viên chọn lớp
        ↓
API lấy học sinh
        ↓
Giáo viên chọn học sinh
        ↓
Bắt đầu LuckyWheel
        ↓
Giáo viên điều khiển
        ↓
Hiển thị kết quả
        ↓
Chọn học sinh tiếp theo
```

Trong khi:

```text
playMode != classroom
        ↓
Không hiển thị Classroom UI
        ↓
Giữ nguyên cách hoạt động của game hiện tại
```

## Lưu ý triển khai

Không thay đổi logic của các `playMode` khác nếu không cần thiết.

Toàn bộ phần Classroom phải được **điều kiện hóa bằng `playMode === "classroom"`**, để việc thêm Classroom Mode không làm ảnh hưởng đến các chế độ chơi hiện tại.
