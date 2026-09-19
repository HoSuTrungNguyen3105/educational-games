# YÊU CẦU REFACTOR MODULE ASSIGNMENT

## 1. Bối cảnh hiện tại

Hãy đọc và phân tích **toàn bộ source code của project**, đặc biệt là phần liên quan đến:

* Assignment
* Student
* Teacher
* Authentication / Login
* Nhập mã bài / Assignment Code
* Làm bài
* Submit bài
* Kết quả bài làm
* Route / URL
* API liên quan đến assignment
* Logic phân quyền
* Logic lưu user/student hiện tại
* Các context/store/hook liên quan

### Flow hiện tại

Hiện tại hệ thống đang hoạt động theo hướng:

```text
Học sinh
   ↓
Vào trang Assignment
   ↓
Nhập mã bài
   ↓
Tìm assignment
   ↓
Vào làm bài
```

Tức là học sinh phải biết và nhập **assignment code** trước khi có thể vào bài.

---

# 2. Flow mới cần thay đổi

Tôi muốn thay đổi flow để giáo viên có thể **copy trực tiếp URL của assignment và gửi cho học sinh**.

Ví dụ:

```text
https://domain.com/assignment/ABC123
```

Trong đó:

```text
ABC123
```

là assignment code hoặc identifier của assignment.

Khi học sinh click vào link này, hệ thống phải tự xác định assignment và đưa học sinh vào đúng bài.

## Flow mới

```text
Teacher
   ↓
Tạo assignment
   ↓
Có assignment code / ID
   ↓
Copy assignment URL
   ↓
Gửi URL cho học sinh
   ↓
Student click URL
   ↓
┌─────────────────────────────┐
│ Student đã đăng nhập chưa? │
└─────────────────────────────┘
          ↓
      ┌───┴───┐
      ↓       ↓
     YES      NO
      ↓       ↓
Logic hiện   Hiện form
tại          nhập tên
      ↓       ↓
      └───┬───┘
          ↓
     Vào làm bài
```

---

# 3. Trường hợp học sinh CHƯA đăng nhập

Nếu học sinh truy cập trực tiếp assignment URL nhưng **chưa đăng nhập**:

Ví dụ:

```text
/assignment/ABC123
```

thì KHÔNG bắt buộc học sinh phải đăng nhập.

Thay vào đó hiển thị một màn hình/form yêu cầu:

```text
Nhập tên của bạn để bắt đầu

[ Nguyễn Văn A ]

        [ Bắt đầu làm bài ]
```

Đây là dạng **guest / vãng lai student**.

Sau khi nhập tên:

```text
Guest Student
    ↓
Assignment ABC123
    ↓
Start Assignment
    ↓
Làm bài
    ↓
Submit
```

Tên guest cần được lưu trong state/context/store/localStorage/session tùy theo kiến trúc hiện tại của project.

Không tự ý tạo một hệ thống authentication mới nếu project đã có cơ chế phù hợp.

---

# 4. Trường hợp học sinh ĐÃ đăng nhập

Nếu học sinh đã đăng nhập thì phải **giữ nguyên logic hiện tại**.

Ví dụ:

```text
Student Login
     ↓
Click assignment URL
     ↓
/assignment/ABC123
     ↓
Lấy thông tin student hiện tại
     ↓
Kiểm tra assignment
     ↓
Vào assignment
```

Không được thay đổi hoặc phá vỡ:

* Authentication hiện tại
* User information
* Student ID
* Class
* Permission
* Assignment history
* Progress
* Submission
* Result
* Các logic liên quan khác đang hoạt động

Nếu hệ thống hiện tại đã có logic kiểm tra student có quyền làm assignment hay không thì **phải giữ lại và tái sử dụng**.

---

# 5. URL structure

Hãy kiểm tra cấu trúc routing hiện tại của project và lựa chọn cách triển khai phù hợp với framework đang sử dụng.

Ưu tiên URL dạng:

```text
/assignment/[code]
```

Ví dụ:

```text
/assignment/ABC123
```

hoặc nếu hệ thống hiện tại sử dụng ID/slug:

```text
/assignment/[assignmentId]
```

Không hard-code assignment cụ thể.

Không sử dụng query string nếu Dynamic Route có thể đáp ứng được.

Ví dụ KHÔNG ưu tiên:

```text
/assignment?code=ABC123
```

mà ưu tiên:

```text
/assignment/ABC123
```

Tuy nhiên trước khi thay đổi, hãy đọc code hiện tại để xác định assignment đang được định danh bằng:

* code
* id
* slug
* hoặc combination khác.

Sau đó chọn URL structure phù hợp nhất với database/API hiện tại.

---

# 6. Quan trọng: Không được phá flow cũ

Đây là yêu cầu rất quan trọng.

Flow nhập assignment code hiện tại **không nhất thiết phải bị xóa ngay**.

Hãy kiểm tra xem trang nhập code hiện tại có thể:

```text
Nhập code
   ↓
Navigate đến
/assignment/[code]
```

thay vì duplicate toàn bộ logic hay không.

Mục tiêu là gom flow về một entry point:

```text
                    ┌── Teacher gửi URL ──┐
                    │                      ↓
Student nhập code ──┴──────────────→ /assignment/[code]
                                      ↓
                              Assignment Handler
                                      ↓
                              Auth / Guest check
                                      ↓
                                 Start Assignment
```

Như vậy cả hai cách đều hoạt động:

### Cách 1

```text
Student nhập code
```

### Cách 2

```text
Student click URL giáo viên gửi
```

Cả hai cuối cùng nên đi qua cùng một assignment flow.

---

# 7. Teacher cần có chức năng copy URL

Tìm phần teacher đang quản lý assignment.

Nếu hiện tại assignment đã có:

```text
Assignment Code
```

thì thêm chức năng:

```text
Copy assignment link
```

Ví dụ:

```text
Assignment Code: ABC123

[ Copy Link ]
```

Khi click:

```text
https://domain.com/assignment/ABC123
```

được copy vào clipboard.

URL phải được tạo dựa trên domain hiện tại, không hard-code domain production.

Ví dụ nên sử dụng logic tương tự:

```js
window.location.origin
```

hoặc cơ chế environment/config hiện tại của project.

Không hard-code:

```text
https://abc-production.com
```

nếu project đã có environment config.

---

# 8. Kiểm tra assignment

Khi truy cập:

```text
/assignment/ABC123
```

phải xử lý đầy đủ các trường hợp:

### Assignment tồn tại

```text
→ Hiển thị assignment
→ Kiểm tra authentication
→ Nếu login → dùng user hiện tại
→ Nếu guest → yêu cầu nhập tên
→ Cho phép bắt đầu
```

### Assignment không tồn tại

Hiển thị UI rõ ràng:

```text
Không tìm thấy bài tập
```

Không để màn hình trắng.

### Assignment đã bị xóa

Hiển thị trạng thái phù hợp.

### Assignment đã đóng / hết hạn

Nếu backend hiện tại có thông tin này thì phải sử dụng logic hiện tại để xử lý.

### Assignment không cho phép student hiện tại truy cập

Giữ nguyên permission logic hiện tại.

---

# 9. Guest student

Guest student chỉ nên được sử dụng cho trường hợp:

```text
Chưa đăng nhập
+
Truy cập trực tiếp assignment link
```

Không được làm ảnh hưởng đến authenticated student.

Ví dụ:

```text
Guest:
{
  name: "Nguyễn Văn A",
  assignmentId: "...",
  isGuest: true
}
```

Tên guest phải được sử dụng xuyên suốt quá trình làm bài để khi submit hệ thống biết bài này thuộc về ai.

Hãy kiểm tra API hiện tại xem backend đã hỗ trợ guest/student name chưa.

### Nếu backend đã hỗ trợ

Tái sử dụng API hiện tại.

### Nếu backend chưa hỗ trợ

Không tự ý sửa backend lớn ngay.

Hãy phân tích:

* API nào nhận student
* API nào tạo attempt
* API nào submit
* API nào lưu result

Sau đó đề xuất thay đổi tối thiểu cần thiết.

---

# 10. Không được tạo duplicate logic

Trước khi code hãy tìm toàn bộ logic liên quan đến:

```text
assignment code
assignment ID
assignment detail
start assignment
student authentication
guest student
submit assignment
assignment result
```

Nếu đã có function/hook/service/context dùng để:

```text
getAssignment()
startAssignment()
submitAssignment()
```

thì ưu tiên **tái sử dụng**.

Không tạo thêm:

```text
getAssignmentNew()
getAssignmentByUrl()
getAssignmentFromCode2()
```

nếu chỉ khác cách lấy parameter.

---

# 11. Yêu cầu đọc code trước khi sửa

Đây là phần bắt buộc.

### Bước 1 — Phân tích

Hãy scan toàn bộ project và xác định:

```text
Assignment pages
Assignment components
Assignment routes
Assignment API/service
Assignment hooks
Assignment context/store
Authentication
Student information
Teacher assignment management
Assignment code flow
Submission flow
Result flow
```

Sau đó mô tả architecture hiện tại.

### Bước 2 — Xác định các file cần thay đổi

Liệt kê rõ:

```text
File:
- ...
- ...
- ...

Lý do cần sửa:
- ...
```

Không sửa các file không liên quan.

### Bước 3 — Thiết kế flow mới

Mô tả flow:

```text
Teacher
   ↓
Copy URL
   ↓
Student opens URL
   ↓
Assignment lookup
   ↓
Auth check
   ├── Logged in → existing logic
   └── Guest → enter name
```

### Bước 4 — Sau khi phân tích mới bắt đầu code

Không được vừa scan vừa tự ý refactor toàn bộ project.

---

# 12. Các nguyên tắc khi sửa code

Ưu tiên:

* Reuse code hiện tại
* Giữ backward compatibility
* Không phá API hiện tại
* Không phá authentication
* Không phá assignment code flow
* Không duplicate business logic
* Không thay đổi database nếu chưa cần thiết
* Không thay đổi UI không liên quan
* Không thay đổi các component ngoài scope
* Giữ TypeScript type safety nếu project dùng TypeScript
* Giữ coding convention hiện tại
* Giữ loading state
* Giữ error handling
* Giữ toast/notification hiện tại
* Giữ responsive UI

Nếu cần thay đổi API/backend thì phải chỉ rõ:

```text
Tại sao cần sửa?
API nào cần sửa?
Request hiện tại?
Request mới?
Response hiện tại?
Response mới?
Ảnh hưởng đến frontend nào?
```

---

# 13. Acceptance Criteria

Sau khi hoàn thành, các flow sau bắt buộc phải hoạt động.

## Case 1 — Teacher copy link

Teacher có assignment:

```text
ABC123
```

Click:

```text
Copy Link
```

Kết quả:

```text
https://domain.com/assignment/ABC123
```

---

## Case 2 — Guest student

Student chưa login.

Mở:

```text
/assignment/ABC123
```

Kết quả:

```text
Hiển thị form nhập tên
```

Nhập:

```text
Nguyễn Văn A
```

→ Start assignment.

Student có thể làm bài và submit.

---

## Case 3 — Logged-in student

Student đã login.

Mở:

```text
/assignment/ABC123
```

Không hỏi lại tên.

Sử dụng student hiện tại và **giữ nguyên logic assignment hiện tại**.

---

## Case 4 — Student vẫn nhập code như cũ

Student vào trang assignment cũ.

Nhập:

```text
ABC123
```

Sau đó hệ thống redirect đến:

```text
/assignment/ABC123
```

và sử dụng flow chung.

---

## Case 5 — Invalid assignment

Mở:

```text
/assignment/INVALID
```

Không được crash hoặc màn hình trắng.

Hiển thị thông báo assignment không tồn tại.

# 14. Sau khi sửa

Sau khi code xong:

1. Kiểm tra TypeScript/ESLint.
2. Kiểm tra các route liên quan.
3. Kiểm tra build.
4. Kiểm tra navigation.
5. Kiểm tra guest flow.
6. Kiểm tra logged-in flow.
7. Kiểm tra nhập code flow.
8. Kiểm tra teacher copy link.
9. Kiểm tra refresh.
10. Kiểm tra submit.
11. Kiểm tra assignment invalid.
12. Kiểm tra các lỗi regression.

### Lưu ý cuối cùng

**Đừng bắt đầu bằng việc viết code ngay.**

Hãy đọc và hiểu toàn bộ flow Assignment hiện tại trước, sau đó đưa ra phân tích ngắn gọn và danh sách file cần thay đổi. Sau khi xác định được architecture và impact, mới tiến hành implementation.

Mục tiêu chính là:

> **Thêm khả năng truy cập assignment trực tiếp bằng URL cho học sinh, hỗ trợ guest student bằng cách nhập tên khi chưa đăng nhập, đồng thời giữ nguyên toàn bộ logic hiện tại đối với học sinh đã đăng nhập và không phá flow nhập assignment code cũ.**
