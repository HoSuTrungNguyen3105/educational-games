# Chuyển Website thành PWA

Chuyển website hiện tại thành **Progressive Web App (PWA)** để có thể cài đặt trực tiếp trên điện thoại và máy tính như một ứng dụng.

### Yêu cầu chính

* Thêm **Web App Manifest**: tên app, icon, theme màu, splash screen.
* Thêm **Service Worker** để hỗ trợ cache và khả năng hoạt động offline cơ bản.
* Hiển thị nút **Cài đặt ứng dụng / Add to Home Screen** khi thiết bị hỗ trợ.
* Khi mở từ màn hình chính, app chạy ở chế độ **standalone**, không hiển thị thanh trình duyệt.
* Responsive tốt trên **iOS, Android và Desktop**.
* Không làm thay đổi logic, API và giao diện hiện tại ngoài các phần cần thiết cho PWA.
* Nếu website dùng **Vite/React**, ưu tiên cấu hình PWA bằng `vite-plugin-pwa`.
* Chuẩn bị nền tảng để sau này tích hợp **Push Notification**.
