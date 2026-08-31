# Avatar bằng HTML + lưu vào API

## Mục tiêu

Đổi hệ thống Avatar sang **HTML**, không dùng React để dựng từng phần Avatar.

- Avatar được tạo/render bằng HTML + CSS.
- HTML của Avatar được lưu trong API.
- Profile User tải HTML từ API và hiển thị.
- Không cần tách sprite sheet thành hàng chục file ảnh.
- Vẫn giữ cơ chế tùy chỉnh: tóc, áo, quần, giày, mũ, kính, phụ kiện...
- Mỗi item phải là **một vùng riêng**, không lấy cả cụm nhiều item trong sprite sheet.

## 1. Cấu trúc dữ liệu Avatar

API nên lưu một Avatar Template HTML.

Ví dụ logic:

```text
Avatar
├── HTML
├── CSS
└── danh sách item / dữ liệu tùy chỉnh
```

HTML nên có các layer riêng:

```text
avatar
├── body
├── hair
├── shirt
├── pants
├── shoes
├── hat
├── glasses
└── accessory
```

Mỗi layer có vị trí cố định và có thể thay đổi hình ảnh/item.

## 2. Lưu HTML trong API

API có thể lưu:

- `avatarHtml`: HTML hoàn chỉnh của Avatar.
- `avatarCss`: CSS nếu muốn tách riêng.
- `items`: danh sách item Avatar.
- `loadout`: các item User đang trang bị.

Không lưu toàn bộ HTML vào User nếu HTML dùng chung cho nhiều User.

Nên:

```text
Avatar Template
    ↓
User loadout
    ↓
API trả về Avatar HTML + dữ liệu item
    ↓
Profile render Avatar
```

## 3. Item phải lấy đúng từng món

Không được dùng một bounding box bao quanh cả nhóm item.

Nếu một ảnh sprite có:

```text
[ tóc 1 ][ tóc 2 ][ tóc 3 ][ tóc 4 ]
```

thì mỗi tóc phải có tọa độ riêng:

```text
hair-01 → x, y, width, height
hair-02 → x, y, width, height
hair-03 → x, y, width, height
hair-04 → x, y, width, height
```

Khi User chọn `hair-02`, HTML chỉ hiển thị vùng của `hair-02`.

Có thể sử dụng CSS:

```css
.avatar-item {
    background-image: url(...);
    background-repeat: no-repeat;
}
```

và thay đổi:

```css
background-position;
width;
height;
```

để chỉ hiển thị đúng một item.

## 4. Profile User

Tại Profile:

```text
[ Avatar hiện tại ]

[ Tùy chỉnh Avatar ]
```

Khi bấm **Tùy chỉnh Avatar**:

1. Mở modal.
2. Tải Avatar HTML/template từ API.
3. Tải danh sách item từ API.
4. Hiển thị từng item thành một card.
5. User chọn item.
6. Cập nhật preview Avatar.
7. Nếu item có giá Coin thì kiểm tra Coin.
8. Bấm `Lưu Avatar`.
9. Gửi loadout mới lên API.

## 5. Không tạo hàng chục file HTML

Không tạo:

```text
hair1.html
hair2.html
hair3.html
shirt1.html
...
```

Chỉ nên có **một Avatar HTML template**.

Các item chỉ là dữ liệu được thay đổi trong template.

Ví dụ:

```text
Avatar HTML
    ↓
<div class="avatar">
    <div class="avatar-body"></div>
    <div class="avatar-hair"></div>
    <div class="avatar-shirt"></div>
    <div class="avatar-pants"></div>
    <div class="avatar-shoes"></div>
</div>
```

API quyết định item nào được hiển thị ở từng layer.

## 6. Lưu Loadout của User

User chỉ cần lưu lựa chọn hiện tại:

```text
hair: hair-02
shirt: shirt-05
pants: pants-01
shoes: shoes-03
hat: null
glasses: glasses-02
```

Khi Profile mở:

```text
User Loadout
    ↓
Avatar HTML Template
    ↓
Apply từng item vào từng layer
    ↓
Render Avatar
```

## 7. Mua item bằng Coin

Nếu item chưa sở hữu:

```text
[ Item ]
80 Coin
[ Mua ]
```

Nếu đã sở hữu:

```text
[ Item ]
[ Trang bị ]
```

Khi mua:

```text
Frontend
   ↓
API kiểm tra Coin
   ↓
Trừ Coin
   ↓
Thêm item vào inventory
   ↓
Trả kết quả
   ↓
Frontend cập nhật Avatar
```

Không nên trừ Coin chỉ bằng frontend.

## 8. API nên chịu trách nhiệm

Backend/API xử lý:

- Avatar template.
- Danh sách item.
- Giá item.
- Inventory của User.
- Loadout hiện tại.
- Mua item.
- Kiểm tra Coin.
- Lưu Avatar.
- Trả HTML/CSS và dữ liệu cần thiết.

Frontend chỉ:

- Hiển thị HTML.
- Hiển thị danh sách item.
- Preview.
- Chọn item.
- Gọi API.

## 9. Quan trọng

**Không lưu HTML riêng cho từng User.**

Nên lưu:

```text
Avatar Template HTML
+
Avatar Item Data
+
User Inventory
+
User Loadout
```

Như vậy sau này có thể thêm hàng trăm trang phục mà không phải tạo thêm hàng trăm file HTML.

## 10. Kết luận

Kiến trúc phù hợp với hệ thống hiện tại:

```text
API
│
├── Avatar Template HTML
├── Avatar CSS
├── Avatar Items
├── Inventory
└── User Loadout
        │
        ▼
Profile User
        │
        ▼
Avatar Editor
        │
        ├── Tóc
        ├── Áo
        ├── Quần
        ├── Giày
        ├── Mũ
        ├── Kính
        └── Phụ kiện
```

**Ưu tiên dùng một HTML Avatar Template duy nhất và lưu template trong API. Item và loadout chỉ là dữ liệu để thay đổi các layer của HTML.**
