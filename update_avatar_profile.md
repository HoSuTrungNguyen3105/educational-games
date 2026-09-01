Avatar System – HTML Item
1. Mục tiêu

Xây dựng hệ thống Avatar theo hướng không lưu ảnh riêng cho từng Item.

Mỗi Item Avatar sẽ được tạo bằng HTML/SVG/CSS và lưu vào API.

Avatar Template là bộ khung chung để render toàn bộ Avatar.

2. Kiến trúc
Avatar Template
│
├── Body
├── Face
├── Hair
├── Shirt
├── Pants
├── Shoes
├── Hat
├── Glasses
└── Accessory

Template chịu trách nhiệm:

Kích thước Avatar.
Khung hiển thị.
Các vùng/category.
Thứ tự layer.
CSS chung.
Vị trí mặc định của từng category.
3. Avatar Item

Mỗi Item không phải là một file ảnh.

Item được lưu dưới dạng dữ liệu:

Item
├── id
├── category
├── name
├── html
├── price
└── default

Trong đó:

id: ID duy nhất của Item.
category: category của Item.
name: tên hiển thị.
html: HTML/SVG/CSS của Item.
price: giá bằng Coin.
default: xác định Item mặc định.

Ví dụ:

hair_01
category: hair
name: Tóc nâu
html: nội dung HTML/SVG của tóc
price: 100
default: false

Không lưu ảnh PNG riêng cho Item.

4. HTML của Item

HTML của Item chỉ chứa phần cần render, không chứa toàn bộ Avatar.

Không tạo:

<html>
<body>
...
</body>
</html>

cho từng Item.

Thay vào đó, Item chỉ chứa nội dung như:

<div class="avatar-hair">
    ...
</div>

hoặc SVG/CSS tương ứng.

5. Avatar Template

Template là HTML chung của Avatar.

Template tạo các vùng/category để Item được render vào đúng layer.

Ví dụ cấu trúc:

Avatar
│
├── Body
├── Face
├── Hair
├── Shirt
├── Pants
├── Shoes
├── Hat
├── Glasses
└── Accessory

Thứ tự layer phải được cố định để tránh việc quần áo hoặc tóc nằm sai phía trước/sau.

Ví dụ:

Body
↓
Face
↓
Pants
↓
Shirt
↓
Shoes
↓
Hair
↓
Hat
↓
Glasses
↓
Accessory

Thứ tự thực tế có thể điều chỉnh tùy thiết kế Avatar.

6. Trang quản trị Avatar Items

Trang Avatar Items lấy danh sách Item từ API.

Admin có thể:

Xem Item.
Tạo Item mới.
Chọn category.
Nhập tên Item.
Nhập HTML/SVG/CSS.
Thiết lập giá Coin.
Thiết lập Item mặc định.
Chỉnh sửa Item.
Xóa Item.

Không cần upload ảnh Item lên Cloudinary.

7. Canvas Preview

Khi mở trình chỉnh sửa Avatar:

Load Avatar Template
        ↓
Load Avatar Items từ API
        ↓
Render Template
        ↓
Render các Item vào đúng category
        ↓
Hiển thị Avatar hoàn chỉnh

Canvas phải hiển thị đúng kích thước Avatar.

Khi admin chọn một Item:

Category Hair
        ↓
Chọn hair_05
        ↓
Xóa hair hiện tại
        ↓
Render hair_05

Mỗi category chỉ có một Item đang được trang bị, trừ những category cho phép nhiều Item như Accessory.

8. Profile User

Profile không cần lưu HTML hoàn chỉnh của Avatar.

Chỉ lưu cấu hình Item mà User đang sử dụng.

Ví dụ:

body → body_01
face → face_02
hair → hair_05
shirt → shirt_03
pants → pants_02
shoes → shoes_01
hat → hat_02
glasses → glasses_01

Khi mở Profile:

User Avatar Configuration
        ↓
Load Avatar Template
        ↓
Load các Item tương ứng từ API
        ↓
Render HTML
        ↓
Hiển thị Avatar
9. Lưu Avatar

Khi User bấm Lưu Avatar:

User chọn Item
        ↓
Kiểm tra Coin / quyền sở hữu
        ↓
Lưu cấu hình Avatar
        ↓
Render Avatar hoàn chỉnh
        ↓
Tạo ảnh PNG
        ↓
Upload PNG lên Cloudinary
        ↓
Lưu avatarUrl vào Profile

Ảnh PNG chỉ là ảnh kết quả cuối cùng, không phải ảnh của từng Item.

10. Cloudinary

Cloudinary chỉ dùng để lưu:

Avatar hoàn chỉnh của User

Không cần:

hair_01.png
hair_02.png
shirt_01.png
pants_01.png
...

Điều này giúp giảm số lượng file ảnh cần quản lý.

11. Khi User thay đổi Avatar

Ví dụ:

Avatar hiện tại:
hair_01
shirt_01
pants_01

User đổi tóc:

hair_05

Hệ thống:

Load Template
    ↓
Load hair_05
    ↓
Giữ shirt_01
    ↓
Giữ pants_01
    ↓
Render Avatar mới
    ↓
Cập nhật Avatar
    ↓
Render PNG mới
    ↓
Upload Cloudinary
12. Ưu điểm
Không phải tách ảnh thành hàng chục file.
Không cần quản lý tọa độ từng ảnh.
Item có thể được chỉnh sửa trực tiếp bằng HTML/SVG/CSS.
Dễ thêm trang phục mới.
Dễ thêm category mới.
Có thể thêm animation.
Có thể thêm hiệu ứng.
Có thể đổi màu bằng CSS.
Có thể tạo Item động.
API chỉ quản lý dữ liệu Item và cấu hình User.
Cloudinary chỉ lưu ảnh Avatar cuối cùng.
13. React

React chịu trách nhiệm:

Quản lý Avatar Editor.
Load Template.
Load Items từ API.
Chọn Item.
Thay đổi category.
Preview Avatar.
Quản lý trạng thái Avatar.
Lưu cấu hình User.
Render Avatar trước khi tạo ảnh.

Không dùng React để lưu từng Item thành file ảnh.

14. Bảo mật HTML

Nếu HTML của Item được lấy từ API và render bằng dangerouslySetInnerHTML, cần kiểm soát nội dung HTML.

Chỉ cho phép HTML/SVG/CSS do hệ thống quản trị tạo ra hoặc đã được sanitize.

Không cho User thông thường nhập HTML tùy ý.

15. Luồng tổng thể
ADMIN
  ↓
Avatar Template
  ↓
Tạo Avatar Item bằng HTML/SVG/CSS
  ↓
Lưu Item vào API
  ↓
User mở Profile
  ↓
Load Avatar Template
  ↓
Load Avatar Configuration
  ↓
Load các Item tương ứng
  ↓
Render Avatar
  ↓
User thay đổi trang phục
  ↓
Kiểm tra Coin / Item sở hữu
  ↓
Lưu Avatar Configuration
  ↓
Render Avatar thành PNG
  ↓
Upload Cloudinary
  ↓
Lưu avatarUrl
Kết luận

Không lưu ảnh riêng cho Avatar Item.

Thiết kế chính:

HTML Avatar Template
        +
HTML/SVG/CSS Avatar Items
        +
Avatar Configuration của User
        ↓
      Avatar
        ↓
   PNG cuối cùng
        ↓
    Cloudinary

Đây là kiến trúc nên sử dụng cho hệ thống Avatar hiện tại.