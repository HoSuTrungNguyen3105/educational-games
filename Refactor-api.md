# YÊU CẦU: TÁCH QUESTION KHỎI GAME

## 1. Mục tiêu

Hiện tại API Question đang trả về field `gameId`:

```json
{
  "_id": "6a8abf745b383eb63e12a5bf",
  "id": "question-001",
  "content": "Trong vườn có 45 cây cam và 28 cây táo. Hỏi trong vườn có tất cả bao nhiêu cây?",
  "options": [
    {
      "id": "answer-001",
      "content": "63 cây"
    },
    {
      "id": "answer-002",
      "content": "73 cây"
    },
    {
      "id": "answer-003",
      "content": "83 cây"
    }
  ],
  "correctAnswer": "answer-002",
  "timeLimit": 20,
  "points": 100,
  "gameId": "6a8abf735b383eb63e12a5b0"
}
```

Yêu cầu thay đổi:

> **Question không còn phụ thuộc trực tiếp vào Game và API Question không được trả về `gameId`.**

---

# 2. Response mới

API Question phải trả về dữ liệu dạng:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "_id": "6a8abf745b383eb63e12a5bf",
      "id": "question-001",
      "content": "Trong vườn có 45 cây cam và 28 cây táo. Hỏi trong vườn có tất cả bao nhiêu cây?",
      "options": [
        {
          "id": "answer-001",
          "content": "63 cây"
        },
        {
          "id": "answer-002",
          "content": "73 cây"
        },
        {
          "id": "answer-003",
          "content": "83 cây"
        }
      ],
      "correctAnswer": "answer-002",
      "timeLimit": 20,
      "points": 100
    }
  ]
}
```

## Bắt buộc

Không được trả về:

```json
"gameId": "..."
```

ở Question API.

---

# 3. Database / Model

Kiểm tra Question model/schema hiện tại.

Nếu Question đang có:

```js
gameId
```

thì loại bỏ quan hệ trực tiếp:

```text
Question → Game
```

Question nên là entity độc lập.

Cấu trúc Question chỉ nên chứa các thông tin thuộc về bản thân câu hỏi:

```text
Question
├── _id
├── id
├── content
├── options
├── correctAnswer
├── timeLimit
└── points
```

Không thêm `gameId` vào response mới.

---

# 4. Không tạo GameQuestion trong phạm vi task này

Task hiện tại chỉ yêu cầu:

1. Bỏ `gameId` khỏi Question.
2. Điều chỉnh schema/model nếu cần.
3. Điều chỉnh service/repository/query.
4. Điều chỉnh API response.
5. Đảm bảo frontend hiện tại không bị lỗi do `gameId` bị loại bỏ.

**Không cần tự ý tạo bảng/collection `GameQuestion` trong task này**, trừ khi code hiện tại bắt buộc phải có quan hệ đó để hệ thống hoạt động.

Nếu việc bỏ `gameId` gây ảnh hưởng đến logic Game hiện tại thì trước tiên hãy phân tích và báo rõ những phần bị ảnh hưởng.

---

# 5. API GET Question

Kiểm tra tất cả API đang lấy Question.

Ví dụ:

```text
GET /questions
GET /questions/:id
```

hoặc các endpoint tương ứng trong project.

Tất cả response Question phải thống nhất:

```json
{
  "_id": "...",
  "id": "...",
  "content": "...",
  "options": [],
  "correctAnswer": "...",
  "timeLimit": 20,
  "points": 100
}
```

Không trả:

```json
"gameId": "..."
```

---

# 6. API Create Question

Kiểm tra API tạo Question.

Nếu request hiện tại đang yêu cầu:

```json
{
  "content": "...",
  "options": [],
  "correctAnswer": "...",
  "timeLimit": 20,
  "points": 100,
  "gameId": "..."
}
```

thì thay đổi thành:

```json
{
  "content": "...",
  "options": [],
  "correctAnswer": "...",
  "timeLimit": 20,
  "points": 100
}
```

`gameId` không còn là field bắt buộc của Question.

---

# 7. API Update Question

Kiểm tra API update Question.

Không còn cho phép update:

```json
{
  "gameId": "..."
}
```

Ví dụ request mới:

```json
{
  "content": "Nội dung mới",
  "options": [
    {
      "id": "answer-001",
      "content": "..."
    }
  ],
  "correctAnswer": "answer-001",
  "timeLimit": 20,
  "points": 100
}
```

---

# 8. API Delete Question

Kiểm tra logic delete Question.

Việc xóa Question không được phụ thuộc vào:

```text
gameId
```

Nếu hiện tại delete Question đang kiểm tra Game thì cần điều chỉnh lại để Question có thể được quản lý độc lập.

---

# 9. Service / Repository / Query

Tìm toàn bộ code có sử dụng:

```text
question.gameId
```

hoặc:

```text
gameId
```

liên quan đến Question.

Kiểm tra các vị trí:

```text
Controller
Service
Repository
Schema / Model
DTO
Validator
Serializer
Response mapper
Query
Populate
Aggregation
```

Loại bỏ những phần chỉ tồn tại để phục vụ quan hệ:

```text
Question → Game
```

Không xóa `gameId` của các entity khác nếu chúng vẫn cần sử dụng.

Ví dụ:

```text
Game.gameId
Assignment.gameId
```

không được tự ý xóa.

Chỉ xử lý `gameId` thuộc Question.

---

# 10. Kiểm tra dữ liệu cũ

Database có thể vẫn đang tồn tại các document:

```json
{
  "id": "question-001",
  "content": "...",
  "gameId": "..."
}
```

Cần kiểm tra khả năng tương thích dữ liệu cũ.

Nếu schema/model mới không còn sử dụng `gameId`, API response vẫn phải loại field này.

Nếu cần migration database để xóa field `gameId` khỏi dữ liệu cũ thì phải báo rõ trước khi thực hiện.

Không tự ý xóa dữ liệu production.

---

# 11. Kiểm tra các API Game

Sau khi Question không còn `gameId`, kiểm tra các API Game hiện tại có đang lấy Question bằng:

```text
gameId
```

hay không.

Nếu Game hiện tại đang phụ thuộc vào:

```text
Question.gameId
```

thì **không được tự ý phá logic Game**.

Hãy báo cáo:

```text
Game hiện tại đang phụ thuộc Question.gameId ở:
- ...
- ...
- ...

Ảnh hưởng:
- ...
```

Sau đó đề xuất phương án xử lý.

Task chính vẫn là:

> Question phải trở thành entity độc lập và Question API không trả về `gameId`.

---

# 12. Response format

Giữ nguyên wrapper response hiện tại:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": []
}
```

Không thay đổi:

```text
status
code
msg
```

Chỉ thay đổi structure của Question trong `data`.

---

# 13. Backward compatibility

Không được làm hỏng các API không liên quan.

Đặc biệt kiểm tra:

```text
Assignment
Game
Student
Question
Answer
Submission
Result
```

Nếu frontend đang sử dụng `gameId` từ Question thì phải tìm và xử lý các chỗ đó.

Không được chỉ xóa field ở backend rồi để frontend bị:

```text
undefined
```

hoặc crash.

---

# 14. Expected result

Sau khi hoàn thành:

### Question API

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "_id": "6a8abf745b383eb63e12a5bf",
      "id": "question-001",
      "content": "Trong vườn có 45 cây cam và 28 cây táo. Hỏi trong vườn có tất cả bao nhiêu cây?",
      "options": [
        {
          "id": "answer-001",
          "content": "63 cây"
        },
        {
          "id": "answer-002",
          "content": "73 cây"
        },
        {
          "id": "answer-003",
          "content": "83 cây"
        }
      ],
      "correctAnswer": "answer-002",
      "timeLimit": 20,
      "points": 100
    }
  ]
}
```

### Không được có:

```json
"gameId": "..."
```

---

# 15. Checklist trước khi hoàn thành

* [ ] Question schema/model không còn phụ thuộc trực tiếp vào Game.
* [ ] GET Question không trả `gameId`.
* [ ] GET Question by ID không trả `gameId`.
* [ ] Create Question không bắt buộc `gameId`.
* [ ] Update Question không xử lý `gameId`.
* [ ] Delete Question không phụ thuộc `gameId`.
* [ ] DTO/Validator đã cập nhật.
* [ ] Service/Repository đã cập nhật.
* [ ] Response mapper/serializer đã cập nhật.
* [ ] Không làm hỏng Game API.
* [ ] Không làm hỏng Assignment API.
* [ ] Không làm hỏng Submission/Result.
* [ ] Kiểm tra frontend đang sử dụng Question.
* [ ] Kiểm tra TypeScript/ESLint nếu project có.
* [ ] Test API response thực tế.
* [ ] Đảm bảo Question API trả đúng structure mới.

# 16. Quan trọng

**Đọc toàn bộ code liên quan trước khi sửa.**

Không chỉ xóa dòng:

```js
gameId
```

mà phải tìm toàn bộ dependency của `Question.gameId`.

Sau khi phân tích, hãy báo cáo:

```text
1. Question đang được sử dụng ở đâu?
2. gameId đang được sử dụng ở đâu?
3. Những file nào cần sửa?
4. Có API nào phụ thuộc Question.gameId không?
5. Có cần migration database không?
6. Có ảnh hưởng Game/Assignment không?
```

Sau đó mới implementation.

Mục tiêu cuối cùng:

> **Question là dữ liệu độc lập, không gắn trực tiếp với Game và Question API chỉ trả về các thông tin thuộc về Question.**