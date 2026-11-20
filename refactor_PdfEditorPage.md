Kiểm tra và tối ưu dung lượng bundle của dự án Educational Games.

Hiện tại npm run build thành công nhưng PdfEditorPage đang có dung lượng 1,682.80 KB, vượt ngưỡng cảnh báo 1,500 KB.

Yêu cầu:
- Phân tích PdfEditorPage và các thư viện đang import.
- Áp dụng React.lazy(), Suspense và dynamic import khi phù hợp.
- Tách các thư viện PDF và chức năng chỉnh sửa PDF thành các chunks riêng.
- Chỉ tải thư viện khi người dùng truy cập chức năng tương ứng.
- Kiểm tra các thư viện bị import trùng lặp.
- Không ảnh hưởng đến các chức năng PDF Editor.
- Không thay đổi giao diện hoặc logic nghiệp vụ.
- Không tăng chunkSizeWarningLimit để che cảnh báo.
- Chạy npm run build sau khi tối ưu và so sánh dung lượng trước/sau.