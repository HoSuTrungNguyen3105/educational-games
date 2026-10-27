# API REFRESH TOKEN — YÊU CẦU TRIỂN KHAI FRONTEND & BACKEND

## 1. Mục tiêu

Kiểm tra và triển khai cơ chế refresh token cho hệ thống hiện tại nhằm duy trì phiên đăng nhập an toàn, tự động cấp access token mới khi cần mà không yêu cầu người dùng đăng nhập lại liên tục.

Trước khi sửa code, hãy kiểm tra cấu trúc dự án, framework backend, API xác thực, cách lưu token, `AuthProvider`, `ApiProvider`, API client, interceptor, cấu hình CORS và cookie.

Ưu tiên tích hợp vào kiến trúc hiện có, không tạo endpoint trùng lặp và không viết lại toàn bộ hệ thống xác thực nếu không cần thiết.

## 2. Kiến trúc lưu trữ token

### 2.1. Access token

- Backend cấp access token sau khi đăng nhập hoặc refresh thành công.
- Frontend nhận access token từ response và lưu trong bộ nhớ ứng dụng, ưu tiên quản lý bằng `AuthProvider` hoặc cơ chế state hiện có.
- Các request cần xác thực sử dụng access token mới nhất trong header `Authorization`.
- Khi tải lại trang, nếu access token trong bộ nhớ đã mất, frontend có thể gọi endpoint refresh để lấy access token mới thông qua refresh token trong cookie.
- Hạn chế lưu access token trong `localStorage` vì JavaScript có thể đọc dữ liệu này nếu ứng dụng gặp lỗ hổng XSS.

### 2.2. Refresh token

- Backend lưu refresh token trong cookie có thuộc tính `HttpOnly`.
- Trong môi trường production, cookie phải sử dụng `Secure` và cấu hình `SameSite` phù hợp với kiến trúc domain.
- Frontend không đọc refresh token bằng `document.cookie`.
- Frontend không lưu refresh token vào `localStorage` hoặc `sessionStorage`.
- Trình duyệt tự gửi cookie khi gọi API refresh nếu cấu hình cookie, CORS và `credentials` cho phép.
- Backend chịu trách nhiệm xác thực, gia hạn, xoay vòng hoặc thu hồi refresh token theo chính sách hiện có.

Nếu dự án đang sử dụng cơ chế lưu token khác, hãy đánh giá khả năng tương thích trước khi thay đổi để tránh làm hỏng login, logout và các request API hiện tại.

## 3. API refresh token

### 3.1. Endpoint

- Kiểm tra endpoint refresh token hiện có trước khi tạo mới.
- Nếu chưa tồn tại, triển khai endpoint theo quy ước của backend.
- Ưu tiên phương thức `POST`.
- Backend lấy refresh token từ cookie `HttpOnly` theo thiết kế đã thống nhất.
- Backend xác thực token trước khi cấp access token mới.
- Không sử dụng access token cũ làm bằng chứng duy nhất để cấp token mới.

### 3.2. Response thành công

Response JSON mong muốn:

```json
{
  "status": true,
  "code": 200,
  "msg": "refresh.success",
  "Authorization": "Bearer <ACCESS_TOKEN_MOI>"
}
```

Quy ước:

- `status`: `true` khi refresh thành công.
- `code`: mã kết quả `200`.
- `msg`: thông báo `refresh.success`.
- `Authorization`: access token mới theo định dạng thống nhất giữa frontend và backend.

Giá trị token chỉ là placeholder.

Nếu API hiện tại sử dụng tên trường khác hoặc trả access token trong HTTP response header, hãy kiểm tra hợp đồng API trước khi thay đổi. Không tự ý đổi cấu trúc response làm ảnh hưởng đến frontend.

Nếu backend xoay vòng refresh token, hãy cập nhật cookie mới thông qua header `Set-Cookie`; không trả refresh token trong JSON response.

## 4. Chu kỳ refresh token

Ưu tiên refresh dựa trên thời hạn access token thay vì gọi API cố định mỗi 20 giây.

Yêu cầu:

- Kiểm tra thời hạn access token theo cơ chế hiện tại.
- Chủ động refresh trước khi access token hết hạn một khoảng thời gian phù hợp.
- Nếu access token hết hạn và API trả `401`, có thể thực hiện refresh một lần rồi thử lại request ban đầu.
- Không refresh lặp lại vô hạn khi request tiếp tục thất bại.
- Không thực hiện refresh nếu phiên đăng nhập đã kết thúc.
- Nếu refresh token hết hạn, bị thu hồi hoặc không hợp lệ, yêu cầu người dùng đăng nhập lại.

Nếu nghiệp vụ thực tế bắt buộc gọi refresh mỗi 20 giây, hãy xác nhận yêu cầu trước khi triển khai. Khi đó phải có cơ chế chống request đồng thời, kiểm soát tải backend và xử lý refresh token rotation an toàn.

## 5. Kiểm soát domain ở backend

### 5.1. Allowlist domain

Backend chỉ cho phép refresh từ các origin được cấu hình.

Ví dụ:

```env
REFRESH_ALLOWED_ORIGINS=https://your-production-domain.com,http://localhost:5173
```

Thay domain ví dụ bằng domain thực tế của dự án.

Yêu cầu:

- Domain production phải được khai báo rõ ràng.
- Cho phép `http://localhost:5173` trong môi trường phát triển.
- Không mặc định cho phép `localhost` ở port khác.
- Không cho phép mọi domain khi cấu hình bị thiếu.
- Không dùng `includes()` hoặc `endsWith()` thiếu kiểm soát để so sánh domain.
- Đối chiếu origin chính xác, bao gồm scheme, hostname và port.
- Chỉ sử dụng HTTP cho localhost trong môi trường phát triển; production phải dùng HTTPS.

### 5.2. Kiểm tra nguồn gốc request

- Kiểm tra header `Origin` khi có mặt và đối chiếu với allowlist.
- Cấu hình CORS phù hợp với các origin được phép.
- Nếu sử dụng cookie và frontend khác origin, cấu hình `credentials` và `Access-Control-Allow-Credentials` đúng cách.
- Không dùng `Access-Control-Allow-Origin: *` cùng với credentials.
- Không coi `Origin`, `Host` hoặc `X-Forwarded-Host` là bằng chứng xác thực refresh token.
- Với request không có `Origin`, áp dụng chính sách riêng cho client không phải trình duyệt; không tự động cho phép refresh chỉ vì thiếu header.
- Nếu sử dụng reverse proxy, chỉ tin các proxy đã được cấu hình tin cậy.

Lưu ý: CORS và kiểm tra origin không thể ngăn mọi client giả mạo header. Backend vẫn phải xác thực refresh token và bảo vệ endpoint bằng các biện pháp phù hợp.

### 5.3. Điều kiện cấp token

Backend chỉ cấp access token mới khi:

1. Request đáp ứng chính sách origin/domain của hệ thống.
2. Refresh token hợp lệ và chưa hết hạn.
3. Token chưa bị thu hồi và phiên đăng nhập vẫn hợp lệ.
4. Các kiểm tra bảo mật bổ sung đều thành công.

Nếu domain không được phép hoặc refresh token không hợp lệ, backend phải từ chối refresh và không phát hành access token mới.

## 6. Bảo vệ cookie và chống CSRF

Nếu refresh token được lưu trong cookie:

- Sử dụng `HttpOnly` để JavaScript không đọc trực tiếp refresh token.
- Sử dụng `Secure` trong production.
- Chọn `SameSite` phù hợp với việc frontend và backend cùng site hay khác site.
- Nếu sử dụng cookie cho endpoint refresh, đánh giá và áp dụng biện pháp chống CSRF phù hợp.
- Cấu hình CORS chỉ cho phép các origin cần thiết.
- Không ghi token thật vào log.
- Không đưa token vào URL hoặc thông báo lỗi.
- Nếu cần xóa hoặc thu hồi refresh token, backend phải xử lý cookie và phiên đăng nhập theo thiết kế hiện có.

## 7. Tích hợp frontend

Kiểm tra `AuthProvider`, `ApiProvider`, API client, interceptor và các nơi đang lưu access token.

Triển khai các yêu cầu sau:

1. Sau login, frontend nhận access token và lưu trong bộ nhớ ứng dụng.
2. Refresh token được backend đặt trong cookie `HttpOnly`.
3. Khi cần refresh, frontend gọi endpoint bằng phương thức và cấu hình credentials phù hợp.
4. Khi refresh thành công, frontend cập nhật access token mới trong state/context.
5. Các request tiếp theo phải sử dụng access token mới nhất.
6. Nếu nhiều request cùng cần refresh, chỉ thực hiện một request refresh tại một thời điểm; các request khác chờ kết quả.
7. Nếu refresh thất bại, xử lý đăng xuất hoặc yêu cầu đăng nhập lại theo logic hiện có.
8. Khi logout, frontend gọi API logout; backend xóa cookie và thu hồi refresh token hoặc phiên tương ứng.
9. Không tạo nhiều timer khi component render lại, chuyển trang hoặc khởi tạo lại provider.
10. Không lưu refresh token vào `localStorage` hoặc `sessionStorage`.

Nếu access token hiện tại đang được lưu trong `localStorage`, hãy đánh giá các thành phần phụ thuộc trước khi chuyển sang bộ nhớ ứng dụng. Tránh thay đổi đột ngột làm hỏng các API hoặc trạng thái đăng nhập.

## 8. Xử lý lỗi

Giữ nguyên quy ước response lỗi hiện có của dự án và xử lý tối thiểu các trường hợp:

- Origin/domain không được phép.
- Thiếu refresh token.
- Refresh token không hợp lệ.
- Refresh token hết hạn hoặc bị thu hồi.
- Phiên đăng nhập không còn hợp lệ.
- Lỗi mạng hoặc timeout.
- Lỗi khi cấp access token mới.

Không trả access token mới khi refresh thất bại. Không tạo vòng lặp retry vô hạn và không để nhiều request refresh đồng thời gây xung đột.

## 9. Kiểm thử và nghiệm thu

| Trường hợp | Kết quả mong muốn |
|---|---|
| Login thành công | Nhận access token, backend đặt refresh token trong cookie |
| Refresh thành công | Nhận access token mới và cập nhật trong frontend |
| Request API tiếp theo | Sử dụng access token mới nhất |
| Tải lại trang | Có thể khôi phục phiên qua endpoint refresh nếu cookie còn hợp lệ |
| Domain production được cho phép | Refresh hoạt động khi token hợp lệ |
| `http://localhost:5173` trong môi trường phát triển | Refresh được phép |
| `http://localhost:3000` không được cấu hình | Từ chối theo chính sách domain |
| Origin giả mạo | Không bỏ qua xác thực token hoặc chính sách bảo mật |
| Refresh token hết hạn hoặc bị thu hồi | Từ chối refresh |
| Nhiều request đồng thời | Không tạo nhiều luồng refresh gây xung đột |
| Logout | Dừng refresh, xóa cookie và kết thúc phiên theo cơ chế hiện có |
| Lỗi mạng | Không retry vô hạn |

Chỉ báo cáo kiểm thử thành công nếu đã thực sự chạy kiểm thử.

## 10. Yêu cầu thực hiện

Trước khi chỉnh sửa code:

1. Xác định framework và cấu trúc backend hiện tại.
2. Xác định endpoint login, refresh, logout và cách quản lý token.
3. Kiểm tra thời hạn access token và refresh token.
4. Kiểm tra cấu hình cookie, CORS, domain và môi trường.
5. Xác định các file frontend cần sửa để nhận access token mới.
6. Đề xuất phương án tích hợp phù hợp với kiến trúc hiện tại.

Sau khi triển khai:

- Liệt kê các file đã tạo hoặc chỉnh sửa.
- Giải thích luồng login, refresh và logout.
- Hướng dẫn cấu hình domain và cookie.
- Báo cáo kết quả kiểm thử thực tế.
- Nêu rõ các phần chưa thể kiểm thử hoặc cần bổ sung cấu hình.

Không thay đổi những phần không liên quan và không khẳng định đã hoàn thành nếu chưa thực sự triển khai, kiểm tra.
