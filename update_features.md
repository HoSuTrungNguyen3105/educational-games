# DANH SÁCH CÁC VẤN ĐỀ CẦN KHẮC PHỤC VÀ HOÀN THIỆN HỆ THỐNG

## 1. Rủi ro bảo mật nghiêm trọng – Lộ thông tin tài khoản mẫu trên giao diện Production

- `src/pages/LoginScreen.jsx:46` đang hiển thị công khai thông tin tài khoản mẫu: *teacher / 123456 – admin / admin123* ngay trên màn hình đăng nhập của website đang hoạt động. Điều này tiềm ẩn nguy cơ truy cập trái phép vào tài khoản quản trị.
- `server/data/users.json` hiện đang lưu mật khẩu dưới dạng văn bản thuần (plaintext), ví dụ: `"password": "admin123"`. Chưa thấy cơ chế hash mật khẩu bằng bcrypt trong dữ liệu khởi tạo.

**Yêu cầu khắc phục:**
- Xóa toàn bộ thông tin tài khoản mẫu khỏi giao diện Production.
- Thay đổi ngay mật khẩu mặc định của tài khoản Admin và Teacher.
- Triển khai cơ chế hash mật khẩu bằng bcrypt.
- Xây dựng quy trình migration để chuyển đổi dữ liệu mật khẩu hiện tại sang định dạng đã hash.
- Đảm bảo không để lộ thông tin đăng nhập trong mã nguồn hoặc giao diện người dùng.

## 2. Chưa có chức năng Quên mật khẩu (Forgot Password)

- `LoginScreen` hiện chưa có liên kết hoặc chức năng Quên mật khẩu.
- Backend chỉ hỗ trợ API `PATCH /users/:id/reset-password`, cho phép Admin đặt lại mật khẩu cho người dùng khác.
- Học sinh và giáo viên chưa thể tự khôi phục tài khoản khi quên mật khẩu.

**Yêu cầu bổ sung:**
- Xây dựng quy trình yêu cầu đặt lại mật khẩu thông qua email hoặc mã xác thực.
- Bổ sung API xử lý yêu cầu khôi phục mật khẩu.
- Triển khai cơ chế xác thực danh tính và mã/link đặt lại mật khẩu có thời hạn.
- Bổ sung giao diện Quên mật khẩu và Đặt lại mật khẩu.
- Đảm bảo an toàn, tránh để lộ thông tin tài khoản khi gửi yêu cầu khôi phục.

## 3. API quản lý trang tĩnh (`/pages`) chưa có endpoint lấy danh sách

- Backend hiện chỉ hỗ trợ các endpoint `GET /:slug`, `GET /:slug/raw` và `PUT /:slug`.
- Chưa có endpoint `GET /api/pages` để lấy danh sách toàn bộ trang tĩnh (kiểm tra thực tế trả về 404).
- Điều này khiến Admin không thể xem và quản lý danh sách các trang hiện có một cách tập trung mà phải biết trước từng `slug`.

**Yêu cầu bổ sung:**
- Xây dựng API `GET /api/pages` để lấy danh sách toàn bộ trang tĩnh.
- Hỗ trợ quản lý, tìm kiếm và truy cập nhanh nội dung từng trang.
- Đảm bảo API được phân quyền phù hợp, chỉ tài khoản có quyền mới được phép quản lý và chỉnh sửa nội dung.

## 4. Ẩn hoàn toàn chức năng Chấm công (Attendance) ở cả Backend và Frontend

Hiện tại hệ thống không còn sử dụng chức năng Chấm công. Do đó, cần ẩn và vô hiệu hóa toàn bộ chức năng này khỏi hệ thống đang hoạt động.

- Backend hiện vẫn tồn tại các API liên quan đến chấm công như `attendance/class/:classId`, `stats/:id/:month` và những route Attendance khác.
- Frontend vẫn có các component như `AttendancePage.jsx`, `AttendanceCalendar.jsx` và những thành phần liên quan.
- Cần rà soát toàn bộ hệ thống để đảm bảo không còn điểm truy cập hoặc khả năng sử dụng chức năng này.

**Yêu cầu thực hiện:**

**Backend:**
- Vô hiệu hóa toàn bộ API liên quan đến Attendance.
- Chặn các request truy cập trực tiếp đến API chấm công, kể cả khi người dùng có token hợp lệ.
- Rà soát route, controller, service, middleware và các API phụ thuộc vào Attendance.

**Frontend:**
- Ẩn toàn bộ chức năng Chấm công khỏi giao diện Admin và Teacher.
- Loại bỏ mục Chấm công khỏi Sidebar, menu, dashboard, tab, nút điều hướng và các liên kết liên quan.
- Ngăn người dùng truy cập trực tiếp vào các route trang Chấm công thông qua URL.
- Rà soát các component như `AttendancePage.jsx`, `AttendanceCalendar.jsx` và những component liên quan để đảm bảo không còn được sử dụng trong luồng giao diện hiện tại.

**Lưu ý quan trọng:**
- Chỉ ẩn và vô hiệu hóa chức năng, không xóa dữ liệu chấm công hiện có.
- Không xóa database, cấu trúc lưu trữ hoặc các file có thể cần thiết khi khôi phục chức năng trong tương lai.
- Không ảnh hưởng đến các chức năng quản lý lớp, học sinh, giáo viên và thống kê khác.
- Có thể giữ lại mã nguồn cũ nếu không gây ảnh hưởng đến quá trình build và vận hành.
- Đảm bảo cả Client và Server đều không thể sử dụng chức năng Chấm công sau khi hoàn thành.

## 5. Route Legacy chưa được xử lý triệt để và có nguy cơ trùng lặp

- Route `admin-all-questions` trong router được ghi chú là route cũ cần chuyển hướng (legacy redirect) sang `/dashboard/questions`.
- Tuy nhiên, `TeacherApp` vẫn đang render trực tiếp component `UnifiedQuestionManagement` thay vì thực hiện chuyển hướng như mô tả.
- Điều này tạo ra sự thiếu nhất quán trong hệ thống điều hướng và có thể gây trùng lặp logic.

**Yêu cầu khắc phục:**
- Rà soát toàn bộ các route legacy trong hệ thống.
- Xóa những route không còn được sử dụng hoặc triển khai redirect thực sự về route mới.
- Đảm bảo không tồn tại nhiều route cùng xử lý một chức năng.
- Giữ nguyên khả năng tương thích với các liên kết cũ nếu vẫn còn người dùng truy cập.

## 6. Hệ thống phân quyền Admin chưa đồng bộ

Một số mục quản trị hiện đang được cấu hình `permission: null`, bao gồm:

- `admin-classes`
- `admin-assignments`
- `admin-studio`
- `admin-documents`
- `admin-avatar-*`
- `admin-pet-catalog`
- `admin-body-custom`
- `admin-plant-types`
- `admin-upload-items`
- `admin-settings`

Trong khi đó, nhiều chức năng khác đã được gắn quyền cụ thể như `games.manage`, `users.view`...

Điều này khiến hệ thống phân quyền chưa đồng bộ và có nguy cơ cho phép người dùng không đủ quyền nhìn thấy hoặc truy cập các chức năng quản trị.

**Yêu cầu khắc phục:**
- Rà soát toàn bộ các mục quản trị đang sử dụng `permission: null`.
- Xây dựng quyền riêng cho từng nhóm chức năng, ví dụ:
  - `classes.manage`
  - `assignments.manage`
  - `avatar.manage`
  - `documents.manage`
  - `settings.manage`
- Đồng bộ hệ thống phân quyền giữa Frontend và Backend.
- Kiểm tra quyền tại `permissionFilter` và các middleware/API tương ứng.
- Không chỉ ẩn menu trên giao diện mà phải thực thi quyền ở phía Server để ngăn truy cập API trái phép.
- Đảm bảo mỗi nhóm tài khoản chỉ được truy cập những chức năng phù hợp với quyền được cấp.

## 7. Hệ thống thống kê và báo cáo dành cho Admin chưa đầy đủ

- Chưa có các endpoint tổng hợp như `GET /api/stats/overview` hoặc `/users/admin/summary` (kiểm tra thực tế trả về 404).
- Dashboard hiện đang sử dụng dữ liệu từ API `/stats` với phạm vi thống kê 14 ngày.
- Tuy nhiên, hệ thống vẫn thiếu các chức năng báo cáo chuyên sâu dành cho quản trị viên.

**Yêu cầu bổ sung:**
- Xây dựng trang tổng quan thống kê toàn hệ thống.
- Bổ sung biểu đồ phân tích dữ liệu theo lớp, môn học và khoảng thời gian.
- Thống kê hoạt động của học sinh và giáo viên.
- Bổ sung chức năng xuất báo cáo dưới định dạng CSV/Excel.
- Hỗ trợ bộ lọc theo thời gian, lớp học và đối tượng.
- Đảm bảo dữ liệu thống kê chính xác, đồng bộ với dữ liệu thực tế từ Backend.

## 8. Chưa có hệ thống kiểm duyệt nội dung do người dùng tạo (UGC Moderation)

- Hệ thống đã có API `/support/admin/reports` để tiếp nhận báo cáo từ học sinh. Tuy nhiên, kết quả kiểm tra hiện trả về mảng rỗng.
- Giao diện xử lý báo cáo hiện được tích hợp trong `SupportTicketManagement`.
- Tuy nhiên, chưa có hàng đợi kiểm duyệt tập trung đối với nội dung do người dùng tạo hoặc tải lên, chẳng hạn tên hiển thị, avatar và các nội dung cá nhân khác.

**Yêu cầu bổ sung:**
- Xây dựng hệ thống Moderation Queue để quản trị viên theo dõi các nội dung cần kiểm duyệt.
- Cho phép Admin xem xét, phê duyệt, từ chối hoặc gỡ bỏ nội dung vi phạm.
- Quản lý các nội dung do học sinh tự tạo hoặc tải lên.
- Có khả năng tiếp nhận và xử lý báo cáo vi phạm từ người dùng.
- Lưu lại lịch sử xử lý và người thực hiện thao tác kiểm duyệt.
- Đảm bảo nội dung không phù hợp không được hiển thị công khai khi chưa được xử lý theo quy định.

## 9. Thiếu các chức năng vận hành và quản trị hệ thống (System Operations)

- Module `system/config` hiện đã hỗ trợ cấu hình `site.name`, `logo`, `favicon`, `supportContact` và banner bảo trì.
- Tuy nhiên, hệ thống vẫn thiếu một số chức năng quan trọng phục vụ công tác vận hành và quản trị lâu dài.

**Các chức năng cần bổ sung:**

**9.1. Notification Broadcast – Quản lý thông báo hàng loạt**
- Xây dựng giao diện quản lý và gửi thông báo đến một lớp, nhiều lớp hoặc toàn trường.
- Hỗ trợ soạn nội dung, lựa chọn đối tượng nhận và theo dõi trạng thái gửi.
- Hiện tại API chủ yếu hỗ trợ thông báo cá nhân và `testPush`, chưa đáp ứng nhu cầu gửi thông báo hàng loạt.

**9.2. Audit Log – Nhật ký hoạt động và quản trị**
- Xây dựng hệ thống ghi nhận lịch sử thao tác của người dùng và quản trị viên.
- Theo dõi ai đã thực hiện hành động gì, trên dữ liệu nào và vào thời điểm nào.
- Hỗ trợ tra cứu, lọc theo người dùng, hành động, chức năng và thời gian.
- Phân biệt nhật ký hoạt động người dùng với log lỗi và log vận hành hệ thống hiện có.

**9.3. Cache/PWA Version Management – Quản lý phiên bản và bộ nhớ đệm**
- Bổ sung cơ chế quản lý phiên bản ứng dụng.
- Theo dõi phiên bản đang triển khai và phiên bản hiện tại của Client.
- Kiểm soát cache để hạn chế tình trạng người dùng tiếp tục sử dụng giao diện hoặc tài nguyên từ phiên bản cũ.
- Hỗ trợ thông báo khi có phiên bản mới và cơ chế cập nhật phù hợp với cấu hình triển khai hiện tại.

---

# YÊU CẦU CHUNG KHI TRIỂN KHAI

1. Rà soát source code hiện tại trước khi chỉnh sửa, xác định rõ những chức năng đã có, còn thiếu hoặc đang hoạt động chưa đúng.
2. Không tự ý xây dựng lại những chức năng đã hoàn thiện hoặc tạo thêm API, component trùng lặp.
3. Ưu tiên tái sử dụng cấu trúc, component, service và hệ thống phân quyền hiện có.
4. Đảm bảo đồng bộ giữa Frontend, Backend, API và dữ liệu.
5. Không làm ảnh hưởng đến các chức năng đang hoạt động ổn định.
6. Đối với những chức năng được yêu cầu ẩn hoặc vô hiệu hóa, không xóa dữ liệu hiện có nếu không có yêu cầu cụ thể.
7. Kiểm tra quyền truy cập thực tế ở cả giao diện và API, không chỉ dựa vào việc ẩn menu.
8. Sau khi chỉnh sửa, chạy build, kiểm tra các route, API và luồng nghiệp vụ liên quan để đảm bảo hệ thống không phát sinh lỗi.
9. Không tự ý thay đổi giao diện hoặc nghiệp vụ ngoài phạm vi yêu cầu.

# BÁO CÁO SAU KHI HOÀN THÀNH

Sau khi thực hiện, hãy tổng hợp kết quả bao gồm:

- Danh sách file đã chỉnh sửa hoặc tạo mới.
- Danh sách API đã bổ sung, chỉnh sửa hoặc vô hiệu hóa.
- Danh sách route và component đã thay đổi.
- Các chức năng đã hoàn thiện và những chức năng còn tồn tại.
- Kết quả kiểm tra phân quyền và bảo mật.
- Kết quả chạy build và kiểm thử.
- Những vấn đề chưa thể xử lý và nguyên nhân cụ thể.

**Mục tiêu cuối cùng:** Hoàn thiện hệ thống quản trị Admin theo hướng bảo mật, đồng bộ, dễ vận hành và có khả năng mở rộng lâu dài; đồng thời đảm bảo những chức năng không còn sử dụng được ẩn và vô hiệu hóa đúng cách mà không làm mất dữ liệu hiện có.