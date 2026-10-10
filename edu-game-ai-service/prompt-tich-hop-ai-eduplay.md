# PROMPT: Tích hợp chức năng AI vào nền tảng Lớp Học Vui – EduPlay

## Vai trò

Bạn là Senior Full-Stack Developer có kinh nghiệm với React, Java/Spring Boot, tích hợp LLM và thiết kế sản phẩm EdTech cho học sinh. Hãy khảo sát codebase hiện tại trước khi sửa và triển khai chức năng AI phù hợp với kiến trúc sẵn có.

## 1. Mục tiêu

Tích hợp **AI Bạn Học** vào EduPlay để hỗ trợ học sinh học thông qua game, đặc biệt là giải thích câu trả lời sai và hướng dẫn học sinh tự tìm ra đáp án.

AI cần thân thiện, dễ hiểu, phù hợp lứa tuổi học sinh, ưu tiên gợi ý từng bước thay vì đưa đáp án ngay lập tức.

## 2. Phạm vi triển khai ưu tiên

### Giai đoạn 1 — AI Bạn Học

Tạo giao diện chat AI có thể mở từ nút nổi ở góc dưới bên phải màn hình:

- Giao diện thân thiện, phù hợp với phong cách EduPlay.
- Có lời chào và các câu hỏi gợi ý như:
  - “Giải thích giúp mình bài này nhé!”
  - “Cho mình một bài tương tự để luyện tập.”
  - “Mình nên học chủ đề nào tiếp theo?”
- Giữ ngữ cảnh hội thoại trong phạm vi phiên phù hợp.
- Có nút đóng/mở, trạng thái loading, thông báo lỗi và gửi lại.
- Không che các nút quan trọng của game; hỗ trợ màn hình desktop và mobile.
- Không bắt buộc đăng nhập để xem giao diện, nhưng các dữ liệu cá nhân và lịch sử học phải tuân theo cơ chế xác thực hiện có.

### Giai đoạn 2 — Gợi ý học tập cá nhân hóa

Chỉ triển khai sau khi xác định được dữ liệu học tập thực tế hiện có:

- Gợi ý game/chủ đề dựa trên lịch sử làm bài và các chủ đề học sinh thường sai.
- Đề xuất một mục tiêu học tập ngắn mỗi ngày.
- Không tự bịa điểm số, lịch sử hoặc năng lực nếu hệ thống chưa lưu dữ liệu tương ứng.
- Nếu chưa có dữ liệu, đưa ra gợi ý chung và nói rõ đây là gợi ý ban đầu.

## 3. Backend và tích hợp LLM

Trước khi viết code, kiểm tra backend AI hiện có và tái sử dụng endpoint/service đã triển khai nếu phù hợp.

Nếu dự án đang dùng Java/Spring Boot AI Service:

- Tích hợp qua backend, không gọi trực tiếp nhà cung cấp LLM từ frontend.
- API key phải nằm trong biến môi trường/cấu hình server, tuyệt đối không hard-code hoặc gửi xuống client.
- Xác thực người dùng theo cơ chế hiện tại.
- Kiểm tra và giới hạn kích thước đầu vào, độ dài câu trả lời, tần suất yêu cầu và thời gian chờ.
- Xử lý lỗi từ nhà cung cấp LLM; trả về lỗi có cấu trúc, không làm lộ API key, prompt nội bộ, stack trace hoặc thông tin nhạy cảm.
- Dùng DTO/schema rõ ràng, thống nhất với convention API hiện tại.
- Không tạo endpoint trùng với endpoint đang tồn tại.
- Nếu AI Service hiện tại chưa có chức năng cần thiết, đề xuất phần thiếu trước khi mở rộng.

Frontend:

- Sử dụng JavaScript/JSX, không chuyển sang TypeScript.
- Tái sử dụng API wrapper, auth, toast, router và component hiện có.
- Không thêm thư viện mới nếu không thực sự cần thiết.
- Không làm thay đổi contract của các API game/câu hỏi hiện có.

## 4. Nguyên tắc về dữ liệu và đáp án

- Không thay đổi cấu trúc database của `games` và `templates`.
- Không thay đổi cấu trúc dữ liệu câu hỏi/đáp án hiện tại.
- Không thay đổi cách game chấm điểm hoặc cập nhật tiến độ.
- AI chỉ hỗ trợ giải thích và luyện tập; backend hiện tại vẫn là nguồn xác thực chính thức cho đáp án, điểm thưởng, xu, thành tích và vật phẩm.
- Không cho AI tự cập nhật điểm, xu, cấp độ, thành tích hoặc mở khóa vật phẩm.
- Chỉ gửi dữ liệu tối thiểu cần thiết tới mô hình AI; không gửi thông tin cá nhân không cần thiết.
- Không để AI tiết lộ đáp án đúng trước khi học sinh thử trả lời, trừ khi luồng sản phẩm hiện tại cho phép hiển thị lời giải.
- Nếu frontend không được phép biết đáp án đúng, backend phải thực hiện việc kiểm tra và xây dựng ngữ cảnh giải thích phù hợp.

## 5. Phong cách phản hồi của AI

Prompt hệ thống dành cho AI Bạn Học cần tuân thủ:

- Nói tiếng Việt tự nhiên, thân thiện, ngắn gọn, phù hợp với học sinh.
- Giải thích theo từng bước; dùng ví dụ gần gũi.
- Khuyến khích học sinh tự suy nghĩ, không chê bai khi trả lời sai.
- Với câu hỏi học thuật, nếu thiếu thông tin thì hỏi lại hoặc nêu rõ giả định.
- Không bịa dữ kiện, không khẳng định đáp án khi không đủ thông tin.
- Khi học sinh trả lời sai: chỉ ra điểm cần xem lại, đưa gợi ý trước, sau đó mới giải thích đầy đủ nếu được yêu cầu.
- Từ chối lịch sự các yêu cầu không phù hợp và đưa cuộc trò chuyện quay lại mục đích học tập.
- Không yêu cầu học sinh cung cấp địa chỉ, mật khẩu, số điện thoại hoặc thông tin riêng tư.

## 6. Trải nghiệm lỗi và an toàn

- AI không khả dụng thì game vẫn chơi bình thường.
- Hiển thị thông báo dễ hiểu và nút thử lại.
- Chống gửi liên tục bằng loading/disable nút và giới hạn tần suất phía backend.
- Không render HTML tùy ý do AI tạo ra; hiển thị câu trả lời dưới dạng text/Markdown đã được kiểm soát.
- Không thực thi code, script hoặc nội dung do AI trả về.
- Tránh lưu hội thoại chứa thông tin cá nhân không cần thiết.
- Thêm kiểm thử cho trường hợp thành công, đầu vào không hợp lệ, chưa xác thực (nếu cần), lỗi LLM, timeout và phản hồi rỗng.

## 7. Quy trình làm việc bắt buộc

1. Khảo sát cấu trúc repository, trang chủ, component game, luồng kết quả câu hỏi, API wrapper và AI Service hiện có.
2. Tóm tắt kiến trúc hiện tại và xác định những file cần sửa/thêm.
3. Kiểm tra endpoint, request/response DTO và các bài test đã có để tránh viết trùng.
4. Lập kế hoạch thay đổi ngắn gọn, giữ phạm vi triển khai ưu tiên ở Giai đoạn 1.
5. Triển khai theo từng phần nhỏ, tận dụng component/service sẵn có.
6. Chạy test/build phù hợp với repository; sửa lỗi phát sinh do thay đổi.
7. Báo cáo file đã sửa/thêm, API đã dùng, biến môi trường cần thiết và kết quả kiểm thử.
8. Nếu thiếu thông tin hoặc có quyết định ảnh hưởng contract/dữ liệu, dừng ở bước phân tích và nêu rõ câu hỏi; không tự ý thay đổi cấu trúc dữ liệu.

## 8. Tiêu chí hoàn thành

- [ ] Trang chủ vẫn hoạt động và giữ layout không có sidebar trái.
- [ ] Banner hero full-width và danh sách game vẫn hiển thị đúng.
- [ ] Học sinh có thể yêu cầu AI giải thích câu trả lời sai.
- [ ] Có trạng thái loading, lỗi và thử lại.
- [ ] Lỗi AI không làm hỏng luồng chơi game.
- [ ] Frontend dùng JavaScript/JSX, không dùng TypeScript.
- [ ] Không lộ API key và không gọi LLM trực tiếp từ frontend.
- [ ] Không thay đổi cấu trúc `games`, `templates` hoặc contract câu hỏi hiện có.
- [ ] Đã chạy kiểm thử/build phù hợp và báo cáo kết quả trung thực.

**Yêu cầu quan trọng:** Không viết lại toàn bộ dự án. Trước tiên hãy đọc code hiện tại, tận dụng những gì đã có và chỉ sửa những phần thực sự cần thiết. Ưu tiên triển khai MVP “AI giải thích câu trả lời sai” trước; chỉ mở rộng sang các chức năng khác sau khi MVP hoạt động ổn định.
