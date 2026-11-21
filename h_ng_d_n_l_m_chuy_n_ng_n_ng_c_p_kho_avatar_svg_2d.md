# Tài Liệu Cho AI: Làm Chuyển Động, Di Chuyển & Nâng Cấp Kho Đồ Avatar SVG 2D

## 1. Mục Tiêu & Phạm Vi

* **Hiện trạng:** Hệ thống avatar trên giao diện 2D (màn hình tùy chỉnh `/profile`) đang dùng nhân vật SVG ghép lớp (thân, đầu, mặt, tóc, áo, quần, váy, giày, kính, mũ, phụ kiện) với 20+ mẫu thân/trang phục.
* **Mục tiêu:**
  1. Giúp nhân vật SVG có thể **chuyển động cơ thể** (thở/nhún khi đứng yên, đung đưa tay/chân khi đi bộ, nhảy mừng khi đổi đồ/nhận thưởng) và **di chuyển vị trí** (đi qua lại, đổi hướng trái/phải, nhảy, điều khiển bằng nút/phím) mà **không làm lệch các lớp đồ đang mặc**.
  2. **Nâng cấp giao diện các thẻ phụ kiện/trang phục** đẹp, trực quan, dễ nhận diện hơn cho học sinh tiểu học.
  3. **Mở rộng phong phú bộ sưu tập Tóc, Quần áo, Váy, Giày, Mũ, Kính và Phụ kiện** (đặc biệt bổ sung các kiểu tóc lấy cảm hứng từ manga/anime như tóc chỏm nhọn phong cách Son Goku và nhiều chủ đề gần gũi với trẻ nhỏ).

---

## 2. Nguyên Tắc Cấu Trúc SVG Để Đồ Mặc Không Bị Lệch

1. **Không tách rời đồ khỏi bộ phận mà nó bám vào:**
   * Khi nhân vật đi bộ hoặc nhún nhảy, **áo** phải đi cùng thân trên, **quần/váy/giày** phải đi cùng chân/thân dưới, **tóc/kính/mũ** phải đi cùng đầu.
   * Bọc các lớp SVG theo cụm chức năng (`<g>`) thay vì để rời rạc:
     * `#avatar-head-group`: Đầu + Mặt + Tóc (lớp trước & lớp sau) + Kính + Mũ.
     * `#avatar-upper-body`: Thân trên + Áo.
     * `#avatar-arm-left`, `#avatar-arm-right`: Tay trái, tay phải (kèm tay áo nếu có).
     * `#avatar-leg-left`, `#avatar-leg-right`: Chân trái, chân phải + Quần/Váy + Giày.
2. **Bắt buộc cấu hình tâm xoay (`transform-origin`) chuẩn cho SVG:**
   * Luôn đặt `transform-box: fill-box;` cho các nhóm `<g>` cần xoay/co giãn.
   * Đặt `transform-origin` đúng khớp nối (ví dụ: cổ/đầu ở đáy cổ `50% 90%`, vai ở đỉnh vai `50% 10%`, hông ở đỉnh hông `50% 5%`) để tay/chân/đầu không bị văng lệch tâm khi xoay.

---

## 3. Các Trạng Thái Chuyển Động Cơ Thể (CSS Animation)

Yêu cầu AI tạo stylesheet riêng (ví dụ `src/styles/svgAvatarMotion.css`) hỗ trợ các trạng thái gắn trên container nhân vật:

* **`idle` (Đứng thở / nhún nhẹ):** Thân trên nhún thở chậm (`translateY` nhẹ, `scaleY` tinh tế), đầu nghiêng/lắc nhẹ nhàng.
* **`walk` (Đi bộ / di chuyển ngang):** Thân nhún theo nhịp bước, tay trái/phải đánh ngược pha nhau, chân trái/phải bước luân phiên. Các body đặc thù liền khối (như *Bóng ma*, *Robot*, *Rồng*) vẫn chạy mượt nhờ chuyển động thân + nhún/lướt + bóng đổ bên dưới.
* **`jump` (Nhảy mừng):** Kích hoạt ngắn gọn (`500ms–650ms`) khi học sinh chọn món đồ mới, bấm nút ngẫu nhiên, lưu hồ sơ hoặc hoàn thành nhiệm vụ, sau đó tự quay về `idle` hoặc `walk`.

---

## 4. Cơ Chế Di Chuyển Vị Trí & Đổi Hướng Trong React

Yêu cầu AI tạo wrapper component dùng chung (ví dụ `src/components/avatar/MovableSvgAvatar.jsx`) bọc quanh component SVG avatar hiện tại:

* **Quản lý vị trí & hướng nhìn:** `posX` (giới hạn trong biên an toàn của khung chứa), `facing` (`1` nhìn phải, `-1` quay trái bằng `scaleX(-1)`), `motionState` (`'idle' | 'walk' | 'jump'`).
* **Điều khiển tương tác:** Hỗ trợ phím mũi tên `ArrowLeft` / `ArrowRight` + `Space` (nhảy), kèm cụm nút điều khiển nhỏ gọn trên UI (Trái / Phải / Nhảy / Tự đi dạo).
* **Bóng đổ đồng bộ:** Lớp bóng mờ dưới chân dịch chuyển theo `posX` và thu nhỏ nhẹ khi bật nhảy.

---

## 5. Nâng Cấp Giao Diện Các Thẻ Phụ Kiện & Trang Phục (UI/UX)

Yêu cầu AI cải tiến giao diện khu vực chọn đồ bên phải của màn hình `Tùy chỉnh Avatar`:

1. **Thẻ chọn đồ (Item Card) sinh động, rõ chi tiết:**
   * Hiển thị **bản xem trước SVG phóng to, căn giữa rõ nét** trên nền thẻ bo góc mềm mại, có đổ bóng nhẹ (`shadow-sm`), hiệu ứng nổi nhẹ khi hover (`hover:-translate-y-0.5`) và viền nổi bật + dấu tích/ngôi sao nhỏ khi đang được chọn (`active`).
   * Có **nhãn tên món đồ ngắn gọn, dễ thương** bên dưới mỗi thẻ (ví dụ: *Tóc Chiến Binh Chỏm Nhọn*, *Áo Võ Phục Cam*, *Kính Siêu Anh Hùng*) để học sinh tiểu học dễ nhận biết.
   * Bổ sung **tùy chọn "Bỏ chọn / Không dùng"** ở ô đầu tiên cho các tab không bắt buộc (*Kính, Mũ, Phụ kiện, Váy*).
2. **Thanh Tab & Lọc trực quan:**
   * Giữ đầy đủ các tab (`Thân`, `Mặt`, `Tóc`, `Màu tóc`, `Da`, `Áo`, `Váy`, `Quần`, `Giày`, `Kính`, `Mũ`, `Phụ kiện`) với icon rõ nét, trạng thái active nổi bật, cuộn mượt trên cả màn hình nhỏ.
   * Khi học sinh chọn một món đồ bất kỳ, kích hoạt ngay hiệu ứng nhân vật `jump` nhẹ để tạo phản hồi vui nhộn.

---

## 6. Mở Rộng Kho Kiểu Tóc, Quần Áo & Phụ Kiện SVG Mới

Yêu cầu AI vẽ thêm nhiều vector SVG mới đồng bộ phong cách nét tròn, màu sắc tươi sáng với avatar hiện tại (hỗ trợ đổi `hairColor` cho toàn bộ kiểu tóc mới):

### 6.1. Bộ sưu tập Tóc mới (hỗ trợ đầy đủ màu tóc)
* **Tóc Chiến Binh Chỏm Nhọn (lấy cảm hứng từ Son Goku trong manga):** Nhiều chỏm tóc nhọn lớn tỏa sang hai bên và đỉnh đầu đầy năng lượng (cần có cả lớp tóc sau đầu và tóc mái trước để ôm trọn khuôn mặt tự nhiên).
* **Tóc Hoàng Tử Saiya / Tóc Dựng Ngược:** Mái tóc chỏm dựng ngược cá tính.
* **Tóc Ninja Băng Đô / Tóc Đuôi Ngựa Cao:** Mái chéo kết hợp đuôi tóc buộc cao năng động.
* **Tóc Mái Ngố Cắt Bằng (Bob):** Tóc ngắn ôm má dễ thương.
* **Tóc Xoăn Bồng Bềnh / Tóc Xù Mây:** Các lọn xoăn tròn mềm mại.
* **Tóc Hai Bím / Hai Chỏm Na Tra:** Buộc hai bên có dây buộc màu sắc.
* **Tóc Tết Dài Công Chúa:** Bím tóc tết dài rủ qua vai.
* **Tóc Undercut / Rẽ Ngôi Học Đường:** Gọn gàng, lịch sự cho bé trai.

### 6.2. Bộ sưu tập Áo, Váy & Quần mới
* **Áo Võ Phục Cam – Xanh (lấy cảm hứng võ đường manga):** Áo võ cổ chữ V màu cam rực có đai lưng xanh dương.
* **Áo Đồng Phục Tiểu Học:** Áo sơ mi trắng cổ bẻ kèm khăn quàng đỏ hoặc nơ cổ.
* **Áo Hoodie Tai Mèo / Tai Thỏ:** Áo nỉ có mũ trùm sau lưng và túi trước bụng.
* **Áo Khoác Phi Hành Gia / Áo Giáp Công Nghệ:** Có chi tiết huy hiệu và đường viền hiện đại.
* **Áo Thun Họa Tiết:** Áo thun in hình ngôi sao, khủng long, tên lửa, cầu vồng.
* **Váy Công Chúa Xòe / Váy Yếm Jean / Váy Thủy Thủ:** Nhiều màu pastel và họa tiết chấm bi, kẻ caro.
* **Quần Võ Phục Rộng / Quần Jean Xắn Gấu / Quần Short Thể Thao / Quần Yếm:** Khớp chuẩn với cả giày thể thao lẫn ủng.

### 6.3. Bộ sưu tập Giày, Mũ, Kính & Phụ Kiện mới
* **Giày:** Giày võ thuật buộc dây, giày sneaker phát sáng, ủng siêu anh hùng, giày búp bê gắn nơ, dép sandal đi biển.
* **Mũ:** Vương miện vàng, mũ tai mèo/tai thỏ, mũ phù thủy, mũ lưỡi trai đội ngược, băng đô sừng tuần lộc, mũ bảo hiểm phi hành gia.
* **Kính:** Kính đo chỉ số sức mạnh 1 mắt (Scouter kiểu manga), kính tròn Harry, kính râm ngôi sao, kính bơi.
* **Phụ kiện:** Áo choàng siêu anh hùng, đôi cánh thiên thần/rồng nhỏ, ba lô tên lửa, gậy phép ngôi sao, thú cưng nhỏ đứng cạnh chân (mèo con, rồng mini, bé sao).

---

## 7. Prompt Mẫu Để Gửi Cho AI Thực Thi

> *"Dựa trên tài liệu `svg_avatar_movement_guide.md`, hãy thực hiện trọn bộ nâng cấp cho hệ thống Avatar SVG 2D của tôi:*
> *1. Thêm cấu trúc nhóm `<g>` chuẩn khớp nối (`#avatar-head-group`, `#avatar-upper-body`, `#avatar-arm-left`, `#avatar-arm-right`, `#avatar-leg-left`, `#avatar-leg-right`), tạo `svgAvatarMotion.css` (`idle`, `walk`, `jump`) và wrapper `MovableSvgAvatar.jsx` để nhân vật di chuyển trái/phải, đổi hướng, nhảy và có bóng đổ.*
> *2. Nâng cấp UI các thẻ chọn đồ trong màn hình Tùy chỉnh Avatar cho đẹp mắt, có preview phóng to rõ nét, tên món đồ, nút bỏ chọn và hiệu ứng nhân vật nhảy mừng khi chọn đồ.*
> *3. Vẽ bổ sung nhiều mẫu SVG mới đồng bộ phong cách: đặc biệt là kiểu tóc chỏm nhọn phong cách Son Goku (và biến thể dựng ngược), bộ võ phục cam-xanh, kính đo sức mạnh 1 mắt, cùng nhiều kiểu tóc (hai chỏm, bím tóc, xoăn xù, đuôi ngựa), quần áo (đồng phục khăn quàng đỏ, hoodie tai thú, váy yếm, váy công chúa) và phụ kiện (áo choàng, cánh, ba lô tên lửa, thú cưng) hỗ trợ đổi màu tóc đầy đủ."*