YÊU CẦU CẬP NHẬT: TÍCH HỢP CÔNG CỤ CHỈNH SỬA PDF VÀO WEB , trang dashboard cho giáo viên
1. Mục tiêu
Bổ sung một chức năng Chỉnh sửa PDF trực tiếp trên website React hiện tại, cho phép người dùng tải tài liệu PDF lên, xem trước, thực hiện các thao tác chỉnh sửa phổ biến và xuất lại thành file PDF mới.

Tính năng cần hoạt động ngay trên giao diện web, thân thiện, dễ sử dụng và tương thích với giao diện/style hiện có của dự án. Không làm ảnh hưởng đến các chức năng đang hoạt động.
2. Yêu cầu giao diện
- Bổ sung mục hoặc nút Chỉnh sửa PDF tại vị trí phù hợp trong giao diện hiện tại.
- Thiết kế giao diện trực quan, hiện đại, đồng bộ với màu sắc, typography, component và quy tắc responsive sẵn có của website.
- Có khu vực kéo-thả hoặc chọn file PDF từ thiết bị.
- Sau khi tải file, hiển thị tài liệu trong vùng làm việc chính; có thanh công cụ chỉnh sửa rõ ràng.
- Hỗ trợ màn hình desktop, tablet và mobile. Trên mobile, thanh công cụ cần bố trí gọn, không che khuất tài liệu.
- Có trạng thái loading, lỗi, file không hợp lệ và thông báo khi xuất file thành công.
3. Chức năng cần có
3.1. Tải lên và xem PDF
- Chọn file PDF từ máy hoặc kéo-thả vào vùng tải lên.
- Kiểm tra định dạng và dung lượng file; hiển thị thông báo dễ hiểu nếu file không hợp lệ hoặc vượt giới hạn.
- Hiển thị PDF theo từng trang, giữ đúng tỷ lệ và chất lượng.
- Có điều hướng trang trước/sau, nhập số trang, phóng to/thu nhỏ và vừa khung nhìn.
- Hiển thị số trang hiện tại và tổng số trang.
3.2. Chỉnh sửa nội dung PDF
Cần phân biệt rõ hai nhóm thao tác:

Nhóm thao tác có thể triển khai trực tiếp:
- Thêm văn bản mới lên trang PDF.
- Chỉnh font chữ có sẵn trong thư viện, cỡ chữ, màu chữ, căn lề.
- Kéo thả, di chuyển, thay đổi kích thước và xóa các đối tượng văn bản vừa thêm.
- Thêm hình ảnh, di chuyển, thay đổi kích thước và xóa hình ảnh.
- Thêm hình chữ nhật, đường kẻ hoặc vùng che nội dung.
- Xoay trang, xóa trang và sắp xếp lại thứ tự trang.
- Thêm ghi chú, highlight hoặc đánh dấu nội dung nếu thư viện được chọn hỗ trợ.
Nhóm chỉnh sửa nội dung chữ gốc đã tồn tại trong PDF:
- Không được giả định rằng mọi PDF đều cho phép click vào chữ cũ rồi sửa trực tiếp như Word.
- Cần kiểm tra khả năng trích xuất text, font và vị trí chữ của PDF.
- Nếu có thể xác định chính xác vùng chữ và font, cung cấp phương án chỉnh sửa phù hợp.
- Với PDF scan hoặc chữ đã được chuyển thành hình ảnh, cần có OCR nếu muốn nhận diện nội dung.
- Nếu không thể sửa an toàn chữ gốc, thông báo rõ giới hạn và cung cấp phương án che nội dung cũ rồi chèn nội dung mới.
- Không làm sai lệch các phần nội dung xung quanh khi thay thế chữ.
3.3. Quản lý thao tác
- Có Undo/Redo cho các thao tác chỉnh sửa.
- Có thể chọn, di chuyển, chỉnh sửa và xóa đối tượng đã thêm.
- Có thao tác khôi phục về trạng thái ban đầu hoặc tải lại file gốc.
- Cảnh báo trước khi rời trang nếu còn thay đổi chưa xuất/lưu.
- Không tự động ghi đè file gốc.
3.4. Xuất PDF
- Có nút Xuất PDF dễ nhận biết.
- Xuất toàn bộ trang cùng các nội dung đã chỉnh sửa.
- Giữ đúng kích thước trang, thứ tự trang và chất lượng hình ảnh.
- Tên file xuất mặc định có thể thêm hậu tố -edited.
- Người dùng có thể tải file PDF đã chỉnh sửa về thiết bị.
- Kiểm tra file xuất có thể mở lại bình thường và không bị mất nội dung.
- Nếu có lỗi xuất file, hiển thị nguyên nhân phù hợp và không làm mất phiên chỉnh sửa hiện tại.
4. Định hướng kỹ thuật
Trước khi cài thư viện hoặc sửa code, hãy kiểm tra cấu trúc dự án, phiên bản React, cách quản lý state, hệ thống UI, routing và quy ước code hiện tại.

Có thể cân nhắc các thư viện sau, nhưng phải kiểm tra tính tương thích trước khi lựa chọn:
- PDF.js / pdfjs-dist: render và đọc nội dung PDF.
- React PDF: hiển thị PDF trong React nếu phù hợp với phiên bản dự án.
- pdf-lib: tạo PDF mới, ghép trang và thêm text/image/shape lên PDF.
- Fabric.js hoặc Konva: xây dựng lớp đối tượng chỉnh sửa dạng overlay trên trang PDF nếu cần.
- OCR: chỉ tích hợp khi thực sự cần nhận diện chữ trong PDF scan.
Lưu ý kỹ thuật quan trọng:
- pdf-lib không phải công cụ hoàn chỉnh để chỉnh sửa tùy ý các đoạn text gốc trong mọi PDF.
- Không quảng cáo tính năng là “sửa được mọi chữ trong PDF” nếu thực tế chỉ hỗ trợ thêm lớp nội dung mới.
- Tách riêng phần render PDF, lớp thao tác chỉnh sửa và phần xuất file để dễ bảo trì.
- Quản lý bộ nhớ tốt; giải phóng object URL, canvas và worker khi đóng tài liệu hoặc chuyển file.
- Xử lý file ở phía client nếu phù hợp để hạn chế gửi tài liệu riêng tư lên server. Chỉ sử dụng backend khi có yêu cầu rõ ràng.
- Không gửi nội dung PDF lên dịch vụ bên thứ ba nếu chưa có sự đồng ý của người dùng.
5. Yêu cầu về chất lượng và an toàn
- Không phá vỡ layout, style hoặc chức năng hiện tại của website.
- Tái sử dụng component, modal, button, notification và hệ thống theme đang có.
- Không viết lại toàn bộ ứng dụng hoặc thay đổi routing không cần thiết.
- Kiểm tra file PDF lỗi, file mã hóa/mật khẩu, file quá lớn và trường hợp trình duyệt không hỗ trợ.
- Không để thao tác chỉnh sửa làm thay đổi file gốc.
- Có xử lý lỗi rõ ràng, không để màn hình trắng khi PDF không đọc được.
- Đảm bảo không có lỗi console nghiêm trọng và không phát sinh dependency conflict.
- Viết code đúng convention hiện tại; nếu dự án đang dùng JavaScript/JSX thì tiếp tục dùng JavaScript/JSX, không tự ý chuyển sang TypeScript.
6. Tiêu chí nghiệm thu
Chỉ xem là hoàn thành khi đáp ứng các tiêu chí sau:
1. Người dùng tải được PDF hợp lệ và xem được tài liệu theo từng trang.
2. Điều hướng trang, zoom in/out và fit-to-view hoạt động.
3. Có thể thêm, chọn, di chuyển, chỉnh sửa và xóa text/image/shape đã thêm.
4. Có Undo/Redo cho các thao tác chính.
5. Có thể xoay, xóa và sắp xếp trang nếu các thao tác này được triển khai trong phạm vi phiên bản.
6. Xuất được PDF mới, tải xuống được và mở lại bình thường.
7. Nội dung gốc không bị thay đổi ngoài ý muốn; các giới hạn chỉnh sửa text gốc được thông báo minh bạch.
8. Giao diện responsive và đồng bộ với website hiện tại.
9. Không làm hỏng các chức năng cũ.
10. Có hướng dẫn ngắn về các thao tác và giới hạn của công cụ.
7. Cách triển khai
- Bước 1: Khảo sát cấu trúc source code và xác định vị trí tích hợp phù hợp.
- Bước 2: Đề xuất thư viện và kiến trúc triển khai, nêu rõ tính năng nào hỗ trợ trực tiếp và tính năng nào có giới hạn.
- Bước 3: Xây dựng giao diện tải lên, xem PDF và thanh công cụ.
- Bước 4: Triển khai các thao tác chỉnh sửa và quản lý Undo/Redo.
- Bước 5: Triển khai xuất PDF và xử lý lỗi.
- Bước 6: Kiểm thử với PDF có text thật, PDF nhiều trang, PDF scan, PDF có hình ảnh và file lớn.
- Bước 7: Kiểm tra responsive, chạy build/test và sửa các lỗi phát sinh.
Yêu cầu cuối cùng: Hãy cập nhật trực tiếp trên codebase React hiện tại, ưu tiên thay đổi nhỏ, rõ ràng và dễ bảo trì. Trước khi sửa, hãy đọc code liên quan; không tự ý tạo một ứng dụng độc lập hoặc thay đổi công nghệ của dự án.