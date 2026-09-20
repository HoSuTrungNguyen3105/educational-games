Tôi muốn bổ sung tính năng **chơi game Co-op với một user được chỉ định**, không phải chế độ chơi solo ở F:\Clone\edu_game\educational-games\src\games\XO\XO.html đây 

Flow mong muốn như sau:

1. **Chọn người chơi** , hiện hệ thống đã có component mời người chơi coop , hiện đã làm ở bên F:\Clone\edu_game\educational-games\src\games\block-master\LangCuaToi.html , hãy tách phần đó ra 1 component react cho tôi để dùng chung cho bên game nào coop cho tôi đi , flow như đã làm , logic cũng gần đúng :

   * Người dùng có thể chọn một user cụ thể để mời chơi game.
   * Sau khi chọn game và user, người dùng gửi lời mời chơi.

2. **Gửi lời mời**

   * Khi gửi lời mời, backend tạo lời mời chơi và gửi **push notification** đến đúng user được chọn.
   * Sử dụng logic notification/push notification hiện tại của project nếu có, không tạo một cơ chế thông báo riêng nếu không cần thiết.

3. **User được mời nhận thông báo**

   * Thông báo phải xuất hiện ở user được mời.
   * Khi user click vào thông báo:

     * Nếu click từ phần thông báo ở `F:\Clone\edu_game\educational-games\src\pages\HomeScreen.jsx`
     * Hoặc click trực tiếp trong khu vực/thanh thông báo của hệ thống
     * Thì phải chuyển người dùng đến **đúng game mà họ được mời tham gia**.

4. **Đây là game Co-op**

   * Game này **không phải solo**.
   * Hai user phải cùng tham gia một session/game room.
   * Người gửi lời mời và người nhận lời mời phải được xác định là 2 người chơi của cùng một game session.
   * Không được chỉ redirect cả hai người vào một trang game nhưng mỗi người chơi một session riêng.
   * Cần có cơ chế để backend xác định:

     * `inviter`
     * `invitedUser`
     * `game`
     * `gameSession/room`
     * trạng thái lời mời: pending / accepted / rejected / expired... nếu cần.

5. **Khi user chấp nhận lời mời**

   * User được mời vào đúng game session mà người gửi đã tạo.
   * Người gửi cũng phải được kết nối vào cùng session.
   * Hai người có thể nhìn thấy/truyền trạng thái của nhau trong game theo logic Co-op.

6. **Cần kiểm tra và sửa cả Backend + Frontend**

   * Kiểm tra API hiện tại xem đã đáp ứng flow này chưa.
   * Nếu API hiện tại chưa phù hợp thì sửa hoặc bổ sung API cần thiết.
   * Đảm bảo API trả về đầy đủ thông tin để frontend biết:

     * game nào
     * session/room nào
     * người gửi lời mời
     * người nhận
     * trạng thái lời mời.
   * Sau đó sửa frontend để nhận và xử lý đúng dữ liệu từ API.
   * Đặc biệt kiểm tra phần notification ở:
     `F:\Clone\edu_game\educational-games\src\pages\HomeScreen.jsx`
   * Kiểm tra cả logic click notification và routing/navigation sang game.

7. **Mục tiêu cuối cùng**

   Flow hoàn chỉnh cần là:

   **User A chọn User B → chọn game → gửi lời mời → Backend tạo game session + invitation → User B nhận push notification → User B click notification → vào đúng game session → A và B cùng chơi trong một phòng Co-op.**

Hãy kiểm tra toàn bộ flow hiện tại trước, sau đó sửa **API + Backend + Frontend** để tính năng hoạt động đồng bộ. Không chỉ sửa giao diện hoặc redirect URL; cần đảm bảo hai người thực sự tham gia **cùng một game session Co-op**.
