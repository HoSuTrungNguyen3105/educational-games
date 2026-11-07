# YÊU CẦU CHUYỂN EDITOR THIỆP CƯỚI THÀNH EDUPLAY AI STUDIO
## Tài liệu mô tả UI/UX, tính năng, kiến trúc định hướng và hướng dẫn triển khai cho AI Coding Agent

> **Mục đích:** Dùng tài liệu này để yêu cầu AI coding agent phân tích và chuyển đổi source editor thiệp cưới hiện có thành một **AI Learning Studio** dành cho website học tập `educational-games`.
>
> **Lưu ý quan trọng:** Đây là yêu cầu chỉnh sửa source code và triển khai tính năng thật, không phải yêu cầu tạo ảnh minh họa hoặc dựng UI tĩnh. AI phải đọc codebase thực tế trước khi sửa, tận dụng tối đa editor hiện tại và hệ thống game HTML hiện có.

---

# PHẦN A — BỐI CẢNH VÀ MỤC TIÊU

## 1. Bối cảnh dự án

Tôi đang có:
- Một source editor được xây dựng ban đầu dành cho thiết kế thiệp cưới ở file này : F:\Clone\clone-digotal_3\hiweb_id_erp\Hiweb_wedding_app\thieponline_app_management\src\pages\editor\EditorPage.jsx.
- Website học tập `educational-games`.
- Các game/hoạt động đã được xây dựng dưới dạng HTML và có cơ chế hiển thị/chạy game.
- Backend hiện tại của website.
- Định hướng tích hợp AI để hỗ trợ tạo nội dung học tập. Model AI dự kiến có thể là Qwen/Ollama hoặc một dịch vụ khác đã được cấu hình trong dự án.
- Một số hệ thống quản lý bài học, game, lớp học hoặc nội dung có thể đã tồn tại trong codebase.

Không được giả định rằng tất cả các thành phần trên có cùng schema/API như mô tả. Hãy kiểm tra source thực tế để xác định chính xác.

## 2. Mục tiêu sản phẩm

Chuyển editor thiệp cưới thành **EduPlay AI Studio** — công cụ giúp giáo viên tạo, chỉnh sửa, xem trước và xuất bản bài học có nội dung tương tác.

AI không chỉ là một chatbot trả lời câu hỏi. AI cần hỗ trợ giáo viên tạo ra **dữ liệu bài học có cấu trúc** mà editor và website có thể sử dụng.

Luồng trải nghiệm mong muốn:

1. Giáo viên nhập chủ đề, mục tiêu hoặc tài liệu bài học.
2. AI đề xuất cấu trúc bài học, nội dung, câu hỏi và hoạt động.
3. Giáo viên xem bản nháp do AI tạo.
4. Nội dung được đưa vào editor để giáo viên tiếp tục chỉnh sửa.
5. Giáo viên có thể thêm game HTML đã có trong thư viện.
6. Giáo viên xem trước trải nghiệm như học sinh.
7. Giáo viên lưu nháp hoặc xuất bản.
8. Học sinh học, làm câu hỏi và chơi game.
9. Khi hệ thống đã có dữ liệu kết quả, AI có thể phân tích và đề xuất nội dung luyện tập tiếp theo.

**Nguyên tắc:** AI hỗ trợ giáo viên; giáo viên vẫn là người kiểm duyệt và quyết định xuất bản.

## 3. Nguyên tắc triển khai

- Đọc source hiện tại trước khi chỉnh sửa.
- Tái sử dụng canvas, drag-and-drop, resize, layer, zoom, grid, snap, undo/redo, media library và các component dùng chung nếu phù hợp.
- Không tạo project/editor mới độc lập nếu có thể chuyển đổi editor hiện tại.
- Không chỉ đổi tên hoặc màu sắc của editor thiệp cưới.
- Không xóa nhầm chức năng/component/service đang được sử dụng.
- Không tự tạo API, schema, route, database table hoặc trường dữ liệu chưa được xác minh.
- Không giả lập thành công cho các thao tác lưu, publish, gọi AI hoặc chạy game.
- Nếu cần thay đổi backend/database, hãy nêu rõ và thực hiện theo kiến trúc hiện có.
- Ưu tiên triển khai từng giai đoạn, giữ cho dự án có thể chạy sau mỗi giai đoạn.
- Không đưa API key/secret vào frontend.
- Không để AI sinh HTML/JavaScript tùy ý rồi chạy không kiểm soát trong website.
- Không làm hỏng thư viện game HTML, template game, URL HTML hoặc cơ chế xuất bản hiện có.

---

# PHẦN B — MÔ HÌNH GIAO DIỆN MỚI

## 4. Định hướng giao diện

Giao diện nên có cảm giác của một công cụ thiết kế nội dung hiện đại, thân thiện với giáo viên, kết hợp:
- Editor trực quan kiểu Canva.
- Khả năng tạo nội dung bằng AI.
- Quản lý nhiều trang/slide trong bài học.
- Thư viện tài nguyên học tập.
- Khu vực thêm game HTML.
- Panel cấu hình nội dung và AI Copilot.

Phong cách:
- Sáng, rõ ràng, dễ dùng.
- Màu chủ đạo xanh dương hoặc màu đang dùng trong website `educational-games`.
- Không quá rực rỡ, không tạo cảm giác AI quá phô trương.
- Ưu tiên khả năng đọc nội dung và thao tác.
- Responsive ở mức phù hợp; editor desktop là trải nghiệm chính nếu codebase hiện tại được thiết kế cho desktop.

## 5. Bố cục tổng thể

Giữ mô hình editor quen thuộc, nhưng thay nội dung thiệp cưới bằng nội dung học tập.

### 5.1. Header trên cùng

Bên trái:
- Nút quay lại danh sách bài học.
- Logo/tên `EduPlay AI Studio` hoặc tên sản phẩm phù hợp với branding hiện có.
- Tên bài học.
- Trạng thái lưu: `Đang chỉnh sửa`, `Chưa lưu`, `Đã lưu`.
- Có thể đổi tên bài học.

Bên phải:
- `Xem trước`.
- `Lưu nháp`.
- `Xuất bản`.
- Nút AI hoặc trạng thái AI nếu phù hợp.

Hành vi:
- Trạng thái lưu phải phản ánh kết quả thực tế.
- Nếu có thay đổi chưa lưu, hiển thị rõ.
- Không thông báo thành công khi API chưa xác nhận.
- Khi xuất bản, kiểm tra các trường bắt buộc và báo lỗi cụ thể.
- Có xử lý khi người dùng rời trang trong lúc có thay đổi chưa lưu.

### 5.2. Thanh công cụ dọc bên trái

Các nhóm công cụ dự kiến:

| Mục | Mục đích |
|---|---|
| Trang/Slide | Quản lý trang của bài học |
| Nội dung | Thêm tiêu đề, đoạn văn, ghi chú, hộp nội dung |
| Hình ảnh/Media | Chọn hoặc tải ảnh, audio/video nếu hệ thống hỗ trợ |
| Câu hỏi | Thêm và cấu hình các dạng câu hỏi |
| Trò chơi | Chọn game HTML hiện có để thêm vào bài học |
| Thư viện | Tài nguyên, template, nội dung đã lưu |
| AI Copilot | Hỗ trợ tạo/chỉnh sửa nội dung bằng câu lệnh |
| Hiệu ứng | Hiệu ứng trang/phần tử nếu editor hiện tại hỗ trợ |
| Cài đặt | Thiết lập bài học/canvas |

Chỉ hiển thị các mục có chức năng thực tế. Không tạo tab chỉ để trang trí.

### 5.3. Thư viện công cụ bên trái

Nội dung thay đổi theo tab đang chọn.

**Nội dung:**
- Tiêu đề.
- Đoạn văn.
- Ghi chú.
- Hộp nội dung.
- Hình ảnh.
- Audio/video nếu source hỗ trợ.

**Câu hỏi:**
- Trắc nghiệm một đáp án.
- Trắc nghiệm nhiều đáp án.
- Đúng/Sai.
- Điền từ.
- Nối cặp.
- Kéo thả.
- Sắp xếp thứ tự.

Chỉ triển khai loại câu hỏi mà hệ thống chấm điểm/runtime có thể hỗ trợ. Nếu dạng câu hỏi chưa có runtime, cần ghi rõ là cần phát triển thêm, không hiển thị như thể đã hoạt động.

**Trò chơi:**
- Danh sách game HTML hiện có.
- Tìm kiếm/lọc theo tên, môn học hoặc loại game nếu metadata hiện có.
- Thumbnail.
- Tên game.
- Mô tả ngắn.
- Nút xem trước.
- Nút thêm vào bài học.

**Thư viện/template:**
- Các mẫu bài học hoặc trang đã có.
- Ưu tiên tái sử dụng dữ liệu/template thực tế của dự án.

### 5.4. Canvas trung tâm

Canvas là vùng thiết kế nội dung của trang/slide hiện tại.

Ví dụ một slide Toán lớp 3:
- Tiêu đề: `Cùng học phép nhân!`
- Nội dung giải thích ngắn.
- Hình minh họa.
- Câu hỏi `3 × 4 = ?`
- Các lựa chọn đáp án.
- Một game HTML có thể được thêm ở trang khác.

Hành vi:
- Chọn phần tử để hiển thị khung chọn.
- Di chuyển, thay đổi kích thước, xoay, sắp xếp lớp nếu editor hiện tại hỗ trợ.
- Thêm, xóa, nhân bản phần tử.
- Undo/redo nếu có.
- Zoom, grid, snap/căn chỉnh nếu có.
- Không hiển thị đáp án đúng cho học sinh trong chế độ preview/student.
- Phân biệt rõ chế độ thiết kế với chế độ học sinh.
- Không làm mất dữ liệu khi đổi slide hoặc mở panel.

### 5.5. Panel thuộc tính bên phải

Panel phải thay đổi theo phần tử đang chọn.

**Khi chọn văn bản:**
- Nội dung.
- Font, cỡ chữ, màu.
- Căn lề.
- Vị trí/kích thước.
- Các thuộc tính khác mà editor hiện tại hỗ trợ.

**Khi chọn hình ảnh:**
- Thay ảnh.
- Crop nếu có.
- Kích thước/vị trí/xoay.
- Viền, bo góc, bóng nếu có.

**Khi chọn câu hỏi:**
- Nội dung câu hỏi.
- Loại câu hỏi.
- Danh sách đáp án.
- Chọn đáp án đúng.
- Thêm/xóa đáp án.
- Điểm.
- Thời gian nếu runtime hỗ trợ.
- Giải thích đáp án.
- Phản hồi khi đúng/sai.
- Cho phép thử lại nếu hỗ trợ.

**Khi chọn game HTML:**
- Tên game.
- Thumbnail.
- Mô tả/hướng dẫn.
- ID hoặc URL game theo cấu trúc hiện tại.
- Kích thước/vị trí trên canvas.
- Tùy chọn cấu hình mà game thực sự hỗ trợ.
- Nút xem trước.
- Nút mở game trong thư viện nếu phù hợp.

Không tự tạo cấu hình điểm, thời gian, cấp độ hoặc chế độ chơi nếu game chưa hỗ trợ các thuộc tính đó.

### 5.6. Dải slide phía dưới

Mỗi thumbnail đại diện cho một trang trong bài học.

Ví dụ:
1. Giới thiệu.
2. Kiến thức.
3. Ví dụ.
4. Luyện tập.
5. Game.
6. Tổng kết.

Thao tác:
- Chọn trang.
- Thêm trang.
- Nhân bản trang.
- Xóa trang.
- Đổi tên trang.
- Sắp xếp lại nếu hỗ trợ.

Khi chuyển trang:
- Hiển thị đúng nội dung trang được chọn.
- Không mất thay đổi.
- Có xử lý thay đổi chưa lưu.
- Cập nhật trạng thái lưu.

### 5.7. Thanh trạng thái

Có thể hiển thị:
- Kích thước canvas.
- Zoom.
- Phần tử đang chọn.
- Tổng số phần tử.
- Trạng thái lưu.

Tránh hiển thị các thông tin kỹ thuật không cần thiết với giáo viên.

---

# PHẦN C — CÁC FEATURE AI

## 6. AI Lesson Generator — Tạo bài học từ yêu cầu

Đây là feature AI quan trọng nhất và nên ưu tiên triển khai đầu tiên.

### 6.1. Mục tiêu

Giáo viên có thể tạo bài học bằng cách mô tả nội dung mong muốn, thay vì tự thêm từng phần tử từ đầu.

Ví dụ prompt:

> Tạo bài học Toán lớp 3 về bảng nhân 4. Bài học gồm phần giới thiệu, giải thích kiến thức, ví dụ minh họa, 5 câu hỏi luyện tập, một game HTML phù hợp và phần tổng kết. Nội dung dễ hiểu, vui nhộn, phù hợp học sinh tiểu học.

### 6.2. Thông tin đầu vào

Form hoặc hội thoại AI nên thu thập các thông tin hữu ích:
- Chủ đề bài học.
- Môn học.
- Cấp học/lớp.
- Mục tiêu học tập.
- Độ khó.
- Thời lượng dự kiến.
- Số lượng câu hỏi.
- Loại hoạt động mong muốn.
- Phong cách trình bày.
- Tài liệu đầu vào nếu dự án hỗ trợ upload/đọc tài liệu.

Cho phép người dùng cung cấp một phần thông tin; không bắt buộc tất cả trường nếu không cần thiết.

### 6.3. Quy trình

1. Giáo viên nhập yêu cầu.
2. AI tạo bản đề xuất cấu trúc bài học.
3. Hiển thị bản xem trước cấu trúc trước khi đưa vào editor.
4. Giáo viên có thể chấp nhận, chỉnh prompt hoặc tạo lại.
5. Khi xác nhận, chuyển nội dung AI thành dữ liệu editor có cấu trúc.
6. Giáo viên tiếp tục sửa thủ công.
7. Lưu nháp hoặc xuất bản.

### 6.4. Kết quả AI cần tạo

AI nên trả về dữ liệu có cấu trúc, không chỉ trả về một đoạn văn bản dài.

Về mặt khái niệm, nội dung bài học gồm:
- Thông tin bài học.
- Danh sách trang.
- Mỗi trang có tiêu đề.
- Các phần tử nội dung.
- Câu hỏi và đáp án.
- Hoạt động/game được đề xuất.
- Mục tiêu hoặc ghi chú giáo viên.

Hãy dùng schema thực tế của dự án nếu đã có. Không tự tạo schema mới một cách độc lập.

### 6.5. Quy tắc

- AI không tự xuất bản.
- Giáo viên phải xem và xác nhận nội dung.
- Nếu AI không trả về dữ liệu hợp lệ, hiển thị lỗi và cho phép thử lại.
- Không làm mất nội dung hiện tại khi tạo lại.
- Có thể tạo lại một trang hoặc một phần nội dung thay vì phải tạo lại toàn bài.

## 7. AI Copilot — Trợ lý chỉnh sửa ngay trong editor

### 7.1. Giao diện

Có một panel hoặc khu vực hội thoại AI bên phải, có thể thu gọn/mở rộng.

AI cần biết ngữ cảnh phù hợp:
- Bài học hiện tại.
- Trang hiện tại.
- Phần tử đang chọn.
- Loại phần tử.
- Nội dung liên quan cần chỉnh sửa.

Chỉ gửi lượng dữ liệu cần thiết, không gửi toàn bộ thông tin không liên quan.

### 7.2. Các lệnh ví dụ

- `Viết lại nội dung này dễ hiểu hơn cho học sinh lớp 2.`
- `Tạo thêm 3 câu hỏi tương tự nhưng khó hơn.`
- `Rút gọn phần giải thích này.`
- `Tạo ví dụ thực tế cho nội dung đang chọn.`
- `Đề xuất hình minh họa phù hợp.`
- `Biến trang này thành hoạt động luyện tập.`
- `Tạo lời giải cho câu hỏi này.`
- `Kiểm tra xem câu hỏi có mơ hồ không.`

### 7.3. Hành vi bắt buộc

- AI tạo đề xuất trước.
- Giáo viên có thể `Áp dụng`, `Bỏ qua` hoặc `Chỉnh yêu cầu`.
- Không tự thay đổi toàn bộ bài học khi người dùng chỉ chọn một phần tử.
- Có thể hoàn tác sau khi áp dụng nếu editor hỗ trợ undo.
- Hiển thị trạng thái đang xử lý, lỗi và thử lại.
- Không giả lập phản hồi AI nếu backend/model chưa kết nối.

## 8. AI Question Generator — Sinh câu hỏi và đáp án

Cho phép tạo câu hỏi dựa trên:
- Chủ đề.
- Nội dung trang/bài học.
- Môn học/cấp học.
- Độ khó.
- Số lượng câu hỏi.
- Dạng câu hỏi được runtime hỗ trợ.

AI có thể sinh:
- Nội dung câu hỏi.
- Các lựa chọn.
- Đáp án đúng.
- Giải thích.
- Phản hồi khi trả lời đúng/sai.
- Mức độ khó hoặc mục tiêu kiến thức nếu schema hỗ trợ.

Yêu cầu:
- Giáo viên kiểm tra trước khi thêm.
- Có kiểm tra câu hỏi trùng lặp ở mức phù hợp.
- Không coi kết quả AI là chính xác tuyệt đối.
- Không gửi đáp án đúng cho học sinh trước khi chấm.
- Bảo đảm dữ liệu tương thích với hệ thống chấm điểm/runtime hiện tại.

## 9. AI Game Builder — Kết hợp AI với game HTML hiện có

### 9.1. Nguyên tắc quan trọng

Website đã có game HTML. Không xây dựng lại toàn bộ game nếu có thể tái sử dụng game hiện tại.

Phân biệt rõ:
- **Game runtime/template:** HTML/JS thực hiện gameplay.
- **Game content/config:** câu hỏi, đáp án, hình ảnh, cấp độ hoặc dữ liệu mà game sử dụng.
- **Editor:** nơi chọn game và chỉnh nội dung/cấu hình.
- **AI:** tạo hoặc đề xuất dữ liệu cho game.

Ưu tiên để AI tạo **dữ liệu game có cấu trúc** và gắn dữ liệu đó vào game/template đã có.

### 9.2. Luồng mong muốn

1. Giáo viên mở tab `Trò chơi`.
2. Chọn game HTML từ thư viện.
3. Chọn `Tạo nội dung bằng AI` nếu game hỗ trợ.
4. Nhập chủ đề, cấp học, độ khó, số câu hoặc số cặp.
5. AI tạo nội dung tương thích với game.
6. Hiển thị bản xem trước.
7. Giáo viên chỉnh sửa/chấp nhận.
8. Lưu cấu hình game vào bài học.
9. Xem trước game trong bài học.

### 9.3. Ví dụ

Giáo viên chọn game `Ghép cặp` và nhập:

> Tạo 10 cặp phép nhân bảng 4 cho học sinh lớp 3, độ khó tăng dần.

AI tạo dữ liệu phù hợp với định dạng mà game ghép cặp hiện tại yêu cầu.

### 9.4. Tích hợp HTML

- Kiểm tra cách website hiện tại lưu và hiển thị game HTML.
- Tái sử dụng URL/ID game hiện có.
- Không sao chép toàn bộ HTML vào dữ liệu bài học nếu game đã được lưu riêng.
- Có thể dùng iframe hoặc cơ chế hiện tại của dự án để nhúng game.
- Không tự xây dựng cơ chế iframe mới nếu dự án đã có cách hiển thị HTML.
- Kiểm tra sandbox, quyền truy cập và nguồn HTML trước khi nhúng.
- Không chạy HTML/JavaScript do AI sinh tùy ý mà không có kiểm soát.
- Nếu cần truyền dữ liệu vào game, kiểm tra khả năng của game hiện tại trước khi thay đổi.
- Nếu game chưa hỗ trợ nhận dữ liệu động, ghi rõ phần cần nâng cấp.

### 9.5. Trao đổi dữ liệu game và website

Nếu cần các tính năng như:
- Truyền tên học sinh.
- Truyền cấu hình game.
- Nhận điểm.
- Nhận trạng thái hoàn thành.
- Chuyển trang sau khi hoàn thành.

Hãy khảo sát khả năng hiện tại. Có thể sử dụng API hoặc `window.postMessage` khi phù hợp, nhưng phải kiểm tra nguồn gửi/nhận, xác thực message và cấu trúc dữ liệu. Không tự giả định mọi game đều hỗ trợ.

## 10. AI Lesson Review — Kiểm tra chất lượng bài học

Trước khi xuất bản, giáo viên có thể yêu cầu AI kiểm tra:
- Nội dung có phù hợp lớp/cấp học không?
- Mục tiêu học tập có rõ ràng không?
- Câu hỏi có đúng và rõ nghĩa không?
- Đáp án có hợp lý không?
- Có câu hỏi trùng lặp không?
- Độ khó có tăng dần hợp lý không?
- Có lỗi chính tả/ngữ pháp không?
- Nội dung có thiếu phần giải thích không?
- Có hoạt động tương tác phù hợp không?

Kết quả nên là danh sách:
- Vấn đề.
- Mức độ ưu tiên.
- Trang/phần tử liên quan.
- Gợi ý sửa.
- Nút áp dụng đề xuất nếu phù hợp.

AI chỉ đưa ra nhận xét và đề xuất. Giáo viên quyết định có áp dụng hay không.

## 11. AI Adaptive Learning — Học tập thích ứng (giai đoạn sau)

Khi website đã có kết quả học tập đủ tin cậy, AI có thể:
- Phát hiện dạng câu hỏi học sinh thường sai.
- Đề xuất bài tập bổ sung.
- Điều chỉnh độ khó.
- Tạo nội dung ôn tập.
- Đề xuất bài học tiếp theo.

Không triển khai tính năng này bằng dữ liệu giả. Cần kiểm tra dữ liệu kết quả, quyền truy cập và cấu trúc lưu kết quả hiện tại.

## 12. AI Learning Insights — Phân tích kết quả (giai đoạn sau)

Dành cho giáo viên:
- Tỷ lệ hoàn thành.
- Câu hỏi sai nhiều.
- Nội dung học sinh chưa nắm.
- Gợi ý hoạt động bổ sung.
- So sánh tiến bộ nếu dữ liệu theo thời gian có sẵn.

AI chỉ được tổng hợp dữ liệu mà người dùng có quyền xem. Không đưa thông tin riêng tư của học sinh vào prompt nếu không cần thiết.

---

# PHẦN D — CHẾ ĐỘ SỬ DỤNG VÀ LUỒNG NGƯỜI DÙNG

## 13. Chế độ thiết kế

Giáo viên:
- Thêm/sửa/xóa nội dung.
- Chỉnh bố cục.
- Tạo câu hỏi.
- Thêm game HTML.
- Sử dụng AI Copilot.
- Quản lý trang/slide.
- Lưu nháp.

## 14. Chế độ xem trước

Xem trước mô phỏng đúng trải nghiệm học sinh:
- Ẩn công cụ thiết kế và panel thuộc tính.
- Hiển thị nội dung theo bố cục thực tế.
- Câu hỏi có thể tương tác nếu runtime hỗ trợ.
- Game HTML chạy qua cơ chế hiện tại.
- Không để lộ đáp án đúng trước khi học sinh trả lời.
- Có nút quay lại editor.
- Không ghi nhận kết quả thật của học sinh khi giáo viên chỉ đang preview, trừ khi hệ thống đã có chế độ test riêng.

## 15. Chế độ xuất bản

Khi xuất bản:
- Kiểm tra dữ liệu bắt buộc.
- Kiểm tra liên kết game HTML.
- Kiểm tra nội dung câu hỏi.
- Báo lỗi cụ thể nếu thiếu dữ liệu.
- Gọi API publish thực tế.
- Hiển thị trạng thái dựa trên phản hồi backend.
- Bảo đảm học sinh truy cập được bài học theo hệ thống hiện tại.

## 16. Luồng sử dụng mẫu

1. Giáo viên vào khu vực quản lý nội dung.
2. Chọn `Tạo bài học bằng AI`.
3. Nhập chủ đề: `Bảng nhân 4 – Toán lớp 3`.
4. Chọn mục tiêu, cấp học, độ khó và số câu hỏi.
5. AI đề xuất cấu trúc bài học.
6. Giáo viên xem/chỉnh cấu trúc.
7. AI tạo nội dung và câu hỏi.
8. Giáo viên chọn game HTML phù hợp từ thư viện.
9. AI tạo dữ liệu game nếu game hỗ trợ.
10. Giáo viên xem trước toàn bộ bài học.
11. Giáo viên dùng AI Review để kiểm tra.
12. Lưu nháp.
13. Xuất bản.
14. Học sinh mở bài học và học/chơi.

---

# PHẦN E — DỮ LIỆU, BACKEND VÀ TÍCH HỢP AI

## 17. Kiểm tra schema hiện tại trước khi thiết kế dữ liệu

Trước khi thêm hoặc sửa model, hãy tìm hiểu:
- Bài học hiện được lưu như thế nào?
- Game HTML được lưu ở đâu?
- API trả về ID, URL hay HTML?
- Editor hiện đang lưu canvas ra sao?
- Có model trang/slide chưa?
- Có hệ thống câu hỏi/chấm điểm chưa?
- Có hệ thống lớp học/học sinh/kết quả chưa?
- Backend AI hoặc Ollama integration đã có chưa?

Dùng schema hiện tại nếu phù hợp. Nếu cần bổ sung, trình bày rõ:
- Trường mới.
- Lý do.
- Ảnh hưởng tới dữ liệu cũ.
- API bị ảnh hưởng.
- Cách tương thích ngược.

Không tự ý thay đổi contract của API hiện có.

## 18. Kết quả AI cần có cấu trúc

AI nên trả về một cấu trúc dữ liệu có thể validate, ví dụ về mặt ý tưởng:
- Metadata bài học.
- Danh sách trang.
- Nội dung từng trang.
- Câu hỏi.
- Các lựa chọn và đáp án.
- Giải thích.
- Tham chiếu game HTML.
- Cấu hình game nếu được hỗ trợ.

Đây chỉ là mô tả khái niệm, không phải yêu cầu dùng nguyên schema này. Hãy dùng model/schema thật của dự án.

Yêu cầu kỹ thuật:
- Validate response từ AI trước khi đưa vào editor.
- Xử lý JSON lỗi hoặc thiếu trường.
- Có giới hạn kích thước/nội dung phù hợp.
- Không tin tưởng trực tiếp HTML do AI trả về.
- Có thể lưu bản nháp trước khi áp dụng.
- Không ghi đè bài học đang làm nếu người dùng chưa xác nhận.

## 19. Tích hợp model AI

Kiểm tra cách AI đang được hoặc sẽ được gọi trong dự án:
- Qwen/Ollama local.
- Backend proxy.
- Provider khác nếu đã cấu hình.

Yêu cầu:
- Frontend gọi backend/service đã được dự án thiết kế.
- Không đưa secret/API key vào client.
- Không giả định model luôn online.
- Có trạng thái loading, lỗi, timeout và thử lại.
- Có thông báo thân thiện khi AI chưa sẵn sàng.
- Không làm editor mất khả năng chỉnh sửa thủ công khi AI không hoạt động.
- Không yêu cầu AI chạy 24/7 nếu định hướng triển khai hiện tại không hỗ trợ.
- Không tự chuyển sang dịch vụ AI trả phí nếu chưa được cho phép.

Nếu model local có giới hạn về tài nguyên hoặc không thể tạo nội dung lớn, cân nhắc chia tác vụ theo từng trang/phần và kiểm tra output.

## 20. Bảo mật và quyền riêng tư

- Không để lộ đáp án đúng trước thời điểm chấm.
- Không gửi dữ liệu học sinh không cần thiết tới AI.
- Kiểm tra quyền giáo viên/học sinh khi gọi API.
- Kiểm tra nguồn và quyền truy cập HTML game.
- Không chạy code do AI sinh mà không có cơ chế kiểm soát.
- Không tin tưởng dữ liệu từ prompt, game hoặc client.
- Validate dữ liệu ở backend khi lưu/publish/chấm điểm.

---

# PHẦN F — HƯỚNG DẪN CHUYỂN ĐỔI SOURCE CŨ

## 21. Giai đoạn 0: Khảo sát codebase

Trước khi sửa:
1. Xác định entry page editor thiệp cưới.
2. Xác định component canvas.
3. Xác định toolbar.
4. Xác định panel thuộc tính.
5. Xác định thư viện ảnh/media.
6. Xác định hệ thống layer.
7. Xác định state/store/context.
8. Xác định undo/redo.
9. Xác định API/service lưu nháp.
10. Xác định preview/publish.
11. Xác định các component/service đang dùng chung.
12. Xác định thư viện game HTML hiện có và cách tải game.
13. Xác định backend và AI integration hiện có.

Hãy tạo báo cáo khảo sát ngắn trước khi thực hiện thay đổi lớn.

## 22. Giai đoạn 1: Chuyển đổi khung UI

- Thay branding thiệp cưới thành EduPlay AI Studio hoặc branding phù hợp.
- Thay tên và nội dung header.
- Chuyển toolbar sang các nhóm nội dung học tập.
- Cập nhật thư viện trái.
- Cập nhật panel thuộc tính.
- Cập nhật slide strip.
- Đồng bộ với style website `educational-games`.
- Loại bỏ nội dung thiệp cưới khỏi giao diện chính.

Không làm hỏng canvas và cơ chế tương tác cũ.

## 23. Giai đoạn 2: Chuyển đổi nội dung editor

Loại bỏ hoặc thay thế các phần đặc thù thiệp cưới như:
- Cô dâu/chú rể.
- Ngày cưới.
- Địa điểm cưới.
- RSVP.
- Lời mời.
- Template và metadata chỉ dành cho thiệp.

Thay bằng:
- Bài học.
- Trang/slide.
- Mục tiêu học tập.
- Nội dung kiến thức.
- Câu hỏi.
- Hoạt động.
- Game HTML.
- Điểm/phản hồi nếu hệ thống hỗ trợ.

Không xóa các component dùng chung chỉ vì chúng từng được dùng trong editor thiệp cưới.

## 24. Giai đoạn 3: Tích hợp game HTML

- Tìm thư viện game hiện tại.
- Dùng ID/URL game theo API thực tế.
- Cho phép chọn game từ thư viện.
- Cho phép thêm game vào trang bài học.
- Hiển thị game bằng cơ chế hiện có.
- Xem trước game.
- Lưu tham chiếu game.
- Nếu cần, xây dựng cấu hình dữ liệu game theo schema runtime.
- Kiểm tra game hoạt động sau khi publish.

## 25. Giai đoạn 4: AI Lesson Generator và Copilot

Ưu tiên:
1. Tạo bài học từ prompt.
2. Tạo cấu trúc trang.
3. Sinh nội dung từng trang.
4. Sinh câu hỏi.
5. AI Copilot chỉnh sửa phần tử/trang.
6. Preview kết quả trước khi áp dụng.

Không bắt đầu bằng Adaptive Learning hoặc Analytics nếu hệ thống chưa có dữ liệu kết quả.

## 26. Giai đoạn 5: Hoàn thiện và nghiệm thu

Kiểm tra:
- Editor mở được.
- Không còn nội dung thiệp cưới không phù hợp.
- Thêm/sửa/xóa phần tử hoạt động.
- Thêm/sửa/xóa/sắp xếp trang hoạt động.
- Dữ liệu không mất khi đổi trang.
- Lưu nháp thật.
- Preview đúng.
- Publish thật.
- Game HTML hiển thị/chạy đúng.
- AI tạo dữ liệu hợp lệ.
- AI lỗi không làm hỏng editor.
- Đáp án đúng không bị lộ.
- Responsive phù hợp.
- Không phát sinh lỗi build/lint mới.
- Không xóa nhầm service/component đang dùng.

---

# PHẦN G — PHÂN CHIA ƯU TIÊN

## 27. MVP — Nên làm trước

Các tính năng bắt buộc:
1. Chuyển giao diện editor sang giáo dục.
2. Giữ canvas và các thao tác chỉnh sửa cốt lõi.
3. Quản lý trang/slide.
4. Thêm văn bản/hình ảnh.
5. Chọn game HTML có sẵn.
6. Thêm game HTML vào bài học.
7. Xem trước.
8. Lưu nháp.
9. Xuất bản theo API hiện có.
10. AI Lesson Generator tạo bản nháp có cấu trúc.
11. AI Question Generator.
12. AI Copilot cơ bản.
13. Có trạng thái lỗi/loading khi AI không sẵn sàng.

## 28. Giai đoạn mở rộng

Sau khi MVP ổn định:
- AI Game Builder nâng cao.
- AI kiểm tra chất lượng bài học.
- Sinh hình minh họa bằng AI nếu có công cụ phù hợp.
- Tạo bài học từ tài liệu.
- Tạo nội dung theo nhiều cấp học/môn học.
- AI Adaptive Learning.
- AI Learning Insights.
- Theo dõi tiến độ và gợi ý lộ trình.

Không làm các tính năng mở rộng bằng dữ liệu giả hoặc chỉ để giao diện có nhiều nút.

---

# PHẦN H — TIÊU CHÍ NGHIỆM THU

## 29. Tiêu chí UI/UX

- Giao diện nhìn rõ là công cụ tạo bài học, không còn là editor thiệp cưới.
- Header, toolbar, thư viện, canvas, panel thuộc tính và slide strip có bố cục rõ.
- Các nút có chức năng thật.
- Trạng thái lưu/AI/preview/publish rõ ràng.
- Không làm giao diện quá rối.
- Đồng bộ style với website hiện tại.

## 30. Tiêu chí chức năng

- Giáo viên tạo bài học mới.
- Giáo viên thêm và chỉnh sửa nội dung.
- Giáo viên quản lý nhiều trang.
- Giáo viên tạo câu hỏi theo loại runtime hỗ trợ.
- Giáo viên chọn và thêm game HTML có sẵn.
- Giáo viên xem trước bài học.
- Giáo viên lưu nháp.
- Giáo viên xuất bản.
- AI tạo nội dung có cấu trúc.
- AI Copilot có thể đề xuất chỉnh sửa.
- Giáo viên có quyền chấp nhận hoặc từ chối đề xuất.
- Nếu AI không hoạt động, editor thủ công vẫn dùng được.

## 31. Tiêu chí kỹ thuật

- Không tạo kiến trúc song song không cần thiết.
- Tái sử dụng component/service phù hợp.
- Không tự suy đoán API hoặc schema.
- Không hardcode dữ liệu giả để làm giao diện trông hoạt động.
- Không đưa secret lên frontend.
- Không thực thi HTML do AI sinh thiếu kiểm soát.
- Có xử lý loading/error/empty state.
- Không làm mất dữ liệu cũ ngoài phạm vi được yêu cầu.
- Build và lint theo script dự án.
- Kiểm tra luồng editor → save → preview → publish → student view.

---

# PHẦN I — YÊU CẦU BÁO CÁO SAU KHI AI THỰC HIỆN

Sau khi hoàn tất, hãy trả lời rõ:

1. Đã khảo sát những phần nào của codebase?
2. Các component nào được tái sử dụng?
3. Các file nào đã thêm/sửa/xóa?
4. Những feature nào đã hoàn thành?
5. Những feature nào chưa làm?
6. Có cần thay đổi backend/database/API không?
7. Game HTML hiện có được tích hợp theo cách nào?
8. AI đang gọi model/service nào?
9. Cách chạy và kiểm thử.
10. Những lỗi hoặc giới hạn còn lại.

Nếu chưa thể hoàn thành một feature do thiếu backend/schema/runtime, hãy nói rõ nguyên nhân và đề xuất phần cần bổ sung. Không được báo hoàn thành nếu mới chỉ dựng giao diện.

---

# PROMPT NGẮN ĐỂ BẮT ĐẦU THỰC HIỆN

Hãy đọc toàn bộ tài liệu này và khảo sát source editor thiệp cưới hiện tại cùng website `educational-games`.

Tôi muốn chuyển editor cũ thành **EduPlay AI Studio** — công cụ giúp giáo viên tạo bài học bằng AI, chỉnh sửa nội dung trên canvas, tạo câu hỏi, chọn và nhúng game HTML đã có, xem trước, lưu nháp và xuất bản.

Hãy bắt đầu bằng việc phân tích codebase và báo cáo kiến trúc hiện tại. Sau đó đề xuất kế hoạch triển khai theo từng giai đoạn. Khi đã xác định được component/service/API cần dùng, hãy thực hiện thay đổi trực tiếp theo phạm vi MVP trong tài liệu.

Ưu tiên tái sử dụng source cũ và hệ thống game HTML hiện có. Không tạo project mới, không chỉ dựng UI tĩnh, không giả lập API/AI/game, không xóa file chưa xác minh là không dùng. Bảo đảm các thao tác lưu, preview, publish và tích hợp game hoạt động thật.

Nếu có điểm nào chưa rõ trong codebase, hãy kiểm tra source trước; chỉ hỏi tôi khi thật sự cần quyết định sản phẩm hoặc cần thông tin mà codebase không thể cung cấp.