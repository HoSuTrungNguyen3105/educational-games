# YÊU CẦU: BỔ SUNG BODY MỚI CHO HỆ THỐNG AVATAR

## 1. Mục tiêu

Bổ sung các mẫu Body mới vào hệ thống Avatar hiện tại.

**Quan trọng:**
- Trang Admin đã có sẵn, không xây dựng lại hoặc chỉnh sửa giao diện Admin.
- Không tạo hệ thống quản lý Body mới.
- Chỉ tập trung thiết kế, tạo asset Body mới và tích hợp vào cơ chế hiện tại.
- Tái sử dụng toàn bộ cấu trúc, quy trình và cách hoạt động của các Body đang có.

## 2. Các Body cần tạo thêm

Tạo các nhân vật sau:

**Nhóm nhân vật đặc biệt:**
1. Phi hành gia.
2. Ninja.
3. Robot thân thiện.
4. Cướp biển.
5. Ma cà rồng.

**Nhóm nghề nghiệp:**
6. Bác sĩ.
7. Lính cứu hỏa.
8. Giáo viên.
9. Cảnh sát.
10. Đầu bếp.
11. Phi công.

**Nhóm cổ tích:**
12. Hoàng tử.
13. Công chúa.
14. Hiệp sĩ.
15. Phù thủy.
16. Tiên.

**Nhóm lễ hội:**
17. Bộ xương.
18. Người tuyết.
19. Ông già Noel.
20. Ma Halloween.

## 3. Yêu cầu đồng bộ Style hình ảnh

Đây là yêu cầu quan trọng nhất.

Dựa trực tiếp vào các Body hiện có trong hệ thống làm tiêu chuẩn thiết kế.

Tất cả Body mới phải:
- Đồng bộ phong cách minh họa 2D hiện tại.
- Có tỷ lệ đầu, thân, tay và chân tương đồng.
- Có độ chi tiết, đường nét và cách phối màu giống các nhân vật hiện có.
- Phong cách dễ thương, thân thiện, phù hợp với học sinh tiểu học.
- Không sử dụng phong cách 3D, realistic hoặc anime khác biệt.
- Không tạo nhân vật có tỷ lệ cơ thể quá lớn hoặc quá nhỏ so với các Body cũ.

**Về hình ảnh:**
- Không có background.
- Xuất hình SVG hoặc định dạng asset tương ứng với hệ thống hiện tại.
- Giữ đúng kích thước canvas, viewBox và tỷ lệ hiển thị.
- Nhân vật phải được căn giữa, không bị cắt mất đầu, tay hoặc chân.
- Chất lượng hình ảnh rõ nét, không bị vỡ khi phóng to.

## 4. Yêu cầu tương thích linh kiện

Các Body mới phải tương thích với hệ thống linh kiện hiện tại:

- Mặt.
- Tóc.
- Màu tóc.
- Da.
- Áo.
- Váy.
- Quần.
- Giày.
- Kính.
- Mũ.
- Phụ kiện.

Kiểm tra kỹ vị trí các bộ phận để khi thay đổi linh kiện không bị lệch, xuyên hình hoặc sai thứ tự layer.

Đối với các Body đặc biệt như Robot, Phi hành gia, Bộ xương hoặc Người tuyết, nếu không phù hợp với một số linh kiện thì xử lý theo cơ chế tương thích hiện tại, không cố ghép gây lỗi.

## 5. Yêu cầu tích hợp

- Đọc và làm theo cấu trúc của các Body hiện có.
- Tạo asset mới theo đúng quy ước đặt tên và tổ chức thư mục.
- Đăng ký các Body mới vào hệ thống hiện tại để Admin có thể nhìn thấy và sử dụng.
- Nếu hệ thống đang sử dụng cơ chế tự động tạo HTML từ SVG thì tiếp tục sử dụng cơ chế đó.
- Không thay đổi ID, asset hoặc cấu hình của Body cũ.
- Không làm ảnh hưởng đến chức năng Preview, lưu và tải Avatar.

## 6. Gợi ý mở rộng về sau

Thiết kế các Body mới theo định hướng có thể tiếp tục mở rộng thêm các chủ đề:

- Nhân vật thường ngày.
- Siêu anh hùng.
- Sinh vật giả tưởng.
- Công nghệ.
- Nghề nghiệp.
- Cổ tích.
- Lễ hội.

Chưa cần xây dựng thêm chức năng phân loại hoặc giao diện Admin mới. Chỉ cần tổ chức asset và metadata hợp lý để thuận tiện bổ sung nhân vật trong tương lai.

## 7. Kiểm tra hoàn thành

- [ ] Tạo đủ 20 Body mới.
- [ ] Style đồng nhất với Body hiện tại.
- [ ] Không có background.
- [ ] Kích thước và tỷ lệ đồng nhất.
- [ ] Hiển thị đúng trong danh sách Body.
- [ ] Hiển thị đúng trong Preview.
- [ ] Không lỗi khi thay đổi linh kiện.
- [ ] Không ảnh hưởng đến Body cũ.
- [ ] Không phát sinh lỗi Console.

**Yêu cầu cuối:** Hãy khảo sát các Body hiện tại trước khi thiết kế. Lấy chúng làm chuẩn tham chiếu trực tiếp về style, tỷ lệ, màu sắc, kích thước và cấu trúc SVG. Không tự ý thay đổi phong cách thiết kế. Chỉ bổ sung các nhân vật mới sao cho khi đặt cạnh Body cũ, người dùng cảm nhận tất cả đều thuộc cùng một bộ nhân vật Avatar.