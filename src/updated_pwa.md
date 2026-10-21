# Kiểm tra và sửa lỗi PWA không cập nhật trên iPhone

Dự án sử dụng React + Vite, `vite-plugin-pwa`, Workbox và PWA có đường dẫn `/educational-games/`.

**Vấn đề:** Sau khi deploy phiên bản mới, PWA đã cài trên iPhone đôi khi vẫn hiển thị giao diện hoặc dữ liệu cũ. Hãy kiểm tra và sửa trực tiếp code để khắc phục.

## Yêu cầu

1. Kiểm tra `vite.config.js`, `src/main.jsx`, `package.json` và toàn bộ các file đăng ký Service Worker.
2. Phát hiện đăng ký Service Worker trùng lặp, lỗi `autoUpdate`, `skipWaiting`, `clientsClaim` hoặc cơ chế reload không đúng.
3. Kiểm tra cache của `index.html`, JS/CSS, API và HTML game; xác định nguyên nhân khiến nội dung cũ vẫn xuất hiện.
4. Kiểm tra cấu hình deploy, HTTP cache headers, `base` và `scope` của PWA.
5. Kiểm tra tương thích với iOS Safari và PWA cài trên màn hình chính.
6. Sửa trực tiếp các file cần thiết, tránh thay đổi những phần không liên quan.
7. Đảm bảo cập nhật tự động khi có phiên bản mới, hạn chế reload liên tục và không yêu cầu người dùng xóa cache hoặc cài lại ứng dụng.
8. Giữ nguyên Firebase Messaging, routing, game online, game offline và dữ liệu học tập.
9. Chạy build production và kiểm tra các lỗi phát sinh.

## Báo cáo

Sau khi sửa, hãy nêu:
- Nguyên nhân tìm được.
- Các file đã sửa và nội dung thay đổi.
- Kết quả build.
- Những điểm cần kiểm tra thêm trên iPhone thực tế.

**Lưu ý:** Không kết luận đã sửa hoàn toàn nếu chưa kiểm thử trên iPhone. Không xóa toàn bộ cache hoặc viết lại cấu hình PWA khi chưa có lý do kỹ thuật.