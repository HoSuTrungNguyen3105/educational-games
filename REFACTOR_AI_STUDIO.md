# KẾ HOẠCH TÁCH CHỨC NĂNG & NÂNG CẤP TRANG AI STUDIO (EDUPLAY ADMIN)

## 1. Mục tiêu tái cấu trúc (Refactoring)
Hiện tại trên Sidebar mục `AI`, trang **`AI Studio`** đang chứa chức năng tạo bài học (đặt sai tên). Cần thực hiện tách bạch 2 luồng chức năng:
1. **Tách chức năng tạo bài học hiện tại** sang một menu mới phù hợp hơn dưới nhóm `Nội dung`.
2. **Xây dựng lại trang `AI Studio`** trở thành trung tâm cấu hình hành vi Gia sư AI (RAG) và quản lý tri thức ưu tiên.

---

## 2. Chi tiết các bước thực hiện

### Bước 1: Tách và đổi tên trang Tạo bài học hiện tại
- **Thay đổi trên Sidebar (Nhóm `Nội dung`):**
  - Tạo menu mới tên là **`Tạo bài học AI`** (hoặc **`Soạn bài học`**), đặt ngay phía trên mục `Soạn tài liệu`.
  - Di chuyển toàn bộ giao diện, component và logic tạo bài học đang nằm ở `AI Studio` cũ sang route mới này (ví dụ: `/admin/ai-lesson-creator`).
  - Giữ nguyên toàn bộ tính năng tạo bài học hiện có, không làm mất dữ liệu hay luồng hoạt động cũ.

### Bước 2: Xây dựng lại nội dung cho trang `AI Studio` (`/admin/ai-studio`)
Giữ nguyên tên **`AI Studio`** trong nhóm `AI` trên Sidebar (cùng với `Phân tích AI` và `Lịch sử hỏi AI`), sau đó xây dựng giao diện gồm **3 Tab chức năng chính**:

#### Tab 1: Cấu hình hành vi Gia sư AI (Prompt & Guardrails)
- **Bộ chọn Cấp học & Môn học:** Cho phép Admin chọn cấu hình riêng cho từng cấp (*Tiểu học, THCS, THPT, Đại học*) hoặc áp dụng mặc định cho toàn hệ thống.
- **Trình soạn thảo System Prompt:** Khung nhập liệu quy định cách AI giao tiếp với học sinh (ví dụ: *"Chỉ gợi ý phương pháp giải, không đưa ra đáp án cuối cùng"*). Kèm các nút chèn biến nhanh như `{ten_mon_hoc}`, `{cap_hoc}`, `{ten_bai_hoc}`.
- **Thanh trượt Temperature (Độ sáng tạo):** Giới hạn từ `0.0` (bám sát 100% tài liệu) đến `0.5` (linh hoạt lấy thêm ví dụ).
- **Các công tắc kiểm soát (Toggles):**
  - `Chỉ trả lời trong phạm vi bài học hiện tại` (Bật/Tắt).
  - `Bắt buộc trích dẫn số trang / mốc thời gian video` (Bật/Tắt).
  - `Từ chối trả lời các câu hỏi ngoài lề không có trong giáo trình` (Bật/Tắt).

#### Tab 2: Vá lỗi nóng & Đính chính kiến thức (Knowledge Override)
- **Mục đích:** Sửa nhanh các kiến thức bị sai trong giáo trình mà chưa kịp chỉnh sửa lại file Word/PowerPoint gốc.
- **Giao diện:**
  - Form nhập nhanh gồm: Chọn `Môn học`, `Cấp học`, `Câu hỏi / Chủ đề cần đính chính`, và `Nội dung kiến thức chuẩn xác`.
  - Danh sách các bản ghi đính chính đang hoạt động (có nút Sửa / Xóa).
- **Logic Backend:** Khi lưu, hệ thống tạo embedding và lưu thẳng vào Vector DB với cờ `priority = 'high'`. Hệ thống RAG luôn ưu tiên truy xuất dữ liệu này trước tài liệu gốc.

#### Tab 3: Kiểm thử Gia sư AI (RAG Playground)
- Một khung chat thử nghiệm ngay bên trong `AI Studio` để Admin/Giáo viên hỏi thử sau khi chỉnh sửa System Prompt hoặc thêm nội dung đính chính.
- Hiển thị rõ dưới câu trả lời: AI đã lấy thông tin từ đoạn tài liệu nào (Chunk nào), độ tương đồng (Score) là bao nhiêu để Admin dễ dàng kiểm tra độ chính xác.

---

## 3. Liên kết đồng bộ với các trang hiện có
- **Trang `Lịch sử hỏi AI`:** Thêm nút `Dạy lại AI` ở các câu trả lời bị đánh giá kém (`👎`), khi bấm vào sẽ đẩy dữ liệu sang **Tab 2 (Đính chính kiến thức)** của `AI Studio`.
