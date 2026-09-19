# Task: Xây dựng Nông Trại 2D Isometric bằng Code cho EduPlay

## 1. Bối cảnh

Website EduPlay hiện là nền tảng học tập kết hợp giải trí dành cho học
sinh. Website đã có các khu vực như Trang chủ, DreamDale, Khu vườn,
Nhiệm vụ, Vòng quay, Trò chơi, Ví của tôi, Bài tập, Hồ sơ và Trang giáo
viên.

Cần phát triển **Khu vườn** thành một **nông trại 2D Isometric tương
tác**, được tích hợp trực tiếp vào website. Đây là một
mini-game/gamification layer hỗ trợ việc học, không phải một game độc
lập bên ngoài website.

## 2. Mục tiêu

Xây dựng farm có cảm giác như một game nông trại 2D hoàn chỉnh:

-   Góc nhìn 2D Isometric.
-   Phong cách cartoon nhiều màu sắc, dễ thương, phù hợp học sinh.
-   Có chiều sâu nhờ isometric coordinates và depth/layer.
-   Có nhà, chuồng, ruộng, cây, hồ nước, cầu, hàng rào, đường đi, cửa
    hàng.
-   Có bò, gà và nhân vật người chơi.
-   Có cây trồng với nhiều giai đoạn phát triển.
-   Có click/tap tương tác.
-   Có animation nhẹ.
-   Có XP, Coin, Level và phần thưởng.
-   Có thể mở rộng gameplay về sau.

## 3. Công nghệ

Ưu tiên:

-   **React / Next.js**: website và UI.
-   **Phaser 3**: game 2D, camera, input, animation và gameplay.
-   **Phaser Graphics / Geometry**: tạo các thành phần bằng code.
-   **HTML5 Canvas**: Phaser render game.
-   API/backend hiện có: lưu XP, coin, inventory và tiến trình khi cần (sử dụng API: http://localhost:3001/api/).

### Không sử dụng

-   Three.js.
-   React Three Fiber.
-   WebGL 3D.
-   3D Mesh.
-   3D Model.
-   Lighting/shadow 3D.

Mục tiêu là **2D Isometric**, không phải 3D.

## 4. Yêu cầu đặc biệt: ưu tiên tạo hình bằng code

Không muốn hệ thống phụ thuộc hoàn toàn vào các file ảnh như `barn.png`,
`cow.png`, `tree.png`.

Ưu tiên:

``` text
Phaser Graphics
      +
Geometry
      +
Isometric coordinates
      +
Layering / Depth
      +
Animation
```

Dùng code để tạo các thành phần cơ bản như:

-   Mặt đất.
-   Ô ruộng.
-   Đường đi.
-   Hàng rào.
-   Cây.
-   Đá.
-   Nhà.
-   Chuồng.
-   Cối xay gió.
-   Hồ nước.
-   Cầu.
-   Cây trồng.
-   Icon tương tác.
-   Động vật cartoon đơn giản.
-   Nhân vật cartoon đơn giản.

Có thể dùng asset 2D/PNG/SVG cho những chi tiết quá phức tạp nếu thật sự
cần, nhưng không được dùng một ảnh background duy nhất để giả lập toàn
bộ game.

## 5. Phong cách hình ảnh

Phong cách mong muốn:

**Colorful 2D Isometric Cartoon Farming Game**

Đặc điểm:

-   Tươi sáng.
-   Vui nhộn.
-   Thân thiện với học sinh.
-   Hình khối rõ ràng.
-   Có shading/highlight giả bằng code nếu phù hợp.
-   Có chiều sâu nhưng vẫn nhìn rõ là 2D.
-   Không u tối.
-   Không quá thực tế.

Tham khảo bố cục:

``` text
                    🌳 🌳 🌳
             🏠              🌬️
          🌳    🌾🌾🌾       🐄
              🌾🌾🌾🌾
       🌳             🚜
                👨‍🌾
          🐔             🏪
              💧  🌉
```

Không cần sao chép nguyên mẫu; chỉ lấy cảm hứng về bố cục và phong cách.

## 6. Vị trí trong EduPlay

Nếu sidebar hiện tại đã có:

``` text
🌱 Khu vườn
```

thì sử dụng **Khu vườn** làm entry point cho farm, không tạo thêm một
menu "Nông trại" trùng chức năng.

Luồng:

``` text
Khu vườn
   ↓
Nông trại 2D Isometric
```

## 7. Vai trò của nông trại trong hệ thống học tập

Nông trại phải kết nối với gamification của EduPlay.

Luồng mong muốn:

``` text
Học bài
   ↓
Làm Quiz / Bài tập
   ↓
Hoàn thành
   ↓
+ XP + Coin
   ↓
Nông trại
   ↓
Mua hạt giống / xây dựng / nuôi thú
   ↓
Phát triển nông trại
```

Ví dụ:

``` text
Đúng 8/10 câu
      ↓
  +50 XP
  +20 Coin
      ↓
Vào Khu vườn
      ↓
Mua hạt giống
      ↓
Trồng
      ↓
Cây phát triển
      ↓
Thu hoạch
```

Mục tiêu là biến nông trại thành phần thưởng và động lực cho quá trình
học.

## 8. Bố cục màn hình

### Khu vực farm

Chiếm phần lớn màn hình:

``` text
┌─────────────────────────────────────────────┐
│                                             │
│          🌳      🏠      🌬️                 │
│                                             │
│       🌾🌾🌾       🐄                       │
│     🌾🌾🌾🌾                                 │
│                                             │
│            👨‍🌾                              │
│                         🐔 🐔               │
│                                             │
│       💧────────🌉────────                  │
│                                             │
└─────────────────────────────────────────────┘
```

### HUD

Có thể hiển thị:

-   Avatar.
-   Level.
-   XP.
-   Coin.
-   Diamond nếu hệ thống có.
-   Energy nếu cần.

Ví dụ:

``` text
Lv. 5
████████░░ 320 / 500 XP

🪙 3.405.429
💎 250
```

### Action buttons

Có thể có:

-   Bản đồ.
-   Kho đồ.
-   Thành tựu.
-   Trồng cây.
-   Nuôi thú.
-   Xây dựng.
-   Cửa hàng.

## 9. Các đối tượng cần có

### Môi trường

-   Cỏ.
-   Đất.
-   Đường.
-   Hồ nước.
-   Cầu.
-   Cây.
-   Bụi cây.
-   Hoa.
-   Đá.
-   Hàng rào.
-   Đèn.
-   Biển báo.

### Công trình

-   Nhà chính.
-   Chuồng bò.
-   Chuồng gà.
-   Kho.
-   Cửa hàng.
-   Cối xay gió.
-   Giếng.
-   Công trình có thể nâng cấp.

### Nông nghiệp

Có ô đất và các trạng thái:

``` text
seed → sprout → growing → mature → harvest
```

### Động vật

Tối thiểu:

-   Bò.
-   Gà.

Có thể mở rộng:

-   Cừu.
-   Heo.
-   Ngựa.
-   Ong.

### Nhân vật

Có một nhân vật người chơi:

-   Đứng.
-   Di chuyển.
-   Animation đi bộ đơn giản.
-   Có thể tương tác với farm.

## 10. Hệ thống Isometric

Xây dựng hệ tọa độ riêng cho map:

``` text
Grid coordinates
       ↓
Isometric coordinates
       ↓
Screen coordinates
```

Có thể dùng:

``` js
screenX = (gridX - gridY) * tileWidth / 2
screenY = (gridX + gridY) * tileHeight / 2
```

Mục tiêu:

-   Click đúng ô đất.
-   Di chuyển nhân vật.
-   Đặt công trình.
-   Trồng cây.
-   Mở rộng map.
-   Tính khoảng cách giữa object.

## 11. Depth / Layer

Phải xử lý thứ tự hiển thị để các object không bị chồng sai:

``` text
Background
    ↓
Ground
    ↓
Water
    ↓
Buildings / Trees
    ↓
Animals
    ↓
Player
    ↓
Foreground
    ↓
Interaction UI
```

Có thể dùng `setDepth()` hoặc tính depth dựa trên tọa độ isometric.

## 12. Tương tác

### Ô đất

``` text
Click ô đất
    ↓
Hiện action
    ↓
Trồng cây
```

### Cây trưởng thành

``` text
Click cây
    ↓
Thu hoạch
    ↓
+ Coin
+ XP
```

### Nhà

``` text
Click nhà
    ↓
Thông tin
    ↓
Nâng cấp
```

### Cửa hàng

``` text
Click cửa hàng
    ↓
Mở Shop UI
```

Các chức năng chính phải thao tác được bằng click/tap, không được phụ
thuộc vào hover.

## 13. Animation

Thêm animation nhẹ:

-   Cây rung.
-   Cối xay gió quay.
-   Nước chuyển động.
-   Bò đi.
-   Gà đi.
-   Nhân vật đi bộ.
-   Hiệu ứng thu hoạch.
-   Coin bay lên.
-   XP tăng.
-   Particle nhẹ.

Không tạo animation liên tục quá nặng.

## 14. Phân chia React và Phaser

Không dùng React để render từng tile/object trong farm.

Kiến trúc:

``` text
React / Next.js
│
├── Sidebar
├── Header
├── HUD
├── Shop Modal
├── Inventory
├── Quest UI
└── Farm Game Container
          │
          └── Phaser
                ├── Map
                ├── Player
                ├── Crops
                ├── Animals
                ├── Buildings
                └── Environment
```

React quản lý website/UI.

Phaser quản lý game rendering, input, animation và gameplay.

## 15. Cấu trúc file gợi ý

Tại:

``` text
F:\Clone\edu_game\educational-games\src\components\dreamdale
```

có thể tổ chức:

``` text
dreamdale/
├── DreamDale.jsx
│
├── components/
│   ├── FarmGame.jsx
│   ├── FarmScene.js
│   ├── FarmMap.js
│   ├── FarmPlayer.js
│   ├── FarmBuildings.js
│   ├── FarmCrops.js
│   ├── FarmAnimals.js
│   ├── FarmEnvironment.js
│   ├── FarmInteraction.js
│   ├── FarmHUD.jsx
│   ├── FarmShop.jsx
│   ├── FarmInventory.jsx
│   └── FarmQuest.jsx
│
└── utils/
    ├── isometric.js
    ├── farmConstants.js
    └── farmHelpers.js
```

Có thể điều chỉnh theo cấu trúc hiện tại, không bắt buộc tạo đúng toàn
bộ file trên.

## 16. Performance

Vì farm nằm trong website học tập nên phải nhẹ.

Không:

-   Render từng object bằng React.
-   Update React state mỗi frame.
-   Tạo object liên tục trong `update()`.
-   Dùng quá nhiều particle.
-   Dùng shadow/lighting 3D.
-   Chạy animation nặng khi tab không hoạt động.

Nên:

-   Tái sử dụng Graphics/object.
-   Giới hạn số lượng object.
-   Chỉ update object cần thiết.
-   Culling khi map lớn.
-   Animation đơn giản.
-   Tối ưu mobile.
-   Hỗ trợ giảm animation trên thiết bị yếu.

## 17. Responsive

Phải chạy tốt trên:

-   Desktop.
-   Laptop.
-   Tablet.
-   Mobile.

Desktop:

``` text
Sidebar | Farm
```

Mobile:

``` text
Farm
HUD
Bottom actions
```

Nút tương tác phải đủ lớn cho thao tác cảm ứng của học sinh.

## 18. Không phá vỡ website hiện tại

Khi triển khai:

-   Không làm hỏng game hiện có.
-   Không làm hỏng DreamDale.
-   Không làm hỏng sidebar.
-   Không làm hỏng authentication.
-   Không làm hỏng XP/Coin.
-   Không làm hỏng API hiện tại.
-   Không ảnh hưởng các trang học tập.

Nếu cần sửa component hiện tại phải giữ các chức năng đang có.

## 19. Tiêu chí hoàn thành

-   [ ] Có nông trại trong mục Khu vườn.
-   [ ] Farm là 2D Isometric.
-   [ ] Không sử dụng Three.js/R3F/3D.
-   [ ] Ưu tiên tạo hình bằng Phaser Graphics/Geometry.
-   [ ] Có ground và map.
-   [ ] Có nhà.
-   [ ] Có chuồng.
-   [ ] Có cây.
-   [ ] Có ruộng.
-   [ ] Có cây trồng.
-   [ ] Có bò.
-   [ ] Có gà.
-   [ ] Có hồ nước.
-   [ ] Có cầu.
-   [ ] Có hàng rào.
-   [ ] Có cửa hàng.
-   [ ] Có nhân vật.
-   [ ] Có depth/layer đúng.
-   [ ] Có click/tap tương tác.
-   [ ] Có animation nhẹ.
-   [ ] Có HUD XP/Coin/Level.
-   [ ] Có logic nhận thưởng từ hoạt động học.
-   [ ] Responsive.
-   [ ] Không gây lag đáng kể cho website.
-   [ ] Không làm hỏng chức năng hiện tại.

## 20. Kết quả mong muốn

Nông trại phải tạo cảm giác:

> EduPlay là một website học tập nhưng học sinh có một thế giới nông
> trại riêng để phát triển thông qua những phần thưởng nhận được khi
> học.

Không làm farm thành một ảnh nền tĩnh. Hãy xây dựng nó như một
**mini-game 2D Isometric thật sự có thể tương tác**, nhưng giữ kiến trúc
nhẹ để phù hợp với website học tập.

Ưu tiên:

``` text
2D Isometric
+ Cartoon
+ Colorful
+ Educational Gamification
+ Lightweight
+ Interactive
+ Code-generated Graphics
```
