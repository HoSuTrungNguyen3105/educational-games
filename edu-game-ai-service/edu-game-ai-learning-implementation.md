# Kế hoạch triển khai AI hỗ trợ học tập cho Edu Game

## 1. Mục tiêu

Tích hợp các chức năng AI vào hệ thống Edu Game hiện tại, tận dụng backend Java/Spring Boot đã có. **Không tạo lại dự án backend, không thay đổi cấu trúc database hiện tại nếu chưa thực sự cần thiết, không làm ảnh hưởng các API và luồng nghiệp vụ đang chạy.**

Các chức năng cần triển khai:

1. Chatbot AI hỗ trợ học tập.
2. AI tự động tạo câu hỏi trắc nghiệm.
3. AI phân tích kết quả học tập của học sinh.

Sử dụng Ollama làm nhà cung cấp mô hình AI, cấu hình qua biến môi trường. Biến `OLLAMA_KEY` hiện có trong `.env` phải được đọc từ cấu hình backend nếu endpoint đang sử dụng yêu cầu API key.

---

## 2. Nguyên tắc bắt buộc

- Trước khi code, kiểm tra cấu trúc dự án Java hiện tại, phiên bản Java/Spring Boot, cách tổ chức controller/service/repository/configuration và cơ chế xác thực.
- Tận dụng các module, DTO, entity, repository và API hiện có; không tự tạo bản sao chức năng đã tồn tại.
- Không thay đổi schema database, bảng `games`, `template` hoặc cấu trúc dữ liệu câu hỏi hiện tại nếu không có yêu cầu và chưa đánh giá ảnh hưởng.
- Không thay đổi hợp đồng API đang được frontend sử dụng. API AI mới nên được thêm độc lập.
- Không hardcode API key, endpoint, model name hoặc thông tin nhạy cảm.
- Không đưa `OLLAMA_KEY` về frontend, không ghi key vào log, response hoặc thông báo lỗi.
- Nếu `OLLAMA_KEY` không tồn tại hoặc để trống, xử lý theo cấu hình endpoint thực tế: cho phép kết nối không cần key nếu server local không yêu cầu xác thực; nếu endpoint yêu cầu key thì trả lỗi cấu hình rõ ràng ở backend, không làm ứng dụng khởi động hỏng ngoài ý muốn.
- Không giả định mọi Ollama endpoint đều yêu cầu API key. Xác minh URL triển khai thực tế; Ollama local thường có thể không cần key, trong khi dịch vụ/proxy từ xa có thể yêu cầu.
- AI chỉ hỗ trợ tạo nội dung và phân tích; backend vẫn là nơi xác thực, phân quyền, kiểm tra dữ liệu và quyết định ghi database.
- Không để AI tự ý sửa điểm, cấp thưởng, thay đổi tiến độ hoặc thực hiện thao tác quan trọng.
- Tất cả phản hồi từ AI đều là dữ liệu chưa đáng tin cậy: cần kiểm tra cấu trúc, giới hạn độ dài, validate kiểu dữ liệu và xử lý lỗi.
- Bổ sung timeout, giới hạn request, giới hạn kích thước input/output, xử lý lỗi và log kỹ thuật không chứa bí mật.
- Nếu chưa đủ thông tin về cấu trúc dự án hoặc dữ liệu học tập, ưu tiên khảo sát code hiện có rồi mới đề xuất phần tích hợp tối thiểu; không tự đoán tên bảng/field/API.

---

## 3. Khảo sát codebase trước khi triển khai

Kiểm tra và ghi nhận:

- Backend Java nằm ở đâu, phiên bản Java và Spring Boot.
- Cấu trúc package hiện tại: controller, service, repository, entity/model, DTO, config, security.
- Cơ chế đăng nhập và lấy ID người dùng hiện tại.
- Các API hiện có liên quan đến môn học, câu hỏi, game, lượt chơi, kết quả và điểm số.
- Database và cách truy vấn dữ liệu kết quả học tập.
- File `.env`, cách load biến môi trường trong lúc chạy và triển khai.
- Frontend hiện gọi API theo convention nào, cấu trúc response, quy tắc xử lý lỗi.
- Ollama endpoint, model đang cài/được cấp quyền sử dụng, cách xác thực và định dạng API thực tế.

Sau khảo sát, lập danh sách file cần thêm/sửa và giải thích ngắn gọn. Không sửa các module không liên quan.

---

## 4. Kiến trúc đề xuất

Luồng tổng quát:

```text
Frontend hiện tại
    |
    v
Java Spring Boot
    |
    +-- AI Chat API
    |      +-- xác thực người dùng
    |      +-- lấy lịch sử chat nếu hệ thống đã hỗ trợ
    |      +-- gọi Ollama
    |
    +-- AI Quiz Generation API
    |      +-- kiểm tra đầu vào
    |      +-- tạo prompt
    |      +-- gọi Ollama
    |      +-- parse và validate JSON
    |      +-- trả câu hỏi hoặc lưu qua service hiện có
    |
    +-- AI Learning Analysis API
           +-- truy vấn kết quả thật từ database qua service/repository hiện có
           +-- tính toán các chỉ số bằng Java
           +-- gửi số liệu đã tổng hợp cho Ollama diễn giải
           +-- trả nhận xét và gợi ý ôn tập

Ollama
    |
    v
LLM đang được cấu hình
```

Không bắt buộc phải dùng RAG ở giai đoạn đầu. Với chatbot chỉ giải đáp dựa trên prompt chung thì có thể gọi LLM trực tiếp. Khi cần trả lời theo giáo trình/tài liệu riêng của hệ thống, thiết kế thêm RAG như phần 9.

---

## 5. Cấu hình Ollama và biến môi trường

Đọc cấu hình bằng cơ chế cấu hình chuẩn của Spring Boot. Không commit file `.env` chứa secret.

Ví dụ `.env.example` (chỉ là mẫu, cần chỉnh endpoint/model theo môi trường thực tế):

```dotenv
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=your-model-name
OLLAMA_KEY=
```

Yêu cầu:

- `OLLAMA_BASE_URL`: URL Ollama hoặc gateway/proxy được cấp.
- `OLLAMA_MODEL`: tên model có sẵn ở endpoint.
- `OLLAMA_KEY`: API key nếu endpoint yêu cầu; không phải Ollama local nào cũng cần key.
- `.env.example` chỉ chứa giá trị giả lập, không có key thật.
- Xác minh cách dự án đang nạp `.env`. Spring Boot không tự động đọc file `.env` trong mọi cấu hình; nếu dự án đã có cách nạp env thì tái sử dụng, nếu chưa có thì cấu hình qua biến môi trường của hệ điều hành/IDE/Docker hoặc bổ sung cách nạp phù hợp.
- Nếu Ollama API tương thích endpoint chat, sử dụng endpoint và request schema đúng với phiên bản/dịch vụ đang chạy. Không giả định endpoint từ xa giống hoàn toàn Ollama local.
- Ưu tiên dùng HTTP client/thư viện đã có trong dự án. Nếu cần thêm dependency, giải thích lý do và tương thích với phiên bản Spring Boot/Java hiện tại.
- Đặt connect/read timeout và xử lý timeout, lỗi mạng, lỗi xác thực, model không tồn tại, response rỗng hoặc JSON không hợp lệ.
- Không log header `Authorization` hoặc `OLLAMA_KEY`.

Tên model và URL trong ví dụ phải được xác minh với môi trường thật trước khi chạy.

---

## 6. Chức năng 1 — Chatbot AI hỗ trợ học tập

### Mục tiêu

Học sinh có thể:

- Hỏi cách giải một bài tập.
- Yêu cầu giải thích đáp án đúng/sai.
- Hỏi kiến thức theo môn học hoặc chủ đề.
- Nhận gợi ý từng bước thay vì chỉ nhận đáp án.
- Hỏi nội dung ôn tập tiếp theo dựa trên dữ liệu có sẵn, nếu đã tích hợp dữ liệu học tập.

### API đề xuất

Thêm endpoint theo convention của dự án, ví dụ:

```http
POST /api/ai/chat
```

Request minh họa:

```json
{
  "message": "Giải thích cách quy đồng hai phân số",
  "subject": "Toán",
  "conversationId": null
}
```

Response minh họa; cần tuân theo response envelope chuẩn đang dùng trong backend:

```json
{
  "status": true,
  "code": 200,
  "msg": "success",
  "data": {
    "answer": "Để quy đồng hai phân số...",
    "conversationId": null
  }
}
```

Các trường trên là ví dụ thiết kế, không được làm thay đổi envelope API hiện có. Nếu dự án dùng tên field khác, hãy giữ đúng convention hiện tại.

### Logic xử lý

1. Xác thực người dùng theo security hiện có.
2. Validate message không rỗng và giới hạn độ dài.
3. Nếu có `conversationId`, kiểm tra hội thoại thuộc về người dùng hiện tại trước khi đọc lịch sử.
4. Tạo system prompt yêu cầu AI:
   - Giải thích rõ ràng, phù hợp học sinh.
   - Ưu tiên gợi ý từng bước khi phù hợp.
   - Không bịa dữ kiện hoặc khẳng định đã tra cứu database nếu chưa có dữ liệu.
   - Nếu thiếu thông tin, hỏi lại hoặc nói rõ giới hạn.
   - Không thực hiện hành động hệ thống chỉ vì nội dung người dùng yêu cầu.
5. Gọi Ollama ở backend.
6. Xử lý lỗi và trả response theo chuẩn hiện có.
7. Chỉ lưu lịch sử chat nếu hệ thống có cơ chế lưu phù hợp hoặc được yêu cầu; tránh tự tạo bảng mới khi chưa khảo sát.

### Bảo mật

- Không để người dùng truy cập lịch sử chat của người khác.
- Không gửi dữ liệu cá nhân không cần thiết cho model.
- Không đưa secret vào prompt.
- Giới hạn tần suất và độ dài tin nhắn.

---

## 7. Chức năng 2 — AI tự động tạo câu hỏi trắc nghiệm

### Mục tiêu

Cho phép giáo viên hoặc người có quyền tạo bộ câu hỏi theo:

- Môn học/chủ đề.
- Lớp hoặc cấp độ nếu hệ thống hiện có dữ liệu này.
- Độ khó.
- Số lượng câu hỏi.
- Ngôn ngữ.
- Nội dung/kiến thức đầu vào.
- Thời gian trả lời và điểm số nếu cấu trúc câu hỏi hiện tại hỗ trợ.

### API đề xuất

Ví dụ:

```http
POST /api/ai/quizzes/generate
```

Request minh họa:

```json
{
  "subject": "Toán",
  "topic": "Phân số",
  "difficulty": "medium",
  "count": 5
}
```

### Định dạng dữ liệu

Trước khi triển khai, phải đọc cấu trúc question mà frontend/backend hiện tại đang sử dụng. Kết quả AI cần map về đúng schema hiện hữu, ví dụ hệ thống có thể đang dùng các field:

- `content`
- `options`
- `correctAnswer`
- `timeLimit`
- `points`

Đây chỉ là các field ví dụ đã được dùng trong định hướng sản phẩm; phải xác minh tên, kiểu và quy tắc thực tế trong code trước khi áp dụng. Không tự ý thay đổi cấu trúc trả về của API câu hỏi.

### Logic xử lý

1. Kiểm tra quyền giáo viên/admin hoặc quyền tạo nội dung phù hợp.
2. Validate `count` và giới hạn số câu tối đa mỗi request.
3. Gửi prompt yêu cầu Ollama trả về JSON đúng schema.
4. Parse JSON; không dùng nguyên văn phản hồi AI làm dữ liệu database.
5. Kiểm tra:
   - Đủ số câu hoặc trả lỗi/ghi rõ số câu hợp lệ.
   - Nội dung câu hỏi không rỗng.
   - Số lượng và kiểu `options` đúng quy định hiện có.
   - `correctAnswer` trỏ tới đáp án hợp lệ theo schema thật.
   - `timeLimit`, `points` hợp lệ nếu được yêu cầu.
   - Không có field thừa nguy hiểm hoặc sai kiểu.
6. Nếu JSON lỗi, thử sửa/parse lại có giới hạn; không lặp vô hạn.
7. Mặc định trả bản nháp để giáo viên xem và chỉnh sửa trước khi lưu.
8. Chỉ lưu câu hỏi thông qua service nghiệp vụ hiện có sau khi đã validate và có quyền phù hợp.
9. Không để AI tự gán điểm cho học sinh hoặc tự sửa dữ liệu kết quả học tập.

### Response minh họa

Giữ envelope response hiện có; phần `data` có thể chứa danh sách câu hỏi đã được validate. Không lưu tự động nếu người dùng chưa xác nhận hoặc chưa có luồng nghiệp vụ cho phép.

### Tiêu chí chất lượng

- Câu hỏi bám sát chủ đề và mức độ yêu cầu.
- Chỉ có một đáp án đúng nếu loại câu hỏi hiện tại yêu cầu một đáp án.
- Các phương án nhiễu hợp lý, không trùng lặp vô nghĩa.
- Không đưa đáp án đúng vào nội dung câu hỏi một cách lộ liễu.
- Giáo viên có thể chỉnh sửa trước khi phát hành.

---

## 8. Chức năng 3 — AI phân tích kết quả học tập của học sinh

### Mục tiêu

Cung cấp báo cáo hỗ trợ giáo viên/học sinh về:

- Điểm trung bình hoặc chỉ số tương ứng mà hệ thống hiện có.
- Tỷ lệ trả lời đúng.
- Chủ đề làm tốt và chủ đề còn yếu.
- Xu hướng tiến bộ theo thời gian, nếu dữ liệu đủ.
- Gợi ý nội dung ôn tập hoặc câu hỏi luyện tập tiếp theo.

### API đề xuất

Ví dụ:

```http
POST /api/ai/learning-analysis
```

Request chỉ nên nhận các bộ lọc cần thiết theo quyền truy cập, chẳng hạn `studentId`, khoảng thời gian hoặc môn học. Backend phải xác minh quyền truy cập `studentId`; không tin ID do client gửi.

### Logic xử lý

1. Xác thực người dùng và kiểm tra quyền xem kết quả.
2. Lấy kết quả học tập từ database qua repository/service hiện có.
3. Tính các chỉ số có thể tính chính xác bằng Java, chẳng hạn số lượt làm, số câu đúng, tỷ lệ đúng và điểm trung bình theo công thức thực tế của hệ thống.
4. Chỉ gửi số liệu tối thiểu cần thiết cho Ollama để diễn giải.
5. Yêu cầu LLM trả về nhận xét, điểm mạnh, phần cần cải thiện và gợi ý ôn tập theo cấu trúc xác định.
6. Validate output, xử lý trường hợp dữ liệu ít hoặc không đủ để kết luận.
7. Trả kết quả theo response envelope hiện tại.

### Nguyên tắc quan trọng

- **Java/database là nguồn dữ liệu sự thật; LLM chỉ diễn giải.**
- Không để LLM tự tính hoặc bịa ra điểm số chính thức.
- Không cho AI tự cập nhật điểm, kết quả, phần thưởng hoặc trạng thái học tập.
- Không kết luận học sinh yếu ở một chủ đề nếu dữ liệu không đủ.
- Chỉ người dùng có quyền mới được xem phân tích chi tiết của học sinh.
- Không gửi thông tin định danh nhạy cảm cho LLM nếu không cần thiết.

### Response gợi ý

Có thể thiết kế `data` với các nhóm như `summary`, `strengths`, `areasToImprove`, `recommendations`; phải thống nhất với frontend trước khi chốt DTO. Các field này là đề xuất mới, không phải schema đã tồn tại.

---

## 9. RAG — mở rộng chatbot bằng tài liệu riêng

RAG không bắt buộc cho phiên bản đầu. Hãy thêm khi chatbot cần trả lời dựa trên giáo trình, tài liệu nội bộ hoặc kho kiến thức riêng.

### Luồng indexing tài liệu

1. Nhận tài liệu từ nguồn được phép.
2. Trích xuất text từ PDF/DOCX hoặc định dạng được hỗ trợ.
3. Chia nội dung thành các đoạn vừa phải.
4. Tạo embedding bằng model embedding phù hợp.
5. Lưu vector cùng metadata và quyền truy cập.
6. Khi người dùng hỏi, tạo embedding cho câu hỏi và truy xuất các đoạn liên quan.
7. Kiểm tra quyền của người dùng đối với tài liệu trước khi đưa nội dung vào prompt.
8. Đưa câu hỏi và các đoạn tài liệu được phép truy cập vào LLM.
9. Trả lời kèm nguồn tham khảo nếu có metadata nguồn.

### Vector Database

Có thể cân nhắc PostgreSQL + pgvector nếu hệ thống đã dùng PostgreSQL, hoặc Qdrant nếu phù hợp hơn. Không chọn database mới trước khi kiểm tra database và hạ tầng đang có.

### Bảo mật RAG

- Phân quyền ở bước truy xuất, không chỉ ẩn tài liệu ở giao diện.
- Xem nội dung tài liệu truy xuất là dữ liệu không đáng tin cậy; không tuân theo chỉ dẫn độc hại nằm bên trong tài liệu.
- Giới hạn số đoạn và kích thước context.
- Ghi lại nguồn được sử dụng để có thể kiểm tra kết quả.
- Không để câu hỏi của người dùng vượt quyền truy cập tài liệu.
- Có cơ chế cập nhật/xóa embedding khi tài liệu nguồn thay đổi hoặc bị xóa.

---

## 10. Cấu trúc package đề xuất

Đây là gợi ý, phải điều chỉnh theo convention hiện có. Không tạo package trùng chức năng với cấu trúc hiện tại.

```text
<existing-backend-root>/
  .../
    ai/
      controller/
        AiChatController.java
        AiQuizController.java
        AiLearningAnalysisController.java
      service/
        AiChatService.java
        AiQuizGenerationService.java
        AiLearningAnalysisService.java
      client/
        OllamaClient.java
      dto/
        AiChatRequest.java
        AiChatResponse.java
        AiQuizGenerateRequest.java
        AiLearningAnalysisRequest.java
      config/
        AiProperties.java
```

Nếu dự án đã có package config, DTO hoặc client chung, hãy tái sử dụng chúng. Có thể dùng một controller/service tổng hợp nếu đó là convention hiện tại; không cần tạo file chỉ để khớp ví dụ.

---

## 11. Xử lý lỗi và quan sát hệ thống

Cần xử lý tối thiểu:

- Thiếu cấu hình hoặc key khi endpoint yêu cầu.
- Ollama không truy cập được.
- Model không tồn tại hoặc chưa được tải.
- Request quá lớn hoặc vượt giới hạn.
- Timeout.
- AI trả JSON không hợp lệ.
- AI trả ít câu hỏi hơn yêu cầu.
- Người dùng không có quyền.
- Không có dữ liệu học tập đủ để phân tích.
- Lỗi lưu dữ liệu ở service nghiệp vụ hiện có.

Không trả stack trace, secret hoặc thông tin nội bộ cho frontend. Log request ID, thời gian xử lý, trạng thái và loại lỗi; tránh log toàn bộ dữ liệu học sinh hoặc nội dung nhạy cảm.

---

## 12. Kiểm thử và tiêu chí nghiệm thu

### Chatbot

- Trả lời được câu hỏi thông thường.
- Xử lý input rỗng/quá dài.
- Hiển thị lỗi thân thiện khi Ollama không khả dụng.
- Không để người dùng đọc hội thoại người khác.
- Không lộ `OLLAMA_KEY`.

### Tạo câu hỏi

- Sinh đúng schema câu hỏi hiện tại.
- Validate đáp án và các field bắt buộc.
- Từ chối số lượng vượt giới hạn.
- Xử lý JSON lỗi hoặc output thiếu.
- Người không đủ quyền không thể tạo/lưu nội dung.
- Không làm hỏng API hoặc dữ liệu câu hỏi hiện có.

### Phân tích học tập

- Các chỉ số khớp với dữ liệu và công thức backend.
- ID học sinh được kiểm tra quyền.
- Dữ liệu rỗng được xử lý rõ ràng.
- LLM không được quyền thay đổi điểm hoặc kết quả.
- Không suy diễn quá mức khi dữ liệu không đủ.

### Tích hợp

- Build và test backend thành công.
- API cũ không bị thay đổi ngoài dự kiến.
- Frontend không cần biết hoặc giữ `OLLAMA_KEY`.
- Có hướng dẫn cấu hình local và môi trường deploy.
- Kiểm thử lỗi timeout, xác thực và phản hồi không hợp lệ.

---

## 13. Thứ tự triển khai

1. Khảo sát codebase và xác định Ollama endpoint/model thật.
2. Tạo cấu hình Ollama an toàn qua environment.
3. Xây dựng client gọi Ollama và kiểm thử kết nối độc lập.
4. Triển khai chatbot cơ bản.
5. Triển khai tạo câu hỏi trắc nghiệm và validate schema hiện tại.
6. Triển khai phân tích kết quả dựa trên dữ liệu thật.
7. Tích hợp giao diện frontend theo convention đang có.
8. Bổ sung RAG nếu cần tra cứu tài liệu riêng.
9. Bổ sung bộ kiểm thử bảo mật và đánh giá chất lượng AI.
10. Chạy regression test toàn hệ thống.

Ưu tiên hoàn thành từng chức năng theo chiều dọc (API, kiểm thử, giao diện) trước khi chuyển sang chức năng tiếp theo.

---

## 14. Yêu cầu đầu ra khi thực hiện

Sau khi triển khai, cung cấp:

- Danh sách file được thêm/sửa.
- Giải thích ngắn về trách nhiệm từng file.
- Danh sách endpoint mới và ví dụ request/response.
- Cấu hình environment cần thiết, không hiển thị key thật.
- Kết quả build và test thực tế.
- Các giới hạn đã biết của model/Ollama.
- Hướng dẫn chạy local và deploy.
- Xác nhận các API, schema và luồng nghiệp vụ hiện có được giữ nguyên; nếu có điểm buộc phải thay đổi, phải nêu rõ trước khi thực hiện.

**Không chỉ tạo skeleton rỗng hoặc TODO.** Hãy triển khai theo cấu trúc thực tế của repository, viết logic có thể chạy, kiểm thử và xử lý lỗi phù hợp. Nếu thiếu thông tin quan trọng, hãy khảo sát dự án trước, không tự bịa tên bảng, API hoặc cấu trúc dữ liệu.
