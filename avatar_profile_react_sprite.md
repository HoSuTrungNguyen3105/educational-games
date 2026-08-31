# Avatar Sprite Sheet — Tọa độ và cách React xử lý

Sprite sheet:
public/avatar/avatar-sprite.png

Kích thước:
1536 × 1024 px

QUAN TRỌNG:
- Không render nguyên sprite sheet.
- Không dùng <img src="/avatar/avatar-sprite.png"> cho Avatar Preview.
- Sprite sheet chỉ là nguồn asset.
- React phải crop từng item bằng background-position / CSS hoặc dùng object-position.
- Mỗi item phải có vùng crop riêng.
- Preview phải ghép các layer thành Avatar.

## Khu vực chính

### Body
X: 0 → 245
Y: 0 → 275

### Face / Skin
X: 250 → 610
Y: 0 → 290

### Hair
X: 625 → 1536
Y: 0 → 310

### Shirt
X: 0 → 1050
Y: 270 → 575

### Hat
X: 1040 → 1536
Y: 280 → 455

### Glasses
X: 1160 → 1536
Y: 430 → 600

### Accessory
X: 1040 → 1536
Y: 430 → 1024

### Pants
X: 0 → 1050
Y: 540 → 810

### Shoes
X: 0 → 1050
Y: 785 → 1024

## Cách render

Tạo:

src/components/avatar/AvatarPreview.jsx

Avatar Preview sử dụng một canvas/avatar container cố định.

Mỗi layer:

- body
- skin
- face
- hair
- shirt
- pants
- shoes
- hat
- glasses
- accessory

được render độc lập.

Không được hiển thị các item khác ngoài item đang được chọn.

## Quan trọng về tọa độ

Các tọa độ trên là vùng CATEGORY, không phải nói rằng toàn bộ vùng đó là một item.

AI phải xác định bounding box của từng item nằm bên trong category tương ứng.

Ví dụ:

hair:
- hair_01
- hair_02
- hair_03
- ...

Mỗi item phải có:

x
y
width
height

riêng.

Không được lấy toàn bộ vùng Hair làm một item.

## Preview

Avatar container:

512 × 512

Các layer được đặt absolute:

position: absolute;
inset: 0;

Mỗi layer phải được crop từ sprite sheet và scale về cùng canvas 512 × 512.

## Profile

Profile User → Tùy chỉnh Avatar

Tabs:

Thân
Da
Mặt
Tóc
Áo
Quần
Giày
Mũ
Kính
Phụ kiện

Khi chọn item:

- Preview thay đổi ngay.
- Không gọi API ngay.

Khi bấm:

Lưu Avatar

mới gửi Loadout lên API.

## Inventory

Item chưa sở hữu:

Hiển thị giá Coin.

Item đã sở hữu:

Hiển thị:

Trang bị

Mua item phải xử lý ở API.
Frontend không được tự trừ Coin.

## Loadout

User chỉ lưu ID:

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

Không lưu ảnh.
Không lưu sprite sheet vào database.
Không lưu HTML.