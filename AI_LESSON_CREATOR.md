# ĐẶC TẢ TÍNH NĂNG: TẠO BÀI HỌC TỰ ĐỘNG BẰNG AI (AI LESSON CREATOR)

## 1. Mục tiêu
Xây dựng tính năng cho phép giáo viên/Admin nhập yêu cầu (Prompt) để AI tự động biên soạn một bài học hoàn chỉnh. Dữ liệu sinh ra phải tuân thủ đúng cấu trúc cơ sở dữ liệu hiện tại để có thể hiển thị ngay trên **trang xem bài học** có sẵn.

---

## 2. Luồng hoạt động (User Flow)
1. **Nhập yêu cầu (Input):** Giáo viên chọn `Môn học`, `Cấp học`, nhập `Chủ đề / Prompt yêu cầu` và chọn `Độ dài bài học` (Ngắn gọn / Tiêu chuẩn / Chuyên sâu).
2. **Sinh nội dung (AI Generation):** Backend gọi LLM API với chế độ **JSON Mode / Structured Outputs** để tạo cấu trúc bài học.
3. **Xem trước & Chỉnh sửa (Live Preview):** Giao diện chia đôi màn hình: bên trái cho phép giáo viên sửa lại chữ nếu muốn, bên phải hiển thị bản xem trước (Preview) sử dụng **chính Component hiển thị bài học hiện có của hệ thống**.
4. **Lưu & Xuất bản (Save):** Giáo viên bấm "Lưu bài học" để ghi dữ liệu vào Database như một bài học bình thường.

---

## 3. Cấu trúc dữ liệu JSON chuẩn (Output Schema từ AI)
Backend bắt buộc AI trả về định dạng JSON theo cấu trúc sau (hãy điều chỉnh tên trường cho khớp với bảng `api/lessons/` hiện tại của dự án):

```json
{
  "title": "Tên bài học hấp dẫn, rõ ràng",
  "grade_level": "Lớp 10",
  "subject": "Tin học",
  "estimated_time": "45 phút",
  "objectives": [
    "Mục tiêu kiến thức 1",
    "Mục tiêu kỹ năng 2"
  ],
  "sections": [
    {
      "heading": "1. Khái niệm cơ bản",
      "content": "Nội dung giải thích chi tiết (hỗ trợ định dạng Markdown hoặc HTML)...",
      "example": "Ví dụ minh họa thực tế dễ hiểu...",
      "key_takeaway": "Ghi nhớ cốt lõi của phần này"
    }
  ],
  "summary": "Tóm tắt toàn bộ bài học trong 3 gạch đầu dòng",
  "quick_quiz": [
    {
      "question": "Câu hỏi trắc nghiệm kiểm tra nhanh?",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correct_answer": "Đáp án A",
      "explanation": "Giải thích tại sao đáp án A đúng"
    }
  ]
}
```

---

## 4. Yêu cầu thiết kế Giao diện (Frontend UI)
Tích hợp vào trang **`Tạo bài học AI`** (nằm dưới nhóm `Nội dung` trên Sidebar Admin):

* **Khu vực nhập Prompt (Top / Left Panel):**
  * Dropdown chọn **Môn học** và **Cấp học** (lấy từ danh mục hiện có của hệ thống).
  * Ô nhập liệu lớn (`Textarea`) để nhập Prompt, kèm theo 3-4 nút **Gợi ý Prompt mẫu** (ví dụ: *"Soạn bài giảng kèm nhiều ví dụ thực tế"*, *"Soạn bài theo phong cách trò chơi hóa"*).
  * Nút bấm chính: **`✨ Tạo bài học với AI`** (có hiệu ứng Loading Skeleton trong lúc chờ AI viết bài).
* **Khu vực Xem trước & Chỉnh sửa (Preview Panel):**
  * Tái sử dụng **Component hiển thị bài học hiện có** của dự án để giáo viên thấy chính xác bài học sẽ hiển thị như thế nào với học sinh.
  * Cho phép giáo viên click trực tiếp vào từng đoạn văn bản để chỉnh sửa thủ công trước khi lưu.
  * Nút **`Lưu vào danh sách bài học`** và nút **`Tạo lại`** nếu chưa ưng ý.

---

## 5. Yêu cầu Backend API (`POST /api/ai/generate-lesson`)
* **Input:** `{ prompt, subject, gradeLevel, length }`
* **System Prompt mẫu cho Backend:**
  > "Bạn là một chuyên gia thiết kế chương trình giáo dục xuất sắc. Hãy soạn một bài giảng chi tiết, dễ hiểu, bám sát chương trình giáo dục và phù hợp với trình độ {gradeLevel} cho môn {subject}. Nội dung cần trình bày logic, có ví dụ thực tế sinh động. Bắt buộc trả về kết quả dưới định dạng JSON theo đúng schema được yêu cầu."
* **Xử lý lỗi:** Bắt lỗi nếu AI trả về sai định dạng JSON hoặc quá thời gian (timeout) và trả thông báo thân thiện về Frontend.
