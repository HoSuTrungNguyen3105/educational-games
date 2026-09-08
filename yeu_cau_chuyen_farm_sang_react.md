# Yêu cầu: Chuyển Farm Game sang React

## Mục tiêu

Làm lại hoàn toàn trang Farm tại:

`F:\Clone\edu_game\educational-games\src\pages\user\GardenPage.jsx`

Dựa trên logic, gameplay và giao diện hiện có của Farm HTML tại:

`F:\Clone\edu_game\educational-games\src\games\block-master\Farmgame.html`

**Không tạo một HTML game mới và không nhúng `Farmgame.html` bằng iframe.** Farm này phải trở thành một phần native của React app.

---

## 1. Đọc và phân tích Farm HTML trước

Mở và phân tích toàn bộ:

`F:\Clone\edu_game\educational-games\src\games\block-master\Farmgame.html`

Xác định đầy đủ:

- Giao diện Farm.
- Các khu vực/ô đất.
- Cơ chế trồng cây.
- Hạt giống.
- Giai đoạn phát triển của cây.
- Thời gian sinh trưởng.
- Tưới nước/chăm sóc nếu có.
- Thu hoạch.
- Coin/xu/phần thưởng.
- Inventory.
- Các vật phẩm.
- Animation/effect.
- Modal/popup.
- Nút thao tác.
- Logic game.
- Các biến state.
- LocalStorage hoặc dữ liệu đang lưu.
- Âm thanh nếu có.
- Responsive/mobile layout.
- Các asset đang được sử dụng.

**Phải giữ lại gameplay và trải nghiệm quan trọng của Farm HTML**, chỉ thay đổi cách triển khai từ HTML/JS sang React.

---

## 2. Làm lại `GardenPage.jsx` bằng React

File chính:

`F:\Clone\edu_game\educational-games\src\pages\user\GardenPage.jsx`

Chuyển toàn bộ UI và logic Farm cần thiết sang React.

Có thể tách component nếu cần, ví dụ:

```text
src/
├── pages/
│   └── user/
│       └── GardenPage.jsx
│
├── components/
│   └── garden/
│       ├── GardenHeader.jsx
│       ├── FarmGrid.jsx
│       ├── FarmPlot.jsx
│       ├── Crop.jsx
│       ├── SeedInventory.jsx
│       ├── GardenModal.jsx
│       └── ...
```

Không bắt buộc phải tách đúng cấu trúc trên; ưu tiên cấu trúc phù hợp với project hiện tại.

---

## 3. Tích hợp với hệ thống React hiện tại

Không làm Farm thành một hệ thống độc lập.

Phải tận dụng các hệ thống hiện có của project nếu đã có:

- User/profile.
- Avatar.
- Coin/xu.
- Level/XP.
- Inventory.
- Loadout.
- API.
- Authentication.
- Zustand/context/state management.
- React Query/SWR nếu project đang sử dụng.
- Toast/notification.
- Modal/component dùng chung.

Không tạo thêm một hệ thống quản lý user/coin/inventory riêng nếu project đã có sẵn.

---

## 4. Dữ liệu Farm

Nếu Farm HTML đang dùng dữ liệu hard-code hoặc LocalStorage thì chuyển sang state/data structure phù hợp với React.

Ưu tiên kiến trúc:

```text
UI React
   ↓
Garden state
   ↓
API / Store
   ↓
Database
```

Nếu API Farm chưa tồn tại thì:

1. Tạo cấu trúc state rõ ràng để UI hoạt động.
2. Không tự ý bịa endpoint API.
3. Để phần gọi API có cấu trúc dễ tích hợp backend sau này.
4. Nếu project đã có API tương ứng thì sử dụng API đó.

---

## 5. Gameplay

Các cơ chế đang có trong `Farmgame.html` phải được giữ lại nếu phù hợp, ví dụ:

- Chọn ô đất.
- Chọn hạt giống.
- Trồng cây.
- Cây phát triển theo thời gian.
- Chăm sóc cây.
- Thu hoạch.
- Nhận phần thưởng.
- Quản lý số lượng hạt giống.
- Kiểm tra điều kiện trồng.
- Hiển thị trạng thái từng ô.
- Các hiệu ứng khi thao tác.

Không đơn giản hóa Farm thành một giao diện tĩnh.

---

## 6. UI/UX

Thiết kế lại theo hướng **mobile-first**, vì hệ thống EduPlay hiện tại được sử dụng nhiều trên mobile.

Yêu cầu:

- Giao diện vui nhộn, phù hợp web học tập + game cho học sinh.
- Bo góc mềm.
- Card rõ ràng.
- Icon trực quan.
- CTA nổi bật.
- Không quá nhiều text.
- Khoảng cách touch đủ lớn.
- Có feedback rõ khi người dùng bấm.
- Animation vừa phải, không gây lag.
- Responsive tốt trên desktop/tablet/mobile.
- Không để nội dung bị che bởi bottom navigation hiện tại.
- Giữ visual language đồng bộ với trang Home của EduPlay.

### Định hướng visual

Có thể sử dụng:

- Xanh lá cho cây/cây trồng.
- Xanh trời cho môi trường.
- Vàng/cam cho coin và phần thưởng.
- Tím của EduPlay cho các CTA/chức năng chính.
- Background thiên nhiên/nông trại.
- Các icon/illustration dễ thương.

Không biến Farm thành giao diện admin/dashboard khô cứng.

---

## 7. Mobile UX

Trên mobile ưu tiên:

```text
Header
↓
Thông tin Farm / coin
↓
Khu vực Farm chính
↓
Thông tin cây đang chọn
↓
Kho hạt giống / vật phẩm
↓
Các thao tác
↓
Bottom Navigation
```

Farm phải dễ thao tác bằng một tay.

Các nút như:

- Trồng
- Tưới
- Thu hoạch
- Mua
- Chọn hạt giống

phải có vùng click đủ lớn.

---

## 8. Không phá code hiện tại

Trước khi sửa:

- Kiểm tra `GardenPage.jsx` hiện tại.
- Kiểm tra các import đang dùng.
- Kiểm tra routing.
- Kiểm tra component/layout cha.
- Kiểm tra state/store liên quan.
- Kiểm tra API liên quan.

Không xóa hoặc thay đổi các hệ thống khác nếu không cần thiết.

Đảm bảo:

```bash
npm run build
```

vẫn chạy thành công.

Không để:

- Import lỗi.
- Component không tồn tại.
- Reference asset sai.
- Runtime error.
- Warning nghiêm trọng.
- Route Farm bị hỏng.

---

## 9. Asset

Ưu tiên tái sử dụng asset hiện có trong project.

Nếu `Farmgame.html` đang tham chiếu asset nào thì kiểm tra asset đó trước khi tạo mới.

Không nhúng nguyên HTML cũ vào React.

Nếu cần chuyển animation hoặc SVG:

- Có thể chuyển thành React JSX.
- Có thể tách thành component.
- Giữ nguyên asset nếu có thể tái sử dụng.

---

## 10. Nguyên tắc quan trọng

### Không làm

```text
GardenPage.jsx
    ↓
iframe
    ↓
Farmgame.html
```

### Phải làm

```text
GardenPage.jsx
    ↓
React Components
    ↓
React State / Store
    ↓
API
```

Farm phải là **một tính năng React thực sự**, giống Farm trồng cây React hiện có trong hệ thống.

---

## 11. Kết quả mong muốn

Sau khi hoàn thành:

1. Vào route Farm → mở `GardenPage.jsx`.
2. Giao diện mới đẹp và hiện đại hơn.
3. Gameplay dựa trên `Farmgame.html` vẫn hoạt động.
4. Không còn phụ thuộc vào việc render `Farmgame.html`.
5. Farm tích hợp được với user/coin/inventory/avatar của EduPlay.
6. Hoạt động tốt trên mobile.
7. Có thể mở rộng thêm cây, hạt giống, đất, vật phẩm và nhiệm vụ sau này.
8. Không làm ảnh hưởng các trang/game React khác.

## Thứ tự thực hiện

```text
1. Đọc GardenPage.jsx
2. Đọc toàn bộ Farmgame.html
3. Phân tích gameplay + state + asset
4. Kiểm tra hệ thống React hiện tại
5. Thiết kế cấu trúc component
6. Chuyển UI sang React
7. Chuyển logic game sang React
8. Tích hợp state/API hiện có
9. Tối ưu mobile
10. Chạy build và sửa toàn bộ lỗi
```

**Quan trọng nhất:** Đừng chỉ copy giao diện HTML sang JSX. Hãy chuyển cả **logic Farm + state + gameplay** thành kiến trúc React có thể bảo trì và mở rộng lâu dài.
