# Xây dựng hệ thống Assignment bằng React

## 1. Thay đổi kiến trúc

Không sử dụng Game Template cho Assignment.

Không sử dụng `templateId` khi giáo viên tạo Assignment.

Assignment sẽ sử dụng **React UI riêng** để hiển thị và làm bài.

Game hiện tại giữ nguyên toàn bộ logic và hệ thống riêng của Game.

---

## 2. Phần tạo Assignment

Khi giáo viên tạo Assignment, không còn bước:

`Chọn Template`

Thay vào đó chỉ cần:

`Tạo Assignment → Tiêu đề → Mô tả → Chọn lớp → Chọn câu hỏi → Thiết lập thời gian → Thiết lập deadline → Tạo bài`

Các thông tin chính:

- Tiêu đề bài.
- Mô tả.
- Lớp được giao.
- Danh sách câu hỏi.
- Thời gian làm bài.
- Deadline.
- Mã bài.

Không cần `templateId`.

---

## 3. Assignment sử dụng React

Tạo giao diện Assignment bằng React.

Ví dụ cấu trúc:

```text
Assignment
├── AssignmentPage
├── AssignmentHeader
├── Timer
├── QuestionList
├── QuestionItem
├── AnswerArea
├── QuestionNavigator
├── SubmitAssignment
└── AssignmentResult