# Avatar Profile System

## 1. Mục tiêu

Xây dựng hệ thống Avatar riêng cho mỗi User trong Profile.

Avatar chỉ là **nhân vật đại diện cho User**, không dùng làm nhân vật gameplay.

Mỗi Game vẫn giữ nhân vật riêng và logic riêng của Game.

Avatar Profile có thể được:

- Tùy chỉnh.
- Mua trang phục bằng xu.
- Mặc/tháo trang phục.
- Mở khóa vật phẩm.
- Hiển thị ở Profile, Home, bảng xếp hạng, danh sách lớp...

---

# 2. Không lưu Avatar dưới dạng HTML

Không lưu nguyên HTML Avatar vào API.

Không tạo:

- avatar.html
- avatar-user-001.html
- HTML riêng cho từng User.

Thay vào đó, lưu **các asset của Avatar** trong project/public hoặc hệ thống lưu trữ ảnh.

React sẽ sử dụng các asset này để tạo Avatar.

---

# 3. Avatar sử dụng Layer

Avatar được tạo từ nhiều layer.

Thứ tự layer đề xuất:

1. Background
2. Body
3. Skin
4. Face
5. Hair
6. Shirt
7. Pants
8. Shoes
9. Hat
10. Accessory

Mỗi item là một asset riêng.

Ví dụ:

```text
public/avatar/
├── body/
├── face/
├── hair/
├── shirt/
├── pants/
├── shoes/
├── hat/
└── accessory/