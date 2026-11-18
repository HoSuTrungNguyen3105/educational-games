Hãy tiếp tục nâng cấp giao diện và chức năng tại trang `#/dashboard/documents/` dựa trên giao diện hiện tại.

### 1. Hoàn thiện chức năng Preview và In (Print)

Hiện tại khu vực Preview A4 đã có nút In (Print) nhưng chưa có action thực tế.

Hãy triển khai:
- Khi nhấn nút **In**, gọi trực tiếp chức năng in của trình duyệt (`window.print()`).
- Chỉ in nội dung tài liệu trong Preview A4, không in Sidebar, Toolbar, Editor hay các thành phần giao diện khác.
- Giữ nguyên kích thước giấy A4, căn lề, font chữ, màu sắc và bố cục khi in.
- Hỗ trợ xem trước khi in và lưu thành PDF thông qua hộp thoại in của trình duyệt.
- Đảm bảo nội dung nhiều trang được phân trang chính xác, không bị cắt chữ hoặc vỡ bảng.
- Có CSS `@media print` riêng để tối ưu bản in.

### 2. Tổ chức lại Sidebar

Hiện tại Sidebar có nhiều mục riêng như Bảng biểu, Danh sách, Trích dẫn. Tôi muốn tổ chức lại hợp lý và gọn gàng hơn.

Hãy gộp 3 mục:
- Bảng biểu
- Danh sách
- Trích dẫn

Thành một mục chung có tên **Thành phần** hoặc **Thư viện nội dung**.

Khi nhấn vào mục này, mở ra một khu vực chọn nhanh các thành phần tài liệu, được thiết kế trực quan và dễ sử dụng.

### 3. Xây dựng thư viện mẫu chọn nhanh

Trong khu vực mới, hãy phân loại thành các nhóm:

**Bảng biểu**
- Bảng cơ bản.
- Bảng có tiêu đề.
- Bảng nhiều cột.
- Bảng đánh giá.
- Bảng điểm.
- Bảng thời khóa biểu.
- Bảng tổng hợp.

**Danh sách**
- Danh sách có đánh số.
- Danh sách dấu chấm.
- Danh sách checkbox.
- Danh sách công việc.
- Danh sách câu hỏi.
- Danh sách gạch đầu dòng.

**Trích dẫn**
- Trích dẫn cơ bản.
- Khung ghi chú.
- Khung lưu ý.
- Khung kiến thức quan trọng.
- Khung ví dụ minh họa.

**Thành phần bổ sung**
- Tiêu đề và tiêu đề phụ.
- Đoạn văn.
- Đường phân cách.
- Khung thông tin.
- Khu vực điền thông tin học sinh.
- Dòng kẻ để học sinh viết câu trả lời.

### 4. Cách hoạt động của thư viện

Tôi muốn trải nghiệm giống một công cụ chọn nhanh thành phần trong trình soạn thảo:

- Mỗi mẫu hiển thị dưới dạng một thẻ nhỏ có tên, biểu tượng và hình minh họa hoặc bản xem trước.
- Có thể tìm kiếm mẫu theo từ khóa.
- Có thể lọc theo từng nhóm.
- Khi nhấn vào một mẫu, hiển thị bản xem trước hoặc chèn trực tiếp vào vị trí hiện tại trong tài liệu.
- Có thể tùy chỉnh nội dung sau khi chèn.
- Các mẫu phải phù hợp với tài liệu giáo dục tiểu học, phiếu bài tập, giáo án và tài liệu học tập.

### 5. Cải tiến UI/UX

- Thiết kế Sidebar gọn gàng, phân cấp rõ ràng.
- Có trạng thái active khi chọn từng nhóm.
- Sử dụng card, icon và preview nhỏ để người dùng nhận biết mẫu nhanh chóng.
- Có hiệu ứng hover và chuyển đổi mượt mà.
- Tối ưu không gian giữa Sidebar, Editor và Preview A4.
- Không để khu vực chọn mẫu chiếm quá nhiều diện tích chỉnh sửa.

### 6. Yêu cầu kỹ thuật quan trọng

- Tận dụng component và logic hiện có, hạn chế viết lại toàn bộ.
- Các mẫu khi chèn phải tương thích với cả hai chế độ Normal (JSON) và Beautiful (HTML/CSS).
- Nội dung sau khi chèn phải cập nhật đúng vào Editor và Preview A4.
- Không làm mất dữ liệu tài liệu hiện tại.
- Không ảnh hưởng chức năng Xuất DOCX, tự động lưu, Format, Tìm kiếm và chuyển đổi chế độ.
- Không chỉnh sửa AI Studio.
- Không tạo thêm bài mới, giữ nguyên 8 bài hiện có.

Mục tiêu cuối cùng: Biến khu vực Documents thành một trình soạn thảo tài liệu học tập có thư viện thành phần dựng sẵn, thao tác nhanh, dễ sử dụng và có khả năng in tài liệu A4 thực tế.

Hãy kiểm tra cấu trúc code hiện tại trước khi triển khai và đảm bảo các chức năng cũ vẫn hoạt động bình thường.