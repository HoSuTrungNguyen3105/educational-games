# FIX FCM TOKEN INVALID

## Lỗi hiện tại

Firebase Admin đã hoạt động bình thường:

[FCM] FIREBASE_SERVICE_ACCOUNT: ĐÃ CÓ (2378 ký tự)
[FCM] ✅ Loaded service account from FIREBASE_SERVICE_ACCOUNT env var.
[FCM] ✅ Firebase Admin initialized for project: eduplay-74301

Nhưng khi gửi notification:

[FCM] Multicast result: 0 sent, 1 failed
[FCM] Token ... error: messaging/registration-token-not-registered

## Yêu cầu

Hãy sửa hệ thống quản lý FCM token.

### 1. Tự động xóa token không hợp lệ

Khi Firebase trả về:

messaging/registration-token-not-registered

thì phải tự động xóa FCM token đó khỏi database.

Chỉ xóa device token bị lỗi, KHÔNG xóa user.

### 2. Giữ các thiết bị còn hợp lệ

Một user có thể có nhiều FCM token:

user-002
├── iPhone token ❌ → xóa
├── PC token ✅ → giữ
└── Android token ✅ → giữ

Không được xóa toàn bộ device của user khi chỉ một token bị lỗi.

### 3. Frontend phải cập nhật token mới

Khi PWA/website khởi động hoặc Firebase cấp token mới:

getToken()
↓
FCM token hiện tại
↓
Gửi token lên Backend
↓
Backend lưu/cập nhật token

Không sử dụng token cũ cố định.

### 4. Không thay đổi Firebase Admin

Firebase Admin hiện đã cấu hình thành công.

KHÔNG thay đổi:

FIREBASE_SERVICE_ACCOUNT
Firebase Service Account
Firebase Admin initialization

### 5. Không sửa lỗi cũ

Không xử lý hoặc thay đổi lỗi:

testPush is not a function

Đây là lỗi cũ, không liên quan yêu cầu hiện tại.

Chỉ tập trung vào:

messaging/registration-token-not-registered

### 6. Không phá chức năng hiện tại

Không thay đổi:

- Authentication
- User
- Database schema nếu không cần thiết
- Notification flow hiện tại
- API hiện tại
- Firebase configuration

Chỉ bổ sung cơ chế quản lý token hết hạn/không hợp lệ.

## Kết quả mong muốn

Khi token hợp lệ:

FCM → gửi thành công → giữ token.

Khi token không hợp lệ:

FCM → registration-token-not-registered
↓
Xóa token khỏi database
↓
Không gửi token này lần sau.

Frontend khi có token mới:

getToken()
↓
API lưu token mới
↓
Backend có token hợp lệ để gửi notification.

Sau khi sửa hãy kiểm tra toàn bộ flow frontend → backend → database → FCM và chạy npm run build để đảm bảo không phát sinh lỗi.