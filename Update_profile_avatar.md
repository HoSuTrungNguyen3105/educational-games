# Hệ thống Avatar Item – Ghép Avatar từ các ảnh riêng

## 1. Mục tiêu

Xây dựng hệ thống Avatar trong trang Profile.

Mỗi bộ phận của Avatar là một ảnh PNG riêng, nền trong suốt. React sẽ lấy các item người dùng đang mặc từ API và xếp các ảnh thành nhiều layer để tạo thành Avatar hoàn chỉnh.

Không cần ghép thành một ảnh duy nhất trong quá trình chỉnh sửa.

---

## 2. Cấu trúc Category

Các category dùng cho Avatar:

- body
- face
- hair
- shirt / áo
- pants / quần
- shoes / giày
- hat / mũ
- glasses / kính
- accessory / phụ kiện

Mỗi category chỉ được chọn tối đa 1 item.

Ví dụ:

- 1 body
- 1 face
- 1 hair
- 1 shirt
- 1 pants
- 1 shoes
- 1 hat
- 1 glasses
- 1 accessory

---

## 3. Cấu trúc Avatar Item API

Nên chuẩn hóa item về dạng:

- `id`: ID duy nhất của item
- `category`: category của item
- `name`: tên item
- `image`: URL ảnh PNG
- `price`: giá bằng Coin
- `default`: item mặc định hay không
- `zIndex`: thứ tự layer khi ghép Avatar

Ví dụ:

```text
{
    id: "hair_01",
    category: "hair",
    name: "Tóc mặc định",
    image: "https://...",
    price: 0,
    default: true,
    zIndex: 30
}

5. Quy chuẩn ảnh Avatar

Tất cả ảnh layer phải sử dụng cùng một kích thước Canvas.

Ví dụ:

500 x 600

Tất cả ảnh:

body.png
face.png
hair.png
shirt.png
pants.png
shoes.png
hat.png
glasses.png
accessory.png

đều phải có kích thước:

500 x 600

và:

nền trong suốt
nhân vật nằm đúng vị trí
không tự crop khác kích thước
không tự scale khác nhau

Mục đích là khi đặt tất cả ảnh chồng lên nhau thì các bộ phận tự khớp vị trí.

6. Cách React ghép Avatar

React tạo một container Avatar có kích thước cố định.

Các ảnh được đặt chồng lên nhau:

body
face
hair
shirt
pants
shoes
hat
glasses
accessory

Mỗi ảnh:

position: absolute
width: 100%
height: 100%

Container:

position: relative

Không dùng tọa độ x/y riêng cho từng item nếu ảnh đã được chuẩn hóa cùng Canvas.

7. Sử dụng zIndex

Mỗi item có zIndex để quyết định thứ tự hiển thị.

Thứ tự mặc định:

body       → 10
face       → 20
hair       → 30
shirt      → 40
pants      → 50
shoes      → 60
hat        → 70
glasses    → 80
accessory  → 90

Có thể điều chỉnh zIndex nếu một item đặc biệt cần nằm trước hoặc sau layer khác.

React phải sort item theo zIndex trước khi render.

8. Khi mở Avatar Editor

React gọi API lấy toàn bộ Avatar Items.

Sau đó:

Nhóm item theo category.
Hiển thị từng category trong tab.
Khi người dùng chọn item, chỉ thay item của category đó.
Preview Avatar được cập nhật ngay lập tức.
Không upload lại ảnh.
Không tạo ảnh Avatar mới ở mỗi lần chọn.

Ví dụ:

Người dùng chọn:

Tóc → hair_05

React thay:

hair_01
↓
hair_05

Các layer khác giữ nguyên.

9. Avatar đang mặc của User

Không nên chỉ lưu một ảnh Avatar cuối cùng.

Nên lưu ID các item mà User đang mặc.

Ví dụ:

body: body_01
face: face_02
hair: hair_05
shirt: shirt_03
pants: pants_02
shoes: shoes_01
hat: hat_04
glasses: glasses_01
accessory: acc_02

Khi mở Profile:

API lấy Avatar của User.
Lấy các Avatar Item tương ứng.
React render các ảnh theo zIndex.
Hiển thị Avatar hoàn chỉnh.
10. Mua Item bằng Coin

Nếu item có:

price > 0

thì item là item cần mua.

Khi User chưa sở hữu:

Hiển thị giá Coin.
Không cho trang bị.
Khi User mua thành công thì thêm item vào Inventory.

Nếu:

price = 0

và:

default = true

thì User có thể sử dụng ngay.

11. Inventory

User cần có danh sách item đã sở hữu.

Ví dụ:

ownedItems:
- body_01
- face_01
- face_02
- hair_01
- hair_05
- shirt_03
- pants_02

Khi User chọn item chưa sở hữu:

Chưa sở hữu
→ Hiển thị giá
→ Mua bằng Coin
→ API xác nhận mua
→ Thêm item vào Inventory
→ Cho phép trang bị
12. Lưu Avatar

Khi nhấn:

Lưu Avatar

React gửi danh sách ID item đang mặc lên API.

API lưu lại Avatar Configuration của User.

Không cần upload ảnh Avatar cuối cùng lên Cloudinary.

Ví dụ:

User
  ↓
avatar configuration
  ↓
ID từng item

Sau này User đổi áo:

shirt_03
↓
shirt_07

chỉ cần cập nhật ID áo.

13. Render Avatar ở Profile

Profile không cần biết cách cắt ảnh.

Profile chỉ cần:

Avatar Configuration
+
Avatar Items API

Sau đó React:

Lấy item
→ lấy image
→ lấy zIndex
→ render layer

Kết quả là Avatar hoàn chỉnh.

14. Khi nào mới tạo ảnh Avatar cuối cùng?

Chỉ tạo ảnh PNG/JPG cuối cùng khi thực sự cần:

tải Avatar xuống
chia sẻ Avatar
xuất Avatar
sử dụng ở nơi không thể render nhiều layer

Khi đó có thể dùng Canvas:

body.png
+
face.png
+
hair.png
+
shirt.png
+
pants.png
+
shoes.png
+
hat.png
+
glasses.png
+
accessory.png
↓
Canvas
↓
avatar-final.png

Nhưng Avatar trong hệ thống vẫn phải lưu bằng ID item, không lưu duy nhất ảnh cuối cùng.

15. Kiểm tra dữ liệu Item

Sau khi tách ảnh từ ảnh tổng, phải kiểm tra category.

Ví dụ:

Ảnh tóc
→ category: hair

Ảnh áo
→ category: shirt

Ảnh quần
→ category: pants

Ảnh giày
→ category: shoes

Ảnh mũ
→ category: hat

Ảnh kính
→ category: glasses

Ảnh phụ kiện
→ category: accessory

Không được để ảnh quần có:

category: hair

vì React sẽ lấy ảnh đó khi người dùng mở tab Tóc.

16. Xử lý Item cũ có x/y

Các item cũ đang dùng:

x
y
width
height

là dữ liệu cắt từ Sprite Sheet.

Có thể hỗ trợ tạm thời bằng cách:

Nếu item có image
→ render image trực tiếp.

Nếu item không có image nhưng có x/y/width/height
→ xử lý theo Sprite Sheet cũ.

Tuy nhiên nên chuyển toàn bộ item sang ảnh riêng để đơn giản hóa hệ thống.

Kết quả kiến trúc
Avatar Items API
        ↓
Danh sách item
        ↓
React Avatar Editor
        ↓
Chọn 1 item / category
        ↓
Preview các layer
        ↓
Mua bằng Coin nếu cần
        ↓
Lưu ID item đang mặc
        ↓
User Avatar Configuration
        ↓
Profile render Avatar
Nguyên tắc chính
Mỗi món đồ = 1 ảnh PNG riêng.
Mỗi món đồ có 1 ID duy nhất.
Mỗi món đồ thuộc 1 category.
Mỗi category chỉ mặc 1 item.
Các ảnh phải cùng Canvas và cùng kích thước.
React ghép bằng layer, không cần crop bằng tọa độ.
Dùng zIndex để kiểm soát thứ tự layer.
API lưu ID item, không lưu ảnh Avatar cuối cùng.
Cloudinary chỉ lưu ảnh item.
Chỉ dùng Canvas để xuất Avatar thành ảnh khi thực sự cần.