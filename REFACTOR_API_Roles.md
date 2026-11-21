# Tái cấu trúc API Role & Permission

## 1. Mục tiêu

Tái cấu trúc toàn bộ API liên quan đến `roles` và `permissions` theo mô hình quản lý quyền thực tế như dữ liệu API trong ảnh tham khảo.

Hệ thống mới phải quản lý riêng 3 thành phần:

1. **Roles:** Danh sách vai trò.
2. **Permission Catalog:** Danh mục toàn bộ quyền có sẵn trong hệ thống.
3. **Role Permissions:** Danh sách quyền được gán cho từng vai trò.

Đọc và kiểm tra API, database, backend, frontend hiện tại trước khi thực hiện. Tái sử dụng cấu trúc và dữ liệu phù hợp, không tự ý tạo thêm hệ thống phân quyền song song.

## 2. API Roles

API lấy danh sách vai trò:

`GET /api/roles?from=1&to=10`

Cấu trúc response mong muốn:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 195,
      "slug": "dai_ly_thiep_online_cung_ung",
      "name_vi": "Đại Lý Thiệp Online Cứng Ứng",
      "name_en": "Online Invitation Agent",
      "created_at": "2026-09-22 15:02:48",
      "updated_at": "2026-09-22 15:02:48",
      "total_permissions": 32
    }
  ]
}
```

Yêu cầu:
- Có phân trang bằng `from`, `to` hoặc cơ chế tương đương.
- Trả về tổng số quyền đang được gán cho từng vai trò qua `total_permissions`.
- Giữ các trường `id`, `slug`, `name_vi`, `name_en`, `created_at`, `updated_at`.
- Hỗ trợ tìm kiếm và lọc vai trò nếu hệ thống hiện tại có chức năng tương ứng.

## 3. API Permission Catalog

Sử dụng API danh mục quyền:

`GET /api/permissions/catalog`

Đây là API tương tự API `/api/permissions/catalog` hiện tại, nhưng cần chuẩn hóa dữ liệu theo cấu trúc mới.

Response mong muốn:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "slug": "user_view",
      "name_vi": "Xem danh sách người dùng",
      "name_en": "View users",
      "module": "user",
      "created_at": "2026-11-07 21:59:39",
      "updated_at": "2026-11-07 21:59:39"
    },
    {
      "id": 2,
      "slug": "user_create",
      "name_vi": "Tạo người dùng",
      "name_en": "Create user",
      "module": "user",
      "created_at": "2026-11-07 21:59:39",
      "updated_at": "2026-11-07 21:59:39"
    }
  ]
}
```

Yêu cầu:
- Mỗi quyền là một bản ghi riêng, có `id` và `slug` duy nhất.
- Có `name_vi`, `name_en` để hiển thị đa ngôn ngữ.
- Có `module` để xác định nhóm chức năng.
- Có phân trang.
- Không trả về cấu trúc quyền dạng object chứa `view`, `edit`, `delete`.

## 4. API Role Permissions

Đây là API lấy danh sách quyền đã được gán cho một vai trò cụ thể.

Ví dụ:

`GET /api/rolePermissions?role_id=195&per_page=100&page=1`

Response mong muốn:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 2502,
      "role_id": 195,
      "permission_id": 1,
      "role_slug": "dai_ly_thiep_online_cung_ung",
      "role_name_vi": "Đại Lý Thiệp Online Cứng Ứng",
      "role_name_en": "Online Invitation Agent",
      "permission_slug": "user_view",
      "permission_name_vi": "Xem danh sách người dùng",
      "permission_name_en": "View users",
      "module": "user"
    }
  ]
}
```

Yêu cầu:
- Lấy danh sách quyền dựa trên `role_id`.
- Trả về thông tin vai trò và quyền tương ứng.
- Hỗ trợ `page`, `per_page`.
- Không trả về quyền của các vai trò khác.
- Đảm bảo mỗi cặp `role_id + permission_id` không bị trùng lặp.

## 5. API quản lý gán và thu hồi quyền

Xây dựng hoặc chuẩn hóa các API sau:

### Gán quyền cho vai trò

`POST /api/rolePermissions`

```json
{
  "role_id": 195,
  "permission_ids": [1, 2, 3, 4]
}
```

### Cập nhật toàn bộ quyền của vai trò

`PUT /api/rolePermissions/195`

```json
{
  "permission_ids": [1, 2, 3, 5, 6]
}
```

Khi cập nhật, hệ thống cần đồng bộ danh sách quyền mới với danh sách hiện tại trong database.

### Thu hồi quyền

`DELETE /api/rolePermissions`

```json
{
  "role_id": 195,
  "permission_ids": [1, 2]
}
```

Lưu ý: Điều chỉnh URL và HTTP method theo quy ước backend hiện tại nếu đã có chuẩn API tương ứng. Không tạo endpoint trùng chức năng.

## 6. Loại bỏ API permissions/features cũ

Hiện tại API:

`GET /api/permissions/features`

Đang trả về cấu trúc kiểu:

```json
{
  "key": "games",
  "label": "Trò chơi",
  "name_en": "Games",
  "permissions": {
    "view": "games.view",
    "edit": "games.edit",
    "delete": "games.delete"
  }
}
```

**Không sử dụng cấu trúc này nữa.**

Yêu cầu:
- Loại bỏ cách phân quyền cố định `view/edit/delete` theo module.
- Xóa hoặc ngừng sử dụng API `/api/permissions/features` sau khi đã chuyển toàn bộ chức năng phụ thuộc.
- Không tiếp tục tạo các object `permissions.view`, `permissions.edit`, `permissions.delete`.
- Không tự động sinh quyền theo quy tắc CRUD.
- Mỗi quyền phải được khai báo thành một bản ghi riêng trong Permission Catalog.
- Các quyền có thể là `user_view`, `user_create`, `user_update`, `user_delete`, `assignments_assign`... tùy nghiệp vụ thực tế.

## 7. Cập nhật Frontend

Điều chỉnh các trang quản lý quyền và vai trò để sử dụng API mới.

### Trang Quyền

- Lấy danh sách từ `/api/permissions/catalog`.
- Hiển thị `name_vi`, `slug`, `name_en`, `module`, thời gian cập nhật.
- Giữ chức năng tìm kiếm, phân trang, xem chi tiết.
- Không hiển thị quyền theo dạng View / Edit / Delete được sinh tự động.

### Trang Vai trò

- Lấy danh sách vai trò từ `/api/roles`.
- Hiển thị số lượng quyền qua `total_permissions`.
- Khi xem hoặc chỉnh sửa vai trò, gọi API `/api/rolePermissions?role_id=...`.
- Hiển thị danh sách quyền được nhóm theo `module`.
- Cho phép chọn nhiều quyền độc lập.
- Khi lưu, đồng bộ danh sách quyền thông qua API Role Permissions.

## 8. Database và bảo mật

Kiểm tra cấu trúc database hiện tại và chuẩn hóa quan hệ:

- `roles`: Lưu thông tin vai trò.
- `permissions`: Lưu danh mục quyền.
- `role_permissions`: Bảng trung gian liên kết vai trò và quyền.

Đảm bảo:
- `role_permissions.role_id` tham chiếu đến `roles.id`.
- `role_permissions.permission_id` tham chiếu đến `permissions.id`.
- Có unique constraint cho cặp `role_id`, `permission_id`.
- Gán và thu hồi nhiều quyền phải được thực hiện an toàn bằng transaction.
- Backend kiểm tra quyền thực tế trước khi cho phép truy cập API.
- Không chỉ dựa vào việc ẩn nút hoặc ẩn giao diện ở frontend.

## 9. Yêu cầu thực hiện

1. Kiểm tra toàn bộ API Role và Permission đang tồn tại.
2. Kiểm tra database và dữ liệu phân quyền hiện tại.
3. Tái cấu trúc backend theo mô hình mới.
4. Cập nhật frontend sử dụng API mới.
5. Loại bỏ các đoạn code phụ thuộc `/permissions/features`.
6. Không làm mất dữ liệu vai trò và quyền hiện có; cần có phương án migration nếu thay đổi schema.
7. Kiểm tra các API đăng nhập, refresh token và middleware phân quyền để tránh ảnh hưởng xác thực.
8. Kiểm tra các chức năng đang sử dụng permission cũ và chuyển sang kiểm tra theo `permission.slug`.
9. Test các trường hợp gán quyền, thu hồi quyền, cập nhật quyền, phân trang và kiểm tra quyền truy cập.

**Lưu ý quan trọng:** Không thay đổi nghiệp vụ của các module khác ngoài phạm vi cần thiết để chuyển đổi hệ thống phân quyền. Không làm ảnh hưởng đến Word, PowerPoint, trò chơi, bài tập và các chức năng hiện tại.

**Kết quả mong muốn:** Toàn bộ hệ thống sử dụng một danh mục Permission Catalog thống nhất. Vai trò chỉ lưu danh sách quyền được gán thông qua Role Permissions. Không còn mô hình `/permissions/features` với ba quyền cố định `view/edit/delete`.