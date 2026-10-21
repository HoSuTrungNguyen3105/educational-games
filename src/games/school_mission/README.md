# Trường Vui Vẻ

Mở `index.html` bằng trình duyệt (double-click) là chơi được, không cần cài gì.

## Cấu trúc
| File | Việc của nó |
|---|---|
| `data/questions.js` | **Câu hỏi, bài thi, thưởng, năng lượng** — file bạn sửa nhiều nhất |
| `data/schedule.js` | **Thời khóa biểu**, giờ vào lớp sớm/muộn, bật/tắt chế độ chỉ học đúng giờ |
| `js/schedule.js` | Đồng hồ, chuông báo, hộp thoại "Đến giờ học", bảng 📅 Thời khóa biểu, chế độ DEMO |
| `js/config.js` | Vị trí các tòa nhà, lớp học, bàn ghế, NPC, đồ trong cửa hàng, nhiệm vụ ngày |
| `js/state.js` | Dữ liệu người chơi (xu, cấp, đồ đã mua), tự lưu localStorage |
| `js/data.js` | Nạp và kiểm tra lỗi dữ liệu câu hỏi |
| `js/questions.js` | Tạo câu hỏi (toán ngẫu nhiên, từ vựng, quiz) |
| `js/ui.js` | Thông báo, hộp thoại, cộng thưởng |
| `js/activities.js` | Bài học, bài thi, căng tin, cửa hàng, thể dục, thu hoa |
| `js/settings.js` | Nút ⚙️ Dữ liệu (sửa JSON ngay trong game) |
| `js/world.js` | Chuyển cảnh, va chạm, vùng tương tác, cập nhật mỗi khung hình |
| `js/input.js` | Bàn phím + joystick cảm ứng |
| `js/characters.js` | Vẽ nhân vật |
| `js/scenes.js` | Vẽ sân trường, hành lang, lớp học |
| `js/render.js` | Camera và vẽ toàn cảnh |
| `js/main.js` | Khởi động, vòng lặp game |
| `css/style.css` | Giao diện HUD, nút, hộp thoại |

## Muốn thêm gì?
- **Thêm câu hỏi/bài thi:** sửa `data/questions.js`.
- **Thêm công trình mới:** thêm vào `P` trong `config.js`, vẽ ở `scenes.js` (`drawOut`), thêm vùng tương tác trong `ZN()` ở `world.js`.
- **Thêm môn/lớp mới:** thêm vào `RM`, `KS`, `DX` trong `config.js`, thêm môn trong `questions.js` dữ liệu, thêm nhiệm vụ vào `QU`.
- **Thêm hoạt động mới:** viết hàm trong `activities.js`, gọi từ `ZN()`.

Lưu ý: các file dùng chung biến toàn cục nên thứ tự `<script>` trong `index.html` phải giữ nguyên.

## Thời khóa biểu
- Sửa lịch trong `data/schedule.js` (hàm `addPeriod`). Bài thi dùng `examId` lấy từ `data/questions.js`.
- Thử nhanh: bấm 📅 → **Bật DEMO**, hoặc đặt `localStorage.tvv_sim_time="08:00"` để giả lập giờ.
- `allowFreePractice:false` = chỉ được học/thi đúng giờ theo lịch.
- Nút **← Thoát** gửi `postMessage({type:"quit"})` cho trang cha (khi nhúng iframe), nếu không thì quay lại trang trước.
