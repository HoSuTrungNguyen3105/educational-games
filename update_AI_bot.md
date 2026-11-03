# TÍCH HỢP OLLAMA QWEN3:4B VÀO DỰ ÁN

## 1. Mục tiêu

Tích hợp AI chạy local bằng Ollama với model `qwen3:4b` vào dự án hiện tại.

Công nghệ:
- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB
- AI: Ollama – Qwen3:4b

Không sử dụng API Key trả phí. Không yêu cầu triển khai AI 24/7. AI chỉ cần hoạt động khi máy tính đang chạy Ollama.

## 2. Kiến trúc

Thiết kế luồng xử lý:

React Frontend → Backend Node.js → Ollama API → Qwen3:4b → Backend → React.

Thông tin kết nối mặc định:
- Ollama URL: `http://localhost:11434`
- Chat API: `http://localhost:11434/api/chat`
- Model: `qwen3:4b`

Frontend tuyệt đối không gọi trực tiếp Ollama. Mọi request AI phải đi qua Backend.

## 3. Yêu cầu Backend

- Kiểm tra cấu trúc dự án và cách tổ chức routes, controllers, services hiện tại.
- Tạo module AI riêng, không viết toàn bộ logic AI trong một file.
- Tạo service kết nối Ollama.
- Tạo API để Frontend gửi câu hỏi và nhận câu trả lời.
- Sử dụng biến môi trường:
  - `OLLAMA_BASE_URL=http://localhost:11434`
  - `OLLAMA_MODEL=qwen3:4b`
- Không hardcode thông tin cấu hình trong nhiều file.
- Có xử lý timeout, lỗi kết nối, model chưa được tải và Ollama chưa khởi động.
- Validate dữ liệu đầu vào, giới hạn độ dài prompt.
- Có thể hỗ trợ streaming để hiển thị câu trả lời từng phần nếu phù hợp với kiến trúc hiện tại.
- Không lưu API Key vì Ollama local không yêu cầu API Key.

## 4. Cấu hình AI

Sử dụng API `/api/chat` của Ollama.

Cấu hình:
- Model: `qwen3:4b`
- `stream: false` mặc định.
- `think: false` nếu phiên bản Ollama và model hỗ trợ, nhằm hạn chế suy nghĩ quá dài.
- System Prompt phải có thể tùy chỉnh theo từng chức năng.
- AI mặc định trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và đúng ngữ cảnh giáo dục.

Không tự ý fine-tune hoặc tải thêm model.

## 5. Tích hợp chức năng giáo dục

Thiết kế module để có thể mở rộng các chức năng:

### AI tạo đề
- Nhận môn học, lớp, chủ đề, số lượng câu hỏi và độ khó.
- Tạo câu hỏi trắc nghiệm hoặc tự luận.
- Sinh đáp án và lời giải.
- Trả dữ liệu JSON có cấu trúc rõ ràng.

### AI gia sư
- Học sinh đặt câu hỏi.
- AI giải thích kiến thức phù hợp với cấp học.
- Ưu tiên cách giải thích dễ hiểu và có ví dụ.

### AI nhận xét kết quả
- Nhận dữ liệu kết quả đã được Backend tính toán.
- Phân tích điểm mạnh, điểm yếu.
- Đưa ra gợi ý ôn tập.

Lưu ý: Backend phải chịu trách nhiệm chấm điểm, tính phần trăm và xếp loại. Không để AI tự quyết định điểm số chính thức.

## 6. Tích hợp Frontend

- Tạo service gọi các API AI của Backend.
- Tuân thủ cách gọi API và cấu trúc service hiện tại.
- Có trạng thái loading khi AI đang xử lý.
- Hiển thị câu trả lời rõ ràng.
- Xử lý lỗi khi AI không kết nối được.
- Ngăn người dùng gửi nhiều request liên tục ngoài ý muốn.
- Không để giao diện bị treo khi AI phản hồi chậm.
- Đồng bộ giao diện với style hiện tại của dự án.

## 7. Bảo mật và xử lý lỗi

- Không để lộ địa chỉ Ollama nội bộ cho người dùng trên trình duyệt.
- Không mở cổng Ollama trực tiếp ra Internet.
- Backend phải xác thực người dùng theo cơ chế hiện có.
- Kiểm tra quyền sử dụng từng chức năng AI.
- Giới hạn request và độ dài nội dung.
- Không thực thi nội dung do AI sinh ra như mã lệnh.
- Kiểm tra JSON AI trả về trước khi lưu MongoDB.
- Không tin tưởng tuyệt đối nội dung AI sinh ra.

## 8. Cấu hình môi trường và triển khai

Trong môi trường phát triển local:
- Backend kết nối Ollama bằng `http://localhost:11434`.
- Ollama phải được khởi động trước khi sử dụng chức năng AI.
- Không yêu cầu laptop phải chạy AI liên tục 24/7.

Đối với Backend triển khai trên Render:
- Không sử dụng `localhost:11434` trên Render để kết nối Ollama trên laptop.
- Khi Backend chạy trên Render, cần cấu hình địa chỉ AI có thể truy cập được từ máy chủ.
- Không tự ý mở Ollama ra Internet hoặc tạo endpoint công khai không có xác thực.
- Nếu chưa có AI Server từ xa, ghi rõ chức năng AI chỉ hoạt động trong môi trường local.

## 9. Kiểm tra sau khi hoàn thành

Thực hiện kiểm tra:

1. Backend kết nối thành công với Ollama.
2. Gửi câu hỏi `Xin chào` và nhận được câu trả lời.
3. AI trả lời bằng tiếng Việt.
4. AI không suy nghĩ quá dài với câu hỏi đơn giản.
5. Frontend gọi được API Backend.
6. Xử lý đúng khi Ollama chưa chạy.
7. Xử lý đúng khi model chưa tồn tại.
8. Kiểm tra các chức năng AI tạo câu hỏi và trả về JSON.
9. Đảm bảo các chức năng hiện tại của dự án không bị ảnh hưởng.

## 10. Nguyên tắc thực hiện

- Đọc và phân tích toàn bộ cấu trúc dự án trước khi chỉnh sửa.
- Tận dụng các service, middleware, context và component đang có.
- Không tạo thêm file hoặc chức năng trùng lặp.
- Không tự ý thay đổi kiến trúc hiện tại.
- Không xóa hoặc sửa các chức năng không liên quan.
- Code rõ ràng, dễ bảo trì và có xử lý lỗi đầy đủ.
- Sau khi hoàn thành, liệt kê các file đã tạo, file đã sửa, cách cấu hình và cách chạy AI.

**Mục tiêu cuối cùng:** Tích hợp Qwen3:4b qua Ollama thành một dịch vụ AI dùng chung trong dự án, để các chức năng giáo dục có thể gọi lại mà không phải viết logic kết nối AI nhiều lần.