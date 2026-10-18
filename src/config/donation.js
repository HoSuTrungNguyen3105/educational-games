/**
 * donation.js — thông tin ủng hộ cho web.
 *
 * ⚠ SỬA FILE NÀY để điền thông tin thật của bạn.
 *
 *   bank        — tên ngân hàng (VD: "MB Bank", "Vietcombank")
 *   holder      — tên chủ tài khoản
 *   accountNo   — số tài khoản
 *   qrPayload   — chuỗi QR chuẩn VietQR/EMVCo do ngân hàng sinh ra
 *                 (dán vào đây để nút "Sao chép nội dung QR" lấy đúng nội dung)
 *   qrImage     — đường dẫn ảnh QR trong thư mục `public/`.
 *                 Ví dụ: ảnh tên `donate-qr.png` → đặt file ở `public/donate-qr.png`
 *                 rồi ghi `qrImage: `${import.meta.env.BASE_URL}donate-qr.png``
 *
 * Nếu chưa có ảnh QR, modal vẫn chạy: hiện khung báo thiếu ảnh + nút sao chép
 * số tài khoản / nội dung QR để bé đọc tay hoặc bạn tự tạo ảnh sau.
 */

const BASE = import.meta.env.BASE_URL;

export const DONATION = {
  bank: "Ngân hàng của bạn",
  holder: "Tên chủ tài khoản",
  accountNo: "0000 0000 0000",
  /** Chuỗi QR do ngân hàng cấp. Rỗng thì nút sao chép sẽ sao số tài khoản. */
  qrPayload: "",
  /** Ảnh QR trong public/. Rỗng nếu chưa có ảnh. */
  qrImage: `${BASE}donate-qr.png`,
  /** Lời nhắn hiện dưới nút. */
  note: "Cảm ơn bé! Mọi khoản ủng hộ đều giúp thêm game mới cho các bé khác.",
  /** Số câu đố trong thử thách. */
  questionCount: 5,
};

/** Chuỗi người dùng thực sự sao chép (ưu tiên nội dung QR nếu có). */
export const donationPayload = () =>
  DONATION.qrPayload ||
  `${DONATION.bank} - ${DONATION.holder} - STK ${DONATION.accountNo}`.trim();