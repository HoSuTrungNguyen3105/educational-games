# YÊU CẦU: TỰ ĐỘNG LƯU HTML THÀNH FILE VÀ CHỈ LƯU URL TRONG MONGODB

## 1. Mục tiêu

Cải tiến cơ chế lưu HTML hiện tại trong dự án React + Node.js + Express + MongoDB.

Hiện tại, khi Frontend gửi API tạo hoặc cập nhật dữ liệu, nội dung HTML đang được lưu trực tiếp vào MongoDB.

Yêu cầu thay đổi:

- Không lưu nội dung HTML trực tiếp vào MongoDB nữa.
- Backend tự động nhận HTML từ API hiện tại, tạo file `.html` và lưu vào thư mục lưu trữ trên server.
- MongoDB chỉ lưu đường dẫn URL của file HTML cùng các thông tin cần thiết.
- Không cần tạo thêm API POST upload HTML riêng.
- Giữ nguyên cách Frontend gọi API hiện tại nếu có thể.

## 2. Luồng xử lý

### POST – Tạo dữ liệu

Khi Frontend gọi API tạo dữ liệu hiện tại : POST → /api/templates

1. Backend nhận thông tin và nội dung HTML.
2. Kiểm tra nội dung HTML hợp lệ.
3. Tạo tên file duy nhất bằng UUID.
4. Tự động tạo file `.html` và lưu vào thư mục storage.
5. Tạo URL truy cập file HTML.
6. Lưu thông tin dữ liệu và `htmlUrl` vào MongoDB.
7. Không lưu trường HTML gốc vào MongoDB.
8. Trả kết quả về Frontend bao gồm URL HTML.

### PUT – Cập nhật dữ liệu

Khi Frontend gọi API cập nhật:

- Nếu có HTML mới: cập nhật nội dung file HTML tương ứng.
- Nếu chỉ cập nhật thông tin khác: giữ nguyên file và URL HTML cũ.
- Không tạo file mới không cần thiết.
- Nếu cần thay thế file, phải đảm bảo xử lý lỗi và tránh để lại file rác.

### GET – Lấy dữ liệu

- Chỉ trả về `htmlUrl` và thông tin cần thiết.
- Không trả nội dung HTML gốc từ MongoDB.
- Đảm bảo Frontend có thể sử dụng URL để hiển thị HTML.

### DELETE – Xóa dữ liệu

- Khi xóa bản ghi MongoDB, tự động xóa file HTML tương ứng.
- Nếu file không tồn tại, vẫn xử lý xóa bản ghi an toàn.
- Tránh xóa nhầm file được sử dụng bởi bản ghi khác nếu có chia sẻ URL.

## 3. Cấu trúc lưu trữ

Tổ chức thư mục lưu HTML rõ ràng, dễ quản lý.

Ví dụ:

```text
backend/
├── uploads/
│   └── html/
│       ├── uuid-001.html
│       ├── uuid-002.html
│       └── uuid-003.html
```

File HTML phải truy cập được bằng URL trực tiếp.

Ví dụ:

`https://domain.com/uploads/html/uuid-001.html`

Không hardcode domain. Sử dụng biến môi trường `BASE_URL` hoặc cấu hình URL phù hợp với môi trường triển khai.

## 4. MongoDB

Điều chỉnh Schema hiện tại để lưu URL thay vì HTML.

Ví dụ:

```json
{
  "_id": "...",
  "name": "Body Avatar",
  "htmlUrl": "https://domain.com/uploads/html/uuid-001.html",
  "fileName": "uuid-001.html",
  "createdAt": "...",
  "updatedAt": "..."
}
```

- Loại bỏ việc lưu nội dung HTML dài trực tiếp trong MongoDB.
- Có thể giữ lại trường `html` ở tầng request nhưng không lưu vào database.
- Không làm mất các trường dữ liệu hiện tại không liên quan.

## 5. Yêu cầu Frontend

- Tận dụng API hiện tại.
- Không gọi thêm API upload HTML.
- Khi tạo hoặc cập nhật, tiếp tục gửi HTML cùng dữ liệu trong request hiện tại.
- Sau khi API thành công, sử dụng `htmlUrl` Backend trả về.
- Những nơi đang đọc HTML từ database cần chuyển sang sử dụng URL phù hợp.
- Nếu cần xem trước HTML, sử dụng iframe với URL mới.

## 6. Bảo mật và xử lý lỗi

- Kiểm tra kiểu dữ liệu HTML đầu vào và giới hạn dung lượng request.
- Tên file phải được tạo ngẫu nhiên, không sử dụng trực tiếp tên file từ người dùng.
- Kiểm soát quyền tạo, cập nhật và xóa HTML.
- Không cho phép truy cập đường dẫn file tùy ý.
- HTML không đáng tin cậy phải được phục vụ trên origin riêng biệt, không chạy JavaScript tùy ý cùng origin với trang quản trị.
- Xử lý rollback: nếu lưu file thành công nhưng MongoDB thất bại thì xóa file vừa tạo.
- Nếu cập nhật thất bại, không làm mất nội dung HTML cũ.
- Tránh tạo file trùng lặp hoặc file rác.
- Không để lộ đường dẫn filesystem nội bộ.

## 7. Tương thích dữ liệu cũ

Kiểm tra dữ liệu HTML hiện tại trong MongoDB.

Nếu đã có bản ghi chứa HTML cũ:

- Xây dựng cơ chế chuyển đổi dữ liệu cũ sang file `.html`.
- Upload/lưu nội dung HTML cũ thành file.
- Cập nhật bản ghi MongoDB sang `htmlUrl`.
- Đảm bảo không mất dữ liệu trong quá trình chuyển đổi.
- Có thể giữ khả năng đọc dữ liệu cũ trong giai đoạn migration nếu cần.

## 8. Những điều tuyệt đối không được làm

- Không tạo API upload HTML mới chỉ để Frontend phải gọi thêm lần nữa.
- Không thay đổi URL hoặc tên các API hiện tại nếu không thực sự cần thiết.
- Không phá vỡ cấu trúc React và Express hiện tại.
- Không tự ý thay đổi các chức năng CRUD khác.
- Không xóa các trường MongoDB không liên quan.
- Không hardcode domain hoặc đường dẫn môi trường production.
- Không chỉ viết code minh họa mà phải tích hợp trực tiếp vào dự án.

## 9. Quy trình thực hiện

1. Đọc và phân tích toàn bộ API đang tạo, cập nhật, lấy và xóa dữ liệu có chứa HTML.
2. Kiểm tra Model MongoDB, Controller, Routes và các service Frontend liên quan.
3. Xác định tất cả nơi đang đọc hoặc ghi trường HTML.
4. Đề xuất cách tích hợp phù hợp với cấu trúc code hiện tại.
5. Triển khai cơ chế tự động lưu file HTML ngay trong API CRUD hiện tại.
6. Cập nhật Schema MongoDB và Frontend nếu cần.
7. Xử lý dữ liệu HTML cũ.
8. Kiểm tra đầy đủ POST, PUT, GET, DELETE.
9. Kiểm tra URL có thể truy cập trực tiếp trên trình duyệt.
10. Tổng kết các file đã sửa, cách hoạt động và những điểm cần cấu hình khi deploy.

**Yêu cầu cuối cùng:** Sau khi hoàn thành, Frontend chỉ cần gọi API tạo/cập nhật dữ liệu như trước. Backend tự xử lý việc lưu HTML thành file, tạo URL và lưu URL vào MongoDB. Không phát sinh thêm một request upload HTML riêng.