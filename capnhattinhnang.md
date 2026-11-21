# Đặc Tả Tính Năng Nâng Cao - Hệ Thống EduPlay

## 1. Bản Đồ Nhiệt Điểm Mù (Knowledge Heatmap)
* **Vai trò sử dụng:** Giáo viên
* **Mục tiêu:** Nhận diện nhanh các lỗ hổng kiến thức chung của cả lớp thông qua trực quan hóa dữ liệu làm bài và chơi game, thay vì phải dò từng bài thủ công.
* **Mô tả chức năng:**
  * **Ma trận trực quan:** Hiển thị bảng nhiệt theo **Chủ đề / Kỹ năng / Câu hỏi** (trục ngang) và **Danh sách học sinh** (trục dọc) với 3 mức màu cảnh báo:
    * **Xanh lá:** Thành thạo (trả lời đúng nhanh, tỷ lệ chính xác cao).
    * **Vàng:** Cần lưu ý (trả lời đúng nhưng thời gian suy nghĩ lâu hoặc làm lại nhiều lần).
    * **Đỏ:** Điểm mù kiến thức (tỷ lệ làm sai cao).
  * **Phân tích chỉ số chi tiết:** Thống kê tỷ lệ làm sai và thời gian phản hồi trung bình cho từng dạng bài hoặc từng câu hỏi cụ thể trong trò chơi.
  * **Thẻ cảnh báo thông minh:** Tự động tổng hợp và hiển thị tóm tắt ngay đầu màn hình (ví dụ: *"Có 14/30 học sinh đang gặp khó khăn ở kỹ năng Phép chia có dư"*).

## 2. Kế Hoạch Can Thiệp 1 Chạm (1-Click Remediation Pack)
* **Vai trò sử dụng:** Giáo viên
* **Mục tiêu:** Tự động hóa quy trình giao bài bổ trợ cho nhóm học sinh yếu, giúp giáo viên tiết kiệm thời gian soạn bài lại từ đầu.
* **Mô tả chức năng:**
  * **Tạo gói ôn tập tức thì:** Liên kết trực tiếp từ **Bản Đồ Nhiệt Điểm Mù**. Giáo viên chỉ cần chọn nhóm học sinh đang ở vùng cảnh báo Đỏ/Vàng và nhấn nút **Tạo gói ôn tập 1 chạm**.
  * **Đóng gói nội dung tự động:** Hệ thống tự động trích xuất các câu hỏi cùng chủ đề ở mức độ cơ bản từ ngân hàng trò chơi để tạo thành một mini-game hoặc bài luyện tập ngắn (thời lượng 5–10 phút).
  * **Lập lịch nhắc ôn tập (Spaced Repetition):** Tự động thiết lập các mốc nhắc học sinh làm lại bài củng cố sau **3 ngày** và **7 ngày**, đồng thời gửi thông báo trực tiếp tới tài khoản của nhóm học sinh đó.

## 3. Chế Độ Sự Kiện & Thử Thách Theo Mùa (Seasonal Event & Quest Engine)
* **Vai trò sử dụng:** Admin (Quản trị hệ thống)
* **Mục tiêu:** Tạo không khí thi đua sôi nổi theo từng thời điểm trong năm học mà không cần can thiệp chỉnh sửa mã nguồn.
* **Mô tả chức năng:**
  * **Khởi tạo chiến dịch sự kiện:** Admin tạo các sự kiện giới hạn thời gian (ví dụ: *Tuần lễ Vui Toán*, *Ngày hội Đọc sách*, *Đua top Chăm chỉ đầu năm*), cấu hình thời gian bắt đầu/kết thúc và phạm vi áp dụng (toàn trường hoặc theo từng khối lớp).
  * **Cấu hình chuỗi nhiệm vụ & Phần thưởng giới hạn:** Thiết lập các cột mốc nhiệm vụ sự kiện (ví dụ: *Tích lũy 500 Sao trong tuần*, *Hoàn thành 5 trò chơi chủ đề*) để học sinh mở khóa **Huy hiệu sự kiện**, **Hạt giống cây quý** hoặc **Khung Avatar đặc biệt**.
  * **Điều khiển bật/tắt & Tổng kết tự động:** Hỗ trợ công tắc kích hoạt/tạm dừng sự kiện theo thời gian thực, tự động cập nhật bảng xếp hạng sự kiện và trao thưởng khi kết thúc chiến dịch.