// ===== THỜI KHÓA BIỂU & CẤU HÌNH GIỜ HỌC — sửa file này để đổi lịch =====
// day: 1=Thứ 2 ... 7=Chủ nhật | subject: math / eng / sci / van
// type: "lesson" (học bài) hoặc "exam" (thi, kèm examId lấy trong data/questions.js)
const TKB = [];
function addPeriod(days, start, end, subject, type, title, examId) {
  days.forEach(day => TKB.push(Object.assign({ day, start, end, subject, type, title }, examId ? { examId } : {})));
}
const WEEKDAYS = [1, 2, 3, 4, 5];
addPeriod(WEEKDAYS, "07:30", "08:15", "math", "lesson", "Toán");
addPeriod(WEEKDAYS, "08:20", "09:05", "van",  "lesson", "Ngữ văn");
addPeriod(WEEKDAYS, "09:25", "10:10", "eng",  "lesson", "Tiếng Anh");
addPeriod(WEEKDAYS, "10:15", "11:00", "sci",  "lesson", "Khoa học");
addPeriod([3], "14:00", "14:45", "math", "exam", "Thi Toán giữa tuần", "thi_toan_2");
addPeriod([5], "14:00", "14:45", "eng",  "exam", "Thi Tiếng Anh", "thi_anh_1");
addPeriod([5], "15:00", "15:45", "sci",  "exam", "Thi Khoa học", "thi_khtn_1");

window.__SCHOOL_CONFIG__ = {
  schoolName: "Trường Vui Vẻ",
  useRealTime: true,            // dùng giờ thật của máy
  simulateTime: null,           // thử nhanh: đặt "08:00" để giả lập giờ
  demoMode: false,              // true = tự tạo lịch demo bắt đầu sau ~1 phút
  earlyMinutes: 5,              // cho vào lớp sớm bao nhiêu phút
  graceMinutes: 10,             // cho vào muộn bao nhiêu phút sau khi hết tiết
  notifyBeforeMinutes: 2,       // báo trước giờ học
  autoEnterClass: true,         // đến giờ tự hiện hộp thoại "Vào học"
  allowFreePractice: true,      // true = ngoài giờ vẫn được luyện tập tự do
  requireOnTimeForLesson: true, // true + allowFreePractice=false => chỉ học đúng giờ
  timetable: TKB
};
