# NÂNG CẤP TRANG CÀI ĐẶT ADMIN – EDUPLAY

## 1. Mục tiêu

Nâng cấp trang **Quản trị → Cài đặt** để trở thành trung tâm quản lý cấu hình và tình trạng hệ thống EduPlay.

Giữ nguyên giao diện, màu sắc, phong cách thiết kế và cấu trúc hiện tại. Không làm lại toàn bộ trang, không ảnh hưởng đến các chức năng đang hoạt động.

## 2. Các chức năng hiện tại cần giữ nguyên

- Đổi mật khẩu quản trị.
- Hiển thị thông tin tài khoản quản trị.
- Thống kê dung lượng LocalStorage.
- Thống kê cache game đã tải.
- Đo lại dung lượng và xóa bộ nhớ đệm game.

Không được xóa hoặc làm hỏng các chức năng này.

## 3. Các chức năng cần bổ sung

### A. Kiểm tra trạng thái hệ thống

Tạo khu vực **Tình trạng hệ thống**, hiển thị:

- Backend API: Đang hoạt động / Không kết nối.
- MongoDB: Đã kết nối / Mất kết nối.
- Supabase Storage: Hoạt động / Lỗi kết nối.
- Trạng thái tải file HTML game.
- Thời điểm kiểm tra gần nhất.

Yêu cầu:
- Có nút "Kiểm tra ngay".
- Hiển thị trạng thái bằng màu sắc và biểu tượng dễ nhận biết.
- Có trạng thái loading khi đang kiểm tra.
- Có thông báo kết quả thành công hoặc thất bại.
- Kiểm tra thông qua Backend API, không để lộ Secret Key hoặc thông tin kết nối nhạy cảm ra Frontend.

### B. Quản lý lưu trữ game

Tạo khu vực **Lưu trữ game**, hiển thị:

- Tổng số game đang quản lý.
- Tổng số file HTML.
- Tổng số thumbnail.
- Dung lượng lưu trữ nếu có dữ liệu thống kê chính xác.
- Trạng thái kết nối Supabase Storage.

Yêu cầu:
- Sử dụng dữ liệu thực tế từ Backend/Supabase nếu có API hỗ trợ.
- Không tự ước lượng dung lượng rồi hiển thị như số liệu chính xác.
- Có nút kiểm tra lại dữ liệu.
- Không hiển thị Secret Key, Access Token hoặc thông tin bảo mật.

### C. Kiểm tra URL game

Tạo khu vực **Kiểm tra dữ liệu game**.

Chức năng:
- Kiểm tra các game trong MongoDB có `htmlUrl` hợp lệ hay không.
- Kiểm tra khả năng truy cập URL HTML trên Supabase.
- Kiểm tra URL thumbnail.
- Phát hiện game thiếu HTML hoặc thumbnail.
- Phân loại lỗi: URL không tồn tại, không truy cập được, lỗi HTTP hoặc thiếu dữ liệu.

Hiển thị danh sách kết quả:
- Tên game.
- Trạng thái HTML.
- Trạng thái thumbnail.
- Nguyên nhân lỗi nếu có.

Có nút "Quét toàn bộ game".

Lưu ý:
- Không tự động xóa game hoặc file trên Supabase.
- Không tự ý sửa URL trong MongoDB.
- Không quét liên tục gây quá tải Backend.
- Có thể phân trang hoặc chia thành từng đợt khi số lượng game lớn.

### D. Quản lý phiên đăng nhập

Tạo khu vực **Bảo mật tài khoản**.

Bổ sung:
- Hiển thị thông tin phiên đăng nhập hiện tại.
- Đăng xuất khỏi tất cả thiết bị nếu Backend hỗ trợ.
- Cảnh báo khi đổi mật khẩu.
- Khi đổi mật khẩu thành công, xử lý thu hồi token cũ theo cơ chế xác thực hiện tại.

Không tự tạo cơ chế quản lý phiên mới nếu hệ thống hiện tại chưa hỗ trợ. Hãy kiểm tra Auth/JWT trước khi triển khai.

### E. Nhật ký hoạt động quản trị

Tạo khu vực **Nhật ký hoạt động**.

Theo dõi các thao tác quan trọng:
- Đăng nhập và đăng xuất.
- Tạo game.
- Chỉnh sửa game.
- Xóa game.
- Tạo, sửa, xóa người dùng.
- Thay đổi quyền và vai trò.
- Thay đổi cấu hình hệ thống.

Thông tin mỗi bản ghi:
- Người thực hiện.
- Hành động.
- Đối tượng bị tác động.
- Thời gian.
- Kết quả thành công hoặc thất bại.

Yêu cầu:
- Lưu nhật ký ở Backend/Database.
- Chỉ tài khoản có quyền phù hợp mới được xem.
- Có tìm kiếm, lọc theo hành động và thời gian.
- Có phân trang.
- Không ghi mật khẩu, Secret Key, JWT hoặc dữ liệu nhạy cảm vào log.

### F. Cấu hình hệ thống

Tạo khu vực **Cấu hình chung** gồm:

- Tên hệ thống.
- Logo.
- Favicon.
- Thông tin liên hệ hỗ trợ.
- Thông báo bảo trì hệ thống.

Yêu cầu:
- Chỉ lưu và cho phép chỉnh sửa những cấu hình thực sự cần thiết.
- Cấu hình phải được lưu ở Backend/Database nếu cần dùng chung cho nhiều thiết bị.
- Không lưu cấu hình quan trọng chỉ trong LocalStorage.
- Không tự ý thay đổi cấu hình mặc định của hệ thống.

### G. Cấu hình thông báo

Tạo khu vực **Thông báo hệ thống**:

- Bật/tắt thông báo chung.
- Cấu hình thông báo khi có người dùng mới.
- Cấu hình thông báo khi có bài tập mới.
- Cấu hình thông báo bảo trì.

Chỉ triển khai những loại thông báo mà hệ thống hiện tại thực sự hỗ trợ. Không tạo các nút bật/tắt giả.

## 4. Bố cục giao diện đề xuất

Chia trang Cài đặt thành các nhóm rõ ràng:

1. **Tài khoản:** Đổi mật khẩu và thông tin quản trị.
2. **Bảo mật:** Phiên đăng nhập và bảo mật tài khoản.
3. **Hệ thống:** Trạng thái Backend, MongoDB và Supabase.
4. **Lưu trữ:** Dữ liệu game, HTML và thumbnail.
5. **Kiểm tra game:** Quét URL HTML và thumbnail.
6. **Thông báo:** Cấu hình thông báo hệ thống.
7. **Dữ liệu cục bộ:** LocalStorage và cache game hiện tại.
8. **Nhật ký:** Lịch sử thao tác quản trị.

Có thể sử dụng các card hoặc nhóm nội dung có tiêu đề riêng. Không nên nhồi tất cả vào một khối dài.

## 5. Yêu cầu thiết kế UI/UX

- Đồng bộ hoàn toàn với giao diện Admin EduPlay hiện tại.
- Giữ nguyên sidebar, header, font chữ, màu sắc và khoảng cách.
- Thiết kế chuyên nghiệp, đơn giản, dễ sử dụng.
- Responsive trên desktop, tablet và mobile.
- Các trạng thái cần phân biệt rõ: Thành công, Cảnh báo, Lỗi, Đang kiểm tra.
- Có loading, empty state và error state.
- Các thao tác nguy hiểm như đăng xuất tất cả thiết bị phải có hộp thoại xác nhận.
- Không sử dụng quá nhiều màu sắc hoặc hiệu ứng không cần thiết.

## 6. Yêu cầu kỹ thuật quan trọng

Trước khi code:

1. Đọc và phân tích cấu trúc toàn bộ dự án.
2. Tìm trang Admin Settings hiện tại.
3. Kiểm tra các API, Controller, Service, Model và cơ chế phân quyền.
4. Kiểm tra cách lưu game hiện tại trong MongoDB.
5. Kiểm tra tích hợp Supabase Storage hiện tại.
6. Tái sử dụng các component và service đang có.

Trong quá trình triển khai:

- Ưu tiên sử dụng API hiện có.
- Chỉ tạo API mới khi thực sự cần thiết.
- Không tạo Controller, Service hoặc Model trùng lặp.
- Không hardcode dữ liệu giả để hiển thị.
- Không để lộ thông tin bảo mật ra Frontend.
- Kiểm tra quyền Admin ở Backend, không chỉ ẩn nút ở giao diện.
- Không làm ảnh hưởng đến các chức năng game, người dùng, lớp học và bài tập.
- Không thay đổi cấu trúc dữ liệu hiện tại nếu không cần thiết.

### H. Rà soát và dọn dẹp các file Service không sử dụng

Yêu cầu kiểm tra toàn bộ thư mục Service ở cả Frontend và Backend.

Thực hiện:

1. Liệt kê tất cả các file Service hiện có.
2. Kiểm tra từng file có đang được import hoặc sử dụng ở bất kỳ đâu trong dự án hay không.
3. Kiểm tra cả các trường hợp import gián tiếp, dynamic import, lazy loading và các cơ chế gọi service thông qua cấu hình hoặc registry.
4. Xác định những file Service thực sự không còn được sử dụng.
5. Xóa các file Service thừa, không còn cần thiết.
6. Kiểm tra lại toàn bộ import sau khi xóa để tránh lỗi module không tìm thấy.
7. Nếu phát hiện nhiều Service có chức năng trùng lặp, ưu tiên hợp nhất hợp lý thay vì tạo thêm file mới.

**Các nguyên tắc bắt buộc:**

- Không xóa file chỉ vì không thấy import trực tiếp.
- Không xóa Service đang được sử dụng bởi bất kỳ chức năng nào.
- Không xóa nhầm API Service, Auth Service, Game Service hoặc các Service nghiệp vụ hiện tại.
- Không tự ý thay đổi logic nghiệp vụ trong quá trình dọn dẹp.
- Không xóa file chỉ vì tên file có vẻ không còn cần thiết.
- Nếu không chắc chắn một file có đang được sử dụng hay không, hãy giữ lại và báo cáo.
- Chỉ xóa những file đã xác minh chắc chắn không còn được sử dụng.

Sau khi dọn dẹp:
- Chạy kiểm tra import và build Frontend.
- Kiểm tra Backend khởi động bình thường.
- Kiểm tra các chức năng liên quan vẫn hoạt động.
- Báo cáo danh sách file Service đã xóa và lý do xóa từng file.

## 7. Kiểm thử sau khi hoàn thành

Kiểm tra đầy đủ:

- Đổi mật khẩu vẫn hoạt động.
- Thông tin tài khoản hiển thị chính xác.
- LocalStorage và cache vẫn đo, xóa được.
- Kiểm tra trạng thái API hoạt động.
- Kiểm tra Supabase không làm lộ Secret Key.
- Quét URL game trả về kết quả chính xác.
- Nhật ký được ghi nhận đúng thao tác.
- Các cấu hình được lưu và tải lại chính xác.
- Phân quyền Admin hoạt động.
- Giao diện responsive.
- Không có lỗi Console hoặc lỗi API ngoài ý muốn.
- Frontend build thành công.
- Backend khởi động thành công.
- Không có lỗi import do xóa Service.

## 8. Báo cáo sau khi thực hiện

Sau khi hoàn thành, hãy báo cáo:

1. Những chức năng đã bổ sung.
2. Những file Frontend đã chỉnh sửa.
3. Những file Backend đã chỉnh sửa.
4. API mới được tạo (nếu có).
5. Danh sách file Service đã xóa và lý do.
6. Những chức năng chưa thể triển khai và lý do.
7. Kết quả kiểm thử.

**Yêu cầu cuối cùng:** Hãy triển khai trực tiếp trên code hiện tại của EduPlay. Ưu tiên tính ổn định, bảo mật và khả năng sử dụng thực tế. Không chỉ dựng giao diện minh họa mà phải kết nối dữ liệu và xử lý chức năng thật.