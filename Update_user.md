# HỆ THỐNG LỚP HỌC + GIAO BÀI + THÔNG BÁO (EduPlay)

## 1. Mục tiêu tổng thể

Bổ sung 2 nhóm tính năng liên quan chặt chẽ với nhau:

1. **Class**: gắn User (học sinh/giáo viên) vào lớp học.
2. **Assignment + Notification**: giáo viên giao bài theo lớp → học sinh nhận thông báo → nhập code → làm bài có thời gian → nộp bài → tự động chấm.

Nguyên tắc xuyên suốt: **Backend là nguồn sự thật duy nhất**. Frontend không tự quyết định classId, code, điểm, thời gian, deadline — chỉ render UI và gửi request.

---

## 2. Model: Class

```
Class
├── id
├── name        // "10A1"
├── code        // unique, dùng để hiển thị
├── schoolYear  // "2026-2027"
├── status      // ACTIVE / INACTIVE
├── createdAt
└── updatedAt
```

Quan hệ: **1 Class — N Student** (1 học sinh chỉ thuộc 1 lớp tại 1 thời điểm).

Giáo viên dạy nhiều lớp → không dùng `User.classId` cho giáo viên, mà dùng bảng trung gian:

```
TeacherClass
├── id
├── teacherId
└── classId
```

## 3. Bổ sung vào User

```
User
├── id
├── username / email / fullName
├── role          // STUDENT | TEACHER | ADMIN
├── classId       // nullable, chỉ có ý nghĩa với STUDENT
└── ...
```

- `classId` phải **nullable**: giáo viên/admin không bắt buộc có lớp; học sinh cũ chưa phân lớp vẫn đăng nhập được.
- **Không lưu tên lớp** ("10A1") trực tiếp trong User — chỉ lưu `classId` và join sang bảng `Class`, vì tên lớp có thể đổi nhưng ID phải ổn định.

### Prisma mẫu

```prisma
model Class {
  id         String   @id @default(cuid())
  name       String
  code       String   @unique
  schoolYear String?
  status     String   @default("ACTIVE")
  students   User[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model User {
  id       String  @id @default(cuid())
  classId  String?
  class    Class?  @relation(fields: [classId], references: [id])
  // các field hiện tại...
}
```

### API Profile

Trả kèm object `class`, không chỉ `classId`, để Frontend dùng trực tiếp:

```json
{
  "id": "student_001",
  "role": "STUDENT",
  "classId": "class_10A1",
  "class": { "id": "class_10A1", "name": "10A1", "code": "10A1" }
}
```

### Đổi lớp

```
PATCH /users/:id
{ "classId": "class_10A2" }
```

---

## 4. Model: Assignment (bài thi/bài giao)

Không tạo lại Question Bank — giữ nguyên cấu trúc câu hỏi hiện có (`question`, `answers`, `correctAnswer`, `time`, `score`...). Assignment chỉ là **một lần giáo viên giao một Game cho một Class**.

```
Assignment
├── id
├── teacherId
├── gameId
├── title
├── description
├── classId
├── code            // unique, tự sinh, KHÔNG lấy từ id
├── isExam          // boolean
├── examDuration    // chỉ nhận 30 | 45 | 60 (phút)
├── deadline
├── status          // ACTIVE / CLOSED
├── createdAt
└── updatedAt
```

Quy tắc validate:
- `examDuration` ∈ {30, 45, 60}, sai → `400 Bad Request`.
- `classId` bắt buộc và phải tồn tại trong DB.
- `code`: unique, dễ nhập, không phân biệt hoa/thường, do Backend sinh — Frontend không tự tạo.

## 5. Model: Submission

```
Submission
├── id
├── assignmentId
├── studentId
├── startedAt
├── submittedAt
├── status         // IN_PROGRESS / SUBMITTED
├── score
├── correctCount
├── wrongCount
├── answers
├── createdAt
└── updatedAt
```

Ràng buộc: nếu bài chỉ làm 1 lần → `UNIQUE(assignmentId, studentId)`.

Chấm điểm: Backend tự so `answers[].answer` với `correctAnswer` trong Question Bank — **không nhận `score` từ Frontend**.

## 6. Model: Notification

```
Notification
├── id
├── userId
├── type          // ASSIGNMENT | RESULT | DEADLINE_REMINDER
├── title
├── message
├── assignmentId
├── data          // ví dụ { code: "A7K92X" }
├── isRead
├── readAt
├── createdAt
└── updatedAt
```

Ràng buộc: không tạo trùng — `UNIQUE(userId, assignmentId, type)`.

DB Notification là **nguồn dữ liệu chính**; Firebase FCM chỉ là lớp đẩy push ra thiết bị, không thay thế DB.

---

## 7. Luồng nghiệp vụ chính

```
Admin tạo Class (10A1)
   → Tạo học sinh, gán User.classId = 10A1
   → Giáo viên tạo Assignment: chọn Game, chọn Class, chọn examDuration, deadline
   → Backend sinh code duy nhất, lưu Assignment
   → Backend tìm toàn bộ User có classId = 10A1 & role = STUDENT
   → Tạo Notification cho từng học sinh đó (không gửi cho lớp khác)
   → Bắn Firebase FCM song song với lưu DB Notification
   → Học sinh mở Home → thấy 🔔 → click → mở modal nhập code (KHÔNG tự điền/vào thẳng)
   → POST /assignments/join { code }
   → Backend validate: code đúng + user.classId === assignment.classId
        + assignment ACTIVE + chưa quá deadline + chưa hoàn thành (nếu 1 lần)
   → Backend trả startedAt, examDuration → Frontend chạy countdown
   → Hết giờ hoặc học sinh bấm nộp → POST submit { answers }
   → Backend tự chấm dựa trên correctAnswer trong Question Bank, lưu Submission
   → Tạo Notification kết quả (điểm, số câu đúng)
```

## 8. Quy tắc bảo mật bắt buộc

- **Không tin `classId` do Frontend gửi lên.** Backend luôn lấy `classId` từ `User` hiện tại (qua token), không nhận từ body request của client.
- Join Assignment phải kiểm tra đồng thời: `code` hợp lệ **+** `user.classId === assignment.classId` **+** `status = ACTIVE` **+** chưa hết `deadline`. Thiếu 1 điều kiện → từ chối:
  ```json
  { "resultCode": "FORBIDDEN", "resultMessage": "Bạn không thuộc lớp được giao bài." }
  ```
- **Thời gian làm bài do Backend kiểm soát**, không dựa vào JS phía client:
  - Lưu `startedAt` + `examDuration` → tính `expiresAt = startedAt + examDuration`.
  - Refresh trang / mở DevTools không làm sai lệch thời gian còn lại.
  - Hết `expiresAt` → tự động submit.
- Học sinh **không được**: tạo Assignment, sửa đáp án/điểm/thời gian/deadline.
- Không hard-code ở Frontend: `classId`, `code`, `teacherId`, `studentId`, `examDuration`, `assignmentId` — tất cả lấy từ API.

## 9. Danh sách API cần có

| API | Chức năng |
|---|---|
| `POST /assignments` | Giáo viên tạo bài thi |
| `GET /assignments/:id` | Lấy thông tin bài thi |
| `POST /assignments/join` | Học sinh nhập code tham gia |
| `POST /assignments/:id/start` | Bắt đầu làm bài (ghi `startedAt`) |
| `POST /assignments/:id/submit` | Nộp bài |
| `GET /assignments/:id/result` | Xem kết quả |
| `GET /notifications` | Lấy thông báo của user hiện tại |
| `PATCH /notifications/:id/read` | Đánh dấu đã đọc |
| `PATCH /notifications/read-all` | Đánh dấu tất cả đã đọc |
| `PATCH /users/:id` | Đổi lớp cho học sinh |

`POST /assignments` — Backend xử lý theo thứ tự: xác thực giáo viên → check quyền → check game tồn tại → check classId tồn tại → validate examDuration → sinh code → tạo Assignment → tìm học sinh theo classId → tạo Notification hàng loạt → trả kết quả.

## 10. Notification nhắc deadline (tuỳ chọn nâng cao)

- Gửi trước 24h và trước 1h so với `deadline`.
- Chỉ gửi cho học sinh **chưa submit**.

## 11. Bảng phân quyền

| Hành động | Giáo viên | Học sinh |
|---|:---:|:---:|
| Tạo Assignment / chọn Game, lớp, thời gian, deadline | ✅ | ❌ |
| Xem học sinh đã làm / điểm | ✅ | ❌ |
| Xem thông báo, nhập code, làm bài, nộp bài, xem kết quả | ❌ | ✅ |
| Sửa đáp án / điểm / thời gian / deadline | ❌ | ❌ |

## 12. Thứ tự triển khai (Phase)

1. **Database**: tạo/refactor `Class`, `Assignment`, `Submission`, `Notification`; thêm `classId`, `isExam`, `examDuration`, `code`, `deadline`.
2. **Teacher flow**: tạo bài thi → chọn Game/Class/thời gian/deadline → sinh code → tạo Assignment.
3. **Notification**: tạo theo classId → API `GET /notifications` → hiển thị Home + `unreadCount` → mark as read.
4. **Join Game**: click notification → modal nhập code → `POST /assignments/join` → validate → vào Game.
5. **Exam Timer**: `startedAt`/`expiresAt` do Backend quản lý → countdown → hết giờ tự nộp.
6. **Auto Grading**: so khớp `correctAnswer` → tính điểm → lưu Submission → trả kết quả.
7. **Firebase FCM**: chỉ bật sau khi DB Notification đã chạy ổn định; là lớp push bổ sung, không thay thế DB.

## 13. Test case bắt buộc

1. Giao bài cho 10A1 → học sinh 10A1 có notification.
2. Học sinh 10A2 → không có notification.
3. Click notification → mở đúng modal nhập code.
4. Nhập code đúng, đúng lớp → vào bài.
5. Code đúng nhưng sai lớp → bị từ chối (FORBIDDEN).
6. Code sai → bị từ chối.
7. Đã hết deadline → không cho bắt đầu bài.
8. Đang làm bài mà refresh trang → thời gian còn lại vẫn đúng (tính theo Backend).
9. Hết giờ → tự động submit.
10. Nộp bài → Backend tự chấm đúng điểm.
11. Có điểm → notification kết quả xuất hiện.
12. Đã nộp bài (nếu chỉ cho làm 1 lần) → không tạo được Submission thứ hai.