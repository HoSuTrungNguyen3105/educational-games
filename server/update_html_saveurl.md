# TÍCH HỢP SUPABASE STORAGE – HTML URL VÀ THUMBNAIL

## 1. Mục tiêu

Tích hợp Supabase Storage vào backend Node.js / Express hiện tại.

Yêu cầu:
- Upload HTML lên Supabase Storage.
- Upload ảnh thumbnail lên Supabase Storage.
- MongoDB Atlas chỉ lưu URL HTML và URL ảnh thumbnail.
- Sử dụng trường `htmlUrl` để lưu URL HTML.
- Sử dụng trường `thumbnail` để lưu URL ảnh.
- Xóa hoàn toàn việc sử dụng trường `icon`.
- API trả về `htmlUrl` và `thumbnail`.
- Không lưu HTML hoặc ảnh dạng binary/base64 trực tiếp vào MongoDB.
- Không lưu file trên filesystem của Render.

## 2. Cấu hình Supabase

Đã tạo project và bucket và tôi có lưu vào .env rồi:

```env
SUPABASE_URL=https://jztnkwssoluetuxodqpo.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxx
SUPABASE_BUCKET=edu-game-templates
```

Sử dụng thư viện:

```bash
npm install @supabase/supabase-js
```

Không hardcode Secret Key. Chỉ sử dụng trong backend, không đưa vào React frontend hoặc GitHub.

## 3. Quy định lưu trữ

Sử dụng chung bucket `edu-game-templates`, phân chia thư mục:

```text
edu-game-templates/
├── templates/
│   ├── abc123.html
│   └── xyz456.html
└── thumbnails/
    ├── abc123.webp
    └── xyz456.webp
```

- HTML lưu trong `templates/`.
- Ảnh thumbnail lưu trong `thumbnails/`.
- Tên file sử dụng UUID để tránh trùng lặp.
- HTML có Content-Type `text/html; charset=utf-8`.
- Ảnh giữ đúng định dạng thực tế như PNG, JPG, WebP.

## 4. Thay thế icon bằng thumbnail

Đây là yêu cầu bắt buộc:

- Xóa trường `icon` khỏi schema/model MongoDB.
- Xóa trường `icon` khỏi API request và API response.
- Xóa toàn bộ logic xử lý icon liên quan đến template.
- Không sử dụng emoji làm ảnh đại diện template nữa.
- Thay thế bằng trường `thumbnail`.
- `thumbnail` lưu URL ảnh thực tế trên Supabase Storage.
- Ảnh thumbnail được upload thông qua backend.
- Frontend sử dụng URL `thumbnail` để hiển thị ảnh xem trước.

Không chỉ ẩn icon ở giao diện mà phải cập nhật đồng bộ toàn bộ backend, frontend và dữ liệu liên quan.

## 5. Cấu trúc MongoDB mới

Ví dụ document:

```json
{
  "_id": "6a93a7fa19519eaeff8cd9ca",
  "name": "Break Of Dawn",
  "description": "Break Of Dawn",
  "type": "play-to-learn",
  "category": "quiz",
  "htmlUrl": "https://example.supabase.co/storage/v1/object/public/edu-game-templates/templates/abc123.html",
  "thumbnail": "https://example.supabase.co/storage/v1/object/public/edu-game-templates/thumbnails/abc123.webp",
  "fileName": "abc123.html",
  "version": 1,
  "status": "inactive",
  "playMode": "solo",
  "createdAt": "2026-08-30T03:48:10.902Z",
  "updatedAt": "2026-09-19T09:39:49.833Z"
}
```

Các trường khác giữ nguyên theo schema hiện tại.

## 6. Quy trình tạo template

Khi frontend gửi API tạo template:

1. Gửi thông tin template.
2. Gửi nội dung HTML.
3. Gửi ảnh thumbnail (multipart/form-data hoặc cơ chế phù hợp với API hiện tại).
4. Backend validate dữ liệu.
5. Upload HTML lên Supabase.
6. Upload thumbnail lên Supabase.
7. Nhận URL của cả hai file.
8. Lưu `htmlUrl` và `thumbnail` vào MongoDB.
9. Trả dữ liệu template về frontend.

Không tạo API POST riêng chỉ để upload HTML hoặc thumbnail. Tích hợp vào API tạo/cập nhật template hiện có.

## 7. Quy trình cập nhật template

Khi cập nhật:
- Nếu có HTML mới, upload HTML mới và cập nhật `htmlUrl`.
- Nếu có thumbnail mới, upload ảnh mới và cập nhật `thumbnail`.
- Nếu không gửi thumbnail mới, giữ nguyên thumbnail cũ.
- Nếu không gửi HTML mới, giữ nguyên HTML cũ.
- Chỉ xóa file cũ sau khi dữ liệu mới đã upload thành công và MongoDB cập nhật thành công.
- Cập nhật `fileName`, version theo logic hiện tại.

## 8. Quy trình xem HTML

Khi frontend mở template:

1. Gọi API backend theo ID.
2. Backend kiểm tra template trong MongoDB.
3. Kiểm tra trạng thái và quyền truy cập.
4. Nếu hợp lệ, trả về `htmlUrl`.
5. Frontend sử dụng `htmlUrl` để hiển thị iframe.
6. Nếu không hợp lệ, không hiển thị HTML.

Nếu cần kiểm soát truy cập trực tiếp, sử dụng Private Bucket và Signed URL. Không để Secret Key xuất hiện ở frontend.

## 9. Cấu trúc API response

Giữ nguyên format response hiện tại:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "_id": "6a93a7fa19519eaeff8cd9ca",
      "name": "Break Of Dawn",
      "description": "Break Of Dawn",
      "type": "play-to-learn",
      "category": "quiz",
      "thumbnail": "https://example.supabase.co/storage/v1/object/public/edu-game-templates/thumbnails/abc123.webp",
      "htmlUrl": "https://example.supabase.co/storage/v1/object/public/edu-game-templates/templates/abc123.html",
      "fileName": "abc123.html",
      "version": 1,
      "status": "inactive",
      "playMode": "solo",
      "createdAt": "2026-08-30T03:48:10.902Z",
      "updatedAt": "2026-09-19T09:39:49.833Z"
    }
  ]
}
```

Yêu cầu:
- API danh sách và chi tiết đều trả về `htmlUrl` và `thumbnail`.
- Không còn trường `icon` trong response.
- Không đổi format `status`, `code`, `msg`, `data`.

## 10. Cập nhật Frontend

Tìm toàn bộ nơi đang sử dụng `icon` để hiển thị template.

Thay thế bằng `thumbnail`:
- Danh sách template hiển thị ảnh thumbnail.
- Card template sử dụng ảnh thumbnail.
- Trang quản lý template hiển thị ảnh thumbnail.
- Form tạo template cho phép chọn và xem trước ảnh.
- Form chỉnh sửa hiển thị thumbnail hiện tại và cho phép thay ảnh mới.
- Khi không có thumbnail, hiển thị placeholder mặc định bằng CSS hoặc ảnh mặc định, không quay lại dùng icon/emoji.

Giữ nguyên layout, màu sắc và phong cách giao diện hiện tại.

## 11. Chuyển đổi dữ liệu cũ

Kiểm tra toàn bộ template hiện tại, đặc biệt 43 template đang có.

- Không xóa dữ liệu cũ ngay lập tức.
- Nếu có icon cũ, loại bỏ trường `icon` sau khi chuyển đổi.
- Nếu template chưa có thumbnail, cho phép `thumbnail` là null hoặc dùng placeholder ở frontend.
- Không tự tạo ảnh giả thay cho thumbnail.
- Nếu có ảnh đại diện cũ, có thể chuyển ảnh đó lên Supabase và cập nhật URL.
- Không làm mất template hoặc thay đổi `_id`.

Thực hiện migration an toàn và có thể kiểm tra kết quả trước khi xóa dữ liệu cũ.

## 12. Kiểm thử

Bắt buộc kiểm tra:

1. Tạo template mới có HTML và thumbnail.
2. HTML được upload đúng thư mục `templates/`.
3. Thumbnail được upload đúng thư mục `thumbnails/`.
4. MongoDB lưu đúng `htmlUrl` và `thumbnail`.
5. API danh sách trả về hai trường trên.
6. API chi tiết trả về hai trường trên.
7. Không còn trường `icon` trong schema và response.
8. Cập nhật riêng HTML không làm mất thumbnail.
9. Cập nhật riêng thumbnail không làm mất HTML.
10. Xóa template xử lý cả file HTML và thumbnail.
11. Template không có thumbnail vẫn hiển thị bình thường.
12. Kiểm tra hoạt động sau khi deploy Render.

## 13. Yêu cầu thực hiện

- Đọc toàn bộ code hiện tại trước khi chỉnh sửa.
- Tái sử dụng API, controller, service và model đang có.
- Đồng bộ frontend, backend và MongoDB.
- Không tạo API trùng chức năng.
- Không thay đổi các chức năng game không liên quan.
- Không tự ý xóa dữ liệu cũ khi chưa migration an toàn.
- Báo cáo các file đã chỉnh sửa, API đã cập nhật và kết quả kiểm thử.

**Kết quả cuối cùng:** Mỗi template chỉ sử dụng hai trường URL quan trọng là `htmlUrl` (file HTML) và `thumbnail` (ảnh đại diện). Không còn sử dụng trường `icon` nữa.