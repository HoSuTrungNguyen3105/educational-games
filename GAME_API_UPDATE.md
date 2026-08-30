# HỆ THỐNG GIÁO VIÊN GIAO BÀI + THÔNG BÁO HỌC SINH

## 1. Mục tiêu

Bổ sung thêm vào api giáo viên, bài kiểm tra.

Làm ở F:\Clone\edu_game\educational-games\src\pages\teacher\AssignmentCreate.jsx này

Luồng chính:

Teacher
    ↓
Tạo bài thi
    ↓
Chọn thời gian làm bài
    ├── 30 phút
    ├── 45 phút
    └── 60 phút
    ↓
Chọn lớp được giao
    ↓
Backend tạo mã code ( phần game sẽ chọn game lấy từ api games , và câu hỏi lấy từ Question Bank )
    ↓
Lưu Assignment
    ↓
Tạo Notification cho học sinh thuộc lớp
    ↓
Học sinh đăng nhập
    ↓
Home hiển thị thông báo
    ↓
Học sinh click thông báo
    ↓
Mở modal nhập code
    ↓
Xác thực code
    ↓
Vào bài thi
    ↓
Làm bài
    ↓
Nộp bài
    ↓
Backend tự chấm
    ↓
Lưu điểm

---

# 2. Không tạo lại Question Bank

Hệ thống hiện tại đã có Question Bank.

Question hiện có các dữ liệu như:

- question
- answers
- correctAnswer
- time
- score
- category
- difficulty

Ví dụ:

```json
{
  "questionType": "multiple_choice",
  "question": "1 + 1 bằng bao nhiêu?",
  "answers": [
    {
      "key": "A",
      "content": "1"
    },
    {
      "key": "B",
      "content": "2"
    }
  ],
  "correctAnswer": "B",
  "time": 20,
  "score": 100
}