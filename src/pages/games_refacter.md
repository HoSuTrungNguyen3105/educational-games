# Kiểm tra và hoàn thiện hệ thống 3 dạng game EduPlay

## 1. Mục tiêu

Kiểm tra cấu trúc dự án hiện tại và tổ chức website học tập thành 3 dạng game riêng biệt:

1. **Game học tập:** Game trực tuyến phục vụ học tập, lưu kết quả và tiến trình người chơi.
2. **Game thư giãn:** Game offline, có thể chơi không cần kết nối Internet sau khi tải đầy đủ tài nguyên cần thiết.
3. **Game nhập vai trường học:** Sử dụng game hiện có tại `src/games/school_mission/School_mission.html`.

## 2. Yêu cầu kiểm tra và triển khai

- Kiểm tra cấu trúc frontend, router, API, hệ thống game và Service Worker/PWA hiện tại trước khi sửa.
- Giữ nguyên công nghệ và kiến trúc đang sử dụng; frontend chỉ sử dụng JavaScript/JSX, không chuyển sang TypeScript.
- Phân loại và hiển thị rõ ràng 3 dạng game trên giao diện.
- Không tạo game mới thay thế khi dự án đã có game tương ứng.
- Tái sử dụng hệ thống tài khoản, hồ sơ, cấp độ, tiền xu, vật phẩm và thành tựu hiện có khi phù hợp.
- Không làm hỏng các chức năng hoặc luồng chơi hiện tại.

## 3. Yêu cầu riêng cho từng dạng game

### Game học tập
- Giữ nguyên cơ chế học tập, chấm điểm và lưu kết quả hiện có.
- Kiểm tra việc đồng bộ dữ liệu với backend.

### Game thư giãn offline
- Kiểm tra khả năng chơi khi mất kết nối Internet.
- Xác định các tài nguyên cần lưu cache để game hoạt động offline.
- Kiểm tra Service Worker/PWA, cơ chế cập nhật phiên bản và lưu tiến trình nếu game hỗ trợ.
- Không phụ thuộc API trực tuyến trong quá trình chơi offline; nếu cần đồng bộ kết quả, thực hiện khi có mạng trở lại.

### Game nhập vai trường học
- Kiểm tra và tích hợp game tại `src/games/school_mission/School_mission.html`.
- Xác định cách mở game, tải tài nguyên, giao tiếp với frontend và lưu tiến trình.
- Giữ nguyên gameplay hiện tại, chỉ sửa những phần cần thiết để tích hợp.
- Kiểm tra đường dẫn tài nguyên, điều hướng quay lại website và khả năng hiển thị trên thiết bị di động.

## 4. Kiểm thử và tiêu chí hoàn thành

- Cả 3 dạng game được phân loại và truy cập đúng.
- Game học tập vẫn hoạt động bình thường.
- Game thư giãn chơi được offline sau khi tải tài nguyên cần thiết.
- Game nhập vai mở đúng file `School_mission.html` và hoạt động đầy đủ.
- Kiểm tra lỗi console, API, đường dẫn tài nguyên, PWA và điều hướng.
- Chạy build và sửa các lỗi phát sinh.

**Lưu ý:** Trước tiên hãy kiểm tra mã nguồn và báo cáo những vấn đề phát hiện được. Sau đó mới chỉnh sửa trực tiếp các file cần thiết, tránh viết lại toàn bộ hệ thống hoặc tạo thêm file trùng chức năng.