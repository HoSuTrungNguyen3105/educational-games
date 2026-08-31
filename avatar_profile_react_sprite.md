# Avatar Profile — React xử lý Sprite Sheet

## 1. Mục tiêu

Tạo hệ thống Avatar nhân vật ngay trong **trang Profile User**.

Avatar sử dụng **một sprite sheet PNG nền trong suốt** thay vì tách mỗi trang phục thành một file riêng.

React sẽ lấy từng vùng trong sprite sheet và ghép các layer thành một nhân vật hoàn chỉnh.

Không lưu HTML cho Avatar.

---

## 2. File Avatar

Đặt sprite sheet vào:

```text
public/avatar-sprite.png
```

Sprite sheet là ảnh PNG nền trong suốt, chứa nhiều bộ phận và trang phục.

Không cần tách thành hàng chục file PNG riêng.

Các nhóm có thể gồm:

- Body
- Skin
- Face
- Hair
- Shirt
- Pants
- Shoes
- Hat
- Glasses
- Accessory

---

## 3. Cách React hiển thị Avatar

Không hiển thị nguyên sprite sheet.

Tạo một component:

```text
AvatarPreview
```

Component nhận cấu hình Avatar hiện tại của user, sau đó tạo các layer.

Thứ tự layer đề xuất:

```text
Body
→ Skin
→ Face
→ Hair
→ Shirt
→ Pants
→ Shoes
→ Hat
→ Glasses
→ Accessory
```

Các layer phải nằm cùng một vị trí và cùng kích thước canvas để khi chồng lên nhau tạo thành một nhân vật hoàn chỉnh.

---

## 4. Không lưu ảnh Avatar hoàn chỉnh vào User

Trong User chỉ lưu **trạng thái trang phục đang trang bị**.

Ví dụ:

```text
avatar:
  body
  skin
  face
  hair
  shirt
  pants
  shoes
  hat
  glasses
  accessory
```

Mỗi giá trị là ID của item.

Ví dụ:

```text
hair = hair_03
shirt = shirt_08
pants = pants_02
shoes = shoes_04
```

React dựa vào ID để tìm tọa độ của item trong sprite sheet.

---

## 5. Metadata của Sprite Sheet

Tạo một file cấu hình:

```text
src/data/avatarItems.js
```

File này chứa metadata của từng item.

Mỗi item cần có:

```text
id
category
name
x
y
width
height
price
default
```

Trong đó:

- `id`: ID duy nhất của item.
- `category`: nhóm item.
- `name`: tên hiển thị.
- `x`: vị trí X trong sprite sheet.
- `y`: vị trí Y.
- `width`: chiều rộng vùng item.
- `height`: chiều cao vùng item.
- `price`: giá bằng Coin.
- `default`: có được trang bị miễn phí mặc định hay không.

Không hard-code thông tin này trực tiếp trong component Profile.

---

## 6. Component Avatar

Tạo:

```text
src/components/avatar/AvatarPreview.jsx
```

Component có nhiệm vụ:

1. Nhận cấu hình Avatar.
2. Tìm item tương ứng trong `avatarItems.js`.
3. Hiển thị sprite sheet bằng CSS.
4. Cắt đúng vùng của từng item.
5. Xếp các layer theo đúng thứ tự.
6. Trả về Avatar hoàn chỉnh.

Không tạo thêm ảnh PNG cho từng item.

---

## 7. CSS Sprite

Có thể sử dụng:

```css
background-image: url("/avatar/avatar-sprite.png");
background-repeat: no-repeat;
```

Mỗi layer sử dụng:

```css
background-position
```

để lấy đúng vùng của sprite sheet.

Nếu sprite sheet được thiết kế theo ô có kích thước cố định thì ưu tiên dùng hệ thống grid để tính vị trí thay vì ghi tọa độ thủ công quá nhiều.

---

## 8. Hiển thị trong Profile

Trong:

```text
Profile User
```

thêm khu vực:

```text
Avatar của tôi
```

Gồm:

```text
┌─────────────────────────────┐
│        Avatar Preview       │
│                             │
│          Nhân vật           │
│                             │
└─────────────────────────────┘

        [ Tùy chỉnh Avatar ]
```

Khi bấm `Tùy chỉnh Avatar`, mở modal hoặc panel tùy chỉnh.

---

## 9. Giao diện tùy chỉnh

Chia item thành các tab:

```text
Tổng quan
Tóc
Áo
Quần
Giày
Mũ
Kính
Phụ kiện
```

Khi user chọn item:

1. Preview Avatar thay đổi ngay lập tức.
2. Chưa cần gọi API ngay.
3. User có thể thử nhiều item.
4. Khi bấm `Lưu Avatar`, mới gửi cấu hình lên API.

---

## 10. Item miễn phí và Item mua bằng Coin

Mỗi item có:

```text
price
```

Nếu:

```text
price = 0
```

thì item miễn phí.

Nếu:

```text
price > 0
```

thì yêu cầu user mua bằng Coin.

Luồng:

```text
User chọn item
        ↓
Kiểm tra user đã sở hữu chưa
        ↓
Nếu đã sở hữu
        ↓
Cho trang bị

Nếu chưa sở hữu
        ↓
Hiển thị giá Coin
        ↓
User bấm Mua
        ↓
API kiểm tra Coin
        ↓
Trừ Coin
        ↓
Thêm item vào Inventory
        ↓
Cho phép trang bị
```

Không tự trừ Coin ở frontend.

---

## 11. Inventory và Loadout

Nên tách:

```text
Inventory
```

và:

```text
Loadout
```

### Inventory

Lưu những item user đã sở hữu.

Ví dụ:

```text
hair_01
hair_03
shirt_02
shirt_08
shoes_01
```

### Loadout

Lưu những item đang mặc.

Ví dụ:

```text
hair: hair_03
shirt: shirt_08
pants: pants_02
shoes: shoes_01
hat: null
glasses: glasses_02
accessory: null
```

Avatar Preview chỉ đọc `Loadout`.

---

## 12. Lưu vào User Profile

Avatar phải thuộc về User hiện tại.

Khi user đăng nhập:

```text
GET /user/profile
```

API trả về thông tin user cùng Avatar/Loadout.

React dùng dữ liệu đó để render Avatar.

Khi thay đổi:

```text
PUT /user/avatar
```

hoặc endpoint tương đương của hệ thống hiện tại.

Request chỉ gửi ID item, không gửi ảnh.

---

## 13. Không lưu sprite sheet vào API

Sprite sheet:

```text
public/avatar/avatar-sprite.png
```

được đóng gói cùng frontend.

API chỉ lưu:

```text
item ID
```

Ví dụ:

```text
hair_03
shirt_08
pants_02
shoes_01
```

Điều này giúp database nhẹ và dễ mở rộng.

---

## 14. Avatar mặc định

Nếu user chưa có Avatar:

```text
body mặc định
skin mặc định
face mặc định
hair mặc định
shirt mặc định
pants mặc định
shoes mặc định
```

React tự tạo Avatar mặc định.

Sau khi user lưu Avatar lần đầu thì lưu Loadout vào User.

---

## 15. Yêu cầu quan trọng

### Không làm

- Không tách sprite sheet thành 40+ file.
- Không lưu ảnh Avatar hoàn chỉnh vào database.
- Không lưu HTML Avatar.
- Không để frontend tự trừ Coin.
- Không hard-code toàn bộ item trực tiếp trong Profile.

### Phải làm

- Dùng một sprite sheet PNG nền trong suốt.
- React xử lý việc ghép layer.
- Metadata item nằm riêng.
- User chỉ lưu ID item.
- Inventory quản lý item đã sở hữu.
- Loadout quản lý item đang mặc.
- API xử lý mua/trừ Coin.
- Preview thay đổi ngay khi chọn item.
- Chỉ lưu Loadout khi user bấm Lưu.

---

## 16. Kết quả mong muốn

Trang Profile sẽ có:

```text
Profile
│
├── Thông tin User
│
├── Avatar
│   ├── Preview nhân vật
│   └── Tùy chỉnh Avatar
│
├── Inventory
│   └── Các item đã sở hữu
│
└── Coin
    └── Số Coin hiện tại
```

Người dùng có thể:

```text
Xem Avatar
   ↓
Tùy chỉnh
   ↓
Chọn tóc / áo / quần / giày / phụ kiện
   ↓
Preview ngay
   ↓
Mua item bằng Coin nếu chưa sở hữu
   ↓
Trang bị
   ↓
Lưu Avatar
   ↓
API lưu Loadout
```

## 17. Tích hợp với hệ thống Game

Avatar Profile này **không thay thế nhân vật riêng của từng game**.

Mỗi game vẫn giữ nhân vật/gameplay riêng như hiện tại.

Avatar Profile chỉ dùng cho:

- Profile User
- Trang cá nhân
- Bảng xếp hạng
- Thành tích
- Khu vực xã hội
- Hiển thị thông tin học sinh

Nếu sau này muốn sử dụng Avatar Profile trong game thì có thể lấy Loadout từ User API, nhưng không được làm ảnh hưởng đến logic nhân vật riêng của từng game.
