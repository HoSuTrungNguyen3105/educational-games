# Tài Liệu Kỹ Thuật Cho AI: Hệ Thống Nhân Vật Chibi Giả Lập 3D (20+ Body)

## 1. Bối Cảnh & Mục Tiêu
* **Dự án:** Hệ thống học tập & trò chơi tương tác cho học sinh Tiểu học (mô hình 1 giáo viên tự vận hành + học sinh).
* **Mục tiêu:** Xây dựng và tích hợp hệ thống **20+ body nhân vật chibi 3D/clay full-body** theo hướng **hoạt ảnh 2D giả lập 3D (2.5D / pseudo-3D)** bằng **Rive** (ưu tiên) hoặc **Spine**, hiển thị trên:
  1. Trang chủ học sinh (nhân vật vẫy chào, nhún nhảy theo nhiệm vụ/trạng thái).
  2. Màn hình tùy chỉnh avatar (`/profile`) và khu vực phần thưởng/tương tác.
* **Nguyên tắc cốt lõi cho 1 người làm với 20+ body:**
  * Dùng chung **1 bộ khung xương (Skeleton/Rig) chuẩn** và tái sử dụng animation/state machine.
  * Chia nhóm body theo đặc điểm hình thể để tránh rig lại từ đầu cho từng mẫu.
  * Có cơ chế fallback an toàn nếu file animation chưa có hoặc thiết bị tải chậm.

---

## 2. Phân Nhóm 20+ Body & Quy Tắc Tách Lớp

### 2.1. Các nhóm body cần phân loại
1. **Nhóm người / đồng phục / nghề nghiệp** (ví dụ: bé trai, bé gái, phi hành gia, ninja, hải tặc, đầu bếp, cảnh sát, siêu nhân...):
   * Có cấu trúc đầu, thân, tay trái/phải, chân trái/phải tương đồng.
   * Dùng chung bộ rig chuẩn nhất.
2. **Nhóm sinh vật / thú cưng / quái vật dễ thương** (ví dụ: khủng long, rồng, thỏ, cú mèo, bóng ma...):
   * Giữ các bone cơ bản (thân, đầu, tay/chân/cánh/đuôi nếu có) và ánh xạ tên slot tương ứng.
   * Với body liền khối (như bóng ma), ưu tiên rig chuyển động thân uốn lượn, mắt/biểu cảm và hiệu ứng nổi.
3. **Nhóm cơ khí / đặc thù** (ví dụ: robot...):
   * Chuyển động cơ học dứt khoát hơn, khớp nối rõ ràng nhưng vẫn dùng cùng tên state/trigger để đồng bộ với React.

### 2.2. Quy tắc chuẩn bị layer (trước khi đưa vào Rive/Spine)
* Xuất ảnh `.png` nền trong suốt, độ phân giải đồng nhất (khuyến nghị `512x512` hoặc `768x768` cho từng bộ phận/khung).
* Đặt tên layer/slot theo quy ước thống nhất:
  * `head`, `torso`, `arm_l`, `arm_r`, `leg_l`, `leg_r`
  * `wing_l`, `wing_r`, `tail`, `cape` (nếu có)
  * `eye_l`, `eye_r`, `mouth`, `blush` (nếu tách biểu cảm)
  * `hat`, `glasses`, `item_hand` (nếu ghép phụ kiện/vật phẩm)

---

## 3. Kỹ Thuật Giả Lập 3D (Pseudo-3D) Trong Rig & Animation

* **Mesh Deformation (Biến dạng lưới):** Áp mesh cho tay, chân, thân hoặc tai/đuôi để uốn cong mềm mại kiểu đồ chơi đất sét/nhựa 3D, tránh gãy khớp cứng.
* **Giả lập góc nhìn / xoay nhẹ (Pseudo-3D Turn):**
  * Khi điều chỉnh góc nhìn trái/phải hoặc tương tác xoay: dịch chuyển ngang nhẹ các chi tiết mặt (`eye_l`, `eye_r`, mũi/miệng), thu hẹp/mở rộng `scaleX` hợp lý, đổi thứ tự hiển thị (`draw order`) của tay/vai/cánh và thêm bóng đổ dưới chân (`shadow`) co giãn theo độ cao nhảy.
* **Bộ Animation chuẩn tối thiểu (dùng chung cho mọi body):**
  * `idle`: thở nhẹ, nhún nhịp nhàng, chớp mắt tự nhiên.
  * `wave`: vẫy tay chào (dùng khi vào trang chủ hoặc mở màn hình tùy chỉnh).
  * `happy` / `celebrate`: nhảy vui mừng, hào hứng (khi làm đúng, hoàn thành nhiệm vụ, nhận sao/cúp).
  * `encourage` / `think`: gãi đầu/nghiêng đầu cổ vũ nhẹ nhàng (khi làm sai hoặc cần gợi ý, tuyệt đối không biểu cảm tiêu cực/gắt gỏng cho trẻ tiểu học).

---

## 4. Kiến Trúc State Machine & Tích Hợp React

### 4.1. State Machine & Inputs chuẩn
Thiết kế State Machine (ví dụ tên `MainStateMachine`) với các input rõ ràng để React điều khiển:
* `mood` (String hoặc Enum/Number): `idle` | `happy` | `encourage` | `wave`
* `turnX` (Number, ví dụ `-1` đến `1`): điều khiển độ nghiêng/xoay giả lập 3D trái/phải
* `triggerCelebrate` (Trigger): kích hoạt pha ăn mừng tức thì khi bé nhận thưởng/hoàn thành bài

### 4.2. Cấu trúc dữ liệu Catalog cho 20+ Body
Tạo file cấu hình dữ liệu tập trung (ví dụ `src/config/characterBodies.js`) để quản lý toàn bộ 20+ body:
```js
export const CHARACTER_BODIES = [
  {
    id: 'boy_basic',
    name: 'Bé Trai Năng Động',
    group: 'human',
    riveFile: '/animations/characters/boy_basic.riv', // hoặc file .riv dùng chung theo group
    artboard: 'CharacterArtboard',
    stateMachine: 'MainStateMachine',
    fallbackImg: '/avatars/bodies/boy_basic.webp',
    supportsTurn: true,
    compatibleSlots: ['hat', 'glasses', 'accessory'],
  },
  // Khai báo tiếp các body còn lại (girl, astronaut, dino, dragon, robot, pirate, chef...)
];
```

### 4.3. Component React thống nhất
Yêu cầu AI xây dựng 1 component dùng chung (ví dụ `src/components/character/CharacterStage.jsx`):
* Nhận props: `bodyId`, `mood = 'idle'`, `turnX = 0`, `celebrateKey = 0`, `accessories = {}`, `className = ''`.
* Tự động tải file `.riv` tương ứng với `bodyId`, đồng bộ `mood` và `turnX` vào State Machine, bắn `triggerCelebrate` khi `celebrateKey` thay đổi.
* Nếu thiếu file `.riv` hoặc đang tải / lỗi runtime: tự động hiển thị `fallbackImg` kèm animation CSS mượt mà để không làm hỏng giao diện.

---

## 5. Lộ Trình Triển Khai Chia Giai Đoạn (Khuyến Nghị Cho AI)

1. **Bước 1 — Cấu trúc dữ liệu & Component khung:** Tạo `characterBodies.js` với danh sách 20+ body mẫu, xây dựng `CharacterStage.jsx` có sẵn fallback và điều khiển state/turnX.
2. **Bước 2 — Gắn vào Trang Chủ & Màn Hình `/profile`:**
   * Trên trang chủ: hiển thị nhân vật ở trạng thái `wave` / `idle`, phản ứng `happy` khi bấm vào nhiệm vụ/chơi.
   * Trên `/profile`: giữ nguyên các tab tùy chỉnh (`Thân`, `Mặt`, `Tóc`, `Màu tóc`, `Da`, `Áo`, `Váy`, `Quần`, `Giày`, `Kính`, `Mũ`, `Phụ kiện`), nút `Ngẫu nhiên`, `Mặc lại`, `Lưu vào hồ sơ` và điều khiển xoay giả 3D (`turnX`).
3. **Bước 3 — Hoàn thiện mẫu thí điểm (3–4 body) rồi mở rộng:** Làm hoàn chỉnh 3–4 body đại diện (ví dụ: *Bé trai/gái*, *Khủng long*, *Phi hành gia*, *Robot*) để kiểm tra khớp xương, độ mượt và cảm giác 2.5D trước khi nhân bản cho toàn bộ 20+ body.

---

## 6. Prompt Mẫu Để Đưa Cho AI Khi Bắt Đầu Code
> *"Dựa trên tài liệu `character_pseudo_3d_ai_guide.md`, hãy tạo trước: (1) file cấu hình `characterBodies.js` cho danh sách 20+ body chibi tiểu học chia theo nhóm, (2) component `CharacterStage.jsx` sử dụng `@rive-app/react-canvas` có hỗ trợ `mood`, `turnX`, `celebrateKey`, lớp phụ kiện và fallback ảnh `.webp` khi chưa có file `.riv`, (3) hướng dẫn tích hợp vào trang chủ và màn hình `/profile` hiện tại mà không phá vỡ các chức năng có sẵn."*