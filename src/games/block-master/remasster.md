Thiết kế API hệ thống nhiệm vụ Game
1. Mục tiêu

Frontend không tự quyết định nhiệm vụ đã hoàn thành hay chưa.

Backend chịu trách nhiệm:

Ghi nhận hành động của user.
Cập nhật tiến độ nhiệm vụ.
Xác định nhiệm vụ đã hoàn thành.
Xác định user đã nhận thưởng hay chưa.
Cộng thưởng một cách an toàn.
Trả trạng thái nhiệm vụ cho frontend.

Frontend chỉ chịu trách nhiệm:

Hiển thị danh sách nhiệm vụ.
Hiển thị progress / target.
Hiển thị trạng thái hoàn thành.
Cho phép user nhận thưởng khi nhiệm vụ đã hoàn thành.
2. Loại nhiệm vụ

Mỗi nhiệm vụ có một type để backend và frontend biết nhiệm vụ được kích hoạt bởi hành động nào.

Type	Ý nghĩa
PLAY_GAME	Chơi game
ANSWER_QUESTION	Trả lời câu hỏi
ANSWER_CORRECT	Trả lời đúng
EARN_XP	Kiếm XP
WIN_GAME	Thắng game

Ví dụ:

{
  "id": 1,
  "name": "Chơi 3 trận",
  "type": "PLAY_GAME",
  "target": 3,
  "reward": 30,
  "active": true
}

3. API lấy danh sách nhiệm vụ
Request
GET /api/tasks

Response
[
  {
    "id": 1,
    "name": "Chơi 1 trận",
    "description": "Hoàn thành 1 trận game bất kỳ",
    "type": "PLAY_GAME",
    "target": 1,
    "progress": 0,
    "reward": 10,
    "completed": false,
    "claimed": false
  },
  {
    "id": 2,
    "name": "Chơi 3 trận",
    "description": "Hoàn thành 3 trận game",
    "type": "PLAY_GAME",
    "target": 3,
    "progress": 0,
    "reward": 30,
    "completed": false,
    "claimed": false
  },
  {
    "id": 3,
    "name": "Trả lời 5 câu",
    "description": "Trả lời 5 câu hỏi bất kỳ",
    "type": "ANSWER_QUESTION",
    "target": 5,
    "progress": 0,
    "reward": 15,
    "completed": false,
    "claimed": false
  },
  {
    "id": 4,
    "name": "Trả lời đúng 5 câu",
    "description": "Trả lời đúng 5 câu hỏi",
    "type": "ANSWER_CORRECT",
    "target": 5,
    "progress": 0,
    "reward": 25,
    "completed": false,
    "claimed": false
  },
  {
    "id": 5,
    "name": "Kiếm 100 XP",
    "description": "Tích lũy 100 XP trong ngày",
    "type": "EARN_XP",
    "target": 100,
    "progress": 0,
    "reward": 20,
    "completed": false,
    "claimed": false
  }
]

4. Không cho frontend tự complete task

Không nên thiết kế API:

POST /api/tasks/:id/complete


và cho frontend gửi:

{
  "completed": true
}


Vì user có thể tự sửa request để gian lận.

Thay vào đó, nhiệm vụ phải được cập nhật từ action nghiệp vụ thực tế.

Ví dụ:

User chơi game
      ↓
POST /api/games/:id/finish
      ↓
Backend xác nhận game hợp lệ
      ↓
Ghi nhận PLAY_GAME
      ↓
Cập nhật user_tasks
      ↓
Kiểm tra target
      ↓
completed = true nếu đủ target

5. Khi user hoàn thành game

Frontend gọi:

POST /api/games/{gameId}/finish


Backend xử lý:

1. Kiểm tra game tồn tại.
2. Kiểm tra user có quyền hoàn thành game.
3. Lưu kết quả game.
4. Tạo event PLAY_GAME.
5. Tìm các nhiệm vụ type PLAY_GAME.
6. Tăng progress.
7. Nếu progress >= target:
      completed = true
8. Trả trạng thái nhiệm vụ về frontend.


Ví dụ response:

{
  "game": {
    "id": 123,
    "result": "win"
  },
  "tasks": [
    {
      "id": 1,
      "type": "PLAY_GAME",
      "progress": 1,
      "target": 1,
      "completed": true,
      "claimed": false
    },
    {
      "id": 2,
      "type": "PLAY_GAME",
      "progress": 1,
      "target": 3,
      "completed": false,
      "claimed": false
    }
  ]
}


Frontend có thể hiển thị:

Chơi 1 trận
1 / 1
✓ Hoàn thành

Chơi 3 trận
1 / 3

6. Khi user trả lời câu hỏi

Frontend gọi:

POST /api/questions/{questionId}/answer


Body:

{
  "answer": "A"
}


Backend tự kiểm tra đáp án.

Trả lời đúng

Backend tạo/cập nhật:

ANSWER_QUESTION += 1
ANSWER_CORRECT += 1

Trả lời sai

Backend chỉ cập nhật:

ANSWER_QUESTION += 1


Không được để frontend gửi:

{
  "correct": true
}


vì frontend không phải nguồn dữ liệu đáng tin cậy để xác định đáp án đúng.

7. Ví dụ user trả lời đúng câu thứ 5

Response:

{
  "answer": {
    "correct": true
  },
  "tasks": [
    {
      "id": 3,
      "type": "ANSWER_QUESTION",
      "progress": 5,
      "target": 5,
      "completed": true,
      "claimed": false
    },
    {
      "id": 4,
      "type": "ANSWER_CORRECT",
      "progress": 5,
      "target": 5,
      "completed": true,
      "claimed": false
    }
  ]
}


Frontend chỉ cần render:

Trả lời 5 câu
5 / 5
✓ Hoàn thành

Trả lời đúng 5 câu
5 / 5
✓ Hoàn thành

8. Tách completed và claimed

Hai trạng thái này phải độc lập.

completed = nhiệm vụ đã đạt điều kiện
claimed   = user đã nhận thưởng


Ví dụ:

{
  "progress": 5,
  "target": 5,
  "completed": true,
  "claimed": false
}


Có nghĩa:

User đã hoàn thành nhiệm vụ nhưng chưa nhận thưởng.

Frontend có thể hiển thị:

Trả lời đúng 5 câu
5 / 5

[ NHẬN +25 ]


Sau khi nhận thưởng:

{
  "progress": 5,
  "target": 5,
  "completed": true,
  "claimed": true
}


Frontend hiển thị:

Trả lời đúng 5 câu
5 / 5

✓ Đã nhận

9. API nhận thưởng
Request
POST /api/tasks/{taskId}/claim


Backend phải kiểm tra:

completed == true
AND
claimed == false


Nếu không thỏa mãn thì từ chối.

Response thành công
{
  "success": true,
  "reward": 25,
  "balance": 1250,
  "task": {
    "id": 4,
    "completed": true,
    "claimed": true
  }
}

10. Transaction khi nhận thưởng

API claim phải chạy trong transaction.

Ví dụ:

BEGIN TRANSACTION

1. SELECT user_task FOR UPDATE

2. Kiểm tra:
   - completed = true
   - claimed_at IS NULL

3. Cộng reward cho user

4. Set:
   claimed_at = NOW()

5. Commit

COMMIT


Mục đích là tránh trường hợp user gửi 2 request claim cùng lúc và nhận thưởng 2 lần.

11. Database
Bảng tasks

Dùng để lưu định nghĩa nhiệm vụ.

CREATE TABLE tasks (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    target INT NOT NULL,
    reward INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


Ví dụ:

id | name                  | type             | target | reward
---|-----------------------|------------------|--------|-------
1  | Chơi 1 trận           | PLAY_GAME        | 1      | 10
2  | Chơi 3 trận           | PLAY_GAME        | 3      | 30
3  | Trả lời 5 câu         | ANSWER_QUESTION  | 5      | 15
4  | Trả lời đúng 5 câu    | ANSWER_CORRECT   | 5      | 25
5  | Kiếm 100 XP           | EARN_XP          | 100    | 20

12. Bảng user_tasks

Dùng để lưu tiến độ của từng user.

CREATE TABLE user_tasks (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    progress INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    claimed_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE(user_id, task_id)
);


Có thể suy ra trạng thái:

completed = completed_at IS NOT NULL
claimed   = claimed_at IS NOT NULL


Không nhất thiết phải lưu riêng:

completed BOOLEAN
claimed BOOLEAN


nếu muốn tránh dữ liệu bị lệch giữa các field.

13. Nếu hệ thống lớn: sử dụng Event

Có thể thêm bảng:

CREATE TABLE user_events (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_id VARCHAR(100),
    metadata JSON,
    created_at TIMESTAMP
);


Ví dụ:

user_id | event_type        | event_id
--------|-------------------|---------
1001    | PLAY_GAME         | game_123
1001    | ANSWER_CORRECT    | q_456
1001    | EARN_XP           | xp_789


Luồng:

Game API
   ↓
PLAY_GAME event
   ↓
Task Processor
   ↓
user_tasks


và:

Question API
   ↓
ANSWER_QUESTION event
   ↓
Task Processor
   ↓
user_tasks

14. Kiến trúc tổng thể
                  ┌─────────────────┐
                  │    FRONTEND     │
                  └────────┬────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
     Finish Game API              Answer API
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  ┌─────────────────┐
                  │ Business Logic  │
                  └────────┬────────┘
                           │
                           ▼
                    Create Event
                           │
                           ▼
                  ┌─────────────────┐
                  │  Task Processor  │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        PLAY_GAME    ANSWER_CORRECT   EARN_XP
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                  ┌─────────────────┐
                  │   user_tasks    │
                  └────────┬────────┘
                           │
                           ▼
                     Task Status
                           │
                           ▼
                  ┌─────────────────┐
                  │    FRONTEND     │
                  └─────────────────┘

15. Quy tắc quan trọng
Frontend

Frontend không được quyết định:

completed
progress
correct
reward


Frontend chỉ gửi action thực tế:

finish game
answer question
claim reward

Backend

Backend quyết định:

progress
completed
reward
claimed

Không tin dữ liệu từ frontend

Không nên nhận:

{
  "progress": 100,
  "completed": true,
  "reward": 1000
}


Thay vào đó backend tự tính từ dữ liệu nghiệp vụ.

16. API đề xuất
Method	Endpoint	Mục đích
GET	/api/tasks	Lấy danh sách nhiệm vụ + progress
POST	/api/games/{id}/finish	Hoàn thành game
POST	/api/questions/{id}/answer	Trả lời câu hỏi
POST	/api/tasks/{id}/claim	Nhận thưởng nhiệm vụ

Không cần:

POST /api/tasks/{id}/complete


vì complete phải được backend tự xác định dựa trên action thực tế.

17. Ví dụ flow hoàn chỉnh

User bắt đầu ngày với:

Chơi 3 trận
0 / 3

Trả lời đúng 5 câu
0 / 5


User chơi trận đầu:

POST /api/games/123/finish


Backend cập nhật:

PLAY_GAME = 1


Frontend nhận:

Chơi 3 trận
1 / 3


User chơi tiếp:

PLAY_GAME = 2


Sau trận thứ 3:

PLAY_GAME = 3
target = 3


Backend set:

completed_at = NOW()


Frontend nhận:

Chơi 3 trận
3 / 3

[ NHẬN +30 ]


User bấm nhận:

POST /api/tasks/2/claim


Backend transaction:

Kiểm tra completed
→ cộng 30 reward
→ set claimed_at
→ commit


Frontend:

Chơi 3 trận
3 / 3

✓ Đã nhận

18. Kết luận

Thiết kế nên theo nguyên tắc:

USER ACTION
    ↓
BUSINESS API
    ↓
EVENT / ACTION
    ↓
TASK PROCESSOR
    ↓
UPDATE USER_TASK
    ↓
COMPLETED
    ↓
CLAIM REWARD


Frontend không hoàn thành nhiệm vụ. Frontend chỉ hiển thị tiến độ mà backend trả về.

Cách này vừa an toàn chống gian lận, vừa dễ mở rộng khi sau này thêm nhiều loại nhiệm vụ mới.