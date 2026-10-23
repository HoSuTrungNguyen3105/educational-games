Hãy kiểm tra và sửa cảnh báo Vite trong dự án React/Vite của tôi.

**Thư mục dự án:** `F:\Clone\edu_game\educational-games`

Khi chạy `npm run build`, xuất hiện cảnh báo:

```text
(!) Your Vite config uses features that are unsupported by
configLoader: 'native':
- __dirname (vite.config.js:16:34). Use import.meta.dirname instead.
Set VITE_CONFIG_NATIVE_IGNORE_WARNING=true to suppress this warning.
```

**Yêu cầu thực hiện:**

1. Đọc file `vite.config.js`, kiểm tra chính xác dòng 16 và các vị trí khác đang sử dụng `__dirname`.
2. Xác định nguyên nhân và sửa tận gốc cảnh báo, ưu tiên thay `__dirname` bằng `import.meta.dirname` nếu phù hợp với phiên bản Node.js và cấu hình hiện tại.
3. Nếu cách thay thế trên không tương thích với môi trường dự án, hãy chọn giải pháp tương thích phù hợp, không sửa máy móc.
4. Giữ nguyên toàn bộ cấu hình hiện tại của Vite, bao gồm:
   - `base` và cấu hình deploy GitHub Pages với tên miền riêng qua file `CNAME`.
   - Các alias, plugin, đường dẫn public và cấu hình build hiện có.
   - Các thiết lập khác phục vụ hoạt động của EduPlay.
5. Không thay đổi logic ứng dụng, không nâng cấp phiên bản package nếu không cần thiết, không xóa file và không chỉnh sửa các phần không liên quan.
6. Kiểm tra cấu hình build để bảo đảm thư mục `edu-game-ai-service` là dự án riêng, không bị đưa vào bản build frontend nếu hiện tại dự án đã có yêu cầu loại trừ thư mục này.
7. Sau khi sửa, chạy `npm run build` để xác minh kết quả. Nếu build thất bại, hãy phân tích và sửa lỗi phát sinh liên quan trực tiếp đến thay đổi.
8. Báo cáo rõ file nào đã sửa, nội dung thay đổi, kết quả build và các cảnh báo còn tồn tại.

**Lưu ý:** Không chỉ hướng dẫn tôi cách sửa hoặc ẩn cảnh báo. Hãy trực tiếp kiểm tra và chỉnh sửa code trong workspace. Không được tự ý thay đổi cấu hình deploy đang hoạt động.