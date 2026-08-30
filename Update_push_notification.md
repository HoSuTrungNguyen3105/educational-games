# 📱 Hệ thống Push Notification cho App

## 1. Mục tiêu

Xây dựng hệ thống **Push Notification** để khi hệ thống có thông báo mới, điện thoại của người dùng sẽ nhận và hiển thị thông báo ngay lập tức.

Ví dụ:

> 🔔 **Nhiệm vụ mới**
> Bạn có một nhiệm vụ cần hoàn thành!

Thông báo cần hoạt động cả khi:

* Người dùng đang mở app.
* Người dùng đang ở app khác.
* Người dùng khóa màn hình.
* Người dùng đã thoát app.

---

# 2. Kiến trúc tổng thể

```text
┌─────────────────────┐
│       Backend       │
│                     │
│ Có notification mới │
└──────────┬──────────┘
           │
           │ Push Notification
           ▼
┌─────────────────────┐
│       Firebase      │
│   Cloud Messaging   │
│       (FCM)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Điện thoại     │
│                     │
│ 🔔 Nhiệm vụ mới     │
│ Bạn có nhiệm vụ...  │
└─────────────────────┘
```

---

# 3. Công nghệ đề xuất

## Frontend

Nếu app hiện tại sử dụng React/Vite:

```text
React / Vite
    +
Firebase Cloud Messaging
    +
Service Worker
```

## Backend

Backend chịu trách nhiệm:

```text
Tạo notification
        ↓
Lưu notification vào database
        ↓
Gửi Push Notification qua FCM
```

## Mobile

Nếu sau này chuyển thành:

* Android
* iOS
* React Native
* Flutter

thì vẫn có thể tiếp tục sử dụng Firebase Cloud Messaging.

---

# 4. Luồng hoạt động

## Bước 1: Người dùng đăng nhập

Frontend lấy:

```text
FCM Token
```

Ví dụ:

```text
fcm_token:
xxxxx-yyyyy-zzzzz
```

Frontend gửi token về Backend.

```http
POST /notifications/device-token
```

Request:

```json
{
  "token": "FCM_TOKEN",
  "deviceType": "ANDROID"
}
```

---

# 5. Backend lưu FCM Token

Database nên có bảng:

```text
UserDevice
```

Ví dụ:

```text
UserDevice
├── id
├── userId
├── token
├── deviceType
├── isActive
├── createdAt
└── updatedAt
```

Ví dụ:

```json
{
  "id": "device_001",
  "userId": "student_001",
  "token": "xxxxx-yyyyy",
  "deviceType": "ANDROID",
  "isActive": true
}
```

Một user có thể có nhiều thiết bị:

```text
Người dùng
├── Điện thoại Android
├── iPhone
└── Máy tính
```

Do đó **không nên chỉ lưu một FCM token trong User**.

---

# 6. Database Notification

Tạo bảng:

```text
Notification
```

Cấu trúc đề xuất:

```text
Notification
├── id
├── userId
├── title
├── message
├── type
├── data
├── isRead
├── createdAt
└── sentAt
```

Ví dụ:

```json
{
  "id": "notification_001",
  "userId": "student_001",
  "title": "🎮 Nhiệm vụ mới",
  "message": "Hoàn thành 1 ván Cờ Tỷ Phú để nhận 100 XP",
  "type": "GAME_MISSION",
  "data": {
    "gameId": "monopoly",
    "missionId": "mission_123"
  },
  "isRead": false
}
```

---

# 7. Các loại Notification

Nên dùng `type` để hệ thống biết notification thuộc loại nào.

```text
GAME_MISSION
GAME_REWARD
DAILY_MISSION
NEW_LESSON
TEACHER_ASSIGNMENT
MESSAGE
LEVEL_UP
ITEM_REWARD
COOP_INVITATION
SYSTEM
```

Ví dụ:

```json
{
  "type": "LEVEL_UP"
}
```

Frontend có thể dựa vào type để xử lý khi người dùng bấm notification.

---

# 8. Data của Notification

Không nên chỉ gửi title và message.

Nên gửi thêm `data`.

Ví dụ:

```json
{
  "title": "🏆 Chúc mừng!",
  "message": "Bạn đã lên Level 10",
  "type": "LEVEL_UP",
  "data": {
    "level": 10
  }
}
```

Hoặc:

```json
{
  "title": "🎮 Nhiệm vụ mới",
  "message": "Có nhiệm vụ Cờ Tỷ Phú mới",
  "type": "GAME_MISSION",
  "data": {
    "gameId": "monopoly",
    "missionId": "mission_123"
  }
}
```

Khi người dùng bấm notification:

```text
GAME_MISSION
      ↓
Mở game
      ↓
monopoly
      ↓
Hiển thị mission_123
```

---

# 9. Gửi Push Notification

Khi có sự kiện:

```text
Học sinh được giao nhiệm vụ
```

Backend xử lý:

```text
1. Tạo Notification
2. Lưu vào Database
3. Lấy FCM Token của user
4. Gửi notification qua Firebase
```

Luồng:

```text
Teacher
   │
   │ Giao nhiệm vụ
   ▼
Backend
   │
   ├── Lưu Notification
   │
   └── Firebase FCM
             │
             ▼
        📱 Student
             │
             ▼
        🔔 Thông báo
```

---

# 10. Notification khi app đang mở

Khi app đang mở:

```text
FCM
 ↓
Frontend
 ↓
Hiển thị Toast / Notification UI
```

Ví dụ:

```text
🔔 Nhiệm vụ mới

Bạn vừa nhận được một nhiệm vụ mới.
```

Có thể sử dụng:

```text
react-hot-toast
```

hoặc tự xây dựng notification popup.

---

# 11. Notification khi app đang đóng

Đây là phần quan trọng nhất.

Khi app không mở:

```text
Backend
   ↓
FCM
   ↓
Android / iOS
   ↓
🔔 System Notification
```

Hệ điều hành sẽ tự hiển thị:

```text
┌──────────────────────────────┐
│ 🔔 Educational Games         │
│                              │
│ 🎮 Nhiệm vụ mới              │
│ Bạn có nhiệm vụ cần làm!     │
└──────────────────────────────┘
```

Không cần người dùng mở app trước.

---

# 12. Service Worker

Nếu sử dụng React/Vite dạng PWA/Web App thì cần Service Worker để xử lý Push Notification trong background.

Ví dụ cấu trúc:

```text
src/
├── firebase/
│   ├── firebaseConfig.js
│   └── notification.js
│
├── service-worker/
│   └── firebase-messaging-sw.js
│
├── notifications/
│   ├── NotificationProvider.jsx
│   └── NotificationToast.jsx
│
└── App.jsx
```

---

# 13. API đề xuất

## Đăng ký thiết bị

```http
POST /notifications/device-token
```

Request:

```json
{
  "token": "FCM_TOKEN",
  "deviceType": "ANDROID"
}
```

---

## Xóa thiết bị

```http
DELETE /notifications/device-token
```

Request:

```json
{
  "token": "FCM_TOKEN"
}
```

---

## Lấy danh sách notification

```http
GET /notifications
```

Response:

```json
{
  "resultCode": 0,
  "resultMessage": "Thành công",
  "list": [
    {
      "id": "notification_001",
      "title": "🎮 Nhiệm vụ mới",
      "message": "Bạn có nhiệm vụ mới",
      "type": "GAME_MISSION",
      "isRead": false,
      "createdAt": "2026-08-30T15:00:00Z"
    }
  ]
}
```

---

## Đánh dấu đã đọc

```http
PATCH /notifications/:id/read
```

---

## Đánh dấu tất cả đã đọc

```http
PATCH /notifications/read-all
```

---

# 14. Notification Flow hoàn chỉnh

```text
┌──────────────┐
│    Teacher   │
└──────┬───────┘
       │
       │ Giao nhiệm vụ
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐       ┌──────────────┐
│   Database   │       │     FCM      │
│ Notification │       │              │
└──────────────┘       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   Student    │
                       │    Phone     │
                       └──────┬───────┘
                              │
                              ▼
                       🔔 Notification
```

---

# 15. Các notification của hệ thống game

Hệ thống Educational Games có thể sử dụng chung một Notification System cho tất cả game.

Ví dụ:

### Nhiệm vụ mới

```text
🎮 Nhiệm vụ mới

Bạn có nhiệm vụ mới:
"Hoàn thành 1 trận Cờ Tỷ Phú"
```

### Nhận thưởng

```text
🎁 Bạn nhận được phần thưởng

+100 XP
+50 Coins
```

### Lên Level

```text
🏆 Level Up!

Chúc mừng! Bạn đã đạt Level 10.
```

### Mời chơi Co-op

```text
👥 Lời mời chơi

Nguyễn A mời bạn chơi Cờ Tỷ Phú.
```

### Nhắc nhiệm vụ

```text
⏰ Nhắc nhở

Bạn chưa hoàn thành nhiệm vụ hôm nay.
```

---

# 16. Không nên phụ thuộc hoàn toàn vào Push Notification

Push Notification chỉ là **cơ chế thông báo**.

Database Notification vẫn phải tồn tại.

Ví dụ:

```text
Notification Database
        │
        ├── App đang mở
        │      ↓
        │   Hiển thị realtime
        │
        └── App đóng
               ↓
            FCM Push
```

Lý do:

* Người dùng có thể tắt notification.
* Điện thoại có thể mất mạng.
* FCM có thể không gửi thành công.
* Người dùng cần xem lại lịch sử notification.
* Cần hiển thị số notification chưa đọc.

---

# 17. Badge Notification

Có thể hiển thị:

```text
🔔
   3
```

Khi có notification:

```text
Notification count = 3
```

Khi đọc:

```text
Notification count = 2
```

API:

```http
GET /notifications/unread-count
```

Response:

```json
{
  "resultCode": 0,
  "count": 3
}
```

---

# 18. Xử lý nhiều thiết bị

Một user có thể đăng nhập:

```text
User 001
│
├── Android
│   └── FCM Token A
│
├── iPhone
│   └── FCM Token B
│
└── Web
    └── FCM Token C
```

Khi gửi notification:

```text
Backend
   ↓
User 001
   ↓
FCM Token A
FCM Token B
FCM Token C
```

Có thể gửi đến tất cả thiết bị đang active.

---

# 19. Bảo mật

FCM Token không nên được tin tưởng trực tiếp từ client để gửi notification.

Frontend chỉ có quyền:

```text
Đăng ký FCM Token
```

Frontend **không được phép**:

```text
Tự gửi Push Notification
```

Việc gửi Push Notification phải được thực hiện ở Backend bằng Firebase credentials/server configuration.

---

# 20. Kiến trúc đề xuất cho dự án

```text
Frontend
│
├── React / Vite
├── Firebase Messaging
├── Service Worker
└── Notification UI
        │
        ▼
      API
        │
        ▼
Backend
│
├── Notification Module
├── Device Token Module
├── Firebase FCM Service
└── Notification Database
        │
        ▼
    Firebase FCM
        │
        ▼
 Android / iOS / Web
```

---

# 21. Nguyên tắc quan trọng

### Không tạo Notification riêng cho từng game

Không nên:

```text
MonopolyNotification
QuizNotification
ChessNotification
RaceNotification
...
```

Nên tạo **một Notification System dùng chung**:

```text
Notification
   │
   ├── GAME_MISSION
   ├── GAME_REWARD
   ├── LEVEL_UP
   ├── COOP_INVITATION
   ├── NEW_LESSON
   └── SYSTEM
```

Như vậy sau này thêm game mới không cần xây lại hệ thống notification.

---

# 22. MVP nên triển khai theo thứ tự

## Phase 1 — Database

Tạo:

```text
Notification
UserDevice
```

---

## Phase 2 — Backend API

Xây dựng:

```text
POST   /notifications/device-token
DELETE /notifications/device-token

GET    /notifications
GET    /notifications/unread-count

PATCH  /notifications/:id/read
PATCH  /notifications/read-all
```

---

## Phase 3 — Firebase

Thiết lập:

```text
Firebase Project
        ↓
Firebase Cloud Messaging
        ↓
FCM Token
```

---

## Phase 4 — Frontend

Xử lý:

```text
Xin quyền notification
        ↓
Lấy FCM Token
        ↓
Gửi token về Backend
        ↓
Nhận notification
        ↓
Hiển thị UI
```

---

## Phase 5 — Background Notification

Thiết lập:

```text
Service Worker
        ↓
Firebase Messaging
        ↓
Background Push
```

---

## Phase 6 — Notification Center

Tạo giao diện:

```text
┌──────────────────────────────┐
│ 🔔 Thông báo                 │
├──────────────────────────────┤
│ 🎮 Nhiệm vụ mới         •    │
│ 5 phút trước                 │
├──────────────────────────────┤
│ 🎁 Bạn nhận 100 XP           │
│ 1 giờ trước                  │
├──────────────────────────────┤
│ 🏆 Bạn đã lên Level 10       │
│ Hôm qua                      │
└──────────────────────────────┘
```

---

# 23. Kết luận

Giải pháp phù hợp là:

```text
React/Vite
    +
Firebase Cloud Messaging
    +
Service Worker
    +
Backend Notification Module
    +
Notification Database
```

**FCM** chịu trách nhiệm đưa thông báo đến thiết bị.

**Backend** quyết định khi nào cần gửi.

**Database** lưu lịch sử notification.

**Frontend** hiển thị notification trong app.

**Service Worker** giúp nhận Push Notification khi web/app đang chạy nền.

Kiến trúc này có thể dùng chung cho toàn bộ hệ thống **quản lý học sinh + học tập + game + nhiệm vụ + phần thưởng + Co-op** và có thể mở rộng thêm Android/iOS sau này.
