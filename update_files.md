YÊU CẦU BỔ SUNG: AI HỖ TRỢ HỌC TẬP THEO KHỐI LỚP VÀ PHÂN QUYỀN THEO VAI TRÒ
1. Mục tiêu
Bổ sung một phân hệ AI hỗ trợ học tập, có khả năng nhận diện vai trò và
thông tin học tập của tài khoản đang sử dụng để điều chỉnh nội dung trả
lời phù hợp.

AI cần phân biệt ít nhất hai nhóm người dùng:
- Học sinh: Chỉ tập trung hỗ trợ kiến thức phù hợp với khối lớp mà
  học sinh đang theo học.
- Admin: Có thể sử dụng các chức năng hỏi đáp và tra cứu dữ liệu
  tổng quan về học sinh trong phạm vi quyền quản trị được cấp.
Không chỉ kiểm tra nội dung câu hỏi, hệ thống phải xác định người dùng
từ thông tin xác thực ở Backend, không dựa vào dữ liệu vai trò hoặc khối
lớp do Client tự gửi lên.
2. Đối với học sinh: Giới hạn kiến thức theo khối lớp
Khi học sinh đặt câu hỏi về bài học, AI cần lấy thông tin tài khoản đã
đăng nhập để xác định:
- Vai trò tài khoản.
- Khối lớp hiện tại (lớp 1, lớp 2, lớp 3, lớp 4 hoặc lớp 5).
- Các môn học và nội dung học tập tương ứng, nếu hệ thống đã có dữ
  liệu chương trình học.
2.1. Trả lời theo đúng chương trình lớp đang học
AI phải ưu tiên giải thích kiến thức trong phạm vi chương trình của khối
lớp hiện tại.

Ví dụ:
- Học sinh lớp 1 hỏi về phép cộng: giải thích bằng số nhỏ, hình ảnh
  minh họa và cách diễn đạt đơn giản phù hợp với lớp 1.
- Học sinh lớp 3 hỏi về phép nhân: giải thích theo kiến thức và phương
  pháp học phù hợp với chương trình lớp 3.
- Học sinh lớp 5 hỏi về phân số: trả lời trong phạm vi kiến thức phân
  số của lớp 5, sử dụng ví dụ và cách giải phù hợp.
Không sử dụng cách giải, thuật ngữ hoặc kiến thức quá nâng cao so với
trình độ của học sinh nếu không thực sự cần thiết.
2.2. Xử lý câu hỏi vượt ngoài chương trình lớp
Nếu học sinh hỏi một nội dung thuộc khối lớp cao hơn hoặc chưa nằm trong
chương trình đang học:
- AI cần nhận biết nội dung đó vượt quá phạm vi kiến thức hiện tại.
- Ưu tiên giải thích ở mức cơ bản, dễ hiểu và phù hợp với độ tuổi.
- Không đưa ra lời giải phức tạp hoặc sử dụng kiến thức nâng cao khiến
  học sinh khó tiếp thu.
- Có thể nói rõ đây là kiến thức nâng cao và gợi ý học sinh tìm hiểu
  khi đã học đến nội dung tương ứng.
2.3. Xử lý câu hỏi không liên quan đến bài học
Không bắt buộc mọi câu hỏi của học sinh đều phải liên quan đến chương
trình học.

Nếu học sinh hỏi về các chủ đề thông thường như khoa học, thiên nhiên,
kỹ năng sống, công nghệ hoặc kiến thức xã hội:
- AI vẫn có thể trả lời bình thường nếu nội dung an toàn và phù hợp
  với lứa tuổi.
- Sử dụng ngôn ngữ đơn giản, dễ hiểu.
- Điều chỉnh độ sâu của câu trả lời theo khối lớp hiện tại.
- Không từ chối chỉ vì câu hỏi không thuộc chương trình học.
Đối với nội dung không phù hợp với trẻ em hoặc vượt quá phạm vi hỗ trợ
an toàn, AI cần xử lý theo chính sách an toàn dành cho người dùng nhỏ
tuổi.
3. Đối với Admin: AI hỗ trợ tra cứu và phân tích dữ liệu học sinh
Admin được sử dụng AI với phạm vi rộng hơn học sinh, đặc biệt là khả
năng khai thác dữ liệu quản lý học tập trong hệ thống.

AI cần hỗ trợ Admin đặt câu hỏi bằng ngôn ngữ tự nhiên, ví dụ:
- Có bao nhiêu học sinh mới đăng ký trong tháng này?
- Những học sinh nào vừa đăng ký tài khoản?
- Danh sách học sinh có điểm kiểm tra thấp trong tháng này?
- Học sinh nào có kết quả học tập giảm so với các lần kiểm tra trước?
- Lớp nào có kết quả học tập trung bình thấp nhất?
- Những học sinh nào chưa hoàn thành bài kiểm tra?
- Thống kê kết quả học tập theo lớp hoặc theo môn học.
3.1. Tra cứu học sinh mới đăng ký
Khi Admin hỏi về học sinh mới đăng ký, AI cần:
- Truy xuất dữ liệu thực tế từ Backend.
- Xác định thời gian đăng ký theo yêu cầu.
- Trả về số lượng học sinh mới.
- Hiển thị thông tin cần thiết như họ tên, lớp, thời gian đăng ký và
  trạng thái tài khoản nếu dữ liệu có sẵn.
- Hỗ trợ lọc theo ngày, tuần, tháng hoặc khoảng thời gian cụ thể.
3.2. Phân tích học sinh có điểm kiểm tra thấp
Khi Admin hỏi về học sinh có kết quả kiểm tra thấp, AI cần:
- Truy xuất kết quả kiểm tra thực tế của học sinh.
- Cho phép lọc theo lớp, môn học, bài kiểm tra và khoảng thời gian.
- Xác định học sinh có điểm thấp dựa trên ngưỡng điểm hoặc tiêu chí
  được cấu hình.
- Hiển thị họ tên, lớp, môn học, tên bài kiểm tra, điểm số và thời
  gian thực hiện nếu dữ liệu có sẵn.
- Có thể tổng hợp số lượng học sinh cần quan tâm và đưa ra nhận xét
  dựa trên dữ liệu thực tế.
Không tự đặt ngưỡng điểm thấp nếu hệ thống chưa có cấu hình. Nếu chưa có
ngưỡng, AI cần hỏi Admin hoặc sử dụng tiêu chí được cấu hình rõ ràng.
3.3. Phân tích và đề xuất hỗ trợ học tập
Dựa trên dữ liệu thực tế, AI có thể:
- Nhận diện học sinh có kết quả học tập chưa tốt.
- So sánh kết quả giữa các lần kiểm tra.
- Xác định môn học hoặc nhóm kiến thức học sinh đang gặp khó khăn.
- Đề xuất nội dung ôn tập phù hợp.
- Gợi ý Admin hoặc giáo viên theo dõi và hỗ trợ học sinh.
Các nhận xét phải dựa trên dữ liệu có thật, không tự suy đoán nguyên
nhân hoặc kết luận về năng lực của học sinh khi chưa đủ thông tin.
4. Phân quyền và bảo mật dữ liệu
Đây là yêu cầu bắt buộc khi triển khai AI theo vai trò.
- Backend phải xác định vai trò người dùng từ token hoặc phiên đăng
  nhập đã được xác thực.
- Không tin tưởng role, userId, classId hoặc thông tin quyền do
  Client tự truyền lên.
- Học sinh chỉ được truy cập thông tin học tập của chính mình và không
  được tra cứu dữ liệu cá nhân, điểm số hoặc tài khoản của học sinh
  khác.
- Admin chỉ được truy cập dữ liệu trong phạm vi quyền quản trị được
  cấp.
- Nếu có vai trò Giáo viên, cần thiết kế quyền riêng để giáo viên chỉ
  xem dữ liệu học sinh và lớp được phân công.
- Không đưa dữ liệu nhạy cảm hoặc thông tin cá nhân không cần thiết
  vào prompt gửi đến AI.
- Ghi nhận lịch sử truy vấn quản trị phù hợp để phục vụ kiểm tra và
  kiểm soát truy cập.
- Không để AI tự thực hiện thao tác sửa, xóa hoặc thay đổi dữ liệu học
  sinh nếu chưa có API, quyền hạn và bước xác nhận tương ứng.
5. Yêu cầu kỹ thuật triển khai
5.1. Xác định ngữ cảnh trước khi gọi AI
Khi nhận câu hỏi, hệ thống cần thực hiện quy trình:
1. Xác thực người dùng đang đăng nhập.
2. Lấy vai trò và thông tin tài khoản từ Backend.
3. Nếu là học sinh, lấy khối lớp và ngữ cảnh học tập tương ứng.
4. Nếu là Admin, xác định các quyền quản trị và dữ liệu được phép truy
   cập.
5. Xây dựng ngữ cảnh phù hợp với từng vai trò.
6. Gửi câu hỏi cùng ngữ cảnh đến AI.
7. Kiểm tra và trả kết quả phù hợp với quyền truy cập của người dùng.
5.2. Tách biệt dữ liệu và hướng dẫn AI theo vai trò
Nên xây dựng các bộ hướng dẫn (system prompt) riêng:
- studentSystemPrompt: Hướng dẫn AI hỗ trợ học sinh theo khối lớp,
  độ tuổi và chương trình học.
- adminSystemPrompt: Hướng dẫn AI hỗ trợ Admin tra cứu, tổng hợp và
  phân tích dữ liệu quản trị.
Không sử dụng chung một prompt cho tất cả người dùng nếu điều đó khiến
AI không phân biệt được quyền hạn và phạm vi kiến thức.
5.3. AI phải truy xuất dữ liệu thực tế khi cần
Đối với các câu hỏi quản trị như học sinh mới đăng ký, điểm kiểm tra
thấp hoặc thống kê theo lớp:
- AI phải sử dụng API/service lấy dữ liệu thực tế từ hệ thống.
- Không yêu cầu AI tự đoán hoặc tự tạo số liệu.
- Backend cần kiểm tra quyền trước khi trả dữ liệu.
- Nếu không có dữ liệu hoặc API chưa hỗ trợ, AI phải thông báo rõ thay
  vì đưa ra kết quả giả định.
5.4. Không làm ảnh hưởng đến chức năng AI hiện tại
- Rà soát cấu trúc AI hiện có trước khi chỉnh sửa.
- Tái sử dụng service, API và cấu hình model hiện tại nếu phù hợp.
- Không tạo thêm các luồng gọi AI trùng lặp.
- Không làm ảnh hưởng đến chức năng chat AI, lịch sử hội thoại và các
  tính năng AI đang hoạt động.
- Đảm bảo có cơ chế xử lý lỗi khi không lấy được thông tin người dùng
  hoặc dữ liệu học tập.
6. Các trường hợp cần kiểm thử
  Tài khoản               Tình huống kiểm thử     Kết quả mong muốn
  Học sinh lớp 1          Hỏi kiến thức Toán lớp  Trả lời đúng trình độ
1                       lớp 1

  Học sinh lớp 5          Hỏi kiến thức Toán lớp  Trả lời trong phạm vi
5                       lớp 5

  Học sinh lớp 1          Hỏi kiến thức nâng cao  Giải thích đơn giản,
của lớp 5               không đưa lời giải vượt
quá trình độ

  Học sinh lớp 3          Hỏi về động vật, thiên  Vẫn trả lời bình
nhiên                   thường, phù hợp lứa
tuổi

  Học sinh                Hỏi điểm kiểm tra của   Từ chối truy cập dữ
học sinh khác           liệu

  Học sinh                Yêu cầu xem danh sách   Không cung cấp dữ liệu
học sinh mới đăng ký    quản trị

  Admin                   Hỏi danh sách học sinh  Trả dữ liệu thực tế từ
mới đăng ký             hệ thống

  Admin                   Hỏi học sinh có điểm    Trả danh sách và điểm
kiểm tra thấp           số chính xác theo tiêu
chí

  Admin                   Yêu cầu thống kê theo   Trả kết quả tổng hợp từ
lớp hoặc môn học        dữ liệu thực tế
Giáo viên (nếu có)      Tra cứu kết quả lớp     Chỉ trả dữ liệu trong
được phân công          phạm vi được cấp quyền
7. Báo cáo sau khi hoàn thành
Sau khi triển khai, cần báo cáo:
- Các file Frontend và Backend đã chỉnh sửa.
- Các API/service được sử dụng để lấy thông tin tài khoản, lớp học và
  kết quả kiểm tra.
- Cách xác định vai trò và khối lớp của người dùng.
- Các prompt hoặc cấu hình AI đã bổ sung.
- Cơ chế phân quyền và bảo vệ dữ liệu học sinh.
- Kết quả kiểm thử theo từng vai trò và khối lớp.
- Những phần chưa thể triển khai và nguyên nhân cụ thể.
MỤC TIÊU CUỐI CÙNG
Xây dựng AI có khả năng hỗ trợ học tập thông minh theo từng đối tượng sử
dụng:
- Học sinh: AI đóng vai trò như một trợ lý học tập, hiểu học sinh
  đang học lớp nào và giải thích kiến thức đúng với trình độ của lớp
  đó.
- Admin: AI đóng vai trò như một trợ lý quản trị giáo dục, có khả
  năng tra cứu, tổng hợp và phân tích dữ liệu học sinh dựa trên dữ
  liệu thực tế của hệ thống.
- Bảo mật: Mỗi vai trò chỉ được truy cập đúng dữ liệu và chức năng
  được cấp quyền, đặc biệt phải bảo vệ thông tin cá nhân và kết quả
  học tập của học sinh.
Ưu tiên triển khai theo hướng tận dụng kiến trúc hiện tại, đảm bảo dễ mở
rộng cho các khối lớp, môn học và chức năng quản trị trong tương lai.