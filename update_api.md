# Yêu cầu bổ sung và hoàn thiện chức năng Quản lý Game & Template – EduPlay

## 1. Yêu cầu chung

Hiện tại hệ thống đã có sẵn 2 trang:
- **Quản lý Game**
- **Quản lý Template**

Không tạo thêm trang quản lý mới, không thay đổi cấu trúc tổng thể hoặc thiết kế lại toàn bộ giao diện hiện tại. Hãy kiểm tra code đang có và chỉ bổ sung các chức năng còn thiếu, tận dụng lại component, API và logic hiện tại.

Dữ liệu được lấy từ API thực tế, không tự tạo dữ liệu giả để thay thế API.

## 2. Hoàn thiện trang Quản lý Template

Template là mẫu game gốc có thể được sử dụng để tạo nhiều Game khác nhau.

Bổ sung các chức năng sau:

- **Hiển thị số lượng Game đang sử dụng Template:** Đếm số Game có `templateId` tương ứng với `_id` của Template.
- **Xem danh sách Game sử dụng Template:** Khi nhấn vào số lượng Game hoặc một nút tương ứng, cho phép xem những Game đang được tạo từ Template đó.
- **Xem trước Template:** Sử dụng `htmlUrl` để mở bản xem trước Template.
- **Quản lý trạng thái Template:** Nếu Template đang `inactive` thì không cho phép sử dụng Template đó để tạo Game mới.
- **Cảnh báo khi xóa Template:** Nếu Template đang được một hoặc nhiều Game sử dụng, phải hiển thị cảnh báo trước khi xóa. Không tự ý xóa các Game liên quan.
- **Hiển thị thông tin phiên bản:** Sử dụng trường `version` để hiển thị phiên bản Template hiện tại.
- **Thống kê Template:** Có thể bổ sung bộ lọc hoặc sắp xếp theo số lượng Game đang sử dụng, trạng thái và thời gian cập nhật.

## 3. Hoàn thiện trang Quản lý Game

Game là một trò chơi cụ thể được tạo ra dựa trên một Template.

Bổ sung các chức năng sau:

- **Hiển thị Template tương ứng:** Dựa vào `templateId` của Game để tìm Template có `_id` tương ứng.
- **Hiển thị tên Template:** Trong danh sách Game hoặc trang chi tiết Game, hiển thị tên Template mà Game đang sử dụng.
- **Lọc Game theo Template:** Cho phép lọc danh sách Game theo Template đã sử dụng.
- **Xem thông tin Template:** Từ chi tiết Game, có thể xem hoặc mở thông tin Template gốc.
- **Kiểm tra Template khi tạo Game:** Chỉ cho phép chọn những Template có trạng thái `active`.
- **Giữ nguyên dữ liệu riêng của Game:** Các thông tin như tên Game, môn học, chủ đề, mã Game, chế độ chơi, trạng thái, số câu hỏi và cấu hình phải được quản lý riêng, không ghi đè bằng dữ liệu của Template.

## 4. Đồng bộ quan hệ giữa Game và Template

Cần thống nhất quan hệ dữ liệu:

- Một Template có thể được sử dụng để tạo nhiều Game.
- Một Game chỉ tham chiếu đến một Template thông qua `templateId`.
- `Game.templateId` phải tham chiếu đúng `Template._id`.
- Không sao chép các thông tin riêng của Template như `htmlUrl`, `fileName`, `version`, `ring` vào Game nếu không thực sự cần thiết.
- Khi Template được cập nhật, cần đảm bảo việc sử dụng Template của các Game hiện tại không bị ảnh hưởng ngoài ý muốn.

**Lưu ý quan trọng:** Kiểm tra dữ liệu API thực tế trước khi triển khai. Trong dữ liệu mẫu hiện tại, `templateId` của Game là `6acb49e2024bb6e14a65ac88`, trong khi `_id` của Template mẫu là `6a93a7fa19519eaeff8cd9ca`. Hai ID này không trùng nhau. Cần kiểm tra xem đây có phải hai bản ghi khác nhau hay dữ liệu liên kết chưa chính xác. Không được tự ý gán Template dựa trên tên hoặc dữ liệu gần giống nhau.

## 5. Bổ sung khái niệm Game Session

Kiểm tra xem hệ thống đã có chức năng lưu lịch sử chơi game hay chưa.

Nếu chưa có, hãy đề xuất cấu trúc dữ liệu Game Session để lưu từng lượt chơi, bao gồm:

- Game được chơi.
- Người chơi.
- Thời gian bắt đầu và kết thúc.
- Điểm số.
- Kết quả chơi.
- Thời gian hoàn thành.
- Phần thưởng nhận được nếu có.

Lưu ý: Game Session là dữ liệu của từng lượt chơi, không phải dữ liệu của Game hoặc Template. Chỉ triển khai khi phù hợp với kiến trúc backend hiện tại.

## 6. Yêu cầu kỹ thuật

API hiện có:

**Danh sách Template:**
`GET https://educational-games-lp4z.onrender.com/api/templates`

**Danh sách Game:**
`GET https://educational-games-lp4z.onrender.com/api/games?from=1&to=12`

Các trường dữ liệu cần chú ý:

**Template:** `_id`, `name`, `description`, `type`, `category`, `ring`, `htmlUrl`, `thumbnail`, `fileName`, `version`, `status`, `playMode`, `createdAt`, `updatedAt`.

**Game:** `_id`, `name`, `description`, `subject`, `topic`, `language`, `templateId`, `type`, `status`, `playMode`, `deliveryMode`, `questionsCount`, `playersCount`, `code`, `config`, `gameMode`, `createdAt`, `updatedAt`.

Trước khi code:
1. Kiểm tra cấu trúc dự án và các API service hiện tại.
2. Kiểm tra cách hai trang Quản lý Game và Template đang lấy, hiển thị và xử lý dữ liệu.
3. Tận dụng lại các component và hàm có sẵn.
4. Kiểm tra API có hỗ trợ các thao tác cần thiết hay không. Nếu backend chưa có API tương ứng, hãy ghi rõ phần cần backend hỗ trợ, không tự giả lập thao tác thành công.
5. Đảm bảo xử lý loading, lỗi API, dữ liệu rỗng và trường hợp `templateId` không tìm thấy Template.

## 7. Kết quả mong muốn

Sau khi hoàn thiện:
- Trang Quản lý Template biết được mỗi Template đang được bao nhiêu Game sử dụng.
- Có thể xem trước Template và xem các Game liên quan.
- Không thể tạo Game mới từ Template đã inactive.
- Không xóa Template đang được sử dụng mà không có cảnh báo.
- Trang Quản lý Game hiển thị chính xác Template gốc và hỗ trợ lọc theo Template.
- Quan hệ Game – Template được đồng bộ chính xác theo ID.
- Không làm hỏng các chức năng hiện tại, không thay đổi dữ liệu không cần thiết.

**Ưu tiên:** Chỉ bổ sung các chức năng còn thiếu, giữ nguyên giao diện và nghiệp vụ hiện tại. Không tự ý viết lại hai trang hoặc thay đổi kiến trúc dự án nếu không có lý do kỹ thuật rõ ràng.