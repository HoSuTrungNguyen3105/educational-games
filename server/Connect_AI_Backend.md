# Yêu cầu tái cấu trúc kiến trúc Backend cho EduPlay

## 1. Mục tiêu

Hiện tại, dự án EduPlay đang sử dụng hai Backend riêng biệt:

- **Backend chính:** chạy tại cổng `5000`, chịu trách nhiệm xử lý nghiệp vụ chính của hệ thống.
- **AI Backend:** chạy tại cổng `8081`, chịu trách nhiệm xử lý các chức năng liên quan đến AI.

Tôi muốn điều chỉnh lại kiến trúc giao tiếp giữa Frontend và hai Backend theo hướng tập trung toàn bộ request từ Frontend về Backend chính.

**Nguyên tắc bắt buộc:**
- Frontend React chỉ gọi API của Backend chính tại cổng `5000`.
- Backend chính chịu trách nhiệm xác thực người dùng, kiểm soát quyền truy cập và gọi AI Backend tại cổng `8081` khi cần sử dụng chức năng AI.
- AI Backend chỉ đảm nhiệm việc xử lý AI và trả kết quả về Backend chính.
- Không để Frontend gọi trực tiếp AI Backend.
- Không thay đổi logic nghiệp vụ hiện có ngoài những phần thực sự cần thiết để triển khai kiến trúc mới.

## 2. Kiến trúc mong muốn

```text
                    FRONTEND REACT
                           |
                           | HTTP Request
                           v
                 BACKEND CHÍNH :5000
                 - Xác thực người dùng
                 - Phân quyền truy cập
                 - Quản lý người dùng
                 - Quản lý game
                 - Quản lý kết quả học tập
                 - Quản lý xu, XP và phần thưởng
                 - Cung cấp API trung gian cho AI
                           |
                           | Internal HTTP Request
                           v
                    AI BACKEND :8081
                    - Xử lý yêu cầu AI
                    - Phân tích dữ liệu học tập
                    - Gợi ý game
                    - Sinh nhiệm vụ
                    - Sinh cốt truyện
                           |
                           | AI Response
                           v
                 BACKEND CHÍNH :5000
                           |
                           | API Response
                           v
                    FRONTEND REACT
```

## 3. Yêu cầu đối với Frontend

Kiểm tra toàn bộ source code Frontend để xác định các vị trí đang gọi trực tiếp AI Backend.

Thực hiện các công việc sau:

1. Chuyển các request gọi trực tiếp đến cổng `8081` sang API tương ứng của Backend chính tại cổng `5000`.
2. Sử dụng cơ chế gọi API, service và cấu hình `API_BASE` hiện có của dự án.
3. Không hard-code URL AI Backend trong component, hook hoặc service của Frontend.
4. Giữ nguyên giao diện, luồng xử lý, dữ liệu đầu vào và cách hiển thị kết quả hiện tại.
5. Không tự ý đổi tên các trường dữ liệu hoặc thay đổi cấu trúc response mà Frontend đang sử dụng.
6. Không tạo thêm API trùng lặp nếu dự án đã có API đáp ứng được chức năng tương ứng.
7. Nếu một chức năng AI chưa có API trung gian ở Backend chính, hãy bổ sung API đó theo cấu trúc và quy ước hiện tại của dự án.

Sau khi hoàn thành, Frontend không được phụ thuộc trực tiếp vào địa chỉ hoặc cổng của AI Backend.

## 4. Yêu cầu đối với Backend chính — cổng 5000

Kiểm tra cấu trúc Backend hiện tại trước khi chỉnh sửa.

### 4.1. Bổ sung lớp giao tiếp với AI Backend

Nếu chưa có, tạo service/client chuyên dùng để giao tiếp với AI Backend.

Service này cần:

- Gọi các endpoint AI Backend tương ứng với từng chức năng.
- Truyền đúng dữ liệu đầu vào theo contract mà AI Backend đang hỗ trợ.
- Xử lý response và lỗi từ AI Backend.
- Có timeout phù hợp để tránh request bị treo vô thời hạn.
- Có log lỗi cần thiết để hỗ trợ debug.
- Không để lộ thông tin nhạy cảm hoặc dữ liệu xác thực trong log.
- Đọc địa chỉ AI Backend từ biến môi trường hoặc cấu hình hiện có, không hard-code URL trong source code.

Ví dụ cấu hình:

```env
AI_BACKEND_URL=http://localhost:8081
```

Tên biến môi trường trên chỉ là đề xuất. Nếu dự án đã có quy ước cấu hình riêng, hãy ưu tiên sử dụng quy ước đó.

### 4.2. Xây dựng API trung gian cho các chức năng AI

Kiểm tra những chức năng AI hiện có và bổ sung API trung gian tương ứng nếu cần.

Ví dụ về endpoint mong muốn:

- `GET /api/ai/recommendations`: lấy gợi ý game phù hợp với người dùng.
- `POST /api/ai/missions/generate`: yêu cầu sinh nhiệm vụ.
- `POST /api/ai/story/generate`: yêu cầu sinh cốt truyện.

Các endpoint trên chỉ là ví dụ thiết kế. Hãy đối chiếu với chức năng, route và contract thực tế trong source code trước khi quyết định tạo mới hoặc chỉnh sửa.

Yêu cầu xử lý:

1. Xác thực người dùng bằng cơ chế hiện tại của Backend chính.
2. Kiểm tra quyền truy cập trước khi xử lý yêu cầu.
3. Lấy dữ liệu nghiệp vụ từ nguồn dữ liệu hiện có khi cần thiết.
4. Gọi AI Backend thông qua service/client đã xây dựng.
5. Kiểm tra và xử lý response từ AI Backend.
6. Trả kết quả về Frontend theo quy ước response hiện tại của Backend chính.
7. Xử lý rõ ràng các trường hợp AI Backend không phản hồi, timeout, trả lỗi hoặc dữ liệu không hợp lệ.

Không cho phép người dùng lợi dụng API trung gian để truy cập dữ liệu hoặc thực hiện chức năng AI vượt quá quyền hạn.

## 5. Yêu cầu đối với AI Backend — cổng 8081

Kiểm tra source code AI Backend, đặc biệt là các service, controller, client và luồng xác thực đang có.

AI Backend tiếp tục chịu trách nhiệm xử lý các tác vụ AI. Tuy nhiên, cần điều chỉnh cách giao tiếp để phù hợp với kiến trúc mới.

### 5.1. Xử lý nghiệp vụ AI

- Giữ nguyên các chức năng AI đang hoạt động.
- Giữ nguyên contract request/response hiện có nếu không có lý do kỹ thuật bắt buộc phải thay đổi.
- Không chuyển toàn bộ nghiệp vụ quản lý người dùng, game, điểm số hoặc phần thưởng sang AI Backend.
- Chỉ nhận những dữ liệu cần thiết để thực hiện tác vụ AI.
- Trả kết quả về Backend chính để Backend chính tiếp tục xử lý và phản hồi Frontend.

### 5.2. Kiểm tra `CoreBackendClient`

Hiện tại, `CoreBackendClient` trong AI Backend có ghi nhận việc gọi ngược đến endpoint:

```text
http://localhost:5000/api/auth/me
```

Hãy kiểm tra kỹ luồng xử lý này trước khi chỉnh sửa.

Yêu cầu:

1. Xác định vì sao AI Backend đang gọi API xác thực của Backend chính.
2. Kiểm tra chức năng nào đang phụ thuộc vào `CoreBackendClient`.
3. Xác định dữ liệu người dùng nào thực sự cần thiết cho tác vụ AI.
4. Thiết kế lại luồng truyền dữ liệu và xác thực để tránh các request gọi vòng lặp hoặc gọi dư thừa giữa hai Backend.
5. Không xóa `CoreBackendClient` hoặc bỏ xác thực một cách máy móc khi chưa xác định đầy đủ các thành phần phụ thuộc.

Nếu Backend chính đã xác thực người dùng, hãy cân nhắc truyền danh tính người dùng và dữ liệu cần thiết sang AI Backend thông qua một cơ chế giao tiếp giữa các service có kiểm tra tính hợp lệ.

Không mặc định tin tưởng các trường `userId`, `role` hoặc thông tin quyền hạn chỉ vì chúng xuất hiện trong request. AI Backend phải xác minh nguồn gốc dữ liệu hoặc chỉ chấp nhận request từ Backend chính thông qua cơ chế xác thực service-to-service phù hợp.

### 5.3. Bảo mật giao tiếp giữa hai Backend

- Không công khai AI Backend trực tiếp cho Frontend sử dụng.
- Khi triển khai production, ưu tiên đặt AI Backend trong mạng nội bộ hoặc giới hạn truy cập bằng cấu hình hạ tầng phù hợp.
- Sử dụng cơ chế xác thực giữa các service, chẳng hạn service token hoặc cơ chế tương đương phù hợp với kiến trúc hiện tại.
- Không sử dụng token người dùng như service token nếu chưa có thiết kế bảo mật rõ ràng.
- Không đưa secret hoặc thông tin xác thực vào source code.
- Không coi CORS là cơ chế bảo vệ API giữa hai Backend.

Trong môi trường development, có thể sử dụng `localhost` nếu cả hai service chạy trên cùng máy. Khi triển khai production hoặc Docker, phải cấu hình URL phù hợp với môi trường thực tế; không mặc định rằng `localhost` của hai container là cùng một địa chỉ.

## 6. Quy tắc quản lý dữ liệu và Database

Backend chính tiếp tục là nơi quản lý dữ liệu nghiệp vụ của EduPlay, bao gồm:

- Người dùng và thông tin xác thực.
- Game và dữ liệu liên quan đến game.
- Kết quả học tập và tiến độ.
- Xu, XP, phần thưởng và các dữ liệu nghiệp vụ khác đang tồn tại.

Không chuyển các nghiệp vụ này sang AI Backend chỉ để phục vụ việc gọi AI.

Không tự ý:
- Thay đổi cấu trúc database.
- Tạo database mới nếu không có yêu cầu thực sự cần thiết.
- Thay đổi schema hoặc quan hệ dữ liệu hiện tại.
- Thay đổi contract của API nghiệp vụ không liên quan.
- Làm mất tính tương thích với Frontend và các chức năng đang hoạt động.

Nếu AI Backend cần thông tin để xử lý, hãy ưu tiên để Backend chính lấy dữ liệu và truyền đúng phần cần thiết sang AI Backend. Chỉ thiết kế quyền truy cập dữ liệu trực tiếp khác khi có căn cứ rõ ràng từ kiến trúc hiện tại.

## 7. Xử lý lỗi và logging

Đảm bảo hệ thống xử lý được các tình huống:

- AI Backend không hoạt động.
- Không kết nối được đến AI Backend.
- Request AI bị timeout.
- AI Backend trả về HTTP error.
- Response AI không đúng định dạng mong đợi.
- Người dùng không có quyền thực hiện tác vụ.
- Request đầu vào không hợp lệ.

Yêu cầu:

- Backend chính trả lỗi theo quy ước response hiện có.
- Không trả stack trace, secret hoặc thông tin nội bộ nhạy cảm cho Frontend.
- Ghi log đủ để xác định lỗi xảy ra tại Backend chính hay AI Backend.
- Không tự động retry các request có thể tạo dữ liệu hoặc phát sinh chi phí AI nếu chưa có cơ chế bảo đảm an toàn.
- Không để lỗi từ AI Backend làm hỏng các chức năng nghiệp vụ không liên quan.

## 8. Yêu cầu kiểm thử

Sau khi chỉnh sửa, hãy kiểm tra tối thiểu các trường hợp sau:

1. Frontend gọi API AI thông qua Backend chính thành công.
2. Backend chính xác thực người dùng trước khi cho phép sử dụng chức năng AI.
3. Backend chính gọi AI Backend và nhận được kết quả hợp lệ.
4. AI Backend không hoạt động nhưng Backend chính vẫn xử lý lỗi đúng cách.
5. Request không có quyền truy cập bị từ chối.
6. Không còn request trực tiếp từ Frontend đến cổng `8081`.
7. Các chức năng đăng nhập, quản lý game, kết quả học tập, xu và XP vẫn hoạt động như trước.
8. Các API hiện có không bị thay đổi response ngoài phạm vi yêu cầu.

Nếu dự án đã có test, hãy bổ sung hoặc cập nhật test theo cấu trúc hiện tại. Không xóa test chỉ để làm cho quá trình build thành công.

## 9. Nguyên tắc thực hiện

**Đây là yêu cầu tái cấu trúc cách giao tiếp giữa các Backend, không phải viết lại toàn bộ hệ thống.**

Bắt buộc tuân thủ:

- Đọc source code hiện tại của cả Frontend, Backend chính và AI Backend trước khi chỉnh sửa.
- Xác định rõ các endpoint, service và luồng xử lý đang tồn tại.
- Tái sử dụng code và cấu hình hiện có khi phù hợp.
- Không tự ý đổi framework, thư viện hoặc cấu trúc thư mục.
- Không viết lại những chức năng đang hoạt động bình thường.
- Không thay đổi logic nghiệp vụ, giao diện, dữ liệu hoặc response nếu không cần thiết.
- Không tạo API mới trùng với API đã có.
- Không xóa code cũ trước khi xác định được toàn bộ nơi sử dụng và phương án thay thế.
- Đảm bảo tương thích giữa các API của Frontend, Backend chính và AI Backend.
- Nếu phát hiện vấn đề kiến trúc cần quyết định thêm, hãy nêu rõ nguyên nhân và đề xuất phương án trước khi thực hiện thay đổi lớn.

## 10. Báo cáo sau khi hoàn thành

Sau khi thực hiện, hãy báo cáo:

1. Các file đã thêm, sửa hoặc xóa.
2. Những API Frontend đã chuyển sang gọi Backend chính.
3. Các API trung gian đã tạo hoặc tái sử dụng.
4. Cách Backend chính giao tiếp với AI Backend.
5. Cách xử lý xác thực giữa hai Backend.
6. Những thay đổi liên quan đến `CoreBackendClient`.
7. Các biến môi trường hoặc cấu hình cần bổ sung.
8. Kết quả build và test thực tế.
9. Các bước cần thực hiện để chạy thử toàn bộ hệ thống.

Nếu có phần nào chưa thể triển khai hoặc chưa kiểm thử được, hãy ghi rõ thay vì khẳng định đã hoàn thành.

**Kết quả cuối cùng mong muốn:** Frontend chỉ giao tiếp với Backend chính tại cổng `5000`; Backend chính quản lý xác thực và nghiệp vụ, đồng thời gọi AI Backend tại cổng `8081` khi cần. AI Backend chỉ đảm nhiệm việc xử lý AI và trả kết quả về Backend chính. Toàn bộ chức năng hiện có phải tiếp tục hoạt động bình thường sau khi tái cấu trúc.