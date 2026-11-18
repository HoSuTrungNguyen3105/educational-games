# NÂNG CẤP DOCUMENT STUDIO

Chỉ thực hiện tại trang `#/dashboard/documents/`. Hãy kiểm tra code hiện tại trước khi triển khai, giữ lại những chức năng đang hoạt động tốt và tập trung nâng cấp UI/UX.

## 1. Cập nhật tên nút chuyển đổi chế độ

Giữ nguyên chức năng hiện tại, chỉ đổi tên hai nút:

- **JSON → Normal:** Giữ nguyên chức năng hiển thị và chỉnh sửa JSON.
- **HTML/CSS → Beautiful:** Giữ nguyên chức năng hiển thị và chỉnh sửa HTML/CSS.

Yêu cầu UI/UX:
- Thiết kế lại hai nút theo phong cách hiện đại, chuyên nghiệp.
- Làm nổi bật chế độ đang được chọn.
- Có hiệu ứng chuyển đổi mượt mà giữa hai chế độ.
- Cải thiện màu sắc, typography, trạng thái hover và active.
- Không thay đổi logic xử lý hoặc cơ chế đồng bộ dữ liệu hiện tại.

## 2. Xây dựng thư viện mẫu chọn nhanh

Các thành phần trong Sidebar cần có trải nghiệm giống một thư viện mẫu trong trình soạn thảo chuyên nghiệp.

Yêu cầu:
- Mỗi mẫu hiển thị dưới dạng card nhỏ, có tên, biểu tượng và bản xem trước.
- Có thanh tìm kiếm theo từ khóa.
- Có bộ lọc theo nhóm.
- Khi chọn mẫu, cho phép xem trước hoặc chèn trực tiếp vào vị trí hiện tại trong tài liệu.
- Có thể tùy chỉnh nội dung sau khi chèn.
- Các mẫu ưu tiên phục vụ giáo dục tiểu học, giáo án, phiếu bài tập và tài liệu học tập.
- Hỗ trợ tương thích với cả Normal và Beautiful.

## 3. Sửa lỗi thanh cuộn trong Preview A4

Hiện tại khu vực Preview bên phải xuất hiện thanh cuộn bên trong khung Word/PDF.

Hãy sửa lại để:

- Chỉ có **một thanh cuộn dọc duy nhất ở bên ngoài khu vực Preview**.
- Không hiển thị thanh cuộn riêng bên trong từng trang A4 hoặc khung nội dung tài liệu.
- Khi cuộn, toàn bộ các trang A4 di chuyển liên tục cùng nhau.
- Hỗ trợ nhiều trang A4 liên tiếp.
- Giữ nguyên chức năng zoom, phóng to, thu nhỏ.
- Không làm mất nội dung hoặc khiến trang bị cắt, tràn.

Mục tiêu là tạo trải nghiệm đọc tài liệu giống một trình xem Word/PDF chuyên nghiệp.

## 4. Tối ưu Padding và không gian giao diện

Hiện tại trang Documents có khá nhiều khoảng padding và khoảng trống chưa cần thiết.

Hãy:
- Giảm padding ở các container chính.
- Thu gọn khoảng cách giữa Sidebar, Editor và Preview.
- Tối ưu padding trong Toolbar và các panel.
- Giảm khoảng trống thừa ở các card và khu vực chức năng.
- Tận dụng tối đa diện tích màn hình cho Editor và Preview.
- Vẫn giữ khoảng cách đủ thoáng để giao diện không bị chật chội.

Ưu tiên thiết kế gọn gàng, hiện đại và chuyên nghiệp.

## 5. Sửa chức năng đóng/mở Preview

Hiện tại khi nhấn nút X ở góc trên bên phải Preview thì không có action.

Hãy triển khai:

- Khi click X, toàn bộ khu vực Preview bên phải phải được ẩn đi.
- Editor bên trái tự động mở rộng để tận dụng không gian.
- Có hiệu ứng đóng/mở mượt mà.
- Bổ sung nút mở lại Preview khi cần.
- Khi mở lại, Preview phải giữ đúng nội dung, trạng thái zoom và trạng thái hiển thị trước đó.
- Không làm mất dữ liệu đang chỉnh sửa.

## 6. Nâng cấp UI/UX tổng thể

- Đồng bộ phong cách thiết kế giữa Sidebar, Editor và Preview.
- Có hiệu ứng hover, active và chuyển cảnh tinh tế.
- Cải thiện typography, icon, màu sắc và trạng thái tương tác.
- Tối ưu giao diện trên các kích thước màn hình khác nhau.
- Không để thư viện mẫu chiếm quá nhiều diện tích chỉnh sửa.
- Ưu tiên trải nghiệm thao tác nhanh, trực quan và dễ sử dụng.

## 7. Yêu cầu kỹ thuật và kiểm thử

- Tận dụng component, CSS và logic hiện có.
- Không viết lại toàn bộ hệ thống nếu không cần thiết.
- Không thay đổi logic JSON, HTML/CSS và cơ chế đồng bộ dữ liệu đang hoạt động.
- Không làm mất dữ liệu tài liệu hiện tại.
- Không ảnh hưởng các chức năng tự động lưu, Format, Tìm kiếm, Chuyển đổi, Áp dụng thay đổi và Xuất DOCX.
- Kiểm tra thanh cuộn chỉ còn một thanh bên ngoài.
- Kiểm tra đóng/mở Preview.

**MỤC TIÊU CUỐI CÙNG**

Biến Documents thành một Document Studio chuyên nghiệp dành cho giáo dục, có thư viện thành phần phong phú, thao tác chèn mẫu nhanh, trình chỉnh sửa thuận tiện, Preview A4 mượt mà và giao diện tối ưu.

Hãy chủ động rà soát, phát hiện những điểm còn thiếu và cải tiến hợp lý. Ưu tiên giữ nguyên những gì đang hoạt động tốt, không sửa lan sang các chức năng không liên quan.