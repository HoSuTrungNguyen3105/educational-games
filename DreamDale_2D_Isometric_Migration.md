# Yêu cầu chuyển DreamDale từ 3D sang 2D Isometric

## Mục tiêu

Hãy chuyển toàn bộ giao diện game DreamDale hiện tại từ **3D/WebGL**
sang **2D Isometric**, lấy phong cách hình ảnh của các game nông trại 2D
như hình tham khảo đã cung cấp.

Game DreamDale là một **mini game nông trại được tích hợp bên trong
website học tập**, vì vậy cần ưu tiên giao diện đẹp, nhẹ, mượt và dễ mở
rộng.

## Phạm vi cần chỉnh sửa

File chính:

`F:\Clone\edu_game\educational-games\src\components\dreamdale\DreamDale.jsx`

Toàn bộ component liên quan:

`F:\Clone\edu_game\educational-games\src\components\dreamdale\components`

Hãy kiểm tra toàn bộ các component trong folder trên và chuyển phần hiển
thị từ tư duy 3D sang 2D.

## Công nghệ mong muốn

Ưu tiên sử dụng:

-   React để quản lý UI và kết nối với website học tập.
-   Phaser 3 để xây dựng phần game 2D.
-   HTML5 Canvas để render game.
-   Sprite / PNG / Isometric assets để tạo cảnh.
-   Tilemap hoặc hệ thống tọa độ Isometric để bố trí map.
-   Không sử dụng Three.js, React Three Fiber hoặc WebGL 3D cho phần
    DreamDale sau khi chuyển đổi.

Nếu project hiện tại đã có hệ thống game hoặc thư viện 2D phù hợp thì có
thể tận dụng lại thay vì tạo lại không cần thiết.

## Phong cách đồ họa

Dựa theo hình ảnh tham khảo:

-   Phong cách **2D Isometric Farming Game**.
-   Góc nhìn từ trên xuống theo kiểu isometric.
-   Màu sắc tươi sáng, thân thiện, phù hợp với website giáo dục.
-   Hình ảnh có chiều sâu bằng cách sử dụng sprite, đổ bóng giả và
    layer, không dùng model 3D.
-   Các vật thể có thiết kế chi tiết và sinh động.
-   Tránh phong cách hình khối 3D đơn giản hiện tại.

Cảnh cần có cảm giác giống một game nông trại hoàn chỉnh:

-   Nhà / chuồng
-   Ruộng
-   Cây trồng
-   Cây ăn quả
-   Cây xanh
-   Đường đi
-   Hàng rào
-   Cối xay gió
-   Kho / silo
-   Động vật
-   NPC
-   Đá, bụi cỏ và các vật thể trang trí
-   Các khu vực đất trống có thể mở rộng về sau

## Thiết kế map

Không tạo map bằng các khối 3D nữa.

Thay vào đó, xây dựng map bằng các tile / sprite 2D theo bố cục
isometric.

Ví dụ:

``` text
              🌳
        🏠          🌾🌾
     🌳     🛤️🛤️      🐄
         🛤️      🚜
    🌽🌽🌽       🍎🍎🍎
       🌳     🏡
              🐔
```

Các object cần được sắp xếp theo thứ tự layer/depth phù hợp để tạo cảm
giác vật thể nằm phía trước/phía sau nhau.

## Nhân vật

Chuyển nhân vật hiện tại từ model 3D sang sprite 2D.

Có thể chuẩn bị animation sprite cho:

-   Đứng
-   Đi lên
-   Đi xuống
-   Đi trái
-   Đi phải
-   Thu hoạch
-   Trồng cây
-   Tương tác

Nếu chưa có asset animation thì trước mắt có thể dùng sprite tĩnh hoặc
animation đơn giản, nhưng kiến trúc code phải dễ bổ sung sprite
animation sau này.

## Tương tác

Giữ lại các chức năng/gameplay hiện có nếu đang có.

Các object trong game cần có thể tương tác bằng click/tap:

-   Click ruộng → chọn ruộng.
-   Click cây → xem trạng thái.
-   Click nhà → mở thông tin.
-   Click NPC → tương tác.
-   Click vật phẩm → thu thập.
-   Click động vật → xem thông tin.
-   Click các khu vực đặc biệt → mở chức năng tương ứng.

Cần hỗ trợ cả:

-   Desktop: chuột.
-   Mobile: touch.

## Kết nối với website học tập

DreamDale không phải game độc lập mà là một phần của website giáo dục.

Giữ kiến trúc để sau này có thể kết nối:

``` text
Website học tập
      ↓
Hoàn thành bài học / Quiz
      ↓
Nhận XP / Coin / Reward
      ↓
DreamDale
      ↓
Dùng phần thưởng để:
- mua hạt giống
- trồng cây
- nâng cấp trang trại
- mua vật phẩm
- mở khu vực mới
```

Không làm ảnh hưởng đến các chức năng website học tập hiện tại.

## Hiệu năng

Đây là phần rất quan trọng.

Mục tiêu là game chạy nhẹ và mượt trên cả desktop và mobile.

Ưu tiên:

-   Không render 3D.
-   Không tạo hàng trăm React DOM element cho từng vật thể game.
-   Render object game thông qua Canvas/Phaser.
-   Dùng Sprite Sheet khi phù hợp.
-   Dùng Texture Atlas khi phù hợp.
-   Tái sử dụng texture cho các object giống nhau.
-   Hạn chế số lượng texture lớn.
-   Hạn chế animation không cần thiết.
-   Không gọi React state update liên tục trong game loop.
-   Không để mỗi frame làm React re-render toàn bộ game.
-   Tách UI React và game rendering thành hai phần tương đối độc lập.
-   Chỉ render/update những gì thực sự cần thiết.

## Responsive

Game phải hoạt động tốt trên:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Mobile cần hỗ trợ:

-   Touch
-   Kéo map
-   Zoom nếu cần
-   Các nút UI có kích thước phù hợp với màn hình cảm ứng

Không để game phá vỡ layout của website.

## UI hiện tại

Giữ lại các thành phần UI/gameplay đang có nếu chúng đã hoạt động, ví
dụ:

-   Level
-   XP bar
-   Coin
-   Currency
-   Nút điều hướng
-   Nút chức năng
-   Inventory
-   Các thông báo

Chỉ thay đổi giao diện nếu cần để phù hợp với phong cách 2D Isometric.

## Không được làm

-   Không tiếp tục dùng Three.js cho phần game.
-   Không dùng React Three Fiber.
-   Không tạo lại cảnh bằng Mesh 3D.
-   Không dùng Lighting/Shadow 3D.
-   Không phá vỡ logic gameplay đang có.
-   Không tự ý xóa các chức năng đang hoạt động.
-   Không thay đổi API hoặc dữ liệu backend nếu không cần thiết.
-   Không làm ảnh hưởng đến các trang học tập khác của website.

## Kiến trúc mong muốn

Có thể tổ chức theo hướng:

``` text
dreamdale/
│
├── DreamDale.jsx
│
├── components/
│   ├── GameCanvas.jsx
│   ├── FarmMap.jsx
│   ├── Player.jsx
│   ├── Buildings.jsx
│   ├── Crops.jsx
│   ├── Trees.jsx
│   ├── Animals.jsx
│   ├── NPC.jsx
│   ├── Decorations.jsx
│   └── ...
│
├── assets/
│   ├── tiles/
│   ├── buildings/
│   ├── crops/
│   ├── characters/
│   ├── animals/
│   └── decorations/
│
└── ...
```

Có thể thay đổi cấu trúc trên nếu cấu trúc project hiện tại có cách tổ
chức tốt hơn.

## Kết quả mong muốn

Sau khi chuyển đổi, khi mở DreamDale người dùng phải cảm nhận được:

> Đây là một khu nông trại 2D Isometric nằm bên trong một website học
> tập, có phong cách giống một game farming hoàn chỉnh.

Không còn cảm giác là một bản đồ 3D đơn giản với các khối hình cơ bản.

Ưu tiên chất lượng theo thứ tự:

1.  Hoạt động đúng.
2.  Mượt và nhẹ.
3.  Đẹp và sinh động.
4.  Dễ mở rộng thêm gameplay.
5.  Phù hợp với cả desktop và mobile.

Hãy kiểm tra toàn bộ code hiện tại trước khi sửa, xác định những phần
đang phụ thuộc vào hệ thống 3D và chuyển chúng sang kiến trúc 2D phù hợp
thay vì chỉ thay đổi phần CSS/giao diện bên ngoài.
